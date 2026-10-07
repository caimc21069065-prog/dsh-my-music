// src/ui/api.js — 宿主 /music 数据接口的客户端封装(同源 fetch)。

async function getJson(pathname, params) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
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
  search: (keywords, type = 'song', limit = 30, offset = 0) =>
    getJson('/search', { keywords, type, limit, offset }),
  songUrls: (ids, level) => getJson('/song/urls', { ids: ids.join(','), level }),
  lyric: (id) => getJson('/lyric', { id }),
  playlistDetail: (id) => getJson('/playlist/detail', { id }),
  playlistTracks: (id, limit = 50, offset = 0) => getJson('/playlist/tracks', { id, limit, offset }),
  toplists: () => getJson('/toplists'),
  toplistTracks: (id, limit = 100) => getJson('/toplist/tracks', { id, limit }),
  hotPlaylists: (limit = 30, offset = 0, cat) => getJson('/playlists/hot', { limit, offset, cat }),
  daily: () => getJson('/daily')
};

/** 歌词 LRC 文本 → [{time, text}] */
export function parseLrc(text) {
  const lines = [];
  for (const raw of (text || '').split('\n')) {
    const matches = [...raw.matchAll(/\[(\d+):(\d+)(?:[.:](\d+))?\]/g)];
    if (matches.length === 0) continue;
    const content = raw.replace(/\[[^\]]*\]/g, '').trim();
    for (const m of matches) {
      const time = Number(m[1]) * 60 + Number(m[2]) + (m[3] ? Number(`0.${m[3]}`) : 0);
      lines.push({ time, text: content });
    }
  }
  return lines.sort((a, b) => a.time - b.time);
}

export function streamUrl(songId, level) {
  return `/music/stream/${songId}${level ? `?level=${encodeURIComponent(level)}` : ''}`;
}

export function formatCount(n) {
  if (typeof n !== 'number') return '';
  if (n >= 100_000_000) return `${Math.round(n / 100_000_000)}亿`;
  if (n >= 10_000) return `${Math.round(n / 10_000)}万`;
  return String(n);
}

export function formatTime(sec) {
  if (!Number.isFinite(sec)) return '0:00';
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
