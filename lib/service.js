// lib/service.js — 宿主 webserver 路由服务:
//   GET  /music/api/*          数据接口(搜索/链接/歌词/歌单/榜单/账号,JSON)
//   GET  /music/stream/:id     音频流代理(Range 透传,UI 的 <audio> 直接指向这里)
//   扫码登录:/api/login/qr/* 生成二维码并轮询,803 成功后 Cookie 落盘持久化

import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

import QRCode from 'qrcode';

import { SEARCH_TYPE_CODES, normalizeSearchResults, normalizePlaylistTracks } from './ncm.js';
import { COOKIE_FILE, mergeCookies, normalizeCookie, resolveCookie, writeCookieFile } from './cookie.js';

const LEVELS = new Set(['standard', 'exhigh', 'higher', 'lossless']);
const QR_SESSION_TTL_MS = 5 * 60 * 1000; // 网易云二维码约 60s 过期,留足余量仅为兜底清理

const QR_MESSAGES = { 800: '二维码已过期,请刷新', 801: '等待扫码', 802: '已扫码,请在手机上确认' };

function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  res.end(body);
}

/** 创建音乐数据/流服务处理器。返回一个 (req,res) 处理函数,挂在前缀路由 /music 下。 */
export function createMusicService({ ncm, defaultLevel = 'standard', cookieFile = COOKIE_FILE, configCookie = '' } = {}) {
  // key -> { cookie, at }:同一张二维码的轮询要沿用服务端陆续下发的设备 Cookie(与浏览器行为一致)
  const qrSessions = new Map();
  const recallQrCookie = (key) => {
    for (const [k, s] of qrSessions) if (Date.now() - s.at > QR_SESSION_TTL_MS) qrSessions.delete(k);
    return qrSessions.get(key)?.cookie ?? '';
  };
  const rememberQrCookie = (key, cookie) => {
    if (!key || !cookie) return;
    qrSessions.set(key, { cookie, at: Date.now() });
  };

  async function readUpstreamBody(req, res, url) {
    const headers = {};
    if (req.headers.range) headers.range = req.headers.range;
    const upstream = await fetch(url, { headers, redirect: 'follow' });
    if (!upstream.ok && upstream.status !== 206) {
      json(res, 502, { error: `音频源返回 ${upstream.status}` });
      return;
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
      const body = await ncm.call('song_url_v1', { id: songId, level });
      url = body?.data?.[0]?.url;
    } catch (error) {
      json(res, 502, { error: `解析播放链接失败:${error.message}` });
      return;
    }
    if (!url) {
      json(res, 404, { error: '未获得播放链接(歌曲可能需要登录 Cookie 或为 VIP 试听)' });
      return;
    }
    try {
      await readUpstreamBody(req, res, url);
    } catch (error) {
      if (!res.headersSent) json(res, 502, { error: `拉取音频失败:${error.message}` });
      else res.destroy();
    }
  }

  async function handleApi(req, res, pathname, query) {
    const limit = (v, d, max = 100) => Math.min(Math.max(Math.trunc(Number(v) || d), 1), max);
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
        const body = await ncm.call('search', {
          keywords: query.get('keywords') || '',
          type: code,
          limit: limit(query.get('limit'), 30, 100),
          offset: Math.max(Math.trunc(Number(query.get('offset')) || 0), 0)
        });
        const result = body?.result ?? {};
        return json(res, 200, {
          type,
          total: result.songCount ?? result.albumCount ?? result.artistCount ?? result.playlistCount ?? undefined,
          items: normalizeSearchResults(body, type)
        });
      }
      case '/api/song/urls': {
        const ids = (query.get('ids') || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 50);
        if (ids.length === 0) return json(res, 200, { items: [] });
        const body = await ncm.call('song_url_v1', { id: ids.join(','), level: LEVELS.has(query.get('level')) ? query.get('level') : defaultLevel });
        return json(res, 200, { items: body?.data ?? [] });
      }
      case '/api/lyric': {
        const body = await ncm.call('lyric_new', { id: query.get('id') });
        return json(res, 200, {
          lyric: body?.lrc?.lyric ?? '',
          translation: body?.tlyric?.lyric ?? ''
        });
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
          creator: p.creator?.nickname
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
            trackCount: l.trackCount
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
        // 每日推荐需要登录;未登录时退回「热歌」列表,UI 无感。
        try {
          const body = await ncm.call('recommend_resource', {});
          const ids = (body?.recommend ?? []).map((r) => r.id);
          if (ids.length > 0) {
            const detail = await ncm.call('playlist_track_all', { id: ids[0], limit: 30 });
            return json(res, 200, { source: 'daily', name: '每日推荐', tracks: normalizePlaylistTracks(detail).tracks });
          }
        } catch {
          /* 未登录,走热歌兜底 */
        }
        const hot = await ncm.call('toplist_detail', { id: 3778678 }); // 飙升榜占位 → 热歌榜
        const songs = (hot?.playlist?.tracks ?? []).slice(0, 30);
        return json(res, 200, {
          source: 'hot',
          name: '热歌精选',
          tracks: songs.map((s) => ({
            id: s.id,
            name: s.name,
            detail: [(s.ar ?? []).map((a) => a.name).join('/'), s.al?.name ?? ''].filter(Boolean).join(' · ')
          }))
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
