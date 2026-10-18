// src/ui/app.jsx — 应用外壳:左侧菜单 + 顶栏(页签/搜索/账号) + 内容区 + 播放条 + 浮层
// (复刻 AppLayout:AppMenu / SearchBar / main-content / PlayBar / PlayingListDrawer / MusicFull)

import React, { useCallback, useEffect, useRef, useState } from 'react';

import themeCss from './theme.css';
import { api } from './api.js';
import { useAccount } from './account.jsx';
import { usePlayerActions } from './player.jsx';
import { NavContext } from './nav.jsx';
import { PlayBar, PlayingListDrawer, MusicFull } from './components.jsx';
import {
  HomePage, PlaylistListPage, ToplistPage, AlbumListPage, MusicListPage,
  AlbumDetailPage, ArtistDetailPage, SearchPage, UserPage, SettingsPage
} from './pages.jsx';
import {
  IconHome, IconSearch, IconList, IconAlbum, IconToplist, IconHistory, IconUser, IconSetting,
  IconMusic, IconArrowLeft, IconPlay, IconCheck, IconClose
} from './icons.jsx';

const MENU = [
  { id: 'home', label: '首页', icon: IconHome },
  { id: 'search', label: '搜索', icon: IconSearch },
  { id: 'list', label: '歌单', icon: IconList },
  { id: 'albums', label: '新碟上架', icon: IconAlbum },
  { id: 'toplist', label: '排行榜', icon: IconToplist },
  { id: 'history', label: '最近播放', icon: IconHistory },
  { id: 'user', label: '我的音乐', icon: IconUser },
  { id: 'settings', label: '设置', icon: IconSetting }
];

const TABS = [
  { id: 'home', label: '首页', icon: IconHome },
  { id: 'list', label: '歌单', icon: IconList },
  { id: 'albums', label: '新碟上架', icon: IconAlbum },
  { id: 'toplist', label: '排行榜', icon: IconToplist }
];

const THEME_KEY = 'dsh-music.theme';
const MENU_KEY = 'dsh-music.menuExpanded';

function readTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function MusicApp() {
  const [stack, setStack] = useState([{ name: 'home', params: undefined }]);
  const [theme, setThemeState] = useState(readTheme);
  const [menuExpanded, setMenuExpandedState] = useState(() => {
    try { return localStorage.getItem(MENU_KEY) === '1'; } catch { return false; }
  });
  const [keyword, setKeyword] = useState('');
  const [suggest, setSuggest] = useState(null);
  const [queueOpen, setQueueOpen] = useState(false);
  const [fullOpen, setFullOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const contentRef = useRef(null);
  const suggestTimer = useRef(null);
  const { account } = useAccount();
  const actions = usePlayerActions();

  const page = stack[stack.length - 1];

  const setTheme = useCallback((next) => {
    setThemeState(next);
    try { localStorage.setItem(THEME_KEY, next); } catch { /* ignore */ }
  }, []);
  const setMenuExpanded = useCallback((next) => {
    setMenuExpandedState(next);
    try { localStorage.setItem(MENU_KEY, next ? '1' : '0'); } catch { /* ignore */ }
  }, []);

  const nav = useCallback((name, params) => {
    setStack((prev) => {
      const cur = prev[prev.length - 1];
      if (cur.name === name && JSON.stringify(cur.params ?? null) === JSON.stringify(params ?? null)) return prev;
      // 从详情页点侧栏/页签:回到顶层,避免历史无限堆叠
      if (['home', 'search', 'list', 'albums', 'toplist', 'user', 'settings'].includes(name) && prev.length > 1) {
        return [{ name, params }];
      }
      return [...prev, { name, params }];
    });
    setSuggest(null);
  }, []);

  const back = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  // action 可选:{ label, onClick }:带操作按钮的提示(如「下载完成 → 打开目录」),停留时间也更长
  const toast = useCallback((msg, type = '', action = null) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-2), { id, msg, type, action }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), action ? 7000 : 2800);
  }, []);

  // 切换页面后回到顶部
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [page.name, page.params]);

  // 全局快捷键(输入框内不拦截):空格播放/暂停、左右方向键 ±5s、上下方向键调音量、Esc 关浮层
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
      if (e.target?.closest?.('[role="slider"]')) return;
      if (e.code === 'Space') {
        if (e.target?.closest?.('button')) return;
        e.preventDefault();
        actions.togglePlay();
        return;
      }
      if (e.key === 'Escape') { setQueueOpen(false); setFullOpen(false); setSuggest(null); return; }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        actions.seek(Math.max(0, actions.getAudio().currentTime + (e.key === 'ArrowRight' ? 5 : -5)));
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        actions.setVolume(actions.getAudio().volume + (e.key === 'ArrowUp' ? 0.05 : -0.05));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [actions]);

  // 搜索建议(防抖)
  const onKeyword = (value) => {
    setKeyword(value);
    clearTimeout(suggestTimer.current);
    if (!value.trim()) { setSuggest(null); return; }
    suggestTimer.current = setTimeout(() => {
      api.searchSuggest(value.trim())
        .then((d) => setSuggest(d.items?.length ? d.items : null))
        .catch(() => setSuggest(null));
    }, 260);
  };

  const doSearch = (kw) => {
    const k = String(kw ?? keyword).trim();
    if (!k) return;
    setKeyword(k);
    setSuggest(null);
    nav('search', { keyword: k });
  };

  const activeMenu = page.name === 'musiclist'
    ? (page.params?.kind === 'toplist' ? 'toplist' : page.params?.kind === 'history' ? 'history' : page.params?.kind === 'favorite' ? 'user' : 'list')
    : page.name;

  const isDetail = ['musiclist', 'album', 'artist'].includes(page.name);
  const title = page.name === 'musiclist'
    ? (page.params?.name ?? '歌单')
    : page.name === 'album' ? (page.params?.name ?? '专辑')
      : page.name === 'artist' ? (page.params?.name ?? '歌手') : '';

  const navValue = {
    page, nav, back, canBack: stack.length > 1,
    openFull: () => setFullOpen(true),
    openQueue: () => setQueueOpen(true),
    toast, theme, setTheme,
    menuExpanded, setMenuExpanded
  };

  return (
    <NavContext.Provider value={navValue}>
      <div className="dsh-music" data-theme={theme}>
        <style>{themeCss}</style>
        <div className="app-body">
          <div className={`app-menu${menuExpanded ? ' expanded' : ''}`}>
            <div className="logo" onClick={() => setMenuExpanded(!menuExpanded)} title="DSH Music">
              <IconMusic />
            </div>
            <div className="menu-list">
              {MENU.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`menu-item${activeMenu === id ? ' on' : ''}`}
                  onClick={() => {
                    if (id === 'history') nav('musiclist', { kind: 'history', name: '最近播放' });
                    else nav(id);
                  }}
                >
                  <Icon />
                  <span className="menu-label">{label}</span>
                  <span className="menu-tip">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="app-main">
            <div className="search-bar">
              {isDetail ? (
                <>
                  <button className="back-btn" onClick={back} title="返回"><IconArrowLeft /></button>
                  <span className="nav-title">{title}</span>
                </>
              ) : (
                <div className="tabs">
                  {TABS.map(({ id, label, icon: Icon }) => (
                    <button key={id} className={`tab${activeMenu === id ? ' on' : ''}`} onClick={() => nav(id)}>
                      <Icon /><span>{label}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="search-wrap">
                <div className="search-box">
                  <IconSearch />
                  <input
                    placeholder="搜索音乐"
                    value={keyword}
                    onChange={(e) => onKeyword(e.target.value)}
                    onBlur={() => setTimeout(() => setSuggest(null), 160)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') doSearch();
                      if (e.key === 'Escape') setSuggest(null);
                    }}
                  />
                </div>
                {suggest ? (
                  <div className="suggest" style={{ zIndex: 70 }}>
                    {suggest.map((s) => (
                      <div key={s} className="suggest-row" onMouseDown={(e) => { e.preventDefault(); doSearch(s); }}>
                        <IconSearch />{s}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <button
                className="user-btn"
                onClick={() => nav(account?.loggedIn ? 'user' : 'settings')}
                title={account?.loggedIn ? account.nickname : '登录网易云账号'}
              >
                {account?.loggedIn && account.avatar
                  ? <img className="avatar sm" src={account.avatar} alt="" />
                  : <span className="login-link">登录</span>}
              </button>
            </div>

            <div className="main-content" ref={contentRef}>
              {page.name === 'home' ? <HomePage /> : null}
              {page.name === 'search' ? <SearchPage key={page.params?.keyword ?? 'search'} initialKeyword={page.params?.keyword} /> : null}
              {page.name === 'list' ? <PlaylistListPage /> : null}
              {page.name === 'toplist' ? <ToplistPage /> : null}
              {page.name === 'albums' ? <AlbumListPage /> : null}
              {page.name === 'musiclist' ? <MusicListPage params={page.params ?? {}} /> : null}
              {page.name === 'album' ? <AlbumDetailPage params={page.params ?? {}} /> : null}
              {page.name === 'artist' ? <ArtistDetailPage params={page.params ?? {}} /> : null}
              {page.name === 'user' ? <UserPage /> : null}
              {page.name === 'settings' ? (
                <SettingsPage
                  theme={theme}
                  setTheme={setTheme}
                  menuExpanded={menuExpanded}
                  setMenuExpanded={setMenuExpanded}
                />
              ) : null}
            </div>
          </div>
        </div>

        <PlayBar />
        <PlayingListDrawer open={queueOpen} onClose={() => setQueueOpen(false)} />
        <MusicFull open={fullOpen} onClose={() => setFullOpen(false)} />

        <div className="toast-wrap">
          {toasts.map((t) => (
            <div key={t.id} className={`toast ${t.type}`}>
              {t.type === 'ok' ? <IconCheck /> : t.type === 'err' ? <IconClose /> : <IconPlay />}
              <span className="toast-msg">{t.msg}</span>
              {t.action ? (
                <button
                  className="toast-action"
                  onClick={() => {
                    t.action.onClick?.();
                    setToasts((prev) => prev.filter((x) => x.id !== t.id));
                  }}
                >
                  {t.action.label}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </NavContext.Provider>
  );
}
