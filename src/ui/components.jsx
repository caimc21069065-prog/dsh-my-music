// src/ui/components.jsx — 共享组件:歌曲行 / 封面卡 / 播放条 / 队列抽屉 / 沉浸式播放页
import React, { useState } from 'react';

import { formatTime, formatCount } from './api.js';
import {
  usePlayer, usePlayerActions, useLyric, useFavorite, PLAY_MODES
} from './player.jsx';
import {
  IconPlay, IconPlayCount, IconPause, IconPrev, IconNext, IconVolume, IconMute, IconRepeat, IconOne,
  IconShuffle, IconHeart, IconQueue, IconLyric, IconChevDown, IconTrash, IconClose
} from './icons.jsx';

const MODE_ICON = { order: IconRepeat, one: IconOne, shuffle: IconShuffle };
const MODE_LABEL = { order: '顺序播放', one: '单曲循环', shuffle: '随机播放' };

/** 自绘竖向滑块:pointer capture 支持拖动与点按(原生竖向 range 在 Chromium 里拖拽不可靠)。 */
export function VerticalSlider({ value, onChange }) {
  const ref = React.useRef(null);
  const drag = React.useRef(false);
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

/** 歌单/榜单/搜索共用的歌曲行。track: {id,name,artist,album,duration,vip} */
export function SongRow({ track, index, onPlay, showAlbum = true, playing = false }) {
  const { favorites, toggle } = useFavorite();
  const dur = track.duration ? formatTime(track.duration / 1000) : track.durationText ?? '';
  return (
    <div className={`song-row${playing ? ' playing' : ''}`} onDoubleClick={onPlay}>
      <span className="idx">{index + 1}</span>
      <span className="name">
        <span className="txt" title={track.name}>{track.name}</span>
        {track.vip ? <span className="vip">VIP</span> : null}
      </span>
      <span className="artist">{track.artist}</span>
      {showAlbum ? <span className="album">{track.album}</span> : <span className="album" />}
      <span className="dur">{dur}</span>
      <span className="ops">
        <button
          className={`icon-btn${favorites.has(track.id) ? ' on' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggle(track); }}
          title="收藏"
        >
          <IconHeart filled={favorites.has(track.id)} />
        </button>
        <button className="icon-btn" onClick={(e) => { e.stopPropagation(); onPlay(); }} title="播放">
          <IconPlay />
        </button>
      </span>
    </div>
  );
}

/** 封面网格卡片(歌单/专辑) */
export function CoverCard({ cover, name, sub, plays, onClick, onPlay }) {
  return (
    <div className="card" onClick={onClick}>
      <div className="cover-wrap">
        {cover ? <img src={cover} alt="" loading="lazy" /> : <div style={{ width: '100%', height: '100%' }} />}
        {plays ? (
          <span className="plays"><IconPlayCount />{formatCount(plays)}</span>
        ) : null}
        {onPlay ? (
          <button
            className="hover-play"
            onClick={(e) => { e.stopPropagation(); onPlay(); }}
            title="播放"
          >
            <IconPlay />
          </button>
        ) : null}
      </div>
      <div className="cap">
        <div className="t" title={name}>{name}</div>
        {sub ? <div className="s">{sub}</div> : null}
      </div>
    </div>
  );
}

/** 底部播放条(复刻 PlayBar:顶边进度条 + 封面 + 控制 + 右侧工具) */
export function PlayBar({ onOpenFull, onOpenQueue }) {
  const snap = usePlayer();
  const actions = usePlayerActions();
  const [dragValue, setDragValue] = useState(null);
  const [volOpen, setVolOpen] = useState(false);
  const barRef = React.useRef(null);
  const dragBar = React.useRef(false);
  const track = snap.index >= 0 ? snap.queue[snap.index] : null;
  if (!track) {
    return (
      <div className="playbar" style={{ justifyContent: 'center', color: 'var(--m-secondary)', fontSize: 13 }}>
        队列空空如也,去搜一首或让 AI 帮你点歌吧
      </div>
    );
  }
  const pct = dragValue ?? (snap.duration ? (snap.position / snap.duration) * 100 : 0);
  const ModeIcon = MODE_ICON[snap.mode] ?? IconRepeat;
  const seekFromEvent = (e) => {
    const rect = barRef.current.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    actions.seek(ratio * snap.duration);
  };
  return (
    <div className="playbar" onDoubleClick={onOpenFull}>
      <div
        className="progress"
        ref={barRef}
        onPointerDown={(e) => { dragBar.current = true; e.currentTarget.setPointerCapture(e.pointerId); seekFromEvent(e); }}
        onPointerMove={(e) => { if (dragBar.current) seekFromEvent(e); }}
        onPointerUp={() => { dragBar.current = false; }}
        onPointerCancel={() => { dragBar.current = false; }}
      >
        <div className="track">
          <div className="fill" style={{ width: `${pct}%` }} />
          <div className="knob" style={{ left: `${pct}%` }} />
        </div>
      </div>
      <img className="cover" src={track.cover} alt="" />
      <div className="meta">
        <div className="t" title={track.name}>{track.name}</div>
        <div className="a" style={snap.errorNote ? { color: '#ff9a9a' } : undefined}>
          {snap.errorNote ?? `${track.artist}${track.album ? ` - ${track.album}` : ''}`}
        </div>
      </div>
      <div className="ctrl">
        <button className="icon-btn" onClick={actions.prevSong} title="上一首"><IconPrev /></button>
        <button className="play-btn" onClick={actions.togglePlay} title={snap.playing ? '暂停' : '播放'}>
          {snap.playing ? <IconPause /> : <IconPlay />}
        </button>
        <button className="icon-btn" onClick={actions.nextSong} title="下一首"><IconNext /></button>
      </div>
      <span className="time">{formatTime(snap.position)} / {formatTime(snap.duration)}</span>
      <div className="right" onDoubleClick={(e) => e.stopPropagation()}>
        <div className="vol-wrap" onMouseEnter={() => setVolOpen(true)} onMouseLeave={() => setVolOpen(false)}>
          <button className="icon-btn" onClick={actions.toggleMute} title="音量">
            {snap.muted || snap.volume === 0 ? <IconMute /> : <IconVolume />}
          </button>
          {volOpen ? (
            <div className="vol-pop">
              <VerticalSlider value={snap.muted ? 0 : snap.volume} onChange={actions.setVolume} />
            </div>
          ) : null}
        </div>
        <button className="icon-btn" onClick={actions.cycleMode} title={MODE_LABEL[snap.mode]}>
          <ModeIcon />
        </button>
        <button className="icon-btn" onClick={onOpenFull} title="歌词">
          <IconLyric />
        </button>
        <button className="icon-btn" onClick={onOpenQueue} title="播放列表">
          <IconQueue />
        </button>
      </div>
    </div>
  );
}

/** 播放队列抽屉(复刻 PlayingListDrawer) */
export function QueueDrawer({ open, onClose }) {
  const snap = usePlayer();
  const actions = usePlayerActions();
  if (!open) return null;
  return (
    <>
      <div className="drawer-mask" onClick={onClose} />
      <div className="queue">
        <div className="q-head">
          播放列表<span className="n">({snap.queue.length})</span>
          <span className="grow" />
          <button className="icon-btn" title="清空" onClick={() => { actions.clearQueue(); }}>
            <IconTrash />
          </button>
          <button className="icon-btn" title="关闭" onClick={onClose}><IconClose /></button>
        </div>
        <div className="q-list">
          {snap.queue.length === 0 ? <div className="empty">播放列表是空的</div> : null}
          {snap.queue.map((track, i) => (
            <div
              key={`${track.id}-${i}`}
              className={`q-item${i === snap.index ? ' playing' : ''}`}
              onClick={() => actions.playTrack(i)}
            >
              <img className="q-cover" src={track.cover} alt="" />
              <div className="q-meta">
                <div className="t">{track.name}</div>
                <div className="a">{track.artist}</div>
              </div>
              <button
                className="icon-btn"
                onClick={(e) => { e.stopPropagation(); actions.removeFromQueue(i); }}
                title="移除"
              >
                <IconClose />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/** 沉浸式播放页(复刻 MusicFull:封面取色渐变背景 + 左封面右歌词) */
export function MusicFull({ open, onClose }) {
  const snap = usePlayer();
  const actions = usePlayerActions();
  const track = snap.index >= 0 ? snap.queue[snap.index] : null;
  const lyric = useLyric(track?.id);
  const lyricBoxRef = React.useRef(null);
  const activeIndex = React.useMemo(() => {
    if (!lyric.lines.length) return -1;
    let idx = -1;
    for (let i = 0; i < lyric.lines.length; i++) {
      if (lyric.lines[i].time <= snap.position) idx = i;
      else break;
    }
    return idx;
  }, [lyric.lines, snap.position]);
  React.useEffect(() => {
    const box = lyricBoxRef.current;
    if (!box) return;
    const el = box.querySelector('.ly-line.on');
    if (el) box.scrollTop = el.offsetTop - box.clientHeight / 2;
  }, [activeIndex]);
  if (!open || !track) return null;
  const ModeIcon = MODE_ICON[snap.mode] ?? IconRepeat;
  const transByTime = new Map(lyric.translation.map((l) => [Math.round(l.time * 10) / 10, l.text]));
  return (
    <div className="music-full" style={{ background: 'linear-gradient(180deg,#1a2130 0%, #000 82%)' }}>
      <div className="mf-top">
        <button className="icon-btn" onClick={onClose} title="收起"><IconChevDown /></button>
        <span style={{ fontSize: 13, color: 'var(--m-secondary)' }}>正在播放</span>
        <span style={{ width: 36 }} />
      </div>
      <div className="mf-body">
        <div>
          <img className="mf-cover" src={track.cover} alt="" />
          <div className="mf-info">
            <div className="t">{track.name}</div>
            <div className="a">{track.artist}{track.album ? ` · ${track.album}` : ''}</div>
          </div>
        </div>
        <div className="mf-lyrics" ref={lyricBoxRef}>
          {lyric.lines.length === 0 ? (
            <div className="empty">暂无歌词</div>
          ) : lyric.lines.map((line, i) => {
            const tr = transByTime.get(Math.round(line.time * 10) / 10);
            return (
              <div key={i} className={`ly-line${i === activeIndex ? ' on' : ''}`} onClick={() => actions.seek(line.time)}>
                {line.text || '···'}
                {tr && i === activeIndex ? <span className="tr">{tr}</span> : null}
              </div>
            );
          })}
        </div>
      </div>
      <div className="playbar" style={{ background: 'transparent', boxShadow: 'none' }} onDoubleClick={(e) => e.stopPropagation()}>
        <div className="progress" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          actions.seek(((e.clientX - rect.left) / rect.width) * snap.duration);
        }}>
          <div className="track">
            <div className="fill" style={{ width: `${snap.duration ? (snap.position / snap.duration) * 100 : 0}%` }} />
          </div>
        </div>
        <img className="cover" src={track.cover} alt="" />
        <div className="meta">
          <div className="t">{track.name}</div>
          <div className="a">{track.artist}</div>
        </div>
        <div className="ctrl">
          <button className="icon-btn" onClick={actions.prevSong}><IconPrev /></button>
          <button className="play-btn" onClick={actions.togglePlay}>{snap.playing ? <IconPause /> : <IconPlay />}</button>
          <button className="icon-btn" onClick={actions.nextSong}><IconNext /></button>
        </div>
        <span className="time">{formatTime(snap.position)} / {formatTime(snap.duration)}</span>
        <div className="right">
          <button className="icon-btn" onClick={actions.cycleMode}><ModeIcon /></button>
          <button className="icon-btn" onClick={onClose}><IconQueue /></button>
        </div>
      </div>
    </div>
  );
}
