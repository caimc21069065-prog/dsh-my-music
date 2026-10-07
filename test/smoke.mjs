// test/smoke.mjs — 独立冒烟测试:mock 最小的 ctx,真实调用工具逻辑(含真实网络)。
// 运行:node test/smoke.mjs


import assert from 'node:assert';

import { apply } from '../lib/index.js';

const registered = new Map();
const routes = new Map();
const ctx = {
  tools: {
    register(tool) {
      registered.set(tool.name, tool);
      return () => registered.delete(tool.name);
    }
  },
  webServer: {
    register(route) {
      routes.set(route.path, route.handler);
      return () => routes.delete(route.path);
    }
  },
  logger: { debug() {}, warn() {} }
};

const exec = { signal: undefined };

apply(ctx, {});
assert.equal(registered.size, 4, `应注册 4 个工具,实际 ${registered.size}: ${[...registered.keys()].join(', ')}`);
assert.ok(routes.has('/music'), '应注册 /music 前缀路由');
console.log('✓ 注册工具:', [...registered.keys()].join(', '));
const musicRoute = routes.get('/music');

// —— 宿主数据 API(fake req/res 直调路由) ——
import { Writable } from 'node:stream';
function fakeRes() {
  const chunks = [];
  const res = new Writable({
    write(chunk, _enc, cb) { chunks.push(chunk); cb(); }
  });
  res.status = 0;
  res.headers = null;
  res.headersSent = false;
  res.writeHead = function (status, headers) {
    res.status = status;
    res.headers = headers;
    res.headersSent = true;
    return res;
  };
  res.bodyOf = () => Buffer.concat(chunks);
  return res;
}
async function api(path) {
  const res = fakeRes();
  await musicRoute({ method: 'GET', url: path, headers: {} }, res);
  return { status: res.status, data: JSON.parse(res.bodyOf().toString('utf-8') || '{}') };
}

const health = await api('/music/health');
assert.equal(health.data.ok, true);
console.log('✓ /music/health ok');

const apiSearch = await api('/music/api/search?keywords=' + encodeURIComponent('海阔天空') + '&type=song&limit=3');
assert.equal(apiSearch.status, 200, JSON.stringify(apiSearch.data));
assert.ok(apiSearch.data.items.length > 0);
console.log(`✓ /music/api/search: ${apiSearch.data.items[0].name} — ${apiSearch.data.items[0].detail}`);

const apiLyric = await api('/music/api/lyric?id=347230');
assert.equal(apiLyric.status, 200);
assert.ok(apiLyric.data.lyric.length > 0);
console.log(`✓ /music/api/lyric: ${apiLyric.data.lyric.split('\n').length} 行`);

const apiPlaylists = await api('/music/api/playlists/hot?limit=3');
assert.equal(apiPlaylists.status, 200);
assert.ok(apiPlaylists.data.items.length > 0);
console.log(`✓ /music/api/playlists/hot: ${apiPlaylists.data.items[0].name}`);

const apiToplists = await api('/music/api/toplists');
assert.equal(apiToplists.status, 200);
assert.ok(apiToplists.data.items.length > 0);
console.log(`✓ /music/api/toplists: ${apiToplists.data.items.length} 个榜单`);

// —— music_search ——
const search = registered.get('music_search');
const searchResult = await search.execute({ keywords: '海阔天空 Beyond', type: 'song', limit: 3 }, exec);
assert.ok(searchResult.results.length > 0, '搜索应有结果');
console.log(`✓ music_search: ${searchResult.results.length} 条 →`, searchResult.results[0]);

const songId = searchResult.results[0].id;

// —— music_song_url ——
const songUrl = registered.get('music_song_url');
const urlResult = await songUrl.execute({ songId, level: 'standard' }, exec);
console.log(`✓ music_song_url: playable=${urlResult.playable} format=${urlResult.format} size=${urlResult.sizeBytes}`);
assert.equal(urlResult.songId, songId);

// —— music_lyric ——
const lyric = registered.get('music_lyric');
const lyricResult = await lyric.execute({ songId: 347230 }, exec); // 海阔天空(专辑版)
console.log(`✓ music_lyric: hasLyric=${lyricResult.hasLyric} translation=${Boolean(lyricResult.translation)}`);
assert.equal(lyricResult.hasLyric, true);

// —— music_playlist_tracks ——
const playlistSearch = await search.execute({ keywords: '华语经典', type: 'playlist', limit: 1 }, exec);
assert.ok(playlistSearch.results.length > 0, '应搜到歌单');
const playlist = registered.get('music_playlist_tracks');
const playlistResult = await playlist.execute({ playlistId: playlistSearch.results[0].id, limit: 3 }, exec);
console.log(`✓ music_playlist_tracks: 共 ${playlistResult.total} 首,返回 ${playlistResult.tracks.length} 首`);
assert.ok(playlistResult.tracks.length > 0);

// —— 音频流代理 ——
{
  const res = fakeRes();
  await musicRoute({ method: 'GET', url: '/music/stream/347230', headers: {} }, res);
  assert.equal(res.status, 200, '流代理应返回 200');
  assert.match(res.headers['content-type'] ?? '', /audio|octet-stream/, '应为音频 content-type');
  const bytes = res.bodyOf().length;
  assert.ok(bytes > 100000, `音频应非空(实际 ${bytes}B)`);
  console.log(`✓ /music/stream/347230: content-type=${res.headers['content-type']} bytes=${bytes}`);
}

// —— render 冒烟 ——
for (const tool of registered.values()) {
  const value =
    tool.name === 'music_search'
      ? searchResult
      : tool.name === 'music_song_url'
        ? urlResult
        : tool.name === 'music_lyric'
          ? lyricResult
          : playlistResult;
  const rendered = tool.output.render({}, value);
  assert.ok(rendered[0].text.length > 0, `${tool.name} render 应产出文本`);
}
console.log('✓ 全部 render 正常');

console.log('\n全部冒烟测试通过 ✅');
