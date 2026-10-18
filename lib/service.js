// lib/service.js — 宿主 webserver 路由服务:
//   GET  /music/api/*          数据接口(搜索/链接/歌词/歌单/榜单/账号/下载,JSON)
//   GET  /music/stream/:id     音频流代理(Range 透传,UI 的 <audio> 直接指向这里)
//   扫码登录:/api/login/qr/* 生成二维码并轮询,803 成功后 Cookie 落盘持久化

import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { mkdir, readdir, rename, rm, stat } from 'node:fs/promises';

import QRCode from 'qrcode';

import {
  SEARCH_TYPE_CODES,
  normalizeAlbumCard,
  normalizeArtistCard,
  normalizePlaylistCard,
  normalizePlaylistTracks,
  normalizeSearchResults,
  normalizeSong,
  normalizeSongs
} from './ncm.js';
import { COOKIE_FILE, mergeCookies, normalizeCookie, resolveCookie, writeCookieFile } from './cookie.js';

export const DEFAULT_DOWNLOAD_DIR = path.join(os.homedir(), 'Music', 'DSH');
const LEVELS = new Set(['standard', 'exhigh', 'higher', 'lossless']);
const QR_SESSION_TTL_MS = 5 * 60 * 1000; // 网易云二维码约 60s 过期,留足余量仅为兜底清理
const DOWNLOAD_TIMEOUT_MS = 5 * 60 * 1000; // 完整曲目体积可达数十 MB,留足下载窗口
const STREAM_URL_TTL_MS = 5 * 60 * 1000; // 网易云直链约 20 分钟有效,复用窗口取保守值
const DOWNLOAD_LIST_MAX = 30; // 设置页只展示最近若干个文件,避免目录里几千首时拖慢首屏
const AUDIO_EXT = new Set(['.mp3', '.flac', '.m4a', '.aac', '.ogg', '.wav', '.ape']);

const QR_MESSAGES = { 800: '二维码已过期,请刷新', 801: '等待扫码', 802: '已扫码,请在手机上确认' };

/** 客户端传来的歌名/歌手只作为文件名素材:去掉路径分隔符与 Windows 非法字符,防止目录穿越。 */
function safeFileNamePart(raw, max = 80) {
  const cleaned = String(raw ?? '')
    .replace(/[\\/*?:"<>|\u0000-\u001f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
  const base = path.basename(cleaned).replace(/^\.+/, '').trim();
  return base || '';
}

/**
 * 在系统文件管理器里打开下载目录(或精确选中某个文件)。
 * Windows 用 explorer 的 /select, 参数可定位到文件;macOS 用 open -R;其余平台打开所在目录。
 */
function revealInFileManager(target, { select = false } = {}) {
  const platform = process.platform;
  const canSelect = platform === 'win32' || platform === 'darwin';
  const mode = select && canSelect ? 'file' : 'dir';
  // 无桌面环境/自动化测试时不要真的弹窗口(冒烟测试靠它验证路径选择逻辑)
  if (process.env.DSH_MUSIC_NO_OPEN === '1') return mode;
  const [cmd, args] = platform === 'win32'
    // 注意 /select, 与路径要拆成两个参数:explorer 自己拼命令行,合成一个参数时带空格的路径会失效
    ? ['explorer.exe', select ? ['/select,', target] : [target]]
    : platform === 'darwin'
      ? ['open', select ? ['-R', target] : [target]]
      : ['xdg-open', select ? [path.dirname(target)] : [target]];
  try {
    const child = spawn(cmd, args, { detached: true, stdio: 'ignore' });
    // explorer.exe 即使成功也可能返回非 0 退出码,这里只吞掉启动期错误(命令不存在等)
    child.on('error', () => {});
    child.unref();
    return mode;
  } catch {
    return '';
  }
}

function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  res.end(body);
}

/** 创建音乐数据/流服务处理器。返回一个 (req,res) 处理函数,挂在前缀路由 /music 下。 */
export function createMusicService({
  ncm,
  defaultLevel = 'standard',
  cookieFile = COOKIE_FILE,
  configCookie = '',
  downloadDir = DEFAULT_DOWNLOAD_DIR
} = {}) {
  // key -> { cookie, at }:同一张二维码的轮询要沿用服务端陆续下发的设备 Cookie(与浏览器行为一致)
  const qrSessions = new Map();
  // `${songId}:${level}` -> { url, at }:音频流解析结果缓存
  const streamUrls = new Map();
  const recallQrCookie = (key) => {
    for (const [k, s] of qrSessions) if (Date.now() - s.at > QR_SESSION_TTL_MS) qrSessions.delete(k);
    return qrSessions.get(key)?.cookie ?? '';
  };
  const rememberQrCookie = (key, cookie) => {
    if (!key || !cookie) return;
    qrSessions.set(key, { cookie, at: Date.now() });
  };

  /**
   * 解析并缓存直链:浏览器每次 seek 都会重新请求 /stream,而重新解析偶尔会拿不到链接
   * (网易云按 IP/时效签发),导致一点快进就中断。直链有效期远长于该缓存。
   */
  async function resolveStreamUrl(songId, level, { refresh = false } = {}) {
    const key = `${songId}:${level}`;
    const hit = streamUrls.get(key);
    if (!refresh && hit && Date.now() - hit.at < STREAM_URL_TTL_MS) return hit.url;
    const body = await ncm.call('song_url_v1', { id: songId, level });
    const url = body?.data?.[0]?.url ?? '';
    if (url) streamUrls.set(key, { url, at: Date.now() });
    else streamUrls.delete(key);
    return url;
  }

  /**
   * 拉取音频源:网易云 CDN 偶发 TLS socket 断连(代理/限流环境下尤其多),
   * 尚未写响应头时可以直接重试,用户侧表现为「点一下没声音 / 拖进度失败」。
   */
  async function fetchUpstream(url, headers, attempts = 2) {
    let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        return await fetch(url, { headers, redirect: 'follow' });
      } catch (error) {
        lastError = error;
        if (i === attempts - 1) break;
        await new Promise((r) => setTimeout(r, 350 * (i + 1)));
      }
    }
    throw lastError;
  }

  /** 把音频源透传给客户端;尚未写响应头时抛错,交由调用方换链接重试。 */
  async function pipeUpstream(req, res, url) {
    const headers = {};
    if (req.headers.range) headers.range = req.headers.range;
    const upstream = await fetchUpstream(url, headers);
    if (!upstream.ok && upstream.status !== 206) {
      await upstream.body?.cancel().catch(() => {});
      throw new Error(`音频源返回 ${upstream.status}`);
    }
    res.writeHead(upstream.status, {
      'content-type': upstream.headers.get('content-type') ?? 'audio/mpeg',
      'accept-ranges': upstream.headers.get('accept-ranges') ?? 'bytes',
      ...(upstream.headers.get('content-range') ? { 'content-range': upstream.headers.get('content-range') } : {}),
      ...(upstream.headers.get('content-length') ? { 'content-length': upstream.headers.get('content-length') } : {}),
      'cache-control': 'no-store'
    });
    if (req.method === 'HEAD' || !upstream.body) {
      res.end();
      return;
    }
    await pipeline(Readable.fromWeb(upstream.body), res);
  }

  async function handleStream(req, res, songId) {
    const parsed = new URL(req.url, 'http://local');
    const levelParam = parsed.searchParams.get('level');
    const level = LEVELS.has(levelParam) ? levelParam : defaultLevel;
    let url;
    try {
      url = await resolveStreamUrl(songId, level);
    } catch (error) {
      return json(res, 502, { error: `解析播放链接失败:${error.message}` });
    }
    if (!url) {
      return json(res, 404, { error: '未获得播放链接(歌曲可能需要登录 Cookie 或为 VIP 试听)' });
    }
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await pipeUpstream(req, res, url);
      } catch (error) {
        if (res.headersSent) return res.destroy();
        if (attempt > 0) return json(res, 502, { error: `拉取音频失败:${error.message}` });
        url = await resolveStreamUrl(songId, level, { refresh: true }).catch(() => url);
      }
    }
  }

  /** 下载:解析直链后落盘到 downloadDir,先写 .part 再改名,避免中断留下半截文件。 */
  async function handleDownload(query) {
    const songId = Number(query.get('id'));
    if (!Number.isFinite(songId) || songId <= 0) return { status: 400, body: { error: 'songId 无效' } };
    const level = LEVELS.has(query.get('level')) ? query.get('level') : defaultLevel;
    let data;
    try {
      const body = await ncm.call('song_url_v1', { id: songId, level });
      data = body?.data?.[0];
    } catch (error) {
      return { status: 502, body: { error: `解析下载链接失败:${error.message}` } };
    }
    if (!data?.url) {
      return { status: 502, body: { error: '未获得下载链接(歌曲可能需要登录 Cookie 或为 VIP 曲目)' } };
    }

    const title = safeFileNamePart(query.get('name')) || `song-${songId}`;
    const artist = safeFileNamePart(query.get('artist'));
    const ext = safeFileNamePart(data.type || 'mp3', 8).toLowerCase() || 'mp3';
    const trial = Boolean(data.freeTrialInfo);
    const fileName = `${artist ? `${artist} - ` : ''}${title}${trial ? ' (试听)' : ''}.${ext}`;

    const dir = path.resolve(downloadDir);
    const target = path.join(dir, fileName);
    const tmp = `${target}.part`;
    await mkdir(dir, { recursive: true }).catch(() => {});
    let lastError;
    // 网易云 CDN 偶发 5xx/TLS 断连:整段重下一次,别让用户点了下载只收到一个失败提示
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const upstream = await fetch(data.url, { signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS) });
        if (!upstream.ok || !upstream.body) {
          throw new Error(`音频源返回 ${upstream.status}`);
        }
        await pipeline(Readable.fromWeb(upstream.body), createWriteStream(tmp));
        await rename(tmp, target);
        const { size } = await stat(target);
        return {
          status: 200,
          body: { ok: true, path: target, dir, fileName, sizeBytes: size, level: data.level ?? level, trial }
        };
      } catch (error) {
        lastError = error;
        await rm(tmp, { force: true }).catch(() => {});
        if (attempt === 0) await new Promise((r) => setTimeout(r, 500));
      }
    }
    return { status: 502, body: { error: `下载失败:${lastError?.message ?? '未知错误'}` } };
  }

  /**
   * 下载目录概览:界面要能告诉用户「歌存哪了」,并列出最近落盘的文件以便定位。
   * 目录不存在(从未下载过)不算错误,返回 exists=false 让界面显示空态。
   */
  async function handleDownloadInfo() {
    const dir = path.resolve(downloadDir);
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return { status: 200, body: { dir, exists: false, items: [] } };
    }
    const files = entries.filter((e) => e.isFile() && AUDIO_EXT.has(path.extname(e.name).toLowerCase()));
    const listed = await Promise.all(files.map(async (e) => {
      const full = path.join(dir, e.name);
      try {
        const s = await stat(full);
        return { name: e.name, path: full, sizeBytes: s.size, mtime: s.mtimeMs, trial: /\(试听\)\.[a-z0-9]+$/i.test(e.name) };
      } catch {
        return null;
      }
    }));
    const items = listed
      .filter(Boolean)
      .sort((a, b) => b.mtime - a.mtime)
      .slice(0, DOWNLOAD_LIST_MAX);
    return { status: 200, body: { dir, exists: true, total: files.length, items } };
  }

  /** 打开下载目录;带 name 时在文件管理器里精确选中该文件。只接受目录内的文件名,防止被当成任意路径打开。 */
  async function handleOpenDownloadDir(query) {
    const dir = path.resolve(downloadDir);
    const raw = String(query.get('name') ?? '');
    const base = raw ? path.basename(raw) : '';
    // basename 与原串不一致 => 传了路径分隔符/上跳,直接退化成「打开目录」
    const safe = base && base === raw && !base.startsWith('.') ? base : '';
    let target = dir;
    let select = false;
    if (safe) {
      const full = path.join(dir, safe);
      if (path.dirname(full) === dir) {
        try {
          await stat(full);
          target = full;
          select = true;
        } catch {
          // 文件已被移走:退回打开目录,不让用户卡在一个失败提示上
        }
      }
    }
    if (!select) {
      // 目录可能还没创建,先建出来,避免 explorer 打开失败
      await mkdir(dir, { recursive: true }).catch(() => {});
    }
    const opened = revealInFileManager(target, { select });
    if (!opened) return { status: 500, body: { error: '无法调起系统文件管理器(当前环境不支持)' } };
    return { status: 200, body: { ok: true, opened, dir, path: target } };
  }

  async function handleApi(req, res, pathname, query) {
    const limit = (v, d, max = 100) => Math.min(Math.max(Math.trunc(Number(v) || d), 1), max);
    const offset = (v) => Math.max(Math.trunc(Number(v) || 0), 0);
    /** 首页由多个独立板块拼成:单个接口挂了只留空板块,不能让整页 500。 */
    const safe = async (fn, fallback = null) => {
      try {
        return await fn();
      } catch {
        return fallback;
      }
    };
    switch (pathname) {
      case '/api/health': {
        const state = resolveCookie({ configCookie, cookieFile });
        return json(res, 200, { ok: true, hasCookie: Boolean(state.cookie), cookieSource: state.source });
      }
      case '/api/account': {
        const state = resolveCookie({ configCookie, cookieFile });
        const base = { loggedIn: false, cookieSource: state.source, hasConfigCookie: state.hasConfigCookie };
        if (!state.cookie) return json(res, 200, base);
        try {
          const body = await ncm.call('user_account', {});
          const profile = body?.profile;
          if (!profile?.nickname) return json(res, 200, base);
          return json(res, 200, {
            ...base,
            loggedIn: true,
            nickname: profile.nickname,
            avatar: profile.avatarUrl,
            vipType: profile.vipType
          });
        } catch {
          return json(res, 200, base);
        }
      }
      case '/api/login/qr/key': {
        const body = await ncm.call('login_qr_key', {});
        const key = body?.data?.unikey;
        if (!key) return json(res, 502, { error: '网易云未返回二维码 key' });
        return json(res, 200, { key });
      }
      case '/api/login/qr/create': {
        const key = query.get('key');
        if (!key) return json(res, 400, { error: '缺少 key' });
        // 该 API 库的 qrimg 已是「不支持二维码登录」占位图,真正的授权载荷在 qrurl,二维码由我们自己绘制
        const body = await ncm.call('login_qr_create', { key, platform: 'web' });
        const qrurl = body?.data?.qrurl;
        if (!qrurl) return json(res, 502, { error: '网易云未返回二维码链接' });
        const qrimg = await QRCode.toDataURL(qrurl, {
          margin: 1,
          width: 320,
          errorCorrectionLevel: 'M',
          color: { dark: '#161616', light: '#ffffff' }
        });
        return json(res, 200, { key, qrurl, qrimg });
      }
      case '/api/login/qr/check': {
        const key = query.get('key');
        if (!key) return json(res, 400, { error: '缺少 key' });
        const body = await ncm.call('login_qr_check', { key, cookie: recallQrCookie(key) });
        const code = body?.code;
        // 服务端在轮询过程中陆续下发设备 Cookie,后续轮询要带着(与浏览器行为一致)
        const cookie = mergeCookies(recallQrCookie(key), normalizeCookie(body?.cookie));
        if (code === 803) {
          qrSessions.delete(key);
          if (!/MUSIC_U=/.test(cookie)) {
            return json(res, 200, { code, ok: false, message: '授权成功但未取到 MUSIC_U,请重新扫码' });
          }
          const written = writeCookieFile(cookie, cookieFile);
          if (!written.ok) {
            return json(res, 200, { code, ok: false, message: `登录态写入失败:${written.error}` });
          }
          return json(res, 200, { code, ok: true, message: '登录成功' });
        }
        rememberQrCookie(key, cookie);
        return json(res, 200, { code, ok: false, message: QR_MESSAGES[code] ?? body?.message ?? `状态 ${code}` });
      }
      case '/api/logout': {
        const written = writeCookieFile('', cookieFile);
        qrSessions.clear();
        if (!written.ok) return json(res, 500, { error: `登录态清除失败:${written.error}` });
        return json(res, 200, { ok: true, cookieSource: resolveCookie({ configCookie, cookieFile }).source });
      }
      case '/api/search': {
        const type = query.get('type') || 'song';
        const code = SEARCH_TYPE_CODES[type];
        if (!code) return json(res, 400, { error: `不支持的类型: ${type}` });
        // cloudsearch 返回完整歌曲元数据(封面/专辑/时长),界面需要它来渲染标准歌曲行
        const body = await ncm.call('cloudsearch', {
          keywords: query.get('keywords') || '',
          type: code,
          limit: limit(query.get('limit'), 30, 100),
          offset: offset(query.get('offset'))
        });
        const result = body?.result ?? {};
        const pick = (list, fn) => (Array.isArray(list) ? list.map(fn) : []);
        const legacy = normalizeSearchResults(body, type);
        const items =
          type === 'song' ? normalizeSongs(result.songs)
            : type === 'playlist' ? pick(result.playlists, normalizePlaylistCard)
              : type === 'album' ? pick(result.albums, normalizeAlbumCard)
                : pick(result.artists, normalizeArtistCard);
        // detail 是旧客户端/工具依赖的摘要字段,结构化字段之上继续保留
        const withDetail = items.map((it, i) => ({ ...it, detail: legacy[i]?.detail ?? '' }));
        return json(res, 200, {
          type,
          total: result.songCount ?? result.albumCount ?? result.artistCount ?? result.playlistCount ?? items.length,
          items: withDetail,
          legacy
        });
      }
      case '/api/search/suggest': {
        const body = await ncm.call('search_suggest', { keywords: query.get('keywords') || '', type: 'mobile' });
        return json(res, 200, {
          items: (body?.result?.allMatch ?? []).map((s) => s.keyword).filter(Boolean).slice(0, 10)
        });
      }
      case '/api/search/hot': {
        const body = await ncm.call('search_hot_detail', {});
        return json(res, 200, {
          items: (body?.data ?? []).slice(0, 10).map((h) => ({ keyword: h.searchWord, score: h.score, icon: h.iconUrl }))
        });
      }
      case '/api/home': {
        const [daily, playlists, artists, albums, newSongs] = await Promise.all([
          safe(async () => {
            const body = await ncm.call('recommend_songs', {});
            const songs = body?.data?.dailySongs;
            if (songs?.length) return { name: '每日推荐', source: 'daily', tracks: normalizeSongs(songs).slice(0, 30) };
            throw new Error('每日推荐为空');
          }),
          safe(async () => {
            const body = await ncm.call('personalized', { limit: 10 });
            const list = body?.result;
            if (!list?.length) throw new Error('推荐歌单为空');
            return list.map(normalizePlaylistCard);
          }),
          safe(async () => {
            const body = await ncm.call('top_artists', { offset: 0, limit: 12 });
            return (body?.artists ?? []).map(normalizeArtistCard);
          }),
          safe(async () => {
            const body = await ncm.call('album_new', { area: 'ALL', limit: 10 });
            return (body?.albums ?? []).map(normalizeAlbumCard);
          }),
          safe(async () => {
            const body = await ncm.call('personalized_newsong', { limit: 12, type: 'new' });
            const list = body?.result;
            if (!list?.length) throw new Error('新歌为空');
            return list.map((it) => normalizeSong(it.song ? { ...it.song, picUrl: it.picUrl } : it));
          })
        ]);

        const dailyFinal = daily ?? await safe(async () => {
          const body = await ncm.call('toplist_detail', { id: 3778678 });
          return { name: '热歌精选', source: 'hot', tracks: normalizeSongs((body?.playlist?.tracks ?? []).slice(0, 30)) };
        }, { name: '热歌精选', source: 'hot', tracks: [] });
        const playlistsFinal = playlists ?? await safe(async () => {
          const body = await ncm.call('top_playlist', { order: 'hot', limit: 10, cat: '全部' });
          return (body?.playlists ?? []).map(normalizePlaylistCard);
        }, []);
        const newSongsFinal = newSongs ?? await safe(async () => {
          const body = await ncm.call('toplist_detail', { id: 3779629 });
          return normalizeSongs((body?.playlist?.tracks ?? []).slice(0, 12));
        }, []);

        return json(res, 200, {
          daily: dailyFinal,
          playlists: playlistsFinal,
          artists: artists ?? [],
          albums: albums ?? [],
          newSongs: newSongsFinal
        });
      }
      case '/api/playlists/categories': {
        const body = await ncm.call('playlist_catlist', {});
        return json(res, 200, {
          categories: ['全部', ...(body?.sub ?? []).map((s) => s.name)]
        });
      }
      case '/api/playlists': {
        const body = await ncm.call('top_playlist', {
          order: 'hot',
          limit: limit(query.get('limit'), 42, 100),
          offset: offset(query.get('offset')),
          cat: query.get('cat') || '全部'
        });
        return json(res, 200, {
          total: body?.total ?? 0,
          more: body?.more ?? false,
          items: (body?.playlists ?? []).map(normalizePlaylistCard)
        });
      }
      case '/api/album/new': {
        const body = await ncm.call('album_new', {
          area: query.get('area') || 'ALL',
          limit: limit(query.get('limit'), 20, 50)
        });
        return json(res, 200, {
          total: body?.total ?? 0,
          items: (body?.albums ?? []).map(normalizeAlbumCard)
        });
      }
      case '/api/album/detail': {
        const body = await ncm.call('album', { id: query.get('id') });
        const a = body?.album ?? {};
        return json(res, 200, {
          album: {
            id: a.id,
            name: a.name,
            cover: a.picUrl,
            artist: a.artist?.name ?? (a.artists ?? []).map((x) => x.name).join(' / '),
            artistId: a.artist?.id ?? a.artists?.[0]?.id ?? 0,
            artistCover: a.artist?.picUrl ?? '',
            publishTime: a.publishTime,
            company: a.company,
            description: a.description,
            size: a.size
          },
          tracks: normalizeSongs(body?.songs)
        });
      }
      case '/api/artist/top': {
        const body = await ncm.call('top_artists', { offset: offset(query.get('offset')), limit: limit(query.get('limit'), 12, 50) });
        return json(res, 200, { items: (body?.artists ?? []).map(normalizeArtistCard) });
      }
      case '/api/artist/detail': {
        // artist_detail 只给艺人资料;热门歌曲走 artist_top_song(该库的 detail 不再带 hotSongs)
        const [body, top] = await Promise.all([
          ncm.call('artist_detail', { id: query.get('id') }),
          safe(() => ncm.call('artist_top_song', { id: query.get('id') }), null)
        ]);
        const data = body?.data ?? body ?? {};
        const artist = data.artist ?? {};
        return json(res, 200, {
          artist: {
            ...normalizeArtistCard({ ...artist, picUrl: artist.cover ?? artist.avatar }),
            briefDesc: artist.briefDesc ?? '',
            albumSize: artist.albumSize ?? 0,
            musicSize: artist.musicSize ?? 0,
            followed: Boolean(artist.followed)
          },
          hotSongs: normalizeSongs(top?.songs ?? data.hotSongs ?? []).slice(0, 50)
        });
      }
      case '/api/artist/albums': {
        const body = await ncm.call('artist_album', {
          id: query.get('id'),
          limit: limit(query.get('limit'), 12, 50),
          offset: offset(query.get('offset'))
        });
        return json(res, 200, {
          items: (body?.hotAlbums ?? []).map(normalizeAlbumCard)
        });
      }
      case '/api/song/detail': {
        const ids = (query.get('ids') || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 50);
        if (ids.length === 0) return json(res, 200, { items: [] });
        const body = await ncm.call('song_detail', { ids: ids.join(',') });
        return json(res, 200, { items: normalizeSongs(body?.songs) });
      }
      case '/api/personal/fm': {
        const body = await ncm.call('personal_fm', {});
        return json(res, 200, { items: normalizeSongs(body?.data) });
      }
      case '/api/user/playlists': {
        // 未登录时 user_account 可能失败:不返回 500,交给客户端按「未登录」展示
        const uid = await safe(async () => {
          const body = await ncm.call('user_account', {});
          return body?.account?.id ?? body?.profile?.userId;
        }, null);
        if (!uid) return json(res, 200, { items: [] });
        const list = await safe(() => ncm.call('user_playlist', { uid, limit: limit(query.get('limit'), 30, 100) }), null);
        return json(res, 200, { items: (list?.playlist ?? []).map(normalizePlaylistCard) });
      }
      case '/api/like': {
        const id = Number(query.get('id'));
        if (!Number.isFinite(id) || id <= 0) return json(res, 400, { error: 'id 无效' });
        const like = query.get('like') !== 'false';
        await ncm.call('like', { id, like });
        return json(res, 200, { ok: true, id, like });
      }
      case '/api/song/urls': {
        const ids = (query.get('ids') || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 50);
        if (ids.length === 0) return json(res, 200, { items: [] });
        const body = await ncm.call('song_url_v1', { id: ids.join(','), level: LEVELS.has(query.get('level')) ? query.get('level') : defaultLevel });
        return json(res, 200, { items: body?.data ?? [] });
      }
      case '/api/lyric': {
        // 经典接口(带 _nmclfl)返回标准 LRC;新版 lyric_new 会把头部若干行改成 JSON 富文本,逐字歌词缺失时反而丢行
        const body = await ncm.call('lyric', { id: query.get('id') });
        return json(res, 200, {
          lyric: body?.lrc?.lyric ?? '',
          translation: body?.tlyric?.lyric ?? ''
        });
      }
      case '/api/download': {
        const result = await handleDownload(query);
        return json(res, result.status, result.body);
      }
      case '/api/download/info': {
        const result = await handleDownloadInfo();
        return json(res, result.status, result.body);
      }
      case '/api/download/open': {
        const result = await handleOpenDownloadDir(query);
        return json(res, result.status, result.body);
      }
      case '/api/playlist/detail': {
        const body = await ncm.call('playlist_detail', { id: query.get('id') });
        const p = body?.playlist ?? {};
        return json(res, 200, {
          id: p.id,
          name: p.name,
          cover: p.coverImgUrl,
          description: p.description,
          trackCount: p.trackCount,
          playCount: p.playCount,
          subscribedCount: p.subscribedCount,
          shareCount: p.shareCount,
          tags: p.tags ?? [],
          creator: p.creator?.nickname,
          creatorId: p.creator?.userId,
          creatorAvatar: p.creator?.avatarUrl,
          createTime: p.createTime,
          updateTime: p.updateTime
        });
      }
      case '/api/playlist/tracks': {
        const body = await ncm.call('playlist_track_all', {
          id: query.get('id'),
          limit: limit(query.get('limit'), 50),
          offset: Math.max(Math.trunc(Number(query.get('offset')) || 0), 0)
        });
        return json(res, 200, normalizePlaylistTracks(body));
      }
      case '/api/toplists': {
        const body = await ncm.call('toplist', {});
        return json(res, 200, {
          items: (body?.list ?? []).slice(0, 30).map((l) => ({
            id: l.id,
            name: l.name,
            cover: l.coverImgUrl,
            updateFrequency: l.updateFrequency,
            trackCount: l.trackCount,
            playCount: l.playCount,
            description: l.description
          }))
        });
      }
      case '/api/toplist/tracks': {
        // 榜单本质是歌单;toplist_detail 对部分榜单(如古典榜)不返回 tracks,
        // 统一走 playlist_track_all 最稳。
        const body = await ncm.call('playlist_track_all', {
          id: query.get('id'),
          limit: limit(query.get('limit'), 100, 200),
          offset: 0
        });
        const { total, tracks } = normalizePlaylistTracks(body);
        return json(res, 200, { total, tracks });
      }
      case '/api/playlists/hot': {
        const body = await ncm.call('top_playlist', {
          order: 'hot',
          limit: limit(query.get('limit'), 30, 100),
          offset: Math.max(Math.trunc(Number(query.get('offset')) || 0), 0),
          cat: query.get('cat') || '全部'
        });
        return json(res, 200, {
          total: body?.total,
          items: (body?.playlists ?? []).map((p) => ({
            id: p.id,
            name: p.name,
            cover: p.coverImgUrl,
            playCount: p.playCount,
            trackCount: p.trackCount,
            creator: p.creator?.nickname
          }))
        });
      }
      case '/api/daily': {
        // 每日推荐(未登录时接口也会返回匿名日推;失败再退回热歌榜)
        try {
          const body = await ncm.call('recommend_songs', {});
          const songs = body?.data?.dailySongs;
          if (songs?.length) {
            return json(res, 200, { source: 'daily', name: '每日推荐', tracks: normalizeSongs(songs).slice(0, 30) });
          }
        } catch {
          /* 走热歌兜底 */
        }
        const hot = await ncm.call('toplist_detail', { id: 3778678 });
        return json(res, 200, {
          source: 'hot',
          name: '热歌精选',
          tracks: normalizeSongs((hot?.playlist?.tracks ?? []).slice(0, 30))
        });
      }
      default:
        return json(res, 404, { error: `未知接口: ${pathname}` });
    }
  }

  return async function musicRoute(req, res) {
    const pathname = new URL(req.url, 'http://local').pathname;
    try {
      if (pathname === '/music/health') return json(res, 200, { ok: true });
      if (pathname.startsWith('/music/stream/')) {
        const songId = Number(pathname.slice('/music/stream/'.length));
        if (!Number.isFinite(songId) || songId <= 0) return json(res, 400, { error: 'songId 无效' });
        return await handleStream(req, res, songId);
      }
      if (pathname.startsWith('/music/api/')) {
        const url = new URL(req.url, 'http://local');
        return await handleApi(req, res, pathname.slice('/music'.length), url.searchParams);
      }
      return json(res, 404, { error: 'not found' });
    } catch (error) {
      if (!res.headersSent) json(res, 500, { error: error.message });
      else res.destroy();
    }
  };
}
