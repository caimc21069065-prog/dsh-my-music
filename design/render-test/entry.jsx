// design/render-test/entry.jsx — 本地全页面遍历测试:mock 宿主 API,遍历各页面渲染路径
import React from 'react';
import { createRoot } from 'react-dom/client';
import { PlayerProvider } from '../../src/ui/player.jsx';
import { MusicApp } from '../../src/ui/app.jsx';

window.__errors = [];
window.addEventListener('error', (e) => window.__errors.push(String(e.error?.stack || e.message)));
window.addEventListener('unhandledrejection', (e) => window.__errors.push('PROMISE: ' + String(e.reason?.stack || e.reason)));

const cover = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="%23222"/></svg>');
const track = (i) => ({ id: 1000 + i, name: '测试歌曲' + i, artist: '歌手' + (i % 3), album: '专辑' + (i % 4), detail: `歌手${i % 3} · 专辑${i % 4}`, cover, duration: 200000 });

const mockJson = (url) => {
  if (url.includes('/daily')) return { source: 'hot', name: '热歌精选', tracks: Array.from({ length: 5 }, (_, i) => track(i)) };
  if (url.includes('/toplists')) return { items: Array.from({ length: 6 }, (_, i) => ({ id: 2000 + i, name: '榜单' + i, cover, updateFrequency: '每天更新', trackCount: 100 })) };
  if (url.includes('/playlists/hot')) return { total: 30, items: Array.from({ length: 10 }, (_, i) => ({ id: 3000 + i, name: '热门歌单' + i, cover, playCount: 100000 * (i + 1), trackCount: 50, creator: '创建者' + i })) };
  if (url.includes('/toplist/tracks')) return { total: 20, tracks: Array.from({ length: 20 }, (_, i) => track(i)) };
  if (url.includes('/playlist/tracks')) return { total: 20, tracks: Array.from({ length: 20 }, (_, i) => track(i)) };
  if (url.includes('/playlist/detail')) return { id: 1, name: '测试歌单', cover, description: '描述', trackCount: 20, playCount: 9999, creator: 'x' };
  if (url.includes('/search')) return { type: 'song', total: 5, items: Array.from({ length: 5 }, (_, i) => track(i)) };
  if (url.includes('/lyric')) return { lyric: '[00:01]第一行\n[00:05]第二行', translation: '' };
  if (url.includes('/song/urls')) return { items: [] };
  if (url.includes('/health')) return { ok: true, hasCookie: false };
  return {};
};

const realFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
  const url = typeof input === 'string' ? input : input.url;
  if (url.startsWith('/music/api/')) {
    return Promise.resolve(new Response(JSON.stringify(mockJson(url)), { status: 200, headers: { 'content-type': 'application/json' } }));
  }
  return realFetch(input, init);
};

createRoot(document.getElementById('root')).render(
  <PlayerProvider>
    <MusicApp />
  </PlayerProvider>
);
