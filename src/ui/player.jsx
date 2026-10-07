// src/ui/player.jsx — 播放器状态中枢:
// 单例 audio 元素 + 队列/播放模式/进度/收藏,localStorage 持久化。
// UI 通过 usePlayer() 订阅;音乐数据(id/name/artist/album/cover)由页面在加入队列时补全。

import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
// 必须静态引入:构建参数 minifyIdentifiers:false + treeShaking:false 下,
// esbuild 会把动态引入本目录模块的解构变量编译成未改名的自由引用(运行期 ReferenceError)。
import { api, parseLrc, streamUrl } from './api.js';

const STORE_KEY = 'dsh-music.player.v1';

const PLAY_MODES = ['order', 'one', 'shuffle']; // 顺序播放 / 单曲循环 / 随机(对齐 AlgerMusicPlayer playMode 0/1/2)

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s && Array.isArray(s.queue) ? s : null;
  } catch {
    return null;
  }
}

let audioEl = null;
function getAudio() {
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.preload = 'auto';
  }
  return audioEl;
}

const state = {
  queue: [],        // [{id, name, artist, album, cover, vip}]
  index: -1,
  playing: false,
  position: 0,
  duration: 0,
  canSeek: false,   // 音频元数据已到,进度条可跳转
  mode: 'loop',
  volume: 0.8,
  muted: false,
  level: undefined,   // 音质覆盖,undefined = 宿主默认
  errorNote: undefined // 当前曲目的播放失败提示(VIP/Cookie 等)
};

const listeners = new Set();
let saving = null;

function emit() {
  const snapshot = { ...state };
  for (const l of listeners) l(snapshot);
  clearTimeout(saving);
  saving = setTimeout(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        queue: state.queue, index: state.index, mode: state.mode, volume: state.volume
      }));
    } catch { /* 存储满时忽略 */ }
  }, 300);
}

function set(patch) {
  Object.assign(state, patch);
  emit();
}

function currentTrack() {
  return state.index >= 0 && state.index < state.queue.length ? state.queue[state.index] : null;
}

/**
 * 可跳转上限:元素时长优先(网易云试听片段只有 30s,列表时长不可信),
 * 其次缓冲尾部;都没有说明元数据未到,返回 null。
 */
function seekCeiling(audio) {
  if (Number.isFinite(audio.duration) && audio.duration > 0) return audio.duration;
  if (audio.seekable.length > 0) return audio.seekable.end(audio.seekable.length - 1);
  return null;
}

// 元数据未到达时的跳转意图,拿到时长后补一次(否则点进度条毫无反应)
let pendingSeek = null;

function syncMediaMeta() {
  const audio = getAudio();
  const ceiling = seekCeiling(audio);
  const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : (ceiling ?? state.duration);
  set({ duration, canSeek: ceiling !== null });
  if (pendingSeek !== null && ceiling !== null) {
    const sec = pendingSeek;
    pendingSeek = null;
    seek(sec);
  }
}

export function initPlayer() {
  const saved = loadState();
  if (saved) {
    set({
      queue: saved.queue ?? [],
      index: typeof saved.index === 'number' ? saved.index : -1,
      mode: PLAY_MODES.includes(saved.mode) ? saved.mode : 'loop',
      volume: typeof saved.volume === 'number' ? saved.volume : 0.8
    });
  }
  const audio = getAudio();
  audio.volume = state.volume;
  audio.addEventListener('timeupdate', () => set({ position: audio.currentTime }));
  audio.addEventListener('durationchange', syncMediaMeta);
  audio.addEventListener('loadedmetadata', syncMediaMeta);
  audio.addEventListener('canplay', syncMediaMeta);
  audio.addEventListener('play', () => set({ playing: true }));
  audio.addEventListener('pause', () => set({ playing: false }));
  audio.addEventListener('ended', () => nextSong(true));
  audio.addEventListener('error', () => {
    pendingSeek = null;
    set({ playing: false, canSeek: false });
    const track = currentTrack();
    if (track) {
      diagnosePlayFailure(track.id).then((note) => set({ errorNote: note }));
    }
  });
}

export function playTrack(index) {
  if (index < 0 || index >= state.queue.length) return;
  const track = state.queue[index];
  const audio = getAudio();
  pendingSeek = null;
  set({
    index,
    position: 0,
    duration: track.duration ? track.duration / 1000 : 0,
    canSeek: false,
    errorNote: undefined
  });
  audio.src = streamUrl(track.id, state.level);
  audio.play().catch(() => set({ playing: false }));
}

/** 音频加载失败后,查一次曲目的可播放性,给用户人话提示。 */
async function diagnosePlayFailure(songId) {
  try {
    const res = await api.songUrls([songId]);
    const d = (res.items || [])[0];
    if (!d) return '拿不到播放信息:歌曲可能已下架';
    if (!d.url && d.fee === 1) return 'VIP 歌曲:在插件设置里配置网易云 Cookie(需含 MUSIC_U)后可试听或播放';
    if (!d.url) return '未获得播放链接:配置网易云 Cookie 后重试';
    if (d.freeTrialInfo) return 'VIP 歌曲 · 当前为试听片段(配置会员 Cookie 可听完整版)';
    return '播放失败,请重试';
  } catch {
    return '播放失败,请重试';
  }
}

export function playQueue(tracks, startIndex = 0) {
  if (!tracks || tracks.length === 0) return;
  set({ queue: tracks });
  playTrack(startIndex);
}

export function addToQueue(track, playNow = false) {
  const existing = state.queue.findIndex((t) => t.id === track.id);
  if (existing >= 0) {
    if (playNow) playTrack(existing);
    return;
  }
  const queue = [...state.queue, track];
  set({ queue });
  if (playNow || state.index < 0) playTrack(queue.length - 1);
}

export function removeFromQueue(index) {
  if (index < 0 || index >= state.queue.length) return;
  const queue = state.queue.filter((_, i) => i !== index);
  let indexNew = state.index;
  if (index < state.index) indexNew -= 1;
  else if (index === state.index) {
    const audio = getAudio();
    audio.pause();
    audio.removeAttribute('src');
    pendingSeek = null;
    indexNew = Math.min(index, queue.length - 1);
    set({ queue, index: -1, playing: false, position: 0, duration: 0, canSeek: false });
    if (indexNew >= 0) playTrack(indexNew);
    return;
  }
  set({ queue, index: indexNew });
}

export function clearQueue() {
  const audio = getAudio();
  audio.pause();
  audio.removeAttribute('src');
  pendingSeek = null;
  set({ queue: [], index: -1, playing: false, position: 0, duration: 0, canSeek: false });
}

export function togglePlay() {
  const audio = getAudio();
  if (!currentTrack()) {
    if (state.queue.length > 0) playTrack(0);
    return;
  }
  if (audio.paused) audio.play().catch(() => set({ playing: false }));
  else audio.pause();
}

function nextSong(auto = false) {
  if (state.queue.length === 0) return;
  let index;
  if (auto && state.mode === 'one') index = state.index;
  else if (state.mode === 'shuffle') index = Math.floor(Math.random() * state.queue.length);
  else index = (state.index + 1) % state.queue.length;
  playTrack(index);
}

function prevSong() {
  if (state.queue.length === 0) return;
  const index = (state.index - 1 + state.queue.length) % state.queue.length;
  playTrack(index);
}

export function seek(sec) {
  if (!Number.isFinite(sec) || sec < 0) return;
  const audio = getAudio();
  const ceiling = seekCeiling(audio);
  if (ceiling === null) {
    pendingSeek = sec; // 元数据未到,先记下,loadedmetadata 后自动补跳
    return;
  }
  pendingSeek = null;
  audio.currentTime = Math.min(sec, ceiling);
  const realDuration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : state.duration;
  set({ position: audio.currentTime, duration: realDuration, canSeek: true });
}

export function setVolume(v) {
  const volume = Math.min(Math.max(v, 0), 1);
  const audio = getAudio();
  audio.volume = volume;
  audio.muted = false;
  set({ volume, muted: false });
}

export function toggleMute() {
  const audio = getAudio();
  audio.muted = !audio.muted;
  set({ muted: audio.muted });
}

export function cycleMode() {
  const mode = PLAY_MODES[(PLAY_MODES.indexOf(state.mode) + 1) % PLAY_MODES.length];
  set({ mode });
}

export function setLevel(level) {
  set({ level });
  const track = currentTrack();
  if (track && state.playing) playTrack(state.index); // 换音质重播当前歌
}

export function usePlayer() {
  const [snap, setSnap] = useState({ ...state });
  useEffect(() => {
    listeners.add(setSnap);
    setSnap({ ...state });
    return () => listeners.delete(setSnap);
  }, []);
  return snap;
}

const EMPTY_LYRIC = { lines: [], translation: [], loading: false, error: undefined };

/** 当前播放曲目的歌词(拉取 + 解析 + 翻译);加载中/失败原因一并返回,便于界面说明。 */
export function useLyric(songId) {
  const [data, setData] = useState(EMPTY_LYRIC);
  useEffect(() => {
    let alive = true;
    if (!songId) {
      setData(EMPTY_LYRIC);
      return undefined;
    }
    setData({ ...EMPTY_LYRIC, loading: true });
    api.lyric(songId).then((d) => {
      if (!alive) return;
      setData({
        lines: parseLrc(d.lyric),
        translation: parseLrc(d.translation),
        loading: false,
        error: undefined
      });
    }).catch((error) => alive && setData({ ...EMPTY_LYRIC, error: error.message }));
    return () => { alive = false; };
  }, [songId]);
  return data;
}

/** 播放上下文,页面组件通过它取状态与操作。 */
const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  useEffect(() => {
    initPlayer();
  }, []);
  const value = useMemo(() => ({
    playQueue, playTrack, addToQueue, removeFromQueue, clearQueue,
    togglePlay, nextSong: () => nextSong(false), prevSong, seek, setVolume,
    toggleMute, cycleMode, setLevel, getAudio
  }), []);
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayerActions() {
  return useContext(PlayerContext);
}

export { PLAY_MODES, currentTrack };

export function useCurrentTrack() {
  const snap = usePlayer();
  return snap.index >= 0 && snap.index < snap.queue.length ? snap.queue[snap.index] : null;
}

export function useProgress() {
  const snap = usePlayer();
  return { position: snap.position, duration: snap.duration };
}

export function useIsCurrent(trackId) {
  const snap = usePlayer();
  return snap.index >= 0 && snap.queue[snap.index]?.id === trackId;
}

export function useFavorite() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('dsh-music.favorites') || '[]'));
    } catch {
      return new Set();
    }
  });
  const toggle = useCallback((track) => {
    setFavorites((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(track.id)) nextSet.delete(track.id);
      else nextSet.add(track.id);
      try {
        localStorage.setItem('dsh-music.favorites', JSON.stringify([...nextSet]));
      } catch { /* ignore */ }
      return nextSet;
    });
  }, []);
  return { favorites, toggle };
}
