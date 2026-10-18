// src/ui/api.js — 宿主 /music 数据接口的客户端封装(同源 fetch)。

async function getJson(pathname, params) {
  // 去掉 undefined 的查询参数:URLSearchParams 会把 undefined 拼成字符串 "undefined",
  // 让宿主收到一个意料之外的值(例如 level=undefined)
  const clean = {};
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v !== undefined && v !== null && v !== '') clean[k] = v;
  }
  const qs = Object.keys(clean).length ? '?' + new URLSearchParams(clean).toString() : '';
  const res = await fetch('/music/api' + pathname + qs);
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch { /* keep default */ }
    throw new Error(message);
  }
  return res.json();
}

export const api = {
  health: () => getJson('/health'),
  account: () => getJson('/account'),
  qrKey: () => getJson('/login/qr/key'),
  qrCreate: (key) => getJson('/login/qr/create', { key }),
  qrCheck: (key) => getJson('/login/qr/check', { key }),
  logout: () => getJson('/logout'),

  home: () => getJson('/home'),
  daily: () => getJson('/daily'),
  fm: () => getJson('/personal/fm'),

  playlists: (cat = '全部', limit = 42, offset = 0) => getJson('/playlists', { cat, limit, offset }),
  playlistCategories: () => getJson('/playlists/categories'),
  playlistDetail: (id) => getJson('/playlist/detail', { id }),
  playlistTracks: (id, limit = 200, offset = 0) => getJson('/playlist/tracks', { id, limit, offset }),

  toplists: () => getJson('/toplists'),
  toplistTracks: (id, limit = 100) => getJson('/toplist/tracks', { id, limit }),

  albums: (limit = 20, area = 'ALL') => getJson('/album/new', { limit, area }),
  albumDetail: (id) => getJson('/album/detail', { id }),

  artists: (limit = 12, offset = 0) => getJson('/artist/top', { limit, offset }),
  artistDetail: (id) => getJson('/artist/detail', { id }),
  artistAlbums: (id, limit = 12, offset = 0) => getJson('/artist/albums', { id, limit, offset }),

  search: (keywords, type = 'song', limit = 30, offset = 0) => getJson('/search', { keywords, type, limit, offset }),
  searchSuggest: (keywords) => getJson('/search/suggest', { keywords }),
  searchHot: () => getJson('/search/hot'),

  songDetail: (ids) => getJson('/song/detail', { ids: [].concat(ids).join(',') }),
  songUrls: (ids, level) => getJson('/song/urls', { ids: [].concat(ids).join(','), level }),
  lyric: (id) => getJson('/lyric', { id }),
  like: (id, like = true) => getJson('/like', { id, like }),
  userPlaylists: (limit = 30) => getJson('/user/playlists', { limit }),
  download: ({ id, name, artist, level }) =>
    getJson('/download', { id, name: name ?? '', artist: artist ?? '', ...(level ? { level } : {}) }),
  // 下载目录概览(dir/最近文件)与「在文件管理器里打开/定位」
  downloadInfo: () => getJson('/download/info'),
  openDownloadDir: (name) => getJson('/download/open', name ? { name } : {})
};

/** 歌词 LRC 文本 → [{time, text}] */
export function parseLrc(text) {
  const lines = [];
  for (const raw of (text || '').split('\n')) {
    const matches = [...raw.matchAll(/\[(\d+):(\d+)(?:[.:](\d+))?\]/g)];
    if (matches.length === 0) continue;
    const content = raw.replace(/\[[^\]]*\]/g, '').trim();
    if (content === '暂无歌词') continue; // 网易云对无歌词曲目返回的占位行
    for (const m of matches) {
      const time = Number(m[1]) * 60 + Number(m[2]) + (m[3] ? Number(`0.${m[3]}`) : 0);
      lines.push({ time, text: content });
    }
  }
  return lines.sort((a, b) => a.time - b.time);
}

/**
 * 桌面端 UI 由 dsh-app:// 自定义协议承载,音频若用相对路径会经 Electron protocol.handle
 * 转发;该路径上的 206 流式响应无法可靠 seek(拖回 0 重新播放,electron#38749)。
 * 宿主在启动时下发了 HTTP 源,媒体直连它,Range 由本地 webserver 原生处理。
 */
function mediaBase() {
  const base = typeof globalThis === 'undefined' ? undefined : globalThis.__DSH_TRANSPORT__?.streamBaseUrl;
  return typeof base === 'string' ? base.replace(/\/+$/, '') : '';
}

export function streamUrl(songId, level) {
  return `${mediaBase()}/music/stream/${songId}${level ? `?level=${encodeURIComponent(level)}` : ''}`;
}

export function formatCount(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '';
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1).replace(/\.0$/, '')}亿`;
  if (n >= 10_000) return `${(n / 10_000).toFixed(1).replace(/\.0$/, '')}万`;
  return String(n);
}

export function formatTime(sec) {
  if (!Number.isFinite(sec)) return '0:00';
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
