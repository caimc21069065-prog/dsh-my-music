// src/ui/nav.jsx — 页面导航 / 浮层 / 提示 的全局上下文(避免组件之间循环依赖)
import { createContext, useContext } from 'react';

export const NavContext = createContext(null);

export function useNav() {
  return useContext(NavContext) || {
    page: { name: 'home' },
    nav() {},
    back() {},
    canBack: false,
    openFull() {},
    openQueue() {},
    toast() {},
    theme: 'dark',
    setTheme() {}
  };
}
