// src/ui/player.jsx — 播放器状态中枢:
// 单例 audio 元素 + 队列/播放模式/进度/收藏/播放历史,localStorage 持久化。
// UI 通过 usePlayer() 订阅;曲目数据(id/name/artist/cover/duration)由页面在加入队列时补全。

import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
// 必须静态引入:构建参数 minifyIdentifiers:false + treeShaking:false 下,
// esbuild 会把动态引入本目录模块的解构变量编译成未改名的自由引用(运行期 ReferenceError)。
import { api, parseLrc, streamUrl } from './api.js';
import { PLAY_MODES, nextIndex, prevIndex, insertNext } from './queue.js';

const STORE_KEY = 'dsh-music.player.v2';
const MAX_HISTORY = 200;

const initial = {
  queue: [],
  index: -1,
  playing: false,
  loading: false,
  position: 0,
  duration: 0,
  canSeek: false,
  mode: 'loop',
  volume: 0.8,
  muted: false,
  level: undefined, // 音质覆盖,undefined = 宿主默认
  rate: 1,
  errorNote: undefined,
  favorites: [], // 收藏的曲目对象(顺序即收藏时间)
  history: [] // 最近播放(新的在前)
};

const state = { ...initial };
const listeners = new Set();

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    if (!s || typeof s !== 'object') return;
    if (Array.isArray(s.queue)) state.queue = s.queue;
    if (typeof s.index === 'number') state.index = Math.min(s.index, state.queue.length - 1);
    if (PLAY_MODES.includes(s.mode)) state.mode = s.mode;
    if (typeof s.volume === 'number') state.volume = Math.min(Math.max(s.volume, 0), 1);
    if (typeof s.level === 'string') state.level = s.level;
    if (typeof s.rate === 'number') state.rate = s.rate;
    if (Array.isArray(s.favorites)) state.favorites = s.favorites;
    if (Array.isArray(s.history)) state.history = s.history;
  } catch { /* 存储损坏就当没有 */ }
}

let saving = null;
function persist() {
  clearTimeout(saving);
  saving = setTimeout(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        queue: state.queue,
        index: state.index,
        mode: state.mode,
        volume: state.volume,
        level: state.level,
        rate: state.rate,
        favorites: state.favorites.slice(0, 500),
        history: state.history.slice(0, MAX_HISTORY)
      }));
    } catch { /* 存储满时忽略 */ }
  }, 250);
}

function emit() {
  const snapshot = { ...state };
  for (const l of listeners) l(snapshot);
  persist();
}

function set(patch) {
  Object.assign(state, patch);
  emit();
}

let audioEl = null;
function getAudio() {
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.preload = 'auto';
  }
  return audioEl;
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

function remember(track) {
  if (!track) return;
  const history = [track, ...state.history.filter((t) => t.id !== track.id)].slice(0, MAX_HISTORY);
  state.history = history;
}

export function initPlayer() {
  if (initPlayer.done) return;
  initPlayer.done = true;
  loadState();
  const audio = getAudio();
  audio.volume = state.volume;
  audio.playbackRate = state.rate;
  audio.addEventListener('timeupdate', () => set({ position: audio.currentTime }));
  audio.addEventListener('durationchange', syncMediaMeta);
  audio.addEventListener('loadedmetadata', syncMediaMeta);
  audio.addEventListener('canplay', () => set({ loading: false, canSeek: seekCeiling(audio) !== null }));
  audio.addEventListener('waiting', () => set({ loading: true }));
  audio.addEventListener('playing', () => set({ playing: true, loading: false }));
  audio.addEventListener('play', () => set({ playing: true }));
  audio.addEventListener('pause', () => set({ playing: false }));
  audio.addEventListener('ended', () => nextSong(true));
  audio.addEventListener('error', () => {
    pendingSeek = null;
    set({ playing: false, loading: false, canSeek: false });
    const track = currentTrack();
    if (track) {
      diagnosePlayFailure(track.id).then((note) => set({ errorNote: note }));
    }
  });
  emit();
}

export function playTrack(index) {
  if (index < 0 || index >= state.queue.length) return;
  const track = state.queue[index];
  const audio = getAudio();
  pendingSeek = null;
  remember(track);
  set({
    index,
    position: 0,
    duration: track.duration ? track.duration / 1000 : 0,
    canSeek: false,
    loading: true,
    errorNote: undefined
  });
  audio.playbackRate = state.rate;
  audio.src = streamUrl(track.id, state.level);
  audio.play().catch(() => set({ playing: false, loading: false }));
}

/** 音频加载失败后,查一次曲目的可播放性,给用户人话提示。 */
async function diagnosePlayFailure(songId) {
  try {
    const res = await api.songUrls([songId]);
    const d = (res.items || [])[0];
    if (!d) return '拿不到播放信息:歌曲可能已下架';
    if (!d.url && d.fee === 1) return 'VIP 歌曲:登录网易云账号后可试听或播放';
    if (!d.url) return '未获得播放链接:登录网易云账号后重试';
    if (d.freeTrialInfo) return 'VIP 歌曲 · 当前为试听片段(登录会员账号可听完整版)';
    return '播放失败,请重试';
  } catch {
    return '播放失败,请重试';
  }
}

export function playQueue(tracks, startIndex = 0) {
  if (!tracks || tracks.length === 0) return;
  set({ queue: tracks.slice() });
  playTrack(Math.min(Math.max(startIndex, 0), tracks.length - 1));
}

/** 插入到下一首播放(纯逻辑在 queue.js,用法见其单测) */
export function playNext(track) {
  if (!track) return;
  const current = currentTrack();
  if (current && current.id === track.id) return; // 正在播放的曲子无需再排
  const queue = insertNext(state.queue, state.index, track);
  set({ queue });
  // 之前没有在播的歌,干脆把这首播起来
  if (state.index < 0) playTrack(queue.length - 1);
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
  set({ queue: [], index: -1, playing: false, position: 0, duration: 0, canSeek: false, errorNote: undefined });
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
  // 自动播放遵循播放模式;手动点「下一首」在单曲循环下也要前进(单曲循环只约束自动播放)
  const mode = auto ? state.mode : state.mode === 'one' ? 'loop' : state.mode;
  playTrack(nextIndex(state.queue, state.index, mode));
}

function prevSong() {
  if (state.queue.length === 0) return;
  playTrack(prevIndex(state.queue, state.index));
}

export function seek(sec) {
  if (!Number.isFinite(sec) || sec < 0) return;
  const audio = getAudio();
  const ceiling = seekCeiling(audio);
  // 元数据没到但列表里有曲目时长时,也先按已知时长尝试:赋不上再记下来等 loadedmetadata 补跳
  const known = ceiling ?? (state.duration > 0 ? state.duration : null);
  if (known === null) {
    pendingSeek = sec;
    return;
  }
  const target = Math.max(0, Math.min(sec, known));
  try {
    audio.currentTime = target;
  } catch {
    pendingSeek = sec;
    return;
  }
  pendingSeek = null;
  const realDuration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : state.duration;
  // 先乐观更新,timeupdate 会用真实播放位置校正
  set({ position: target, duration: realDuration, canSeek: true });
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
  set({ mode: PLAY_MODES[(PLAY_MODES.indexOf(state.mode) + 1) % PLAY_MODES.length] });
}

export function setMode(mode) {
  if (PLAY_MODES.includes(mode)) set({ mode });
}

export function setLevel(level) {
  set({ level });
  const track = currentTrack();
  if (track && state.playing) playTrack(state.index); // 换音质重播当前歌
}

export function setRate(rate) {
  const audio = getAudio();
  audio.playbackRate = rate;
  set({ rate });
}

export function isFavorite(id) {
  return state.favorites.some((t) => t.id === id);
}

/** 收藏:本地即时生效;登录时顺带同步到网易云「我喜欢的音乐」(失败不影响本地)。 */
export function toggleFavorite(track) {
  const exists = state.favorites.some((t) => t.id === track.id);
  const favorites = exists
    ? state.favorites.filter((t) => t.id !== track.id)
    : [track, ...state.favorites];
  set({ favorites });
  api.like(track.id, !exists).catch(() => { /* 未登录/风控时仅保留本地收藏 */ });
  return !exists;
}

export function clearFavorites() {
  const removed = state.favorites;
  set({ favorites: [] });
  for (const t of removed) api.like(t.id, false).catch(() => { /* 未登录/风控时只清本地 */ });
}

export function clearHistory() {
  set({ history: [] });
}

export function removeHistory(id) {
  set({ history: state.history.filter((t) => t.id !== id) });
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

/**
 * 细粒度订阅:进度每秒更新数次,列表行只关心「是否当前曲目/是否在播」,
 * 用选择器避免整页跟着 timeupdate 重渲染。
 */
export function usePlayerSelector(select, isEqual = Object.is) {
  const selectRef = useRef(select);
  selectRef.current = select;
  const [value, setValue] = useState(() => select(state));
  useEffect(() => {
    let prev = selectRef.current(state);
    const listener = (snap) => {
      const next = selectRef.current(snap);
      if (!isEqual(prev, next)) {
        prev = next;
        setValue(next);
      }
    };
    listeners.add(listener);
    listener(state);
    return () => listeners.delete(listener);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // 列表复用组件实例导致选择器变化时,渲染期同步一次
  const current = select(state);
  if (!isEqual(value, current)) setValue(current);
  return value;
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
    playQueue, playTrack, playNext, addToQueue, removeFromQueue, clearQueue,
    togglePlay, nextSong: () => nextSong(false), prevSong, seek, setVolume,
    toggleMute, cycleMode, setMode, setLevel, setRate, toggleFavorite,
    clearFavorites, clearHistory, removeHistory, getAudio
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

export function useIsCurrent(trackId) {
  return usePlayerSelector((s) => s.index >= 0 && s.queue[s.index]?.id === trackId);
}

export function useFavoriteState(trackId) {
  return usePlayerSelector((s) => s.favorites.some((t) => t.id === trackId));
}
