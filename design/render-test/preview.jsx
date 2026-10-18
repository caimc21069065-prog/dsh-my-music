// design/render-test/preview.jsx — 本地视觉校验:mock 宿主 API,按 ?scene= 渲染不同页面/浮层
import React from 'react';
import { createRoot } from 'react-dom/client';
import { PlayerProvider } from '../../src/ui/player.jsx';
import { MusicApp } from '../../src/ui/app.jsx';

const COVERS = [
  'http://p3.music.126.net/x-UpYAXLd0C9VqZz087z_w==/109951173781501220.jpg',
  'http://p4.music.126.net/A6a5ZaeBqGRAcgxa62Ltrw==/109951173929361518.jpg',
  'http://p3.music.126.net/gm6aKwErRpe3Bdr806vy_Q==/109951174111254293.jpg',
  'http://p3.music.126.net/BDu_ylGVe6CRM4lSY5xjHg==/109951173639335878.jpg',
  'http://p3.music.126.net/Xgxfl8qPlwjRIoBDI-cPrg==/109951173819308049.jpg',
  'http://p4.music.126.net/FJh5aA8P_LfcfbQLv9bX8A==/109951173704833849.jpg',
  'http://p4.music.126.net/XtBk-KKRHFBHI87HZE9ljQ==/109951173904350931.jpg',
  'http://p4.music.126.net/8fQ9jzTJnMweLNm7VoyPSw==/6623458045881301.jpg',
  'http://p3.music.126.net/RIx2zHMlWixhessBewSeIw==/109951173651306538.jpg',
  'http://p3.music.126.net/R6nN-HLM5oF50ofsueJ3wg==/109951173880752898.jpg',
  'http://p4.music.126.net/UxAWAj0Bvxn5qpF9gXoD0Q==/109951173631644095.jpg',
  'http://p3.music.126.net/SncgDGwPQgKjetKsjf6pRg==/109951173961405465.jpg',
  'http://p3.music.126.net/78q0jUUJ0h08GxAs2G-tCA==/109951168529051968.jpg',
  'http://p3.music.126.net/VED2XoZcISpeGUTE_Q6lTA==/109951170045683199.jpg',
  'http://p3.music.126.net/5KJI2mq0G0OQHQaAfAJfwg==/109951173289563385.jpg',
  'http://p4.music.126.net/Z2x6knGRr7eRrZeOlgCngA==/109951172414270313.jpg'
];

const NAMES = ['晴天', '海阔天空', '夜曲', '起风了', '稻香', '后来', '平凡之路', '年少有为', '小幸运', '演员',
  '光年之外', '说散就散', '你的答案', '孤勇者', '如愿', '漠河舞厅', '罗生门', '告白气球', '七里香', '泡沫',
  '体面', '红豆', '突然好想你', '爱你', '十年', '雨爱', '情非得已', '一路向北', '花海', '慢慢喜欢你'];
const ARTISTS = ['周杰伦', 'Beyond', '林俊杰', '五月天', '邓紫棋', '陈奕迅', '毛不易', '李荣浩', '薛之谦', '孙燕姿'];
const ALBUMS = ['叶惠美', '乐与怒', '十一月的萧邦', '汪苏泷', '魔杰座', '我等你', '猎户星座', '模特', '小小', '演员'];
const PL_NAMES = ['华语流行精选｜一听就上头', '深夜emo｜一个人的安静时刻', '治愈系纯音乐｜放空专用', '通勤路上｜元气满满', '粤语经典｜黄金年代',
  '轻音乐｜读书写字背景音', '摇滚现场｜热血沸腾', '爵士小酒馆｜慵懒午后', '国风古韵｜诗意江湖', '电子律动｜深夜驾驶',
  '民谣故事｜吉他与人声', '影视原声｜记忆里的旋律'];

const song = (i, extra = {}) => ({
  id: 1000 + i,
  name: NAMES[i % NAMES.length],
  alias: i % 5 === 0 ? 'Live' : '',
  artist: ARTISTS[i % ARTISTS.length],
  artists: [{ id: 500 + (i % ARTISTS.length), name: ARTISTS[i % ARTISTS.length] }],
  album: ALBUMS[i % ALBUMS.length],
  albumId: 700 + (i % ALBUMS.length),
  cover: COVERS[i % COVERS.length],
  duration: 180000 + (i % 6) * 23000,
  fee: i % 4 === 0 ? 1 : 0,
  ...extra
});

const SONGS = Array.from({ length: 40 }, (_, i) => song(i));

const playlist = (i) => ({
  id: 3000 + i,
  name: PL_NAMES[i % PL_NAMES.length],
  cover: COVERS[i % COVERS.length],
  playCount: 120000 + i * 987654,
  trackCount: 60 + i * 7,
  creator: '云音乐推荐',
  copywriter: i % 3 === 0 ? '根据你的口味推荐' : '',
  updateFrequency: '每天更新'
});

const album = (i) => ({
  id: 700 + i,
  name: ALBUMS[i % ALBUMS.length],
  cover: COVERS[(i + 3) % COVERS.length],
  artist: ARTISTS[i % ARTISTS.length],
  artistId: 500 + i,
  publishTime: 1700000000000 + i * 86400000,
  size: 10 + i
});

const artist = (i) => ({
  id: 500 + i,
  name: ARTISTS[i % ARTISTS.length],
  cover: COVERS[(i + 8) % COVERS.length],
  albumSize: 20 + i,
  musicSize: 300 + i * 7,
  alias: i % 2 ? 'Jay Chou' : ''
});

const HOME = {
  daily: { name: '每日推荐', source: 'daily', tracks: SONGS.slice(0, 30) },
  playlists: Array.from({ length: 10 }, (_, i) => playlist(i)),
  artists: Array.from({ length: 10 }, (_, i) => artist(i)),
  albums: Array.from({ length: 10 }, (_, i) => album(i)),
  newSongs: SONGS.slice(10, 22)
};

const json = (data) => Promise.resolve(new Response(JSON.stringify(data), {
  status: 200, headers: { 'content-type': 'application/json' }
}));

const realFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
  const url = typeof input === 'string' ? input : input.url;
  // 注意:window.fetch 拦截不到 <audio> 的请求;要试播放/跳转请用支持 Range 的静态服务
  if (url.startsWith('/music/stream/')) return Promise.reject(new Error('preview: no audio'));
  if (!url.startsWith('/music/api/')) return realFetch(input, init);
  const u = new URL(url, location.origin);
  const p = u.pathname.replace('/music/api', '');
  const q = u.searchParams;

  if (p === '/home') return json(HOME);
  if (p === '/daily') return json({ source: 'daily', name: '每日推荐', tracks: SONGS.slice(0, 30) });
  if (p === '/personal/fm') return json({ items: [song(3)] });
  if (p === '/account') return json(guest ? { loggedIn: false, cookieSource: 'none' } : { loggedIn: true, nickname: '云村用户', avatar: COVERS[0], vipType: 11, cookieSource: 'qr' });
  if (p === '/playlists/categories') return json({ categories: ['全部', '华语', '流行', '摇滚', '民谣', '电子', '轻音乐', '爵士', '古风', '影视原声'] });
  if (p === '/playlists') return json({ total: 100, more: true, items: Array.from({ length: 42 }, (_, i) => playlist(i + Number(q.get('offset') || 0) / 42)) });
  if (p === '/toplists') return json({ items: Array.from({ length: 10 }, (_, i) => ({ ...playlist(i), name: ['飙升榜', '新歌榜', '热歌榜', '原创榜', '说唱榜', '电音榜', 'KTV点唱榜', '古典榜', '粤语榜', '欧美榜'][i], playCount: 8800000 + i * 1234567, updateFrequency: '每天更新' })) });
  if (p === '/album/new') return json({ total: 50, items: Array.from({ length: 24 }, (_, i) => album(i)) });
  if (p === '/album/detail') return json({ album: { ...album(2), artistCover: COVERS[12], company: '索尼音乐', description: '这是一张关于城市与夜晚的专辑,收录了十首在深夜写下的歌。' }, tracks: SONGS.slice(0, 12) });
  if (p === '/artist/top') return json({ items: Array.from({ length: 12 }, (_, i) => artist(i)) });
  if (p === '/artist/detail') return json({ artist: { ...artist(0), briefDesc: '华语流行乐男歌手、音乐人、演员、导演,2000 年发行首张专辑。' }, hotSongs: SONGS.slice(0, 20) });
  if (p === '/artist/albums') return json({ items: Array.from({ length: 8 }, (_, i) => album(i)) });
  if (p === '/playlist/detail') return json({ id: Number(q.get('id')), name: PL_NAMES[1], cover: COVERS[1], description: '深夜适合一个人听的歌,收录了华语流行里最耐听的那些旋律。', trackCount: 40, playCount: 1280000, creator: '云音乐推荐', creatorAvatar: COVERS[12], tags: ['华语', '流行'], updateTime: 1700000000000 });
  if (p === '/playlist/tracks' || p === '/toplist/tracks') return json({ total: 40, tracks: SONGS });
  if (p === '/search') {
    const type = q.get('type');
    const items = type === 'song' ? SONGS.slice(0, 24)
      : type === 'playlist' ? Array.from({ length: 12 }, (_, i) => playlist(i))
        : type === 'album' ? Array.from({ length: 12 }, (_, i) => album(i))
          : Array.from({ length: 12 }, (_, i) => artist(i));
    return json({ type, total: 320, items });
  }
  if (p === '/search/hot') return json({ items: [{ keyword: '我不难过', score: 90114 }, { keyword: '天龙八部之宿敌', score: 76356 }, { keyword: '遗憾总是贯穿人生始终', score: 56213 }, { keyword: '琵琶曲', score: 53465 }, { keyword: '雨爱', score: 49429 }, { keyword: '全息恋人', score: 45377 }, { keyword: '晴天', score: 42100 }, { keyword: '海阔天空', score: 39000 }, { keyword: '夜曲', score: 35000 }, { keyword: '起风了', score: 31000 }] });
  if (p === '/search/suggest') return json({ items: ['海阔天空', '海阔天空 Beyond', '海阔天空 尾奏'] });
  if (p === '/lyric') return json({
    lyric: '[00:00.00]晴天\n[00:03.20]故事的小黄花\n[00:06.50]从出生那年就飘着\n[00:10.10]童年的荡秋千\n[00:13.60]随记忆一直晃到现在\n[00:17.20]吹着前奏望着天空\n[00:20.80]我想起花瓣试着掉落\n[00:24.40]为你翘课的那一天\n[00:28.00]花落的那一天\n[00:31.60]教室的那一间\n[00:35.20]我怎么看不见\n[00:38.80]消失的下雨天\n[00:42.40]我好想再淋一遍',
    translation: '[00:03.20]The little yellow flower of the story\n[00:06.50]Has been floating since the year I was born'
  });
  if (p === '/song/urls') return json({ items: [] });
  if (p === '/user/playlists') return json({ items: Array.from({ length: 6 }, (_, i) => playlist(i + 2)) });
  if (p === '/like') return json({ ok: true });
  if (p === '/download/info') return json({
    dir: 'C:\\Users\\caimc\\Music\\DSH', exists: true, total: 5,
    items: [
      { name: 'C.U - Veil.mp3', path: 'C:\\Users\\caimc\\Music\\DSH\\C.U - Veil.mp3', sizeBytes: 2804781, mtime: 1792305300000, trial: false },
      { name: '圈圈菌 - 王子系变装.mp3', path: 'C:\\Users\\caimc\\Music\\DSH\\圈圈菌 - 王子系变装.mp3', sizeBytes: 1481901, mtime: 1792305200000, trial: false },
      { name: 'Beyond - 海阔天空 (试听).mp3', path: 'C:\\Users\\caimc\\Music\\DSH\\Beyond - 海阔天空 (试听).mp3', sizeBytes: 560945, mtime: 1792305000000, trial: true },
      { name: 'G.E.M.邓紫棋 - 自由的你.mp3', path: 'C:\\Users\\caimc\\Music\\DSH\\G.E.M.邓紫棋 - 自由的你.mp3', sizeBytes: 4751277, mtime: 1791900000000, trial: false },
      { name: '栾一鸣Floscar - 全息恋人.mp3', path: 'C:\\Users\\caimc\\Music\\DSH\\栾一鸣Floscar - 全息恋人.mp3', sizeBytes: 2356269, mtime: 1791890000000, trial: false }
    ]
  });
  if (p === '/download/open') return json({ ok: true, opened: 'dir' });
  if (p === '/health') return json({ ok: true });
  return json({});
};

const params = new URLSearchParams(location.search);
const scene = params.get('scene') || 'home';
const guest = params.get('guest') === '1';

// scene=fav:预置收藏数据,用于验证「取消全部收藏」的确认弹窗
if (scene === 'fav') {
  localStorage.setItem('dsh-music.player.v2', JSON.stringify({
    favorites: SONGS.slice(0, 4), history: SONGS.slice(0, 4), queue: [], index: -1, mode: 'loop', volume: 0.8
  }));
}

createRoot(document.getElementById('root')).render(
  <PlayerProvider>
    <MusicApp />
  </PlayerProvider>
);

const clickMenu = (i) => document.querySelectorAll('.menu-item')[i]?.click();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  await wait(1200);
  if (scene === 'list') clickMenu(2);
  if (scene === 'toplist') clickMenu(4);
  if (scene === 'albums') clickMenu(3);
  if (scene === 'search') clickMenu(1);
  if (scene === 'search-result') {
    clickMenu(1);
    await wait(400);
    const input = document.querySelector('.search-hero .search-box input');
    if (input) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, '周杰伦');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    }
  }
  if (scene === 'playlist') {
    await wait(300);
    document.querySelectorAll('.cover-card')[0]?.click();
  }
  if (scene === 'album') {
    clickMenu(3);
    await wait(700);
    document.querySelectorAll('.cover-card')[0]?.click();
  }
  if (scene === 'artist') {
    await wait(300);
    document.querySelectorAll('.artist-card')[0]?.click();
  }
  if (scene === 'user') clickMenu(6);
  if (scene === 'settings') clickMenu(7);
  if (scene === 'storage') {
    clickMenu(7);
    await wait(400);
    [...document.querySelectorAll('.set-tabs .chip')].find((b) => b.textContent === '存储')?.click();
    await wait(500);
  }
  if (scene === 'queue' || scene === 'full') {
    await wait(300);
    document.querySelector('.hero-play')?.click();
    await wait(700);
    if (scene === 'queue') document.querySelector('.pb-side button[title="播放列表"]')?.click();
    else document.querySelector('.pb-cover-wrap')?.click();
  }
  if (scene === 'queue-next') {
    await wait(1200);
    document.querySelectorAll('.cover-card')[0]?.click();
    await wait(1200);
    document.querySelector('.cover-play button')?.click();
    await wait(900);
    // 播第 1 首,再把第 5 首设为「下一首播放」:预期队列变成 [第1首, 第5首, 第2首, ...]
    const rows = document.querySelectorAll('.song-row');
    const row = rows[4];
    if (row) {
      row.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await wait(120);
      row.querySelector('.song-ops button[title="下一首播放"]')?.click();
    }
    await wait(400);
    document.querySelector('.pb-side button[title="播放列表"]')?.click();
  }
  if (scene === 'context') {
    await wait(1200);
    document.querySelectorAll('.cover-card')[0]?.click();
    await wait(1200);
    const row = document.querySelectorAll('.song-row')[2];
    if (row) {
      const box = row.getBoundingClientRect();
      row.dispatchEvent(new MouseEvent('contextmenu', {
        bubbles: true, cancelable: true, clientX: box.left + 300, clientY: box.top + box.height / 2
      }));
    }
  }
  if (scene === 'fav') {
    clickMenu(6);
    await wait(500);
    document.querySelector('.cover-card')?.click();
    await wait(700);
    const pill = [...document.querySelectorAll('.pill-btn')].find((b) => b.textContent.includes('取消全部收藏'));
    pill?.click();
  }
  document.title = `preview-${scene}`;
})();
