// src/ui/app.jsx — 应用外壳:左侧图标栏 + 顶栏(页签/搜索) + 内容区 + 播放条 + 浮层
// (复刻 AppLayout:菜单 rail / SearchBar / main-content / PlayBar / PlayingListDrawer / MusicFull)

import React, { useCallback, useState } from 'react';

import themeCss from './theme.css';
import { api } from './api.js';
import { CoverCard } from './components.jsx';
import {
  IconHome, IconSearch, IconList, IconTop, IconDisc, IconSetting, IconMusic
} from './icons.jsx';
import { PlayBar, QueueDrawer, MusicFull } from './components.jsx';
import { HomePage, SearchPage, MusicListPage, SettingsPage } from './pages.jsx';
import { useAccount } from './account.jsx';

const RAIL = [
  { id: 'home', label: '发现', icon: IconHome },
  { id: 'search', label: '搜索', icon: IconSearch },
  { id: 'toplist', label: '排行榜', icon: IconTop },
  { id: 'playlist', label: '歌单', icon: IconList },
  { id: 'settings', label: '设置', icon: IconSetting }
];

export function MusicApp() {
  const [page, setPage] = useState({ id: 'home' });
  const [keyword, setKeyword] = useState('');
  const [queueOpen, setQueueOpen] = useState(false);
  const [fullOpen, setFullOpen] = useState(false);
  const { account } = useAccount();

  const nav = useCallback((id, params) => {
    setPage({ id, params });
  }, []);

  const openSearch = useCallback((kw) => {
    setPage((prev) => {
      const next = { id: 'search', params: kw ? { keyword: kw } : undefined };
      return next.id === prev.id && next.params === prev.params ? prev : next;
    });
    setKeyword(kw ?? '');
  }, []);

  // musiclist 页面时,侧栏/顶栏高亮跟随来源类型
  const activeId = page.id === 'musiclist'
    ? (page.params?.kind === 'toplist' ? 'toplist' : page.params?.kind === 'playlist' ? 'playlist' : 'search')
    : page.id;

  return (
    <div className="dsh-music">
      <style>{themeCss}</style>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div className="rail">
          {RAIL.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`rail-item${activeId === id ? ' on' : ''}`}
              onClick={() => nav(id)}
              title={label}
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </div>
        <div className="main">
          <div className="topbar">
            <div className="tabs">
              <span className={`tab${activeId === 'home' ? ' on' : ''}`} onClick={() => nav('home')}><IconMusic />发现</span>
              <span className={`tab${activeId === 'toplist' ? ' on' : ''}`} onClick={() => nav('toplist')}>排行榜</span>
              <span className={`tab${activeId === 'playlist' ? ' on' : ''}`} onClick={() => nav('playlist')}>歌单</span>
            </div>
            <div className="search-input">
              <IconSearch />
              <input
                placeholder="搜索歌曲、歌手、专辑、歌单"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && keyword.trim()) openSearch(keyword.trim()); }}
              />
            </div>
            <button
              className={`chip${account?.loggedIn ? ' green' : ''}`}
              onClick={() => nav('settings')}
              title={account?.loggedIn ? account.nickname : '去登录网易云账号'}
            >
              {account?.loggedIn ? account.nickname : '未登录'}
            </button>
          </div>
          <div className="content">
            {page.id === 'home' ? <HomePage nav={nav} /> : null}
            {page.id === 'search' ? <SearchPage nav={nav} initialKeyword={page.params?.keyword} key={page.params?.keyword ?? 'search'} /> : null}
            {page.id === 'musiclist' ? <MusicListPage nav={nav} params={page.params} key={`${page.params?.kind}-${page.params?.id}`} /> : null}
            {page.id === 'settings' ? <SettingsPage /> : null}
            {page.id === 'toplist' ? <PlaylistExplorer cat="排行榜" kind="toplist" nav={nav} /> : null}
            {page.id === 'playlist' ? <PlaylistExplorer cat="热门歌单" kind="playlist" nav={nav} /> : null}
          </div>
        </div>
      </div>
      <PlayBar onOpenFull={() => setFullOpen(true)} onOpenQueue={() => setQueueOpen(true)} />
      <QueueDrawer open={queueOpen} onClose={() => setQueueOpen(false)} />
      <MusicFull open={fullOpen} onClose={() => setFullOpen(false)} />
    </div>
  );
}

/** 歌单/榜单浏览页(rail 的 歌单/排行榜 两个入口的落地页) */
function PlaylistExplorer({ cat, kind, nav }) {
  const { useState, useEffect } = React;
  const [items, setItems] = useState({ loading: true, list: [] });
  useEffect(() => {
    let alive = true;
    setItems({ loading: true, list: [] });
    const load = kind === 'toplist'
      ? api.toplists()
      : api.hotPlaylists(30);
    load.then((d) => alive && setItems({ loading: false, list: d.items ?? [] }))
      .catch(() => alive && setItems({ loading: false, list: [] }));
    return () => { alive = false; };
  }, [kind]);
  return (
    <div className="page" style={{ paddingTop: 4 }}>
      <div className="sec-title"><span className="bar" />{cat}</div>
      {items.loading ? <div className="empty">加载中…</div> : null}
      <div className="grid-cover">
        {items.list.map((p) => (
          <CoverCard
            key={p.id}
            cover={p.cover}
            name={p.name}
            plays={p.playCount}
            sub={p.updateFrequency ?? (p.creator ? `by ${p.creator}` : '')}
            onClick={() => nav('musiclist', { kind, id: p.id, name: p.name, cover: p.cover })}
          />
        ))}
      </div>
    </div>
  );
}
