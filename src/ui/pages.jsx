// src/ui/pages.jsx — 页面:发现 / 歌单 / 排行榜 / 新碟 / 搜索 / 歌单详情 / 专辑 / 歌手 / 我的 / 设置
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { api, formatCount, formatDate } from './api.js';
import { usePlayer, usePlayerSelector, usePlayerActions } from './player.jsx';
import { shuffled } from './queue.js';
import { useAccount, refreshAccount } from './account.jsx';
import { useNav } from './nav.jsx';
import {
  CoverCard, SongRow, SectionHead, SkeletonGrid, Empty, Loading, Confirm
} from './components.jsx';
import {
  IconPlay, IconPause, IconHeart, IconRadio, IconSearch, IconMusic,
  IconChevronRight, IconTrash, IconArrowLeft
} from './icons.jsx';

/* ───────────── 通用 ───────────── */

function useAsync(fn, deps) {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  useEffect(() => {
    let alive = true;
    setState({ loading: true, data: null, error: null });
    fn()
      .then((data) => alive && setState({ loading: false, data, error: null }))
      .catch((error) => alive && setState({ loading: false, data: null, error }));
    return () => { alive = false; };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return state;
}

function totalDuration(tracks) {
  const ms = (tracks ?? []).reduce((sum, t) => sum + (t.duration || 0), 0);
  const min = Math.round(ms / 60000);
  return min > 0 ? `${min} 分钟` : '';
}

/** 歌单卡:悬停时懒加载前三首,复刻参考实现的曲目预览。 */
function PlaylistCard({ item, onOpen }) {
  const [tracks, setTracks] = useState(null);
  const loadingRef = useRef(false);
  const actions = usePlayerActions();
  const load = () => {
    if (tracks || loadingRef.current) return;
    loadingRef.current = true;
    api.playlistTracks(item.id, 3)
      .then((d) => setTracks((d.tracks ?? []).slice(0, 3)))
      .catch(() => setTracks([]));
  };
  const play = async () => {
    try {
      const d = await api.playlistTracks(item.id, 100);
      if (d.tracks?.length) actions.playQueue(d.tracks, 0);
    } catch { /* 静默失败,用户可再点一次 */ }
  };
  return (
    <div onMouseEnter={load}>
      <CoverCard
        cover={item.cover}
        name={item.name}
        sub={item.copywriter || (item.creator ? `by ${item.creator}` : '')}
        playCount={item.playCount}
        tracks={tracks ?? []}
        onClick={onOpen}
        onPlay={play}
      />
    </div>
  );
}

/* ───────────── 发现 ───────────── */

export function HomePage() {
  const nav = useNav();
  const actions = usePlayerActions();
  const currentId = usePlayerSelector((s) => (s.index >= 0 ? s.queue[s.index]?.id : null));
  const playing = usePlayerSelector((s) => s.playing);
  const home = useAsync(() => api.home(), []);
  const { account } = useAccount();
  const [fm, setFm] = useState(null);
  const [fmBusy, setFmBusy] = useState(false);

  const data = home.data;
  const daily = data?.daily;
  const dailyTracks = daily?.tracks ?? [];
  const loggedIn = Boolean(account?.loggedIn);

  const loadFm = async () => {
    setFmBusy(true);
    try {
      const d = await api.fm();
      setFm(d.items?.[0] ?? null);
    } catch { /* 未登录时接口可能失败 */ } finally { setFmBusy(false); }
  };

  useEffect(() => {
    if (loggedIn && !fm) loadFm();
  }, [loggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  const isFmCurrent = Boolean(fm && currentId === fm.id);
  const toggleFm = (e) => {
    e?.stopPropagation();
    if (!fm) return;
    if (isFmCurrent) actions.togglePlay();
    else actions.playQueue([fm], 0);
  };

  const playDaily = (e) => {
    e?.stopPropagation();
    if (dailyTracks.length) actions.playQueue(dailyTracks, 0);
  };
  const openDaily = () => {
    if (dailyTracks.length) nav.nav('musiclist', { kind: 'daily', name: daily?.name ?? '每日推荐', cover: dailyTracks[0]?.cover, tracks: dailyTracks });
  };

  return (
    <div className="page">
      <div className="hero-grid">
        <div className="hero-card" onClick={openDaily}>
          {dailyTracks[0]?.cover ? <img className="hero-bg" src={dailyTracks[0].cover} alt="" /> : null}
          <div className="shade" />
          <div className="inner">
            <div>
              <div className="hero-title">{daily?.name ?? '每日推荐'}</div>
              <span className="hero-badge"><IconRadio />{dailyTracks.length} 首歌曲</span>
            </div>
            <div className="hero-bottom">
              <div className="hero-songs">
                {dailyTracks.slice(0, 3).map((t, i) => (
                  <div className="hero-song" key={t.id}>
                    <span className="n">{i + 1}</span>
                    <span className="t">{t.name}</span>
                    <span className="a">{t.artist}</span>
                  </div>
                ))}
                {dailyTracks.length === 0 ? <span style={{ color: 'rgba(255,255,255,.6)', fontSize: 13 }}>暂无日推,先去登录账号</span> : null}
              </div>
              <button className="hero-play" onClick={playDaily} title="播放全部"><IconPlay /></button>
            </div>
          </div>
        </div>

        {loggedIn ? (
          <div className="hero-card" onClick={toggleFm}>
            {fm?.cover ? <img className="fm-bg" src={fm.cover} alt="" /> : null}
            <div className="fm-veil" />
            <div className="fm-card">
              {fm?.cover ? <img className="fm-cover" src={fm.cover} alt="" /> : <div className="fm-cover" style={{ background: 'rgba(255,255,255,.12)' }} />}
              <div className="fm-info">
                <div>
                  <div className="fm-name">{fm?.name ?? (fmBusy ? '正在获取私人 FM…' : '私人漫游')}</div>
                  <div className="fm-artist">{fm?.artist ?? '根据你的口味持续推荐'}</div>
                </div>
                <div className="fm-actions">
                  <button className="icon-btn sm" title="换一首" onClick={(e) => { e.stopPropagation(); loadFm(); }}>
                    <IconChevronRight />
                  </button>
                  <button className="fm-play" onClick={toggleFm} title={isFmCurrent && playing ? '暂停' : '播放'}>
                    {isFmCurrent && playing ? <IconPause /> : <IconPlay />}
                  </button>
                  {fm ? <span className="eq"><i /><i /><i /></span> : null}
                </div>
              </div>
              <span className="fm-tag"><IconRadio />私人 FM</span>
            </div>
          </div>
        ) : (
          <div className="hero-card" onClick={() => nav.nav('list')}>
            <div className="wall">
              {(data?.playlists ?? []).slice(0, 4).map((p, i) => (
                p.cover ? <img key={i} src={p.cover} alt="" /> : <div key={i} style={{ background: 'var(--panel-2)' }} />
              ))}
            </div>
            <div className="wall-veil" />
            <div className="wall-inner">
              <span className="wall-badge"><IconMusic />热门歌单</span>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div className="wall-title">发现好歌单</div>
                  <div className="wall-sub">每天都有新的推荐</div>
                </div>
                <span className="wall-go"><IconChevronRight /></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <SectionHead title="推荐歌单" onMore={() => nav.nav('list')} />
      {home.loading ? <SkeletonGrid n={10} /> : (
        <div className="cover-grid">
          {(data?.playlists ?? []).map((p) => (
            <PlaylistCard
              key={p.id}
              item={p}
              onOpen={() => nav.nav('musiclist', { kind: 'playlist', id: p.id, name: p.name, cover: p.cover })}
            />
          ))}
        </div>
      )}

      {(data?.artists ?? []).length > 0 ? (
        <>
          <SectionHead title="热门歌手" />
          <div className="artist-row">
            {data.artists.map((a) => (
              <div className="artist-card" key={a.id} onClick={() => nav.nav('artist', { id: a.id, name: a.name })}>
                <div className="av">{a.cover ? <img src={a.cover} alt="" loading="lazy" /> : null}</div>
                <div className="n">{a.name}</div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {(data?.albums ?? []).length > 0 ? (
        <>
          <SectionHead title="新碟上架" onMore={() => nav.nav('albums')} />
          <div className="cover-grid">
            {data.albums.map((a) => (
              <CoverCard
                key={a.id}
                cover={a.cover}
                name={a.name}
                sub={a.artist}
                onClick={() => nav.nav('album', { id: a.id, name: a.name })}
              />
            ))}
          </div>
        </>
      ) : null}

      <SectionHead
        title="新歌速递"
        action={(
          <button
            className="sec-more"
            onClick={() => { const list = data?.newSongs ?? []; if (list.length) actions.playQueue(list, 0); }}
          >
            <IconPlay style={{ width: 14, height: 14 }} />播放全部
          </button>
        )}
      />
      {home.loading ? <Loading /> : (
        <div className="new-grid">
          {(data?.newSongs ?? []).map((t) => {
            const idx = (data.newSongs ?? []).findIndex((x) => x.id === t.id);
            return (
              <div
                key={t.id}
                className="new-card"
                onClick={() => actions.playQueue(data.newSongs, idx)}
              >
                <div className="cv">
                  {t.cover ? <img src={t.cover} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                  <span className="pl"><IconPlay /></span>
                </div>
                <div className="meta">
                  <div className="t">{t.name}</div>
                  <div className="a">{t.artist}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ───────────── 歌单广场 ───────────── */

export function PlaylistListPage() {
  const nav = useNav();
  const cats = useAsync(() => api.playlistCategories(), []);
  const [cat, setCat] = useState('全部');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinel = useRef(null);

  const load = async (nextCat, nextPage, append) => {
    if (append) setLoadingMore(true); else setLoading(true);
    try {
      const d = await api.playlists(nextCat, 42, nextPage * 42);
      setItems((prev) => (append ? [...prev, ...(d.items ?? [])] : (d.items ?? [])));
      setMore(Boolean(d.more) && (d.items ?? []).length > 0);
      setPage(nextPage);
    } catch {
      if (!append) setItems([]);
      setMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => { load(cat, 0, false); }, [cat]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return undefined;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && more && !loading && !loadingMore) load(cat, page + 1, true);
    }, { rootMargin: '240px' });
    io.observe(el);
    return () => io.disconnect();
  }, [more, loading, loadingMore, page, cat]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page">
      <div className="page-title">歌单广场</div>
      <div className="page-sub">按心情与场景,找到今天想听的那一张</div>
      <div className="chips cats" style={{ marginTop: 18 }}>
        {(cats.data?.categories ?? ['全部']).map((c) => (
          <button key={c} className={`chip${cat === c ? ' on' : ''}`} onClick={() => { setCat(c); setItems([]); }}>{c}</button>
        ))}
      </div>
      {loading ? <SkeletonGrid n={15} /> : (
        <>
          <div className="cover-grid">
            {items.map((p) => (
              <PlaylistCard
                key={`${p.id}-${p.name}`}
                item={p}
                onOpen={() => nav.nav('musiclist', { kind: 'playlist', id: p.id, name: p.name, cover: p.cover })}
              />
            ))}
          </div>
          {items.length === 0 ? <Empty text="这个分类下暂时没有歌单" /> : null}
          <div ref={sentinel} style={{ height: 1 }} />
          {loadingMore ? <Loading text="加载更多…" /> : null}
          {!more && items.length > 0 ? <div className="loading-row" style={{ color: 'var(--muted-2)' }}>没有更多了</div> : null}
        </>
      )}
    </div>
  );
}

/* ───────────── 排行榜 ───────────── */

export function ToplistPage() {
  const nav = useNav();
  const list = useAsync(() => api.toplists(), []);
  return (
    <div className="page">
      <div className="page-title">排行榜</div>
      <div className="page-sub">实时更新,看看大家最近都在听什么</div>
      <div style={{ height: 22 }} />
      {list.loading ? <SkeletonGrid n={10} /> : (
        <div className="cover-grid">
          {(list.data?.items ?? []).map((item) => (
            <CoverCard
              key={item.id}
              cover={item.cover}
              name={item.name}
              sub={item.updateFrequency}
              playCount={item.playCount}
              onClick={() => nav.nav('musiclist', { kind: 'toplist', id: item.id, name: item.name, cover: item.cover, updateFrequency: item.updateFrequency })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────── 新碟上架 ───────────── */

const AREAS = [['ALL', '全部'], ['ZH', '华语'], ['EA', '欧美'], ['JP', '日本'], ['KR', '韩国']];

export function AlbumListPage() {
  const nav = useNav();
  const [area, setArea] = useState('ALL');
  const albums = useAsync(() => api.albums(24, area), [area]);
  return (
    <div className="page">
      <div className="page-title">新碟上架</div>
      <div className="page-sub">最新发行的专辑,第一时间听到</div>
      <div className="chips" style={{ marginTop: 18 }}>
        {AREAS.map(([k, label]) => (
          <button key={k} className={`chip${area === k ? ' on' : ''}`} onClick={() => setArea(k)}>{label}</button>
        ))}
      </div>
      {albums.loading ? <SkeletonGrid n={12} /> : (
        <div className="cover-grid">
          {(albums.data?.items ?? []).map((a) => (
            <CoverCard
              key={a.id}
              cover={a.cover}
              name={a.name}
              sub={a.artist}
              onClick={() => nav.nav('album', { id: a.id, name: a.name })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────── 歌单 / 榜单 / 收藏 / 历史详情 ───────────── */

const KIND_LABEL = { playlist: 'Playlist', toplist: 'Ranking', daily: 'Daily', favorite: 'Favorites', history: 'History' };

export function MusicListPage({ params }) {
  const nav = useNav();
  const favorites = usePlayerSelector((s) => s.favorites);
  const history = usePlayerSelector((s) => s.history);
  const actions = usePlayerActions();
  const [clearFav, setClearFav] = useState(false);
  const kind = params.kind;
  const local = kind === 'favorite' || kind === 'history';

  const detail = useAsync(
    () => (kind === 'playlist' ? api.playlistDetail(params.id) : Promise.resolve(null)),
    [kind, params.id]
  );
  const tracksRes = useAsync(
    () => {
      if (kind === 'playlist') return api.playlistTracks(params.id, 300);
      if (kind === 'toplist') return api.toplistTracks(params.id, 200);
      return Promise.resolve({ tracks: params.tracks ?? [] });
    },
    [kind, params.id]
  );

  const tracks = local
    ? (kind === 'favorite' ? favorites : history)
    : (tracksRes.data?.tracks ?? []);
  const info = detail.data ?? {};
  const name = local
    ? (kind === 'favorite' ? '我喜欢的音乐' : '最近播放')
    : (info.name ?? params.name ?? '歌单');
  const cover = local ? (tracks[0]?.cover ?? '') : (info.cover ?? params.cover ?? tracks[0]?.cover ?? '');
  const desc = local
    ? (kind === 'favorite' ? '收藏过的歌曲都在这里,登录后可同步到网易云「我喜欢的音乐」' : '最近播放过的歌曲,按时间倒序')
    : (info.description ?? '');
  const creator = info.creator ?? '';
  const creatorAvatar = info.creatorAvatar ?? '';
  const updateFrequency = kind === 'toplist' ? (params.updateFrequency ?? '') : '';

  const playAll = () => { if (tracks.length) actions.playQueue(tracks, 0); };
  const shufflePlay = () => {
    if (!tracks.length) return;
    actions.playQueue(shuffled(tracks), 0);
  };

  return (
    <div className="page">
      <div className="detail">
        <div className="detail-bg">
          {cover ? <div className="img" style={{ backgroundImage: `url("${cover}")` }} /> : null}
          <div className="fade" />
        </div>
        <div className="detail-head">
          <div className="detail-cover-wrap">
            {cover ? <img className="detail-cover" src={cover} alt="" /> : <div className="detail-cover" />}
            <div className="cover-play">
              <button onClick={playAll} title="播放全部"><IconPlay /></button>
            </div>
          </div>
          <div className="detail-info">
            <span className="detail-kind">{KIND_LABEL[kind] ?? 'Playlist'}</span>
            <div className="detail-name">{name}</div>
            <div className="detail-meta">
              {creator ? (
                <span className="who">
                  {creatorAvatar ? <img src={creatorAvatar} alt="" /> : null}
                  {creator}
                </span>
              ) : null}
              {creator ? <span className="sep" /> : null}
              <span>{tracks.length} 首</span>
              {info.playCount ? <><span className="sep" /><span>播放 {formatCount(info.playCount)}</span></> : null}
              {totalDuration(tracks) ? <><span className="sep" /><span>{totalDuration(tracks)}</span></> : null}
              {updateFrequency ? <><span className="sep" /><span>{updateFrequency}</span></> : null}
            </div>
            {desc ? <div className="detail-desc" title={desc}>{desc}</div> : null}
          </div>
        </div>

        <div className="action-bar">
          <button className="pill-btn primary" onClick={playAll}><IconPlay />播放全部</button>
          <button className="pill-btn ghost" onClick={shufflePlay}><IconRadio />随机播放</button>
          {kind === 'favorite' && tracks.length > 0 ? (
            <button className="pill-btn ghost" onClick={() => setClearFav(true)}>
              <IconHeart />取消全部收藏
            </button>
          ) : null}
          <span style={{ flex: 1 }} />
          {kind === 'history' && tracks.length > 0 ? (
            <button className="pill-btn ghost" onClick={() => actions.clearHistory()}><IconTrash />清空记录</button>
          ) : null}
        </div>

        {tracksRes.loading && !local ? <Loading /> : null}
        {tracksRes.error ? <div className="err">加载失败:{tracksRes.error.message}</div> : null}
        {!tracksRes.loading && tracks.length === 0 ? (
          <Empty text={kind === 'favorite' ? '还没有收藏任何歌曲' : kind === 'history' ? '还没有播放记录' : '这个歌单是空的'} />
        ) : null}
        {tracks.length > 0 ? (
          <div className="song-list">
            <div className="song-head">
              <span style={{ textAlign: 'center' }}>#</span>
              <span>标题</span>
              <span className="album-col">专辑</span>
              <span style={{ textAlign: 'right' }}>时长</span>
              <span style={{ textAlign: 'right', paddingRight: 8 }}>操作</span>
            </div>
            {tracks.map((t, i) => (
              <SongRow
                key={`${t.id}-${i}`}
                track={t}
                index={i}
                onPlay={() => actions.playQueue(tracks, i)}
                extraOps={kind === 'history' ? (
                  <button className="icon-btn sm" title="从记录中移除" onClick={(e) => { e.stopPropagation(); actions.removeHistory(t.id); }}>
                    <IconTrash />
                  </button>
                ) : null}
              />
            ))}
          </div>
        ) : null}
      </div>
      <Confirm
        open={clearFav}
        title="取消全部收藏"
        text={`将从收藏中移除全部 ${tracks.length} 首歌曲(已登录时会同时取消云端喜欢),确定继续吗?`}
        okText="全部取消"
        danger
        onCancel={() => setClearFav(false)}
        onOk={() => { actions.clearFavorites(); setClearFav(false); }}
      />
    </div>
  );
}

/* ───────────── 专辑详情 ───────────── */

export function AlbumDetailPage({ params }) {
  const actions = usePlayerActions();
  const album = useAsync(() => api.albumDetail(params.id), [params.id]);
  const a = album.data?.album;
  const tracks = album.data?.tracks ?? [];
  return (
    <div className="page">
      <div className="detail">
        <div className="detail-bg">
          {(a?.cover ?? params.cover) ? <div className="img" style={{ backgroundImage: `url("${a?.cover ?? params.cover}")` }} /> : null}
          <div className="fade" />
        </div>
        <div className="detail-head">
          <div className="detail-cover-wrap">
            {a?.cover ? <img className="detail-cover" src={a.cover} alt="" /> : <div className="detail-cover" />}
            <div className="cover-play">
              <button onClick={() => tracks.length && actions.playQueue(tracks, 0)}><IconPlay /></button>
            </div>
          </div>
          <div className="detail-info">
            <span className="detail-kind">Album</span>
            <div className="detail-name">{a?.name ?? params.name}</div>
            <div className="detail-meta">
              {a?.artist ? <span className="who">{a.artistCover ? <img src={a.artistCover} alt="" /> : null}{a.artist}</span> : null}
              {a?.artist ? <span className="sep" /> : null}
              <span>{tracks.length} 首</span>
              {a?.publishTime ? <><span className="sep" /><span>{formatDate(a.publishTime)} 发行</span></> : null}
              {a?.company ? <><span className="sep" /><span>{a.company}</span></> : null}
            </div>
            {a?.description ? <div className="detail-desc" title={a.description}>{a.description}</div> : null}
          </div>
        </div>
        <div className="action-bar">
          <button className="pill-btn primary" onClick={() => tracks.length && actions.playQueue(tracks, 0)}><IconPlay />播放全部</button>
        </div>
        {album.loading ? <Loading /> : null}
        {album.error ? <div className="err">加载失败:{album.error.message}</div> : null}
        {tracks.length > 0 ? (
          <div className="song-list">
            <div className="song-head">
              <span style={{ textAlign: 'center' }}>#</span>
              <span>标题</span>
              <span className="album-col">专辑</span>
              <span style={{ textAlign: 'right' }}>时长</span>
              <span style={{ textAlign: 'right', paddingRight: 8 }}>操作</span>
            </div>
            {tracks.map((t, i) => (
              <SongRow key={t.id} track={t} index={i} onPlay={() => actions.playQueue(tracks, i)} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ───────────── 歌手详情 ───────────── */

export function ArtistDetailPage({ params }) {
  const actions = usePlayerActions();
  const nav = useNav();
  const data = useAsync(() => api.artistDetail(params.id), [params.id]);
  const albums = useAsync(() => api.artistAlbums(params.id, 12), [params.id]);
  const artist = data.data?.artist;
  const songs = data.data?.hotSongs ?? [];
  return (
    <div className="page">
      <div className="detail">
        <div className="detail-bg">
          {artist?.cover ? <div className="img" style={{ backgroundImage: `url("${artist.cover}")` }} /> : null}
          <div className="fade" />
        </div>
        <div className="detail-head" style={{ alignItems: 'center' }}>
          <div className="detail-cover-wrap" style={{ borderRadius: '50%' }}>
            {artist?.cover ? <img className="detail-cover" style={{ borderRadius: '50%' }} src={artist.cover} alt="" /> : <div className="detail-cover" />}
          </div>
          <div className="detail-info">
            <span className="detail-kind">Artist</span>
            <div className="detail-name">{artist?.name ?? params.name}</div>
            <div className="detail-meta">
              {artist?.alias ? <span>{artist.alias}</span> : null}
              {artist?.alias ? <span className="sep" /> : null}
              <span>{artist?.musicSize ?? songs.length} 首歌曲</span>
              <span className="sep" />
              <span>{artist?.albumSize ?? 0} 张专辑</span>
            </div>
            {artist?.briefDesc ? <div className="detail-desc">{artist.briefDesc}</div> : null}
          </div>
        </div>
        <div className="action-bar">
          <button className="pill-btn primary" onClick={() => songs.length && actions.playQueue(songs, 0)}><IconPlay />播放热门歌曲</button>
        </div>
        {data.loading ? <Loading /> : null}
        {songs.length > 0 ? (
          <div className="song-list">
            <div className="song-head">
              <span style={{ textAlign: 'center' }}>#</span>
              <span>热门歌曲</span>
              <span className="album-col">专辑</span>
              <span style={{ textAlign: 'right' }}>时长</span>
              <span style={{ textAlign: 'right', paddingRight: 8 }}>操作</span>
            </div>
            {songs.map((t, i) => (
              <SongRow key={t.id} track={t} index={i} onPlay={() => actions.playQueue(songs, i)} />
            ))}
          </div>
        ) : null}

        {(albums.data?.items ?? []).length > 0 ? (
          <>
            <SectionHead title="专辑" />
            <div className="cover-grid">
              {albums.data.items.map((al) => (
                <CoverCard
                  key={al.id}
                  cover={al.cover}
                  name={al.name}
                  sub={al.publishTime ? formatDate(al.publishTime) : ''}
                  onClick={() => nav.nav('album', { id: al.id, name: al.name })}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

/* ───────────── 搜索 ───────────── */

const SEARCH_TYPES = [['song', '单曲'], ['playlist', '歌单'], ['album', '专辑'], ['artist', '歌手']];
const HISTORY_KEY = 'dsh-music.searchHistory.v2';

export function SearchPage({ initialKeyword }) {
  const nav = useNav();
  const [keyword, setKeyword] = useState(initialKeyword ?? '');
  const [submitted, setSubmitted] = useState(initialKeyword ?? '');
  const [type, setType] = useState('song');
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
  });
  const hot = useAsync(() => api.searchHot(), []);

  useEffect(() => {
    if (initialKeyword) {
      setKeyword(initialKeyword);
      setSubmitted(initialKeyword);
    }
  }, [initialKeyword]);

  const submit = (kw) => {
    const k = String(kw ?? '').trim();
    if (!k) return;
    setKeyword(k);
    setSubmitted(k);
    setType('song');
    setHistory((prev) => {
      const next = [k, ...prev.filter((h) => h !== k)].slice(0, 12);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  if (submitted) {
    return <SearchResult keyword={submitted} type={type} onType={setType} nav={nav} onBack={() => setSubmitted('')} />;
  }

  return (
    <div className="page">
      <div className="search-hero">
        <h1>搜索</h1>
        <div className="page-sub">歌曲、歌手、专辑、歌单,想听什么直接搜</div>
        <div className="search-box" style={{ width: 420, marginTop: 18, height: 44, background: 'var(--panel)' }}>
          <IconSearch />
          <input
            autoFocus
            placeholder="搜索音乐"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(keyword); }}
          />
        </div>
      </div>

      <SectionHead title="热搜榜" />
      <div className="hot-list">
        {(hot.data?.items ?? []).map((h, i) => (
          <div className="hot-row" key={h.keyword} onClick={() => submit(h.keyword)}>
            <span className="n">{i + 1}</span>
            <span className="k">{h.keyword}</span>
            <span className="s">{formatCount(h.score)}</span>
          </div>
        ))}
        {hot.loading ? <Loading /> : null}
      </div>

      {history.length > 0 ? (
        <>
          <SectionHead
            title="搜索历史"
            action={<button className="sec-more" onClick={() => { setHistory([]); localStorage.removeItem(HISTORY_KEY); }}>清空</button>}
          />
          <div className="history-chips">
            {history.map((h) => <button key={h} className="chip" onClick={() => submit(h)}>{h}</button>)}
          </div>
        </>
      ) : null}
    </div>
  );
}

function SearchResult({ keyword, type, onType, nav, onBack }) {
  const actions = usePlayerActions();
  const res = useAsync(() => api.search(keyword, type, 50), [keyword, type]);
  const items = res.data?.items ?? [];
  const songs = type === 'song' ? items : [];

  return (
    <div className="page">
      <div className="search-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="back-btn" onClick={onBack} title="返回"><IconArrowLeft /></button>
          <h1 style={{ fontSize: 26 }}>{keyword}</h1>
        </div>
        <div className="page-sub">{res.data?.total ? `共 ${formatCount(res.data.total)} 条结果` : '搜索结果'}</div>
      </div>
      <div className="chips" style={{ marginTop: 16 }}>
        {SEARCH_TYPES.map(([k, label]) => (
          <button key={k} className={`chip${type === k ? ' on' : ''}`} onClick={() => onType(k)}>{label}</button>
        ))}
      </div>

      {res.loading ? <Loading text="搜索中…" /> : null}
      {res.error ? <div className="err">搜索失败:{res.error.message}</div> : null}
      {!res.loading && items.length === 0 ? <Empty text="没有找到相关内容" icon={IconSearch} /> : null}

      {type === 'song' && songs.length > 0 ? (
        <>
          <div className="action-bar" style={{ position: 'static', background: 'transparent', backdropFilter: 'none', borderBottom: 'none' }}>
            <button className="pill-btn primary" onClick={() => actions.playQueue(songs, 0)}><IconPlay />播放全部</button>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>{songs.length} 首</span>
          </div>
          <div className="song-list">
            <div className="song-head">
              <span style={{ textAlign: 'center' }}>#</span>
              <span>标题</span>
              <span className="album-col">专辑</span>
              <span style={{ textAlign: 'right' }}>时长</span>
              <span style={{ textAlign: 'right', paddingRight: 8 }}>操作</span>
            </div>
            {songs.map((t, i) => (
              <SongRow key={t.id} track={t} index={i} onPlay={() => actions.playQueue(songs, i)} />
            ))}
          </div>
        </>
      ) : null}

      {type === 'playlist' && items.length > 0 ? (
        <div className="cover-grid">
          {items.map((p) => (
            <PlaylistCard
              key={p.id}
              item={p}
              onOpen={() => nav.nav('musiclist', { kind: 'playlist', id: p.id, name: p.name, cover: p.cover })}
            />
          ))}
        </div>
      ) : null}

      {type === 'album' && items.length > 0 ? (
        <div className="cover-grid">
          {items.map((a) => (
            <CoverCard key={a.id} cover={a.cover} name={a.name} sub={a.artist} onClick={() => nav.nav('album', { id: a.id, name: a.name })} />
          ))}
        </div>
      ) : null}

      {type === 'artist' && items.length > 0 ? (
        <div className="cover-grid">
          {items.map((a) => (
            <CoverCard key={a.id} cover={a.cover} name={a.name} sub={`${a.musicSize || 0} 首歌曲`} round onClick={() => nav.nav('artist', { id: a.id, name: a.name })} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ───────────── 我的 ───────────── */

export function UserPage() {
  const nav = useNav();
  const favorites = usePlayerSelector((s) => s.favorites);
  const history = usePlayerSelector((s) => s.history);
  const { account, status } = useAccount();
  const playlists = useAsync(() => (account?.loggedIn ? api.userPlaylists(24) : Promise.resolve({ items: [] })), [account?.loggedIn]);

  return (
    <div className="page">
      <div className="page-title">我的音乐</div>
      <div className="account-card">
        {account?.avatar ? <img className="av" src={account.avatar} alt="" /> : <div className="av" />}
        <div className="grow">
          <div className="n">{account?.loggedIn ? account.nickname : '未登录'}</div>
          <div className="d">
            {account?.loggedIn
              ? `${account.cookieSource === 'config' ? '登录态来自插件配置' : '已登录网易云账号'}${account.vipType ? ' · 会员' : ''}`
              : status === 'loading' ? '正在检测登录状态…' : '登录后可同步每日推荐、私人 FM 与喜欢的音乐'}
          </div>
        </div>
        {account?.loggedIn ? (
          <button className="ghost-btn" onClick={() => nav.nav('settings')}>账号设置</button>
        ) : (
          <button className="pill-btn primary" onClick={() => nav.nav('settings')}>去登录</button>
        )}
      </div>

      <div className="cover-grid" style={{ marginTop: 22 }}>
        <CoverCard
          cover={favorites[0]?.cover ?? ''}
          name="我喜欢的音乐"
          sub={`${favorites.length} 首`}
          onClick={() => nav.nav('musiclist', { kind: 'favorite', name: '我喜欢的音乐' })}
        />
        <CoverCard
          cover={history[0]?.cover ?? ''}
          name="最近播放"
          sub={`${history.length} 首`}
          onClick={() => nav.nav('musiclist', { kind: 'history', name: '最近播放' })}
        />
      </div>

      {account?.loggedIn ? (
        <>
          <SectionHead title="我的歌单" />
          {playlists.loading ? <SkeletonGrid n={5} /> : (
            <div className="cover-grid">
              {(playlists.data?.items ?? []).map((p) => (
                <PlaylistCard
                  key={p.id}
                  item={p}
                  onOpen={() => nav.nav('musiclist', { kind: 'playlist', id: p.id, name: p.name, cover: p.cover })}
                />
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

/* ───────────── 设置 ───────────── */

const VIP_NAMES = { 0: '', 10: '普通会员', 11: '豪华会员' };

function LoginPanel() {
  const { status, account } = useAccount();
  const [qr, setQr] = useState(null);
  const [busy, setBusy] = useState(false);
  const timerRef = useRef(null);

  const stopPoll = () => { clearInterval(timerRef.current); timerRef.current = null; };
  useEffect(() => () => stopPoll(), []);

  const poll = async (key) => {
    let r;
    try {
      r = await api.qrCheck(key);
    } catch {
      return; // 单次轮询失败忽略,下个周期重试
    }
    if (r.code === 803) {
      stopPoll();
      if (r.ok) {
        setQr(null);
        await refreshAccount();
      } else {
        setQr((q) => ({ ...q, state: 'error', message: r.message ?? '登录未完成' }));
      }
      return;
    }
    if (r.code === 800) {
      stopPoll();
      setQr((q) => ({ ...q, state: 'expired', message: r.message ?? '二维码已过期' }));
      return;
    }
    setQr((q) => (q ? { ...q, state: r.code === 802 ? 'scanned' : 'active', message: r.message ?? q.message } : q));
  };

  const startLogin = async () => {
    stopPoll();
    setBusy(true);
    try {
      const { key } = await api.qrKey();
      const { qrimg, qrurl } = await api.qrCreate(key);
      if (!qrimg) throw new Error('接口未返回二维码');
      setQr({ img: qrimg, url: qrurl ?? '', key, state: 'active', message: '等待扫码' });
      timerRef.current = setInterval(() => poll(key), 2500);
    } catch (e) {
      setQr({ state: 'error', message: `获取二维码失败:${e.message}` });
    } finally {
      setBusy(false);
    }
  };

  const doLogout = async () => {
    setBusy(true);
    try {
      await api.logout();
      await refreshAccount();
    } finally {
      setBusy(false);
    }
  };

  const loggedIn = account?.loggedIn;
  const failed = qr && (qr.state === 'expired' || qr.state === 'error');

  return (
    <>
      <div className="account-card" style={{ marginTop: 4 }}>
        {loggedIn && account.avatar ? <img className="av" src={account.avatar} alt="" /> : <div className="av" />}
        <div className="grow">
          <div className="n">
            {status === 'loading' ? '检测中…' : loggedIn ? account.nickname : '未登录'}
          </div>
          <div className="d">
            {loggedIn
              ? `已登录${account.cookieSource === 'config' ? '(取自插件配置)' : ''}${VIP_NAMES[account.vipType] ? ` · ${VIP_NAMES[account.vipType]}` : ''}`
              : '扫码登录后可同步每日推荐、私人 FM 与 VIP 试听'}
          </div>
        </div>
        {status === 'ready' ? (
          loggedIn ? <button className="ghost-btn" onClick={doLogout} disabled={busy}>退出登录</button>
            : <button className="pill-btn primary" onClick={startLogin} disabled={busy}>{busy ? '获取二维码…' : '扫码登录'}</button>
        ) : null}
      </div>

      {qr ? (
        <div className="qr-panel">
          {qr.img ? <img src={qr.img} alt="网易云登录二维码" className={failed ? 'dim' : ''} /> : null}
          <div className={`qr-msg${failed ? ' expired' : qr.state === 'scanned' ? ' scanned' : ''}`}>{qr.message}</div>
          {qr.img ? <div className="qr-tip">{qr.state === 'scanned' ? '在手机上点确认即可自动完成登录' : '打开网易云音乐 App 扫一扫'}</div> : null}
          {failed ? <button className="ghost-btn" onClick={startLogin} disabled={busy}>重新获取二维码</button>
            : qr.state === 'active' ? <button className="ghost-btn" onClick={() => { stopPoll(); setQr(null); }}>取消</button> : null}
          {qr.url && failed ? <a className="qr-link" style={{ fontSize: 11.5, color: '#4d7cff' }} href={qr.url} target="_blank" rel="noreferrer">在浏览器中打开授权页</a> : null}
        </div>
      ) : null}
    </>
  );
}

const LEVELS = [['standard', '标准'], ['exhigh', '较高'], ['higher', '高'], ['lossless', '无损']];
const RATES = [0.75, 1, 1.25, 1.5];

function formatSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—';
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** 存储:把宿主的下载目录摊开给用户看,并支持在文件管理器里打开/定位到具体文件。 */
function StoragePanel() {
  const nav = useNav();
  const [state, setState] = useState({ loading: true, data: null, error: null });

  const load = () => {
    setState((prev) => ({ ...prev, loading: true }));
    api.downloadInfo()
      .then((data) => setState({ loading: false, data, error: null }))
      .catch((error) => setState({ loading: false, data: null, error }));
  };
  useEffect(load, []);

  const open = (name) => {
    api.openDownloadDir(name).catch((error) => nav.toast(`打开失败:${error.message}`, 'err'));
  };

  const data = state.data;
  const items = data?.items ?? [];

  return (
    <div className="set-section">
      <SectionHead title="下载" />
      <div className="set-row">
        <div className="lab">
          <div className="t">下载目录</div>
          <div className="d">
            <span className="path">{data?.dir ?? '读取中…'}</span>
            <br />
            歌曲由宿主直接落盘到这里。要换位置请修改插件配置 <code>downloadDir</code>(绝对路径)。
          </div>
        </div>
        <button className="ghost-btn" onClick={() => open()} disabled={state.loading}>打开目录</button>
      </div>

      <div className="dl-head">
        <span className="t">最近下载</span>
        <span className="n">{data?.total ? `共 ${data.total} 个音频文件` : ''}</span>
        <span className="grow" />
        <button className="ghost-btn sm" onClick={load} disabled={state.loading}>
          {state.loading ? '刷新中…' : '刷新'}
        </button>
      </div>

      {state.error ? <div className="dl-empty">读取下载目录失败:{state.error.message}</div> : null}
      {!state.error && !state.loading && items.length === 0 ? (
        <div className="dl-empty">
          {data?.exists ? '目录里还没有音频文件,挑一首歌点下载试试' : '还没下载过歌曲,首次下载会自动创建该目录'}
        </div>
      ) : null}

      <div className="dl-list">
        {items.map((it) => (
          <div className="dl-item" key={it.path}>
            <span className="n" title={it.path}>
              {it.name}
              {it.trial ? <em>试听</em> : null}
            </span>
            <span className="m">{formatSize(it.sizeBytes)} · {formatDate(it.mtime)}</span>
            <button className="ghost-btn sm" onClick={() => open(it.name)}>定位</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsPage({ theme, setTheme, menuExpanded, setMenuExpanded }) {
  const snap = usePlayer();
  const actions = usePlayerActions();
  const [tab, setTab] = useState('basic');
  const TABS = [['basic', '账号'], ['playback', '播放'], ['appearance', '外观'], ['storage', '存储'], ['about', '关于']];

  return (
    <div className="page settings">
      <div className="page-title">设置</div>
      <div className="set-tabs">
        {TABS.map(([k, label]) => (
          <button key={k} className={`chip${tab === k ? ' on' : ''}`} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>

      {tab === 'basic' ? (
        <div className="set-section">
          <SectionHead title="网易云账号" />
          <LoginPanel />
          <div className="set-row">
            <div className="lab">
              <div className="t">登录态存储</div>
              <div className="d">扫码成功后 Cookie 保存在 ~/.dsh/music-cookie.json,重启后仍然有效;退出登录会清除该文件。</div>
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'playback' ? (
        <div className="set-section">
          <SectionHead title="播放" />
          <div className="set-row">
            <div className="lab"><div className="t">默认音质</div><div className="d">音频代理的默认码率;更高音质需要登录账号与会员</div></div>
            <div className="seg">
              {LEVELS.map(([lv, label]) => (
                <button key={lv} className={(snap.level ?? 'standard') === lv ? 'on' : ''} onClick={() => actions.setLevel(lv)}>{label}</button>
              ))}
            </div>
          </div>
          <div className="set-row">
            <div className="lab"><div className="t">播放速度</div><div className="d">变速播放只影响当前会话</div></div>
            <div className="seg">
              {RATES.map((r) => (
                <button key={r} className={snap.rate === r ? 'on' : ''} onClick={() => actions.setRate(r)}>{r}x</button>
              ))}
            </div>
          </div>
          <div className="set-row">
            <div className="lab"><div className="t">播放模式</div><div className="d">列表循环 / 单曲循环 / 随机播放</div></div>
            <div className="seg">
              {[['loop', '列表'], ['one', '单曲'], ['shuffle', '随机']].map(([m, label]) => (
                <button key={m} className={snap.mode === m ? 'on' : ''} onClick={() => actions.setMode(m)}>{label}</button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'appearance' ? (
        <div className="set-section">
          <SectionHead title="外观" />
          <div className="set-row">
            <div className="lab"><div className="t">主题</div><div className="d">深色与浅色两套配色,与 AlgerMusicPlayer 保持一致</div></div>
            <div className="seg">
              <button className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')}>深色</button>
              <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}>浅色</button>
            </div>
          </div>
          <div className="set-row">
            <div className="lab"><div className="t">展开侧边菜单</div><div className="d">展开后菜单显示文字,收起时仅显示图标</div></div>
            <div className={`switch${menuExpanded ? ' on' : ''}`} onClick={() => setMenuExpanded(!menuExpanded)}><i /></div>
          </div>
        </div>
      ) : null}

      {tab === 'storage' ? <StoragePanel /> : null}

      {tab === 'about' ? (
        <div className="set-section">
          <SectionHead title="关于" />
          <div className="set-row">
            <div className="lab">
              <div className="t">DSH Music 1.0.3</div>
              <div className="d">
                界面复刻自 AlgerMusicPlayer 5.1(MIT),数据来自网易云音乐开放接口(社区维护)。
                音乐版权归网易云及版权方所有,仅供个人学习研究,请勿用于商业用途。
              </div>
            </div>
          </div>
          <div className="set-row">
            <div className="lab">
              <div className="t">宿主路由</div>
              <div className="d">/music/api/* 数据接口,/music/stream/:id 音频流代理(支持 Range)。</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
