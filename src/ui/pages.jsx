// src/ui/pages.jsx — 页面:发现 / 搜索 / 歌单·榜单详情 / 设置(复刻 AlgerMusicPlayer 对应视图)
import React, { useEffect, useState } from 'react';

import { api, formatCount } from './api.js';
import { usePlayer, usePlayerActions } from './player.jsx';
import { useAccount, refreshAccount } from './account.jsx';
import { CoverCard, SongRow } from './components.jsx';
import { IconPlay } from './icons.jsx';

/** 把宿主 songs 数据转成可播放的 track(补 cover 由调用方传) */
function toTracks(items) {
  return (items || []).map((s) => ({
    id: s.id,
    name: s.name,
    artist: s.detail || '',
    album: '',
    cover: '',
    durationText: ''
  }));
}

function useAsync(fn, deps) {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  useEffect(() => {
    let alive = true;
    setState({ loading: true, data: null, error: null });
    fn().then((data) => alive && setState({ loading: false, data, error: null }))
      .catch((error) => alive && setState({ loading: false, data: null, error }));
    return () => { alive = false; };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return state;
}

function GridSkeleton({ n = 10 }) {
  return (
    <div className="grid-cover">
      {Array.from({ length: n }, (_, i) => <div key={i} className="skeleton" style={{ height: 178 }} />)}
    </div>
  );
}

/* ─────────────── 发现页(Home) ─────────────── */
export function HomePage({ nav }) {
  const actions = usePlayerActions();
  const daily = useAsync(() => api.daily(), []);
  const hot = useAsync(() => api.hotPlaylists(15), []);
  const toplists = useAsync(() => api.toplists(), []);
  const playAll = (tracks, index = 0) => actions.playQueue(tracks, index);
  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <div className="hero">
        <div className="hero-card">
          {daily.data?.tracks?.[0] ? null : null}
          <div className="shade" />
          <div className="inner">
            <h2>每日推荐</h2>
            <span className="sub">
              {daily.data?.source === 'daily' ? '根据你的口味生成 · 共 30 首' : '登录 Cookie 后可生成口味日推 · 先听热歌'}
            </span>
            {daily.data?.tracks ? (
              <ol>
                {daily.data.tracks.slice(0, 3).map((t, i) => (
                  <li key={t.id}><span className="n">{i + 1}</span>{t.name}<span style={{ opacity: .55, marginLeft: 10 }}>{t.detail}</span></li>
                ))}
              </ol>
            ) : null}
          </div>
          <button
            className="fab"
            title="播放"
            onClick={(e) => {
              e.stopPropagation();
              if (daily.data?.tracks?.length) playAll(daily.data.tracks.map(withCover(daily.data.tracks)));
            }}
          >
            <IconPlay />
          </button>
        </div>
        <div className="hero-card" onClick={() => nav('toplist')}>
          <div className="shade" />
          <div className="inner">
            <h2 style={{ fontSize: 20 }}>排行榜</h2>
            <span className="sub">飙升 / 新歌 / 热歌 / 原创···</span>
          </div>
        </div>
      </div>

      <div className="sec-title"><span className="bar" />热门榜单<span className="more" onClick={() => nav('toplist')}>更多 ›</span></div>
      {toplists.loading ? <GridSkeleton n={5} /> : (
        <div className="grid-cover">
          {(toplists.data?.items ?? []).slice(0, 5).map((l) => (
            <CoverCard key={l.id} cover={l.cover} name={l.name} sub={l.updateFrequency} onClick={() => nav('musiclist', { kind: 'toplist', id: l.id, name: l.name, cover: l.cover })} />
          ))}
        </div>
      )}

      <div className="sec-title"><span className="bar" />热门歌单</div>
      {hot.loading ? <GridSkeleton /> : (
        <div className="grid-cover">
          {(hot.data?.items ?? []).map((p) => (
            <CoverCard
              key={p.id} cover={p.cover} name={p.name} plays={p.playCount} sub={p.creator ? `by ${p.creator}` : ''}
              onClick={() => nav('musiclist', { kind: 'playlist', id: p.id, name: p.name, cover: p.cover })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function withCover() {
  return (t) => t; // cover 在 track 详情缺失时由 <audio> 侧兜底
}

/* ─────────────── 歌单 / 榜单详情(MusicListPage 复刻) ─────────────── */
export function MusicListPage({ params, nav }) {
  const actions = usePlayerActions();
  const isToplist = params.kind === 'toplist';
  const detail = useAsync(
    () => (isToplist ? Promise.resolve({ name: params.name, cover: params.cover }) : api.playlistDetail(params.id)),
    [params.kind, params.id]
  );
  const tracks = useAsync(
    () => (isToplist ? api.toplistTracks(params.id) : api.playlistTracks(params.id, 100)),
    [params.kind, params.id]
  );
  const list = (tracks.data?.tracks ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    artist: (t.detail || '').split(' · ')[0] || '',
    album: (t.detail || '').split(' · ')[1] || '',
    cover: detail.data?.cover || '',
    vip: t.fee === 1
  }));
  const playAll = () => { if (list.length) actions.playQueue(list, 0); };
  return (
    <div className="page" style={{ paddingTop: 16 }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
        <img
          src={detail.data?.cover || params.cover}
          alt=""
          style={{ width: 148, height: 148, borderRadius: 16, objectFit: 'cover', background: 'var(--m-panel)' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{detail.data?.name ?? params.name ?? (isToplist ? '排行榜' : '歌单')}</div>
          <div style={{ color: 'var(--m-secondary)', fontSize: 13, marginTop: 8, display: 'flex', gap: 14 }}>
            {detail.data?.trackCount ? <span>共 {detail.data.trackCount} 首</span> : null}
            {detail.data?.playCount ? <span>播放 {formatCount(detail.data.playCount)} 次</span> : null}
            {detail.data?.updateFrequency ? <span>{detail.data.updateFrequency}</span> : null}
          </div>
          {detail.data?.description ? (
            <div style={{
              color: 'var(--m-secondary)', fontSize: 12.5, marginTop: 8, lineHeight: 1.7,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
            }}>{detail.data.description}</div>
          ) : null}
          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <button className="tab on" onClick={playAll}><IconPlay />播放全部</button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <div className="song-row head"><span /><span>标题</span><span>歌手</span><span>专辑</span><span>时长</span><span /></div>
        {tracks.loading ? <div className="empty">加载中…</div> : null}
        {tracks.error ? <div className="err">{tracks.error.message}</div> : null}
        {list.map((t, i) => (
          <SongRow
            key={t.id}
            track={t}
            index={i}
            onPlay={() => actions.playQueue(list, i)}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────── 搜索页(热搜 + 历史 + 结果,复刻 search 视图) ─────────────── */
const SEARCH_TYPES = [['song', '单曲'], ['playlist', '歌单'], ['album', '专辑'], ['artist', '歌手']];
const HISTORY_KEY = 'dsh-music.searchHistory';

export function SearchPage({ nav, initialKeyword }) {
  const [keyword, setKeyword] = useState(initialKeyword ?? '');
  const [type, setType] = useState('song');
  const [submitted, setSubmitted] = useState(initialKeyword ?? '');
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
  });
  const submit = (kw, ty = type) => {
    const k = (kw ?? keyword).trim();
    if (!k) return;
    setKeyword(k);
    setType(ty);
    setSubmitted(k);
    setHistory((prev) => {
      const next = [k, ...prev.filter((h) => h !== k)].slice(0, 20);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };
  return submitted ? (
    <SearchResult keyword={submitted} type={type} onType={(ty) => submit(submitted, ty)} nav={nav} />
  ) : (
    <div className="page" style={{ paddingTop: 16 }}>
      <div className="sec-title"><span className="bar" />搜索</div>
      <HotSearch onPick={(kw) => submit(kw)} />
      {history.length > 0 ? (
        <>
          <div className="sec-title"><span className="bar" />搜索历史<span className="more" onClick={() => { setHistory([]); localStorage.removeItem(HISTORY_KEY); }}>清空</span></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {history.map((h) => <button key={h} className="ghost-btn" onClick={() => submit(h)}>{h}</button>)}
          </div>
        </>
      ) : null}
    </div>
  );
}

function HotSearch({ onPick }) {
  // 宿主暂无热搜接口,用固定热词占位(后续接 /search/hot/detail)
  const hot = ['海阔天空', '周杰伦', 'Taylor Swift', '告五人', '夜曲', '向云端', '起风了', '五月天'];
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {hot.map((kw, i) => (
        <button key={kw} className="ghost-btn" onClick={() => onPick(kw)}>
          <span style={{ color: i < 3 ? 'var(--m-primary)' : 'var(--m-secondary)', marginRight: 6, fontWeight: 700 }}>{i + 1}</span>
          {kw}
        </button>
      ))}
    </div>
  );
}

function SearchResult({ keyword, type, onType, nav }) {
  const actions = usePlayerActions();
  const [state, setState] = useState({ loading: true, items: [], error: null });
  useEffect(() => {
    let alive = true;
    setState({ loading: true, items: [], error: null });
    api.search(keyword, type, 30).then((d) => alive && setState({ loading: false, items: d.items ?? [], error: null }))
      .catch((error) => alive && setState({ loading: false, items: [], error }));
    return () => { alive = false; };
  }, [keyword, type]);
  const list = state.items.map((s) => ({
    id: s.id,
    name: s.name,
    fee: s.fee,
    artist: type === 'song' ? (s.detail || '').split(' · ')[0] : '',
    album: type === 'song' ? (s.detail || '').split(' · ').slice(1).join(' · ') : (s.detail || ''),
    cover: ''
  }));
  return (
    <div className="page" style={{ paddingTop: 16 }}>
      <div style={{ fontSize: 22, fontWeight: 800 }}>{keyword}</div>
      <div className="set-tabs" style={{ marginTop: 12 }}>
        {SEARCH_TYPES.map(([ty, label]) => (
          <span key={ty} className={`tab${type === ty ? ' on' : ''}`} onClick={() => onType(ty)}>{label}</span>
        ))}
      </div>
      {state.loading ? <div className="empty">搜索中…</div> : null}
      {state.error ? <div className="err">{state.error.message}</div> : null}
      {!state.loading && type === 'song' ? (
        <div style={{ marginTop: 8 }}>
          {list.length > 0 ? (
            <button className="tab on" style={{ marginBottom: 10 }} onClick={() => actions.playQueue(list, 0)}>
              <IconPlay />播放全部 ({list.length})
            </button>
          ) : <div className="empty">没有找到相关内容</div>}
          {list.map((t, i) => (
            <SongRow key={t.id} track={{ ...t, vip: t.fee === 1 }} index={i}
              onPlay={() => actions.playQueue(list, i)} />
          ))}
        </div>
      ) : null}
      {!state.loading && type !== 'song' ? (
        <div className="grid-cover" style={{ marginTop: 14 }}>
          {state.items.map((it) => (
            <CoverCard
              key={it.id}
              name={it.name}
              sub={it.detail}
              onClick={() => {
                if (type === 'playlist') nav('musiclist', { kind: 'playlist', id: it.id, name: it.name });
              }}
            />
          ))}
          {state.items.length === 0 ? <div className="empty">没有找到相关内容</div> : null}
        </div>
      ) : null}
    </div>
  );
}

/* ─────────────── 设置页(复刻 set 视图,插件范围裁剪) ─────────────── */
const VIP_NAMES = { 0: '', 10: '普通会员', 11: '豪华会员' };

function AccountSection() {
  const { status, account } = useAccount();
  const [qr, setQr] = useState(null); // { img, url, key, state: active|scanned|expired|error, message }
  const [busy, setBusy] = useState(false);
  const timerRef = React.useRef(null);

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

  const cancelLogin = () => {
    stopPoll();
    setQr(null);
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
  const desc =
    status !== 'ready' ? '检测中…'
      : loggedIn ? `已登录${account.cookieSource === 'config' ? '(取自插件配置)' : ''}:${account.nickname}${VIP_NAMES[account.vipType] ? ` · ${VIP_NAMES[account.vipType]}` : ''} · 同步每日推荐与 VIP 试听`
      : account?.hasConfigCookie && account?.cookieSource === 'none'
        ? '未登录 · 界面退出登录会同时停用插件配置里的 Cookie'
        : '未登录 · 登录后同步每日推荐,VIP 歌曲可试听';

  return (
    <div className="set-row" style={{ alignItems: 'flex-start', minHeight: 76 }}>
      <div className="lab">
        <div className="t">网易云账号</div>
        <div className="d">{desc}</div>
        {qr ? (
          <div className="qr-panel">
            {qr.img ? <img src={qr.img} alt="网易云登录二维码" className={failed ? 'dim' : ''} /> : null}
            <div className={`qr-msg${failed ? ' expired' : qr.state === 'scanned' ? ' scanned' : ''}`}>{qr.message}</div>
            {qr.img ? (
              <div className="qr-tip">
                {qr.state === 'scanned' ? '在手机上点确认即可自动完成登录' : '打开网易云音乐 App 扫一扫'}
              </div>
            ) : null}
            {failed ? (
              <button className="ghost-btn" onClick={startLogin} disabled={busy}>重新获取二维码</button>
            ) : qr.state === 'active' ? (
              <button className="ghost-btn" onClick={cancelLogin}>取消</button>
            ) : null}
            {qr.url && failed ? (
              <a className="qr-link" href={qr.url} target="_blank" rel="noreferrer">在浏览器中打开授权页</a>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="ctl">
        {status !== 'ready' ? null : loggedIn ? (
          <>
            {account.avatar ? <img className="account-avatar" src={account.avatar} alt="" /> : null}
            <span className="ghost-btn" onClick={doLogout}>退出登录</span>
          </>
        ) : (
          <button className="tab on" onClick={startLogin} disabled={busy}>
            {busy ? '获取二维码…' : '扫码登录'}
          </button>
        )}
      </div>
    </div>
  );
}

export function SettingsPage() {
  const actions = usePlayerActions();
  const snap = usePlayer();
  return (
    <div className="page" style={{ paddingTop: 16, maxWidth: 860 }}>
      <div style={{ fontSize: 22, fontWeight: 800 }}>设置</div>
      <div className="sec-title"><span className="bar" />账号</div>
      <AccountSection />
      <div className="sec-title"><span className="bar" />播放</div>
      <div className="set-row">
        <div className="lab"><div className="t">默认音质</div><div className="d">音频代理的默认码率;更高音质需要登录 Cookie 与会员</div></div>
        <div className="seg">
          {['standard', 'exhigh', 'higher', 'lossless'].map((lv) => (
            <span key={lv} className={(snap.level ?? 'standard') === lv ? 'on' : ''} onClick={() => actions.setLevel(lv)}>
              {{ standard: '标准', exhigh: '较高', higher: '高', lossless: '无损' }[lv]}
            </span>
          ))}
        </div>
      </div>
      <div className="set-row">
        <div className="lab"><div className="t">播放模式</div><div className="d">顺序播放 / 单曲循环 / 随机播放</div></div>
        <div className="seg">
          {['order', 'one', 'shuffle'].map((m) => (
            <span key={m} className={snap.mode === m ? 'on' : ''} onClick={actions.cycleMode}>
              {{ order: '顺序', one: '单曲', shuffle: '随机' }[m]}
            </span>
          ))}
        </div>
      </div>
      <div className="sec-title"><span className="bar" />关于</div>
      <div className="set-row">
        <div className="lab">
          <div className="t">DSH Music v0.2.0</div>
          <div className="d">
            独立的 DeepSeek Harness 音乐插件 · 数据来自网易云音乐开放接口(社区维护),仅供个人学习研究,音乐版权归网易云及版权方所有,请勿用于商业用途。
          </div>
        </div>
      </div>
    </div>
  );
}
