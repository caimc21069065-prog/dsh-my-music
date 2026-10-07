// src/client.jsx — DSH 客户端模块入口。
// 构建后被包装为 window.__ModuleLoader__.load({ id, factory(require) { ... } }),
// 工厂需返回 { inject, apply };esbuild CJS 输出与 banner/footer 组合完成该包装,
// footer 通过引用 __dsh_music_face 返回插件面。react / react-dom 由宿主模块表提供。

import React from 'react';

import { MusicApp } from './ui/app.jsx';
import { PlayerProvider } from './ui/player.jsx';

const PANEL_ID = 'music';

const __dsh_music_face = {
  inject: ['slots'],
  apply(ctx) {
    installGlobalErrorOverlay();
    // 主内容区整页(侧栏「音乐」图标点击后由外壳路由到这里,key 与图标 id 对应)
    ctx.slots.inject('main', () => ctx.slots.register({
      name: 'main',
      key: PANEL_ID
    }, MusicPage));

    // 左侧图标栏入口
    ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
      name: 'sidebar.panellist',
      id: PANEL_ID,
      order: 7,
      label: () => '音乐'
    }, MusicRailIcon));
  }
};

function MusicPage() {
  return (
    <ErrorBoundary>
      <PlayerProvider>
        <MusicApp />
      </PlayerProvider>
    </ErrorBoundary>
  );
}

/** 错误边界:崩溃时把错误文本显示在页面里,而不是黑屏。 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, color: '#ff7a7a', fontSize: 13, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>DSH Music 渲染出错(请截图反馈):</div>
          {String(this.state.error?.stack || this.state.error)}
        </div>
      );
    }
    return this.props.children;
 }
}

/** 全局兜底:逃过边界的错误(含 Promise 异常)以悬浮层显示,React 卸载后依然可见。 */
function installGlobalErrorOverlay() {
  if (window.__dshMusicErrorOverlayInstalled) return;
  window.__dshMusicErrorOverlayInstalled = true;
  const show = (label, message) => {
    let box = document.getElementById('dsh-music-error-overlay');
    if (!box) {
      box = document.createElement('div');
      box.id = 'dsh-music-error-overlay';
      box.setAttribute('style', 'position:fixed;inset:auto 0 0 0;z-index:999999;max-height:45vh;overflow:auto;background:rgba(40,0,0,.94);color:#ffb4b4;font:12px/1.5 monospace;padding:12px 16px;white-space:pre-wrap;');
      document.body && document.body.appendChild(box);
    }
    box.textContent += `[${label}] ${message}\n\n`;
  };
  window.addEventListener('error', (e) => {
    // audio/img 等媒体资源错误由播放器/界面自行呈现,不进全局浮层
    const t = e.target;
    if (t && t !== window && t.tagName && /^(AUDIO|IMG|SOURCE|VIDEO|LINK)$/.test(t.tagName)) return;
    show('error', e.message || (e.error && (e.error.stack || e.error.message)) || String(e.error ?? '未知错误'));
  }, true);
  window.addEventListener('unhandledrejection', (e) => show('promise', String(e.reason && (e.reason.stack || e.reason.message) || e.reason)));
}

/** 侧栏图标:音符。 */
function MusicRailIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3v10.6a4 4 0 1 0 2 3.4V7h4V3h-6z"
      />
    </svg>
  );
}
