// test/smoke.mjs — 独立冒烟测试:mock 最小的 ctx,真实调用工具逻辑(含真实网络)。
// 运行:node test/smoke.mjs


import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { apply } from '../lib/index.js';
import { createMusicService } from '../lib/service.js';
import { createNcm } from '../lib/ncm.js';
import { mergeCookies, normalizeCookie } from '../lib/cookie.js';
import { parseLrc } from '../src/ui/api.js';

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
// 回归:必须走经典接口。新版 lyric_new 会把头部若干行返回成 JSON 富文本,纯音乐曲目更是整段丢失
assert.match(apiLyric.data.lyric, /^\[\d+:\d+/, '歌词应是标准 LRC');
assert.ok(!/^\{"t":/m.test(apiLyric.data.lyric), '歌词里不应混入 JSON 富文本行');
console.log(`✓ /music/api/lyric: ${apiLyric.data.lyric.split('\n').length} 行 LRC`);

const apiPlaylists = await api('/music/api/playlists/hot?limit=3');
assert.equal(apiPlaylists.status, 200);
assert.ok(apiPlaylists.data.items.length > 0);
console.log(`✓ /music/api/playlists/hot: ${apiPlaylists.data.items[0].name}`);

const apiToplists = await api('/music/api/toplists');
assert.equal(apiToplists.status, 200);
assert.ok(apiToplists.data.items.length > 0);
console.log(`✓ /music/api/toplists: ${apiToplists.data.items.length} 个榜单`);

// —— 扫码登录:真实取 key + 出图(库的 qrimg 是占位图,必须由我们自己绘制) ——
{
  const qrKey = await api('/music/api/login/qr/key');
  assert.equal(qrKey.status, 200, JSON.stringify(qrKey.data));
  assert.ok(qrKey.data.key, '应拿到 unikey');
  const qrCreate = await api(`/music/api/login/qr/create?key=${qrKey.data.key}`);
  assert.equal(qrCreate.status, 200, JSON.stringify(qrCreate.data));
  assert.match(qrCreate.data.qrurl, /^https:\/\/music\.163\.com\/login\?codekey=/, 'qrurl 应指向授权页');
  assert.ok(qrCreate.data.qrurl.includes(qrKey.data.key), 'qrurl 应带上 key');
  assert.match(qrCreate.data.qrimg, /^data:image\/png;base64,/, 'qrimg 应是真实 PNG');
  assert.ok(qrCreate.data.qrimg.length > 1500, `PNG 数据量异常:${qrCreate.data.qrimg.length}`);
  console.log(`✓ /music/api/login/qr: key=${qrKey.data.key.slice(0, 8)}… qrimg=${qrCreate.data.qrimg.length}B`);
}

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

  // 快进依赖 Range 透传:浏览器 seek 会带 Range 重新请求同一个 /stream
  const ranged = fakeRes();
  await musicRoute({ method: 'GET', url: '/music/stream/347230', headers: { range: 'bytes=100000-' } }, ranged);
  assert.equal(ranged.status, 206, `Range 请求应返回 206,实际 ${ranged.status}`);
  assert.match(ranged.headers['content-range'] ?? '', /^bytes 100000-\d+\/\d+/, '应回传 content-range');
  assert.equal(ranged.headers['accept-ranges'], 'bytes');
  console.log(`✓ /music/stream Range: ${ranged.headers['content-range']} (${ranged.bodyOf().length}B)`);
}

// —— 下载到本地目录 ——
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-music-dl-'));
  const downloadDir = path.join(dir, 'songs');
  const payload = 'data:audio/mpeg;base64,' + Buffer.from('dsh-music-download-test').toString('base64');
  const stubRoute = createMusicService({
    ncm: {
      async call() {
        return { data: [{ id: 1, url: payload, type: 'mp3', level: 'standard', freeTrialInfo: null }] };
      }
    },
    downloadDir
  });
  const call = async (qs) => {
    const res = fakeRes();
    await stubRoute({ method: 'GET', url: '/music/api/download' + qs, headers: {} }, res);
    return { status: res.status, data: JSON.parse(res.bodyOf().toString('utf-8') || '{}') };
  };

  const ok = await call('?id=1&name=' + encodeURIComponent('  某首歌  ') + '&artist=' + encodeURIComponent('某歌手'));
  assert.equal(ok.status, 200, JSON.stringify(ok.data));
  assert.equal(ok.data.ok, true);
  assert.equal(path.dirname(ok.data.path), path.resolve(downloadDir), '应落在配置目录内');
  assert.equal(path.basename(ok.data.path), '某歌手 - 某首歌.mp3');
  assert.equal(fs.readFileSync(ok.data.path, 'utf-8'), 'dsh-music-download-test');
  console.log(`✓ /music/api/download: ${path.basename(ok.data.path)} (${ok.data.sizeBytes}B)`);

  // 文件名来自客户端,必须清洗:不能借 ../ 逃出目录
  const evil = await call('?id=2&name=' + encodeURIComponent('../../../Escape') + '&artist=' + encodeURIComponent('a/b\\c*d?e'));
  assert.equal(evil.status, 200, JSON.stringify(evil.data));
  assert.equal(path.dirname(evil.data.path), path.resolve(downloadDir), '清洗后仍应落在目录内');
  assert.equal(path.basename(evil.data.path), 'a b c d e - .. .. Escape.mp3');
  assert.ok(!fs.existsSync(path.resolve(downloadDir, '..', '..', 'Escape.mp3')), '不应在 downloadDir 之外落盘');
  console.log(`✓ 下载文件名清洗:${path.basename(evil.data.path)}`);

  fs.rmSync(dir, { recursive: true, force: true });

  // 真实链路:解析网易云直链并落盘到临时目录(不碰用户默认目录)
  const realDir = path.join(dir, 'real');
  const real = createMusicService({ ncm: createNcm({ realIP: '116.25.146.177' }), downloadDir: realDir });
  const okRes = fakeRes();
  await real({ method: 'GET', url: '/music/api/download?id=347230&name=' + encodeURIComponent('海阔天空') + '&artist=Beyond', headers: {} }, okRes);
  const saved = JSON.parse(okRes.bodyOf().toString('utf-8') || '{}');
  assert.equal(okRes.status, 200, JSON.stringify(saved));
  assert.equal(saved.ok, true);
  assert.ok(saved.sizeBytes > 100000, `落盘文件应非空:${JSON.stringify(saved)}`);
  assert.ok(fs.existsSync(saved.path), '文件应存在');
  assert.equal(saved.dir, path.resolve(realDir));
  console.log(`✓ 真实下载:${path.basename(saved.path)} ${saved.sizeBytes}B trial=${saved.trial}`);
  fs.rmSync(dir, { recursive: true, force: true });
}

// —— 扫码登录状态机(桩 ncm:手机扫码无法自动化,这里覆盖 key→轮询→803 落盘→退出) ——
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-music-login-'));
  const cookieFile = path.join(dir, 'music-cookie.json');
  const pollCookies = [];
  const stubNcm = {
    async call(name, params = {}) {
      if (name === 'login_qr_key') return { code: 200, data: { unikey: 'KEY-STUB' } };
      if (name === 'login_qr_create') return { code: 200, data: { qrurl: `https://music.163.com/login?codekey=${params.key}` } };
      if (name === 'login_qr_check') {
        pollCookies.push(params.cookie ?? '');
        if (pollCookies.length === 1) return { code: 801, message: '等待扫码', cookie: 'NMTID=dev; Path=/;' };
        return { code: 803, message: 'ok', cookie: 'MUSIC_U=TK; Path=/; HttpOnly; __csrf=CZ; Path=/;' };
      }
      if (name === 'user_account') return { profile: { nickname: '桩用户', avatarUrl: '', vipType: 11 } };
      throw new Error(`stub 未实现: ${name}`);
    }
  };
  const route = createMusicService({ ncm: stubNcm, cookieFile });
  const hit = async (p) => {
    const res = fakeRes();
    await route({ method: 'GET', url: '/music' + p, headers: {} }, res);
    return { status: res.status, data: JSON.parse(res.bodyOf().toString('utf-8') || '{}') };
  };

  assert.equal((await hit('/api/health')).data.cookieSource, 'none', '初始应无 Cookie');
  assert.equal((await hit('/api/account')).data.loggedIn, false);
  assert.ok(!fs.existsSync(cookieFile), '未登录时不应有登录态文件');

  const created = await hit('/api/login/qr/create?key=KEY-STUB');
  assert.match(created.data.qrimg, /^data:image\/png;base64,/);
  assert.equal((await hit('/api/login/qr/create')).status, 400, '缺 key 应报 400');

  const waiting = await hit('/api/login/qr/check?key=KEY-STUB');
  assert.deepEqual([waiting.data.code, waiting.data.ok, waiting.data.message], [801, false, '等待扫码']);
  const confirmed = await hit('/api/login/qr/check?key=KEY-STUB');
  assert.equal(confirmed.data.ok, true, JSON.stringify(confirmed.data));
  assert.deepEqual(pollCookies, ['', 'NMTID=dev'], '后续轮询要带上服务端下发的设备 Cookie');
  assert.equal(
    JSON.parse(fs.readFileSync(cookieFile, 'utf-8')).cookie,
    'NMTID=dev; MUSIC_U=TK; __csrf=CZ',
    '落盘应保留设备 Cookie 并剔除属性项'
  );

  const acct = (await hit('/api/account')).data;
  assert.deepEqual([acct.loggedIn, acct.cookieSource, acct.nickname], [true, 'qr', '桩用户']);

  assert.equal((await hit('/api/logout')).data.ok, true);
  assert.equal(JSON.parse(fs.readFileSync(cookieFile, 'utf-8')).cookie, '', '退出要留下空状态');
  assert.equal((await hit('/api/account')).data.loggedIn, false);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log('✓ 扫码登录:key→二维码→轮询→Cookie 落盘→账号→退出');
}

// —— 803 但没有 MUSIC_U(授权未完成)不得假装登录成功 ——
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-music-bad-'));
  const cookieFile = path.join(dir, 'music-cookie.json');
  const route = createMusicService({
    ncm: { call: async () => ({ code: 803, cookie: 'NMTID=dev; Path=/;' }) },
    cookieFile
  });
  const res = fakeRes();
  await route({ method: 'GET', url: '/music/api/login/qr/check?key=K', headers: {} }, res);
  const data = JSON.parse(res.bodyOf().toString('utf-8'));
  assert.equal(data.ok, false, JSON.stringify(data));
  assert.match(data.message, /MUSIC_U/);
  assert.ok(!fs.existsSync(cookieFile), '拿不到 MUSIC_U 时不应落盘');
  fs.rmSync(dir, { recursive: true, force: true });
  console.log('✓ 扫码登录:无 MUSIC_U 的 803 判为失败');
}

// —— Cookie 优先级:UI 登录态覆盖配置,退出后配置也不复活 ——
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-music-prio-'));
  const cookieFile = path.join(dir, 'music-cookie.json');
  const route = createMusicService({
    ncm: { call: async (name) => (name === 'user_account' ? { profile: { nickname: '配置用户' } } : {}) },
    cookieFile,
    configCookie: 'MUSIC_U=CFG'
  });
  const hit = async (p) => {
    const res = fakeRes();
    await route({ method: 'GET', url: '/music' + p, headers: {} }, res);
    return JSON.parse(res.bodyOf().toString('utf-8') || '{}');
  };
  assert.equal((await hit('/api/health')).cookieSource, 'config', '未操作过 UI 时用配置 Cookie');
  const acct = await hit('/api/account');
  assert.deepEqual([acct.loggedIn, acct.cookieSource], [true, 'config']);
  await hit('/api/logout');
  assert.equal((await hit('/api/health')).cookieSource, 'none', '主动退出后配置 Cookie 不再生效');
  assert.equal((await hit('/api/account')).hasConfigCookie, true, '仍要告知配置里有 Cookie');
  fs.rmSync(dir, { recursive: true, force: true });
  console.log('✓ Cookie 优先级:扫码/退出 覆盖配置');
}

// —— Cookie 串处理 ——
assert.equal(normalizeCookie(['MUSIC_U=a; Path=/; HttpOnly', '__csrf=b; Expires=x; Domain=.163.com']), 'MUSIC_U=a; __csrf=b');
assert.equal(mergeCookies('NMTID=1; MUSIC_U=old', 'MUSIC_U=new'), 'NMTID=1; MUSIC_U=new');
console.log('✓ normalizeCookie / mergeCookies');

// —— 客户端歌词解析(纯函数,直接测源码) ——
const parsedLrc = parseLrc('[00:01.23]第一句\n[00:10.00][00:40.00]副歌\n[00:00.00] 暂无歌词\n纯文本行忽略');
assert.deepEqual(parsedLrc.map((l) => l.text), ['第一句', '副歌', '副歌'], '应展开多时间标签并丢弃占位/无标签行');
assert.ok(Math.abs(parsedLrc[0].time - 1.23) < 1e-6, `毫秒位应进小数:${parsedLrc[0].time}`);
assert.deepEqual(parsedLrc.map((l) => l.time).slice(1), [10, 40], '按时间升序');
console.log('✓ parseLrc 时间轴解析');

// —— 客户端构建约束:src/ui 不得动态引入本地模块 ——
// 本项目构建参数(minifyIdentifiers:false + treeShaking:false)下,esbuild 会把
// 动态引入的解构变量编译成未改名的自由引用,运行期 ReferenceError 被 .catch 吞掉,
// 表现为歌词整页空白。静态引入不走这条路径,冒烟里以源码规则守住这条边界。
const uiDir = new URL('../src/ui/', import.meta.url);
for (const f of fs.readdirSync(uiDir)) {
  if (!/\.(jsx?|ts)$/.test(f)) continue;
  const code = fs.readFileSync(new URL(f, uiDir), 'utf-8');
  assert.ok(!/(^|[^.\w])import\(['"]\.\/?/.test(code), `src/ui/${f} 出现了对本地模块的动态引入`);
}
console.log('✓ src/ui 无本地模块动态引入');

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
