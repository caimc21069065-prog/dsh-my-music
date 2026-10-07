// src/ui/account.jsx — 账号状态(模块级缓存 + 订阅),登录/退出后 refreshAccount() 全局刷新。
import { useEffect, useState } from 'react';

import { api } from './api.js';

let cache = { status: 'loading', account: null };
const listeners = new Set();

export async function refreshAccount() {
  try {
    const account = await api.account();
    cache = { status: 'ready', account };
  } catch {
    cache = { status: 'ready', account: { loggedIn: false } };
  }
  for (const l of [...listeners]) l(cache);
  return cache;
}

export function useAccount() {
  const [snap, setSnap] = useState(cache);
  useEffect(() => {
    listeners.add(setSnap);
    if (cache.status === 'loading') refreshAccount();
    return () => listeners.delete(setSnap);
  }, []);
  return snap;
}
