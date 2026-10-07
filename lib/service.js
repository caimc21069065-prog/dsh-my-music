// lib/service.js — 宿主 webserver 路由服务:
//   GET  /music/api/*          数据接口(搜索/链接/歌词/歌单/榜单/账号,JSON)
//   GET  /music/stream/:id     音频流代理(Range 透传,UI 的 <audio> 直接指向这里)
//   扫码登录:/api/login/qr/* 生成并轮询二维码,803 成功时 Cookie 落盘持久化

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

import { SEARCH_TYPE_CODES, normalizeSearchResults, normalizePlaylistTracks } from './ncm.js';

const LEVELS = new Set(['standard', 'exhigh', 'higher', 'lossless']);
const COOKIE_FILE = path.join(os.homedir(), '.dsh', 'music-cookie.json');

const COOKIE_ATTR_NAMES = new Set(['path', 'expires', 'max-age', 'httponly', 'secure', 'samesite', 'domain', 'version']);

/** 把登录返回的 Set-Cookie 形态归一成 "a=1; b=2" 的纯 Cookie 串。 */
export function normalizeCookie(raw) {
  if (!raw) return '';
  const parts = Array.isArray(raw) ? raw.join('; ') : String(raw);
  const kept = parts
    .split(/;\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((pair) => {
      const eq = pair.indexOf('=');
      if (eq <= 0) return false;
      const name = pair.slice(0, eq).toLowerCase();
      return !COOKIE_ATTR_NAMES.has(name);
    });
  return kept.join('; ');
}

function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => {
      data += c;
      if (data.length > 1e6) req.destroy();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

/** 创建音乐数据/流服务处理器。返回一个 (req,res) 处理函数,挂在前缀路由 /music 下。 */
export function createMusicService({ ncm, defaultLevel = 'standard', cookieFile = COOKIE_FILE, configCookie = '' } = {}) {
  const getSavedCookie = () => {
    try {
      return JSON.parse(fs.readFileSync(cookieFile, 'utf-8')).cookie || '';
    } catch {
      return '';
    }
  };
  const saveCookie = (cookie) => {
    try {
      if (cookie) {
        fs.mkdirSync(path.dirname(cookieFile), { recursive: true });
        fs.writeFileSync(cookieFile, JSON.stringify({ cookie, savedAt: Date.now() }), 'utf-8');
      } else {
        fs.rmSync(cookieFile, { force: true });
      }
      return true;
    } catch {
      return false;
    }
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
      case '/api/health':
        return json(res, 200, {
          ok: true,
          hasCookie: Boolean(ncm.hasCookie),
          cookieSource: configCookie ? 'config' : getSavedCookie() ? 'saved' : 'none'
        });
      case '/api/account': {
        if (!ncm.hasCookie) return json(res, 200, { loggedIn: false });
        try {
          const body = await ncm.call('user_account', {});
          const profile = body?.profile;
          if (!profile?.nickname) return json(res, 200, { loggedIn: false });
          return json(res, 200, {
            loggedIn: true,
            nickname: profile.nickname,
            avatar: profile.avatarUrl,
            vipType: profile.vipType
          });
        } catch {
          return json(res, 200, { loggedIn: false });
        }
      }
      case '/api/login/qr/key': {
        const body = await ncm.call('login_qr_key', {});
        return json(res, 200, { key: body?.data?.unikey });
      }
      case '/api/login/qr/create': {
        const body = await ncm.call('login_qr_create', { key: query.get('key'), qrimg: true });
        return json(res, 200, { qrimg: body?.data?.qrimg });
      }
      case '/api/login/qr/check': {
        const body = await ncm.call('login_qr_check', { key: query.get('key') });
        const code = body?.code;
        if (code === 803) {
          // 登录成功:归一化并落盘 Cookie,后续请求即时生效(getCookie 动态读取)
          const saved = saveCookie(normalizeCookie(body.cookie ?? body?.message));
          return json(res, 200, { code, message: '登录成功', saved });
        }
        const messages = { 800: '二维码已过期,请刷新', 801: '等待扫码', 802: '已扫码,请在手机上确认' };
        return json(res, 200, { code, message: messages[code] ?? `状态 ${code}` });
      }
      case '/api/logout': {
        saveCookie('');
        return json(res, 200, { ok: true });
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
