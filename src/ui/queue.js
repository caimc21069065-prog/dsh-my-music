// src/ui/queue.js — 播放器队列与播放模式的纯函数(不依赖 React / DOM,可在 Node 下直接测)

export const PLAY_MODES = ['loop', 'one', 'shuffle']; // 列表循环 / 单曲循环 / 随机播放

/** 一首播完后,按播放模式算出下一首的目标下标 */
export function nextIndex(queue, index, mode, rand = Math.random) {
  const n = (queue ?? []).length;
  if (n === 0) return -1;
  if (mode === 'one') return index;
  if (mode === 'shuffle') {
    if (n <= 1) return 0;
    // 用「偏移量」而非「重掷」:偏移 1..n-1 一定不等于当前项,
    // 且即使 rand() 返回固定值也必然终止(曾经的 while 重掷会死循环)
    const skip = 1 + Math.floor((rand() < 0 ? 0 : rand()) * (n - 1));
    return (index + skip) % n;
  }
  return (index + 1) % n; // 列表循环:到末尾回到第一首
}

/** 上一首(始终循环) */
export function prevIndex(queue, index) {
  const n = (queue ?? []).length;
  if (n === 0) return -1;
  return (index - 1 + n) % n;
}

/**
 * 「下一首播放」:保留当前曲目在原下标,把 track 插到它后面;
 * 已在队列中的同 id 先去重,避免重复堆积。正在播放的曲子直接原样返回。
 */
export function insertNext(queue, index, track) {
  const list = queue ?? [];
  if (!track) return list;
  const rest = list.filter((t) => t.id !== track.id);
  if (index < 0 || index >= rest.length) return [...rest, track];
  const at = Math.min(index + 1, rest.length);
  return [...rest.slice(0, at), track, ...rest.slice(at)];
}

/** 随机播放整个列表(Fisher–Yates) */
export function shuffled(list, rand = Math.random) {
  const out = (list ?? []).slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
