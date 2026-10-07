// lib/cookie.js — 网易云登录态文件的读写与 Cookie 串处理(index.js 与 service.js 共用)。

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const COOKIE_FILE = path.join(os.homedir(), '.dsh', 'music-cookie.json');

const COOKIE_ATTR_NAMES = new Set(['path', 'expires', 'max-age', 'httponly', 'secure', 'samesite', 'domain', 'version']);

/** 把登录接口返回的 Set-Cookie 形态("a=1; Path=/; HttpOnly; b=2")归一成 "a=1; b=2" 的纯 Cookie 串。 */
export function normalizeCookie(raw) {
  if (!raw) return '';
  const parts = Array.isArray(raw) ? raw.join('; ') : String(raw);
  return parts
    .split(/;\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((pair) => {
      const eq = pair.indexOf('=');
      if (eq <= 0) return false;
      return !COOKIE_ATTR_NAMES.has(pair.slice(0, eq).toLowerCase());
    })
    .join('; ');
}

function toPairs(str) {
  const map = new Map();
  for (const pair of normalizeCookie(str).split(';')) {
    const s = pair.trim();
    const eq = s.indexOf('=');
    if (eq > 0) map.set(s.slice(0, eq), s.slice(eq + 1));
  }
  return map;
}

/** 合并两段 Cookie,后出现的同名项覆盖前者(轮询过程中设备 Cookie 会陆续下发)。 */
export function mergeCookies(base = '', extra = '') {
  const map = toPairs(base);
  for (const [name, value] of toPairs(extra)) map.set(name, value);
  return [...map].map(([name, value]) => `${name}=${value}`).join('; ');
}

/**
 * 登录态文件。exists=false 表示用户从未在 UI 里登录或退出过。
 * 文件损坏按「空 Cookie」处理:宁可显示未登录,也不拿配置 Cookie 冒充扫码结果。
 */
export function readCookieFile(cookieFile = COOKIE_FILE) {
  let raw;
  try {
    raw = fs.readFileSync(cookieFile, 'utf-8');
  } catch {
    return { exists: false, cookie: '' };
  }
  try {
    const parsed = JSON.parse(raw);
    return { exists: true, cookie: typeof parsed?.cookie === 'string' ? parsed.cookie : '' };
  } catch {
    return { exists: true, cookie: '' };
  }
}

/** 写入登录态;cookie 传空串即「已退出登录」。 */
export function writeCookieFile(cookie, cookieFile = COOKIE_FILE) {
  try {
    fs.mkdirSync(path.dirname(cookieFile), { recursive: true });
    fs.writeFileSync(cookieFile, JSON.stringify({ cookie, savedAt: Date.now() }), 'utf-8');
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

/**
 * 当前生效的 Cookie:UI 的登录态优先(退出后为空即视为未登录),
 * 只有用户从未在 UI 操作过时才回落到插件配置里的 Cookie。
 */
export function resolveCookie({ configCookie = '', cookieFile = COOKIE_FILE } = {}) {
  const session = readCookieFile(cookieFile);
  const cookie = session.exists ? session.cookie : configCookie;
  return {
    cookie,
    source: cookie ? (session.exists ? 'qr' : 'config') : 'none',
    hasConfigCookie: Boolean(configCookie)
  };
}
