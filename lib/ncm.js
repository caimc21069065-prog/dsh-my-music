// lib/ncm.js — netease-cloud-music-api-alger 的库形态封装。
// 与 AlgerMusicPlayer 桌面版同源的数据层,但以函数调用而非内嵌 HTTP 服务使用。

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

// 该库的部分入口会读取 tmp 目录下的 anonymous_token,缺失时直接崩溃
// (AlgerMusicPlayer 的 src/main/server.ts 有同样的前置处理)。
const tokenPath = path.resolve(os.tmpdir(), 'anonymous_token');
if (!fs.existsSync(tokenPath)) {
  try {
    fs.writeFileSync(tokenPath, '', 'utf-8');
  } catch {
    // tmp 不可写时忽略,让调用按原样失败
  }
}

const require = createRequire(import.meta.url);
const ncmApi = require('netease-cloud-music-api-alger/main');

export const SEARCH_TYPE_CODES = { song: 1, album: 10, artist: 100, playlist: 1000 };

/**
 * 创建网易云 API 调用器。
 * @param {{ getCookie?: () => string, timeoutMs?: number, realIP?: string }} options
 *   getCookie: 动态返回登录 Cookie(扫码登录后无需重启即可生效)。
 *   realIP: 伪造客户端 IP(该 API 库的标准能力,AlgerMusicPlayer 默认启用),
 *           匿名请求被风控限流时可恢复 song_url 等接口。
 */
export function createNcm({ getCookie = () => '', timeoutMs = 15000, realIP = '' } = {}) {
  async function once(name, params) {
    const fn = ncmApi[name];
    if (typeof fn !== 'function') {
      throw new Error(`网易云音乐 API 不存在: ${name}(库版本可能已变化)`);
    }
    const payload = { ...params };
    // 显式传入 cookie 时以传入值为准(空串表示匿名请求,如扫码轮询)
    const cookie = params.cookie === undefined ? getCookie() : params.cookie;
    if (cookie) payload.cookie = cookie;
    else delete payload.cookie;
    if (realIP) payload.realIP = realIP;

    const task = fn(payload);
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${name} 请求超时(${timeoutMs}ms)`)), timeoutMs);
    });
    try {
      const res = await Promise.race([task, timeout]);
      if (res?.status && res.status >= 400) {
        // 带上 status:重试判定要区分「网关类失败(可重试)」和「业务 404(不该重试)」
        const error = new Error(`网易云音乐接口返回 ${res.status}`);
        error.status = res.status;
        throw error;
      }
      return res?.body ?? res;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * 该 API 库复用长连接,偶发 TLS socket 断连(尤其在代理/限流下)会让整页板块空白。
   * 网络类错误重试两次,业务错误(接口不存在、4xx)直接抛出。
   */
  async function call(name, params = {}) {
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await once(name, params);
      } catch (error) {
        lastError = error;
        const msg = error?.message || error?.body?.msg || error?.body?.message || '';
        const transient = /socket|TLS|ECONNRESET|ETIMEDOUT|EAI_AGAIN|fetch failed|network/i.test(msg)
          || /请求超时|timeout/i.test(msg)
          || (typeof error?.status === 'number' && error.status >= 500);
        if (!transient || attempt === 2) break;
        await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
      }
    }
    throw lastError;
  }

  return { call };
}

/** 把搜索结果压成紧凑的 {id, name, detail} 列表,控制 token 占用。 */
export function normalizeSearchResults(body, type) {
  const result = body?.result ?? {};
  if (type === 'song') {
    return (result.songs ?? []).map((s) => ({
      id: s.id,
      name: s.name,
      fee: s.fee,
      detail: [
        (s.artists ?? s.ar ?? []).map((a) => a.name).join('/') || '未知歌手',
        s.album?.name || s.al?.name || '',
        s.duration || s.dt ? formatDuration(s.duration ?? s.dt) : ''
      ]
        .filter(Boolean)
        .join(' · ')
    }));
  }
  if (type === 'artist') {
    return (result.artists ?? []).map((a) => ({
      id: a.id,
      name: a.name,
      detail: [
        (a.alias ?? []).join('/') || '',
        [a.albumCount, '专辑'].filter(Boolean).join(''),
        [a.songCount, '首歌曲'].filter(Boolean).join('')
      ]
        .filter(Boolean)
        .join(' · ')
    }));
  }
  if (type === 'album') {
    return (result.albums ?? []).map((a) => ({
      id: a.id,
      name: a.name,
      detail: [a.artist?.name || a.artists?.[0]?.name || '未知歌手', [a.songCount ?? a.size, '首'].filter(Boolean).join(''), formatPublishTime(a.publishTime)]
        .filter(Boolean)
        .join(' · ')
    }));
  }
  return (result.playlists ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    detail: [[p.trackCount, '首'].filter(Boolean).join(''), p.creator?.nickname || '', formatPlayCount(p.playCount)]
      .filter(Boolean)
      .join(' · ')
  }));
}

/**
 * 歌曲 → 客户端 UI 直接消费的结构(对齐 AlgerMusicPlayer 的 SongResult 字段习惯)。
 * 兼容三种来源:搜索(artists/album)、歌单/专辑(ar/al)、FM/推荐(song 内嵌)。
 */
export function normalizeSong(song = {}) {
  const s = song.song && !song.ar && !song.artists ? song.song : song;
  const artists = s.ar ?? s.artists ?? [];
  const album = s.al ?? s.album ?? {};
  return {
    id: s.id,
    name: s.name ?? '',
    alias: s.tns?.[0] ?? s.alia?.[0] ?? s.alias?.[0] ?? '',
    artist: artists.map((a) => a.name).filter(Boolean).join(' / ') || '未知歌手',
    artists: artists.map((a) => ({ id: a.id, name: a.name })),
    album: album.name ?? '',
    albumId: album.id ?? 0,
    cover: album.picUrl ?? s.picUrl ?? '',
    duration: s.dt ?? s.duration ?? 0,
    fee: s.fee ?? s.privilege?.fee ?? 0,
    mv: s.mv ?? 0
  };
}

export function normalizeSongs(list) {
  return (Array.isArray(list) ? list : []).map(normalizeSong).filter((s) => s.id);
}

/** 歌单卡片:推荐歌单用 picUrl,榜单/歌单接口用 coverImgUrl。 */
export function normalizePlaylistCard(p = {}) {
  return {
    id: p.id,
    name: p.name ?? '',
    cover: p.picUrl ?? p.coverImgUrl ?? '',
    playCount: p.playCount ?? 0,
    trackCount: p.trackCount ?? 0,
    creator: p.creator?.nickname ?? p.uiElement?.subTitle?.title ?? '',
    copywriter: p.copywriter ?? '',
    updateFrequency: p.updateFrequency ?? ''
  };
}

export function normalizeAlbumCard(a = {}) {
  return {
    id: a.id,
    name: a.name ?? '',
    cover: a.picUrl ?? '',
    artist: a.artist?.name ?? (a.artists ?? []).map((x) => x.name).join(' / '),
    artistId: a.artist?.id ?? a.artists?.[0]?.id ?? 0,
    publishTime: a.publishTime ?? 0,
    size: a.size ?? a.songCount ?? 0
  };
}

export function normalizeArtistCard(a = {}) {
  return {
    id: a.id,
    name: a.name ?? '',
    cover: a.picUrl ?? a.img1v1Url ?? '',
    albumSize: a.albumSize ?? 0,
    musicSize: a.musicSize ?? 0,
    alias: (a.alias ?? []).join(' / ')
  };
}

export function normalizePlaylistTracks(body) {
  const songs = body?.songs ?? [];
  return {
    total: typeof body?.total === 'number' ? body.total : songs.length,
    tracks: songs.map((s) => ({
      ...normalizeSong(s),
      fee: s.fee ?? s.privilege?.fee,
      detail: [
        (s.ar ?? []).map((a) => a.name).join('/') || (s.artists ?? []).map((a) => a.name).join('/') || '未知歌手',
        s.al?.name || s.album?.name || ''
      ]
        .filter(Boolean)
        .join(' · ')
    }))
  };
}

export function formatDuration(ms) {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatPublishTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? '' : `发行于 ${d.getFullYear()}`;
}

function formatPlayCount(count) {
  if (typeof count !== 'number') return '';
  if (count >= 100_000_000) return `播放 ${Math.round(count / 100_000_000)}亿+`;
  if (count >= 10_000) return `播放 ${Math.round(count / 10_000)}万+`;
  return `播放 ${count}`;
}
