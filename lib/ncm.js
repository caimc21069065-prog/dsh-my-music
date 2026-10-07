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
  async function call(name, params = {}) {
    const fn = ncmApi[name];
    if (typeof fn !== 'function') {
      throw new Error(`网易云音乐 API 不存在: ${name}(库版本可能已变化)`);
    }
    const payload = { ...params };
    const cookie = getCookie();
    if (cookie) payload.cookie = cookie;
    if (realIP) payload.realIP = realIP;

    const task = fn(payload);
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${name} 请求超时(${timeoutMs}ms)`)), timeoutMs);
    });
    try {
      const res = await Promise.race([task, timeout]);
      if (res?.status && res.status >= 400) {
        throw new Error(`网易云音乐接口返回 ${res.status}`);
      }
      return res?.body ?? res;
    } finally {
      clearTimeout(timer);
    }
  }

  return { call, get hasCookie() { return Boolean(getCookie()); } };
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
        (s.artists ?? []).map((a) => a.name).join('/') || '未知歌手',
        s.album?.name || '',
        s.duration ? formatDuration(s.duration) : ''
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
      detail: [a.artist?.name || '未知歌手', [a.songCount, '首'].filter(Boolean).join(''), formatPublishTime(a.publishTime)]
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

export function normalizePlaylistTracks(body) {
  const songs = body?.songs ?? [];
  return {
    total: typeof body?.total === 'number' ? body.total : songs.length,
    tracks: songs.map((s) => ({
      id: s.id,
      name: s.name,
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
