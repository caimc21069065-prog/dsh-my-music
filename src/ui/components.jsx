// src/ui/components.jsx — 共享组件:歌曲行 / 封面卡 / 播放条 / 播放列表抽屉 / 沉浸式播放页
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { api, formatCount, formatTime } from './api.js';
import {
  usePlayer, usePlayerSelector, usePlayerActions, useLyric, useFavoriteState, useIsCurrent
} from './player.jsx';
import { useNav } from './nav.jsx';
import {
  IconPlay, IconPause, IconPrev, IconNext, IconVolume, IconVolumeLow, IconMute, IconRepeat, IconOne,
  IconShuffle, IconHeart, IconQueue, IconClose, IconTrash, IconDownload, IconCheck, IconChevronDown,
  IconChevronUp, IconMusic, IconPlayFill, IconSpinner, IconLyric, IconUser
} from './icons.jsx';

const MODE_ICON = { loop: IconRepeat, one: IconOne, shuffle: IconShuffle };
const MODE_LABEL = { loop: '列表循环', one: '单曲循环', shuffle: '随机播放' };

/* ───────────── 进度条 ───────────── */

/**
 * 播放进度条。
 *
 * 交互层是一个铺满的透明原生 <input type="range">:点按/拖动/键盘都由浏览器内建控件处理,
 * 不依赖 React 合成事件或自定义 pointer 监听。DSH 宿主会在 document/window 上挂指针监听
 * (输入模态、点击外部关闭浮层),之前用元素级 pointerdown 的实现在宿主里收不到事件,
 * 表现就是「进度条点不动」;原生 range 走浏览器内部逻辑,不受这层影响。
 */
export const SEEK_BUILD = '1.0.3';

export function SeekBar({ position, duration, canSeek = true, onSeek, showHint = true, className = '' }) {
  const ref = useRef(null);
  const [hoverPct, setHoverPct] = useState(null);
  const [dragValue, setDragValue] = useState(null);
  const dragTimer = useRef(null);
  const seekTimer = useRef(null);
  const lastSeekAt = useRef(0);

  const max = duration > 0 ? duration : 0;
  const interactive = max > 0 || canSeek;
  const shown = dragValue !== null ? dragValue : Math.min(position, max || 0);
  const pct = max > 0 ? Math.min((shown / max) * 100, 100) : 0;

  const latest = useRef({ onSeek, max });
  latest.current = { onSeek, max };

  useEffect(() => () => {
    clearTimeout(dragTimer.current);
    clearTimeout(seekTimer.current);
  }, []);

  const ratioOf = (clientX) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || !rect.width) return 0;
    return Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
  };

  /** 拖动过程中节流 seek:既能看到画面跟随,又不会每个像素都打一次音频请求。 */
  const scheduleSeek = (value) => {
    setDragValue(value);
    clearTimeout(dragTimer.current);
    dragTimer.current = setTimeout(() => setDragValue(null), 900);
    const wait = Math.max(0, 120 - (Date.now() - lastSeekAt.current));
    clearTimeout(seekTimer.current);
    seekTimer.current = setTimeout(() => {
      lastSeekAt.current = Date.now();
      latest.current.onSeek(value);
    }, wait);
  };

  const commit = () => {
    clearTimeout(seekTimer.current);
    if (dragValue !== null) {
      lastSeekAt.current = Date.now();
      latest.current.onSeek(dragValue);
    }
    setDragValue(null);
  };

  const onKeyDown = (e) => {
    const step = { ArrowLeft: -5, ArrowRight: 5, PageDown: -15, PageUp: 15 }[e.key];
    const target = e.key === 'Home' ? 0 : e.key === 'End' ? max - 1 : step === undefined ? null : shown + step;
    if (target === null) return;
    e.preventDefault();
    onSeek(Math.min(Math.max(target, 0), Math.max(max - 0.5, 0)));
  };

  return (
    <div
      ref={ref}
      className={`pb-progress${dragValue !== null ? ' dragging' : ''}${interactive ? '' : ' off'} ${className}`}
      title={interactive ? `点击或拖动调整进度 (v${SEEK_BUILD})` : '进度暂不可调整(音频未就绪)'}
      onPointerMove={(e) => { if (interactive) setHoverPct(ratioOf(e.clientX)); }}
      onPointerLeave={() => setHoverPct(null)}
    >
      <div className="track">
        <div className="fill" style={{ width: `${pct}%` }} />
        <div className="knob" style={{ left: `${pct}%` }} />
      </div>
      <input
        className="pb-range"
        type="range"
        min={0}
        max={max || 1}
        step={0.1}
        value={Math.min(shown, max || 1)}
        disabled={!interactive}
        aria-label="播放进度"
        onChange={(e) => scheduleSeek(Number(e.target.value))}
        onPointerUp={commit}
        onPointerCancel={commit}
        onBlur={commit}
        onKeyDown={onKeyDown}
        onKeyUp={commit}
      />
      {showHint && hoverPct !== null && max > 0 ? (
        <span className="hint" style={{ left: `${hoverPct * 100}%` }}>{formatTime(hoverPct * max)}</span>
      ) : null}
    </div>
  );
}

/** 自绘竖向滑块:pointer capture 支持拖动与点按(原生竖向 range 在 Chromium 里拖拽不可靠)。 */
export function VerticalSlider({ value, onChange }) {
  const ref = useRef(null);
  const drag = useRef(false);
  const apply = (e) => {
    const rect = ref.current.getBoundingClientRect();
    onChange(Math.min(Math.max(1 - (e.clientY - rect.top) / rect.height, 0), 1));
  };
  return (
    <div
      ref={ref}
      className="vslider"
      onPointerDown={(e) => { drag.current = true; try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* 合成事件无活动指针 */ } apply(e); }}
      onPointerMove={(e) => { if (drag.current) apply(e); }}
      onPointerUp={() => { drag.current = false; }}
      onPointerCancel={() => { drag.current = false; }}
    >
      <div className="fill" style={{ height: `${value * 100}%` }} />
      <div className="knob" style={{ bottom: `calc(${value * 100}% - 6px)` }} />
    </div>
  );
}

/* ───────────── 下载 ───────────── */

export function DownloadButton({ track, level, className = '', menuItem = false, onStart }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useNav();
  const start = async (e) => {
    e?.stopPropagation?.();
    if (busy) return;
    onStart?.();
    setBusy(true);
    // 解析直链 + 落盘要好几秒,先给个即时反馈,否则用户会以为点了没反应
    toast(`开始下载:${track.name}`, '');
    try {
      const r = await api.download({ id: track.id, name: track.name, artist: track.artist, level });
      setDone(true);
      const fileName = r.fileName || String(r.path).split(/[\\/]/).pop();
      // 目录名一并报出来,用户才知道「歌存哪了」;点一下就能在文件管理器里定位
      const dirName = String(r.dir ?? '').split(/[\\/]/).filter(Boolean).pop() || '下载目录';
      const hint = r.trial ? '(试听片段)' : '';
      toast(`已保存到「${dirName}」${hint}:${fileName}`, 'ok', {
        label: '打开目录',
        onClick: () => api.openDownloadDir(fileName).catch(() => {})
      });
    } catch (error) {
      toast(`下载失败:${error.message}`, 'err');
    } finally {
      setBusy(false);
    }
  };
  if (menuItem) {
    return (
      <button className="ctx-item" onClick={start} disabled={busy}>
        {busy ? <IconSpinner className="spinner" /> : done ? <IconCheck /> : <IconDownload />}
        <span>{busy ? '下载中…' : done ? '已下载' : '下载'}</span>
      </button>
    );
  }
  return (
    <button
      className={`icon-btn sm ${className}${done ? ' on' : ''}`}
      onClick={start}
      title={done ? '已下载' : '下载'}
    >
      {busy ? <IconSpinner className="spinner" /> : done ? <IconCheck /> : <IconDownload />}
    </button>
  );
}

/* ───────────── 歌曲行 ───────────── */

/** 歌单/专辑/搜索共用的标准歌曲行。track 结构见宿主 normalizeSong。 */
export function SongRow({ track, index, onPlay, showAlbum = true, onRemove, extraOps }) {
  const actions = usePlayerActions();
  const nav = useNav();
  const fav = useFavoriteState(track.id);
  const isCurrent = useIsCurrent(track.id);
  const playing = usePlayerSelector((s) => s.playing);
  const level = usePlayerSelector((s) => s.level);
  const sounding = isCurrent && playing;
  const [hover, setHover] = useState(false);
  const [menu, setMenu] = useState(null);
  const dur = track.duration ? formatTime(track.duration / 1000) : '';

  const play = () => {
    if (onPlay) onPlay();
    else actions.addToQueue(track, true);
  };

  return (
    <div
      className={`song-row${isCurrent ? ' playing' : ''}`}
      onDoubleClick={play}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onContextMenu={(e) => {
        e.preventDefault();
        const x = Math.min(e.clientX, window.innerWidth - 210);
        const y = Math.min(e.clientY, window.innerHeight - 286);
        setMenu({ x, y });
      }}
    >
      <span className="idx">
        {hover || isCurrent
          ? <button className="icon-btn sm" onClick={play} title={sounding ? '暂停' : '播放'}>
            {sounding ? <IconPause /> : <IconPlay />}
          </button>
          : (index ?? 0) + 1}
      </span>
      <span className="song-main">
        {track.cover ? <img className="song-cover" src={track.cover} alt="" loading="lazy" /> : <span className="song-cover" />}
        <span className="song-text">
          <span className="song-name">
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.name}</span>
            {track.alias ? <span className="alias">({track.alias})</span> : null}
            {track.fee === 1 ? <span className="song-vip">VIP</span> : null}
          </span>
          <span className="song-artist">
            {(track.artists?.length ? track.artists : [{ id: 0, name: track.artist }]).map((a, i) => (
              <React.Fragment key={`${a.id}-${i}`}>
                {i > 0 ? <span>/</span> : null}
                <span
                  className={a.id ? 'link' : ''}
                  onClick={(e) => { if (a.id) { e.stopPropagation(); nav.nav('artist', { id: a.id, name: a.name }); } }}
                >{a.name}</span>
              </React.Fragment>
            ))}
          </span>
        </span>
      </span>
      {showAlbum ? (
        <span
          className="song-album"
          title={track.album}
          onClick={(e) => { e.stopPropagation(); if (track.albumId) nav.nav('album', { id: track.albumId, name: track.album }); }}
        >{track.album || '—'}</span>
      ) : <span />}
      <span className="song-dur">{dur}</span>
      <span className="song-ops">
        <button
          className={`icon-btn sm${fav ? ' on' : ''}`}
          style={fav ? { color: '#ef4444' } : undefined}
          onClick={(e) => { e.stopPropagation(); actions.toggleFavorite(track); }}
          title={fav ? '取消收藏' : '收藏'}
        >
          <IconHeart filled={fav} />
        </button>
        <DownloadButton track={track} level={level} />
        <button
          className="icon-btn sm"
          onClick={(e) => { e.stopPropagation(); actions.playNext(track); nav.toast(`已加入下一首播放:${track.name}`, 'ok'); }}
          title="下一首播放"
        >
          <IconNext />
        </button>
        {extraOps}
        <button className="song-op-play" onClick={(e) => { e.stopPropagation(); play(); }} title={sounding ? '暂停' : '播放'}>
          {sounding ? <IconPause /> : <IconPlay />}
        </button>
      </span>
      {menu ? (
        <SongContextMenu
          track={track}
          menu={menu}
          onClose={() => setMenu(null)}
          onPlay={play}
          onRemove={onRemove}
        />
      ) : null}
    </div>
  );
}

/** 歌曲右键菜单(复刻 SongItemDropdown 的常用项) */
function SongContextMenu({ track, menu, onClose, onPlay, onRemove }) {
  const actions = usePlayerActions();
  const nav = useNav();
  const snap = usePlayer();
  const fav = useFavoriteState(track.id);
  const item = (label, onClick, icon) => (
    <button className="ctx-item" onClick={() => { onClick(); onClose(); }}>
      {icon}<span>{label}</span>
    </button>
  );
  return (
    <>
      <div className="ctx-mask" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <div className="ctx-menu" style={{ left: menu.x, top: menu.y }} onClick={(e) => e.stopPropagation()}>
        {item('播放', onPlay, <IconPlay />)}
        {item('下一首播放', () => { actions.playNext(track); nav.toast(`已加入下一首播放:${track.name}`, 'ok'); }, <IconNext />)}
        {item(fav ? '取消收藏' : '收藏', () => actions.toggleFavorite(track), <IconHeart filled={fav} />)}
        <div className="ctx-sep" />
        {track.albumId ? item('查看专辑', () => nav.nav('album', { id: track.albumId, name: track.album }), <IconMusic />) : null}
        {track.artists?.[0]?.id ? item('查看歌手', () => nav.nav('artist', { id: track.artists[0].id, name: track.artists[0].name }), <IconUser />) : null}
        <div className="ctx-sep" />
        <DownloadButton track={track} level={snap.level} menuItem onStart={onClose} />
        {onRemove ? item('从列表移除', onRemove, <IconTrash />) : null}
      </div>
    </>
  );
}

/** 播放队列 / 历史记录里的紧凑行 */
export function MiniSongRow({ track, index, active, onPlay, onRemove }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className={`qp-item${active ? ' playing' : ''}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onPlay}
    >
      <span style={{ width: 18, textAlign: 'center', fontSize: 11, color: 'var(--muted-2)', flexShrink: 0 }}>
        {hover ? <IconPlay style={{ width: 13, height: 13 }} /> : (index ?? 0) + 1}
      </span>
      {track.cover ? <img className="cv" src={track.cover} alt="" loading="lazy" /> : <span className="cv" />}
      <span className="meta">
        <span className="t">{track.name}</span>
        <span className="a">{track.artist}</span>
      </span>
      {onRemove ? (
        <button className="icon-btn sm del" onClick={(e) => { e.stopPropagation(); onRemove(); }} title="移除">
          <IconClose />
        </button>
      ) : null}
    </div>
  );
}

/* ───────────── 封面卡片 ───────────── */

export function CoverCard({
  cover, name, sub, playCount, updateFrequency, onClick, onPlay, tracks, round, badge
}) {
  const hoverable = Array.isArray(tracks) && tracks.length > 0;
  return (
    <div className={`cover-card${round ? ' round' : ''}`} onClick={onClick}>
      <div className="thumb">
        {cover ? <img src={cover} alt="" loading="lazy" /> : <div className="ph"><IconMusic /></div>}
        <div className="veil" />
        {hoverable ? (
          <div className="hover-tracks">
            {tracks.slice(0, 3).map((t, i) => (
              <div className="hover-track" key={`${t.id}-${i}`}>
                <span className="n">{i + 1}</span>
                <span className="t">{t.name}</span>
              </div>
            ))}
          </div>
        ) : null}
        {onPlay ? (
          <button className="hover-play-btn" onClick={(e) => { e.stopPropagation(); onPlay(); }} title="播放">
            <IconPlayFill />
          </button>
        ) : (
          <span className="thumb-play"><IconPlay /></span>
        )}
        {playCount ? <span className="badge play"><IconPlayFill />{formatCount(playCount)}</span> : null}
        {updateFrequency ? <span className="badge time">{updateFrequency}</span> : null}
        {badge ? <span className="badge play" style={{ opacity: 1 }}>{badge}</span> : null}
      </div>
      <div className="cap">
        <div className="t" title={name}>{name}</div>
        {sub ? <div className="s" title={sub}>{sub}</div> : null}
      </div>
    </div>
  );
}

export function SectionHead({ title, onMore, moreText = '更多', action }) {
  return (
    <div className="sec-head">
      <div className="sec-title">{title}<span className="dot" /></div>
      {action ?? (onMore ? (
        <button className="sec-more" onClick={onMore}>
          {moreText}<IconChevronRightMini />
        </button>
      ) : null)}
    </div>
  );
}

const IconChevronRightMini = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="m9 5.6 6.4 6.4L9 18.4" />
  </svg>
);

export function SkeletonGrid({ n = 10 }) {
  return (
    <div className="cover-grid">
      {Array.from({ length: n }, (_, i) => (
        <div key={i}>
          <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 16 }} />
          <div className="skeleton" style={{ height: 14, width: '70%', marginTop: 12, borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 12, width: '45%', marginTop: 8, borderRadius: 6 }} />
        </div>
      ))}
    </div>
  );
}

export function Empty({ text = '这里空空如也', icon: Icon = IconMusic }) {
  return <div className="empty"><Icon /><span>{text}</span></div>;
}

export function Loading({ text = '加载中…' }) {
  return <div className="loading-row"><IconSpinner className="spinner" />{text}</div>;
}

/* ───────────── 底部播放条 ───────────── */

export function PlayBar() {
  const snap = usePlayer();
  const actions = usePlayerActions();
  const nav = useNav();
  const [volOpen, setVolOpen] = useState(false);
  const barRef = useRef(null);
  const track = snap.index >= 0 ? snap.queue[snap.index] : null;
  const fav = useFavoriteState(track?.id ?? 0);

  if (!track) {
    return <div className="playbar idle">播放列表是空的,去挑一首歌吧</div>;
  }
  const ModeIcon = MODE_ICON[snap.mode] ?? IconRepeat;
  const volIcon = snap.muted || snap.volume === 0 ? <IconMute /> : snap.volume < 0.5 ? <IconVolumeLow /> : <IconVolume />;

  const onBarClick = (e) => {
    if (e.target.closest('.pb-buttons, .pb-side, .pb-progress, .pb-cover-wrap, .volume-wrap')) return;
    nav.openFull();
  };

  return (
    <div className="playbar" ref={barRef} onClick={onBarClick}>
      <SeekBar position={snap.position} duration={snap.duration} canSeek={snap.canSeek} onSeek={actions.seek} />
      <div className="pb-cover-wrap" onClick={() => nav.openFull()} title="展开播放详情">
        {track.cover ? <img className="pb-cover" src={track.cover} alt="" /> : <div className="pb-cover" />}
        {snap.loading ? <div className="pb-loading"><IconSpinner /></div> : null}
        <div className="arrow">
          <IconChevronUp />
          <span>展开</span>
        </div>
      </div>
      <div className="pb-meta">
        <div className="t">
          <span className="txt" title={track.name}>{track.name}</span>
          {snap.rate !== 1 ? <span className="pb-rate">{snap.rate}x</span> : null}
        </div>
        <div className={`a${snap.errorNote ? ' err' : ''}`} title={snap.errorNote || track.artist}>
          {snap.errorNote ?? (track.artists?.length
            ? track.artists.map((a, i) => (
              <React.Fragment key={a.id}>
                {i > 0 ? ' / ' : ''}
                <span className="link" onClick={(e) => { e.stopPropagation(); if (a.id) nav.nav('artist', { id: a.id, name: a.name }); }}>{a.name}</span>
              </React.Fragment>
            ))
            : track.artist)}
        </div>
      </div>
      <div className="pb-buttons">
        <button className="icon-btn" onClick={actions.prevSong} title="上一首"><IconPrev /></button>
        <button className="pb-play" onClick={actions.togglePlay} title={snap.playing ? '暂停' : '播放'}>
          {snap.playing ? <IconPause /> : <IconPlay />}
        </button>
        <button className="icon-btn" onClick={() => actions.nextSong()} title="下一首"><IconNext /></button>
      </div>
      <span className="pb-time">{formatTime(snap.position)} / {formatTime(snap.duration)}</span>
      <div className="pb-side">
        <div
          className="volume-wrap"
          onMouseEnter={() => setVolOpen(true)}
          onMouseLeave={() => setVolOpen(false)}
          onWheel={(e) => {
            e.preventDefault();
            actions.setVolume(snap.volume + (e.deltaY < 0 ? 0.05 : -0.05));
          }}
        >
          <button className="icon-btn" onClick={actions.toggleMute} title="静音">{volIcon}</button>
          {volOpen ? (
            <div className="volume-pop">
              <span className="pct">{Math.round((snap.muted ? 0 : snap.volume) * 100)}%</span>
              <VerticalSlider value={snap.muted ? 0 : snap.volume} onChange={actions.setVolume} />
            </div>
          ) : null}
        </div>
        <button className="icon-btn" onClick={actions.cycleMode} title={MODE_LABEL[snap.mode]}><ModeIcon /></button>
        <button
          className={`icon-btn${fav ? ' on' : ''}`}
          style={fav ? { color: '#ef4444' } : undefined}
          onClick={() => actions.toggleFavorite(track)}
          title="喜欢"
        >
          <IconHeart filled={fav} />
        </button>
        <DownloadButton track={track} level={snap.level} />
        <button className="icon-btn" onClick={() => nav.openQueue()} title="播放列表"><IconQueue /></button>
      </div>
    </div>
  );
}

/* ───────────── 播放列表抽屉 ───────────── */

export function PlayingListDrawer({ open, onClose }) {
  const snap = usePlayer();
  const actions = usePlayerActions();
  const [confirm, setConfirm] = useState(false);
  if (!open) return null;
  return (
    <>
      <div className="drawer-mask" onClick={onClose} />
      <div className="queue-panel">
        <div className="qp-head">
          <span className="title">播放列表</span>
          <span className="n">({snap.queue.length})</span>
          <span className="grow" />
          <button className="icon-btn sm" title="清空列表" onClick={() => setConfirm(true)}><IconTrash /></button>
          <button className="icon-btn sm" title="关闭" onClick={onClose}><IconClose /></button>
        </div>
        <div className="qp-list">
          {snap.queue.length === 0 ? <Empty text="播放列表是空的" /> : null}
          {snap.queue.map((track, i) => (
            <MiniSongRow
              key={`${track.id}-${i}`}
              track={track}
              index={i}
              active={i === snap.index}
              onPlay={() => actions.playTrack(i)}
              onRemove={() => actions.removeFromQueue(i)}
            />
          ))}
        </div>
      </div>
      <Confirm
        open={confirm}
        title="清空播放列表"
        text="清空后当前播放也会停止,确定继续吗?"
        okText="清空"
        danger
        onCancel={() => setConfirm(false)}
        onOk={() => { actions.clearQueue(); setConfirm(false); }}
      />
    </>
  );
}

/* ───────────── 沉浸式播放页 ───────────── */

export function MusicFull({ open, onClose }) {
  const snap = usePlayer();
  const actions = usePlayerActions();
  const nav = useNav();
  const track = snap.index >= 0 ? snap.queue[snap.index] : null;
  const lyric = useLyric(track?.id);
  const boxRef = useRef(null);
  const [showTrans, setShowTrans] = useState(true);
  const [fontScale, setFontScale] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const fav = useFavoriteState(track?.id ?? 0);

  const activeIndex = useMemo(() => {
    if (!lyric.lines.length) return -1;
    let idx = -1;
    for (let i = 0; i < lyric.lines.length; i++) {
      if (lyric.lines[i].time <= snap.position + 0.15) idx = i;
      else break;
    }
    return idx;
  }, [lyric.lines, snap.position]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const el = box.querySelector('.lyric-line.on');
    if (el) box.scrollTop = Math.max(0, el.offsetTop - box.clientHeight * 0.42);
  }, [activeIndex, lyric.lines.length]);

  if (!open || !track) return null;
  const transByTime = new Map(lyric.translation.map((l) => [Math.round(l.time * 10) / 10, l.text]));
  const ModeIcon = MODE_ICON[snap.mode] ?? IconRepeat;

  return (
    <div className="music-full">
      {track.cover ? <div className="mf-bg" style={{ backgroundImage: `url("${track.cover}")` }} /> : null}
      <div className="mf-veil" />
      <div className="mf-top">
        <button className="icon-btn" onClick={onClose} title="收起"><IconChevronDown /></button>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={() => setSettingsOpen((v) => !v)} title="歌词设置"><IconLyric /></button>
            {settingsOpen ? (
              <div className="modal" style={{ position: 'absolute', right: 0, top: 44, width: 250, zIndex: 5 }}>
                <h3 style={{ fontSize: 14 }}>歌词设置</h3>
                <div className="set-row" style={{ minHeight: 48, borderBottom: 'none' }}>
                  <div className="lab"><div className="t">显示翻译</div></div>
                  <div className={`switch${showTrans ? ' on' : ''}`} onClick={() => setShowTrans((v) => !v)}><i /></div>
                </div>
                <div className="set-row" style={{ minHeight: 48, borderBottom: 'none' }}>
                  <div className="lab"><div className="t">字号</div></div>
                  <div className="seg">
                    {[0.9, 1, 1.15].map((s) => (
                      <button key={s} className={fontScale === s ? 'on' : ''} onClick={() => setFontScale(s)}>
                        {{ 0.9: '小', 1: '中', 1.15: '大' }[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <button className="icon-btn" onClick={() => nav.openQueue()} title="播放列表"><IconQueue /></button>
        </div>
      </div>

      <div className="mf-body">
        <div className="mf-left">
          <div className="mf-cover-wrap">
            {track.cover ? <img src={track.cover} alt="" /> : <div style={{ width: '100%', height: '100%', background: 'var(--panel-2)' }} />}
          </div>
          <div className="mf-info">
            <div className="t">{track.name}</div>
            <div className="a">
              {track.artists?.length
                ? track.artists.map((a, i) => (
                  <React.Fragment key={a.id}>
                    {i > 0 ? ' / ' : ''}
                    <span className="link" onClick={() => { if (a.id) { onClose(); nav.nav('artist', { id: a.id, name: a.name }); } }}>{a.name}</span>
                  </React.Fragment>
                ))
                : track.artist}
            </div>
          </div>
          <div className="mf-mini">
            <div className="row">
              <button className="icon-btn" onClick={actions.prevSong}><IconPrev /></button>
              <button className="play" onClick={actions.togglePlay}>{snap.playing ? <IconPause /> : <IconPlay />}</button>
              <button className="icon-btn" onClick={() => actions.nextSong()}><IconNext /></button>
              <span className="time" style={{ marginLeft: 'auto' }}>{formatTime(snap.position)} / {formatTime(snap.duration)}</span>
            </div>
            <SeekBar className="bar" position={snap.position} duration={snap.duration} canSeek={snap.canSeek} onSeek={actions.seek} />
            <div className="row" style={{ marginTop: 12, gap: 4 }}>
              <button className={`icon-btn${fav ? ' on' : ''}`} style={fav ? { color: '#ef4444' } : undefined} onClick={() => actions.toggleFavorite(track)} title="喜欢">
                <IconHeart filled={fav} />
              </button>
              <DownloadButton track={track} level={snap.level} />
              <button className="icon-btn" onClick={actions.cycleMode} title={MODE_LABEL[snap.mode]}><ModeIcon /></button>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,.4)' }}>
                {snap.errorNote ?? ''}
              </span>
            </div>
          </div>
        </div>
        <div className="mf-right">
          <div className="lyric-box" ref={boxRef} style={{ fontSize: `${fontScale * 16}px` }}>
            {lyric.lines.length === 0 ? (
              <div className="lyric-empty">
                {lyric.loading ? '歌词加载中…' : lyric.error ? `歌词加载失败:${lyric.error}` : '纯音乐,请欣赏'}
              </div>
            ) : lyric.lines.map((line, i) => {
              const tr = transByTime.get(Math.round(line.time * 10) / 10);
              return (
                <div
                  key={i}
                  className={`lyric-line${i === activeIndex ? ' on' : ''}`}
                  onClick={() => actions.seek(line.time)}
                >
                  {line.text || '···'}
                  {showTrans && tr ? <span className="tr">{tr}</span> : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────── 确认弹窗 ───────────── */

export function Confirm({ open, title, text, okText = '确定', cancelText = '取消', danger, onOk, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-mask" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {text ? <p>{text}</p> : null}
        <div className="actions">
          <button className="cancel" onClick={onCancel}>{cancelText}</button>
          <button className={danger ? 'danger' : 'ok'} onClick={onOk}>{okText}</button>
        </div>
      </div>
    </div>
  );
}
