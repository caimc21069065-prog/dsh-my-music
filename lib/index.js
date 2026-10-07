// lib/index.js — dsh-plugin-music 宿主侧插件。
// 职责:
//   1. 在 DSH 的 webServer 上挂 /music 前缀路由:数据 API + 音频流代理(供客户端 UI 使用)
//   2. 注册 4 个模型可调用工具(聊天中直接搜歌/取链接/歌词/歌单)

import z from '@deepseek-ai/schemastery';
import { defineTool } from '@deepseek-ai/dsh-tools';

import {
  createNcm,
  SEARCH_TYPE_CODES,
  normalizeSearchResults,
  normalizePlaylistTracks,
  formatDuration
} from './ncm.js';
import { resolveCookie } from './cookie.js';
import { createMusicService } from './service.js';

const name = 'music';
const inject = ['tools', 'webServer'];

/** 行级配置:出现在 cordis.patch.yml 的 music 行 config 下。 */
const Config = z.object({
  cookie: z
    .string()
    .default('')
    .description('网易云音乐 Cookie(需含 MUSIC_U=...),可选;客户端扫码登录/退出后会以扫码结果为准'),
  requestTimeoutMs: z
    .number()
    .default(15000)
    .description('网易云音乐接口请求超时(毫秒)'),
  defaultLevel: z
    .string()
    .default('standard')
    .description('音频代理默认音质:standard / exhigh / higher / lossless'),
  realIP: z
    .string()
    .default('116.25.146.177')
    .description('请求时伪造的客户端 IP(网易云风控限流时可恢复接口);留空则不启用')
});

/** 让请求尊重 exec.signal(用户取消时尽快返回)。 */
function withSignal(promise, signal) {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(new Error('已取消'));
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      signal.addEventListener('abort', () => reject(new Error('已取消')), { once: true });
    })
  ]);
}

const SEARCH_LABELS = { song: '歌曲', artist: '歌手', album: '专辑', playlist: '歌单' };

const LEVEL_NOTES = {
  standard: '标准音质',
  exhigh: '较高音质',
  higher: '高音质',
  lossless: '无损音质'
};

function musicSearchTool(ncm) {
  return defineTool({
    name: 'music_search',
    description:
      '搜索网易云音乐,返回歌曲/歌手/专辑/歌单列表(含后续调用所需的 id)。用户想找歌、找专辑、找歌单时使用;拿到歌曲 id 后可用 music_song_url 取播放链接、music_lyric 取歌词。',
    parameters: {
      keywords: { type: 'string', required: true, description: '搜索关键词,如歌名、歌手名' },
      type: {
        type: 'string',
        enum: ['song', 'artist', 'album', 'playlist'],
        description: '结果类型,默认 song'
      },
      limit: { type: 'number', description: '返回数量 1-30,默认 10' }
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          type: { type: 'string', required: true },
          results: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                id: { type: 'number', required: true },
                name: { type: 'string', required: true },
                detail: { type: 'string' }
              }
            }
          }
        }
      },
      render: (args, value) => [
        {
          type: 'text',
          text:
            value.results.length === 0
              ? `未搜到与「${args.keywords}」相关的${SEARCH_LABELS[value.type] ?? '内容'}`
              : `${SEARCH_LABELS[value.type] ?? '搜索'}「${args.keywords}」:${value.results.length} 条结果`
        }
      ]
    },
    timeoutMs: 30000,
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const type = args.type ?? 'song';
      const limit = Math.min(Math.max(Math.trunc(args.limit ?? 10), 1), 30);
      const code = SEARCH_TYPE_CODES[type];
      if (!code) throw new Error(`不支持的搜索类型: ${type}`);
      const body = await withSignal(
        ncm.call('search', { keywords: args.keywords, type: code, limit }),
        exec.signal
      );
      return { type, results: normalizeSearchResults(body, type) };
    }
  });
}

function musicSongUrlTool(ncm) {
  return defineTool({
    name: 'music_song_url',
    description:
      '获取网易云歌曲的可播放直链(mp3 等),返回的 url 可在浏览器或任意播放器打开。需要 music_search 返回的歌曲 id。VIP/无损曲目在未配置登录 Cookie 时可能只返回试听片段或失败。',
    parameters: {
      songId: { type: 'number', required: true, description: '歌曲 id(music_search 结果中的 id)' },
      level: {
        type: 'string',
        enum: ['standard', 'exhigh', 'higher', 'lossless'],
        description: '音质,默认 standard;更高音质通常需要登录 Cookie 且账号有会员'
      }
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          songId: { type: 'number', required: true },
          playable: { type: 'boolean', required: true },
          url: { type: 'string' },
          format: { type: 'string' },
          level: { type: 'string' },
          sizeBytes: { type: 'number' },
          trial: { type: 'boolean' },
          note: { type: 'string' }
        }
      },
      render: (_args, value) => [
        {
          type: 'text',
          text: value.playable
            ? `${value.level ? LEVEL_NOTES[value.level] ?? value.level : ''} ${value.format ?? ''} 直链已就绪`
            : value.note ?? '未能获取播放链接'
        }
      ]
    },
    timeoutMs: 30000,
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const level = args.level ?? 'standard';
      const body = await withSignal(
        ncm.call('song_url_v1', { id: args.songId, level }),
        exec.signal
      );
      const data = body?.data?.[0];
      if (!data) {
        return {
          songId: args.songId,
          playable: false,
          note: '接口未返回播放信息:歌曲可能已下架,或需要登录 Cookie'
        };
      }
      const notes = [];
      if (data.fee === 1) notes.push('VIP 歌曲');
      if (data.freeTrialInfo) notes.push('当前为试听片段,完整播放需要有效会员 Cookie');
      if (!data.url) notes.push('未获得链接:配置 Cookie(含 MUSIC_U=...)后重试');
      return {
        songId: args.songId,
        playable: Boolean(data.url),
        url: data.url ?? undefined,
        format: data.type ?? undefined,
        level: data.level ?? level,
        sizeBytes: typeof data.size === 'number' ? data.size : undefined,
        trial: Boolean(data.freeTrialInfo),
        note: notes.length > 0 ? notes.join(';') : undefined
      };
    }
  });
}

function musicLyricTool(ncm) {
  return defineTool({
    name: 'music_lyric',
    description: '获取网易云歌曲的歌词(LRC 格式,含时间轴)与可能的中文翻译。需要 music_search 返回的歌曲 id。',
    parameters: {
      songId: { type: 'number', required: true, description: '歌曲 id' }
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          songId: { type: 'number', required: true },
          hasLyric: { type: 'boolean', required: true },
          lyric: { type: 'string' },
          translation: { type: 'string' }
        }
      },
      render: (_args, value) => [{ type: 'text', text: value.hasLyric ? '歌词已获取' : '这首歌没有可用歌词' }]
    },
    timeoutMs: 30000,
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const body = await withSignal(ncm.call('lyric_new', { id: args.songId }), exec.signal);
      const lyric = body?.lrc?.lyric ?? '';
      const translation = body?.tlyric?.lyric ?? '';
      return {
        songId: args.songId,
        hasLyric: lyric.trim().length > 0,
        lyric: lyric.trim() || undefined,
        translation: translation.trim() || undefined
      };
    }
  });
}

function musicPlaylistTracksTool(ncm) {
  return defineTool({
    name: 'music_playlist_tracks',
    description: '列出网易云歌单的曲目(id/歌名/歌手/专辑)。需要 music_search(type=playlist)返回的歌单 id;结果多时用 offset 翻页。',
    parameters: {
      playlistId: { type: 'number', required: true, description: '歌单 id' },
      limit: { type: 'number', description: '返回曲目数 1-100,默认 30' },
      offset: { type: 'number', description: '偏移量,用于翻页,默认 0' }
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          playlistId: { type: 'number', required: true },
          total: { type: 'number', required: true },
          tracks: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                id: { type: 'number', required: true },
                name: { type: 'string', required: true },
                detail: { type: 'string' }
              }
            }
          }
        }
      },
      render: (_args, value) => [
        { type: 'text', text: `歌单 ${value.playlistId}:共 ${value.total} 首,本次返回 ${value.tracks.length} 首` }
      ]
    },
    timeoutMs: 30000,
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const limit = Math.min(Math.max(Math.trunc(args.limit ?? 30), 1), 100);
      const offset = Math.max(Math.trunc(args.offset ?? 0), 0);
      const body = await withSignal(
        ncm.call('playlist_track_all', { id: args.playlistId, limit, offset }),
        exec.signal
      );
      const { total, tracks } = normalizePlaylistTracks(body);
      return { playlistId: args.playlistId, total, tracks };
    }
  });
}

export function apply(ctx, config = {}) {
  // 生效 Cookie:客户端扫码登录/退出优先,用户未在客户端操作过时才用插件配置(动态读取,登录后无需重启)
  const configCookie = config.cookie ?? '';
  const ncm = createNcm({
    getCookie: () => resolveCookie({ configCookie }).cookie,
    timeoutMs: config.requestTimeoutMs ?? 15000,
    realIP: config.realIP ?? '116.25.146.177'
  });

  // 客户端 UI 的数据与音频通道:同源于 DSH 本地 webserver。
  const musicRoute = createMusicService({
    ncm,
    defaultLevel: config.defaultLevel ?? 'standard',
    configCookie
  });
  ctx.webServer.register({
    kind: 'prefix',
    path: '/music',
    handler: musicRoute
  });

  // 聊天侧工具(附加能力:agent 可直接搜歌/点歌)
  ctx.tools.register(musicSearchTool(ncm));
  ctx.tools.register(musicSongUrlTool(ncm));
  ctx.tools.register(musicLyricTool(ncm));
  ctx.tools.register(musicPlaylistTracksTool(ncm));

  ctx.logger?.debug?.('music: /music routes + 4 tools registered');
}

export { name, inject, Config };
