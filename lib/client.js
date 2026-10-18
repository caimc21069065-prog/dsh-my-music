window.__ModuleLoader__.load({
  id: "dsh-plugin-music",
  factory(require) {
var __create=Object.create;var __defProp=Object.defineProperty;var __getOwnPropDesc=Object.getOwnPropertyDescriptor;var __getOwnPropNames=Object.getOwnPropertyNames;var __getProtoOf=Object.getPrototypeOf,__hasOwnProp=Object.prototype.hasOwnProperty;var __copyProps=(to,from,except,desc)=>{if(from&&typeof from=="object"||typeof from=="function")for(let key of __getOwnPropNames(from))!__hasOwnProp.call(to,key)&&key!==except&&__defProp(to,key,{get:()=>from[key],enumerable:!(desc=__getOwnPropDesc(from,key))||desc.enumerable});return to};var __toESM=(mod,isNodeMode,target)=>(target=mod!=null?__create(__getProtoOf(mod)):{},__copyProps(isNodeMode||!mod||!mod.__esModule?__defProp(target,"default",{value:mod,enumerable:!0}):target,mod));var import_jsx_runtime6=require("react/jsx-runtime");var import_jsx_runtime5=require("react/jsx-runtime");var theme_default=`/* src/ui/theme.css \u2014 \u590D\u523B AlgerMusicPlayer 5.x \u7684\u89C6\u89C9\u4F53\u7CFB\r
   \u4E3B\u8272 #22c55e;\u6DF1\u8272 #000/#161616/#2d2d2d;\u6D45\u8272 #fff/#f8f9fa/#e9ecef\u3002\r
   \u6240\u6709\u5C3A\u5BF8\u4EE5\u53C2\u8003\u9879\u76EE\u7684 tailwind \u6570\u503C\u4E3A\u57FA\u51C6(\u83DC\u5355 100px\u3001\u64AD\u653E\u6761 80px\u3001\u5C01\u9762\u5706\u89D2 16px \u7B49)\u3002 */\r
\r
.dsh-music {\r
  --primary: #22c55e;\r
  --primary-dark: #1eb154;\r
  --primary-soft: rgba(34, 197, 94, 0.12);\r
  --bg: #000;\r
  --panel: #161616;\r
  --panel-2: #2d2d2d;\r
  --panel-3: #3d3d3d;\r
  --text: #f5f5f5;\r
  --text-2: #d4d4d4;\r
  --muted: #9ca3af;\r
  --muted-2: #6b7280;\r
  --line: rgba(255, 255, 255, 0.07);\r
  --hover: rgba(255, 255, 255, 0.06);\r
  --shadow: 0 18px 48px rgba(0, 0, 0, 0.5);\r
  --page-x: 32px;\r
  --radius: 16px;\r
\r
  position: relative;\r
  width: 100%;\r
  height: 100%;\r
  min-width: 0;\r
  min-height: 0;\r
  display: flex;\r
  flex-direction: column;\r
  background: var(--bg);\r
  color: var(--text);\r
  font-size: 14px;\r
  font-family: system-ui, -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;\r
  overflow: hidden;\r
  user-select: none;\r
  -webkit-font-smoothing: antialiased;\r
}\r
\r
.dsh-music[data-theme='light'] {\r
  --bg: #fff;\r
  --panel: #f4f5f7;\r
  --panel-2: #e9ecef;\r
  --panel-3: #dee2e6;\r
  --text: #18181b;\r
  --text-2: #3f3f46;\r
  --muted: #71717a;\r
  --muted-2: #a1a1aa;\r
  --line: rgba(0, 0, 0, 0.07);\r
  --hover: rgba(0, 0, 0, 0.045);\r
  --shadow: 0 18px 48px rgba(0, 0, 0, 0.16);\r
}\r
\r
.dsh-music * { box-sizing: border-box; }\r
.dsh-music button { background: none; border: none; color: inherit; cursor: pointer; font: inherit; padding: 0; }\r
.dsh-music input { font: inherit; }\r
.dsh-music a { color: inherit; text-decoration: none; }\r
.dsh-music img { display: block; }\r
.dsh-music ::-webkit-scrollbar { width: 8px; height: 8px; }\r
.dsh-music ::-webkit-scrollbar-thumb { background: var(--panel-3); border-radius: 8px; }\r
.dsh-music ::-webkit-scrollbar-thumb:hover { background: var(--muted-2); }\r
.dsh-music ::-webkit-scrollbar-track { background: transparent; }\r
\r
/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u5E03\u5C40\u9AA8\u67B6 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
.dsh-music .app-body { flex: 1; display: flex; min-height: 0; min-width: 0; }\r
.dsh-music .app-main { flex: 1; min-width: 0; display: flex; flex-direction: column; position: relative; }\r
\r
/* \u5DE6\u4FA7\u83DC\u5355:\u9ED8\u8BA4 100px \u56FE\u6807\u680F,\u70B9 logo \u5C55\u5F00 160px \u663E\u793A\u6587\u5B57(\u53C2\u8003 AppMenu) */\r
.dsh-music .app-menu {\r
  width: 100px;\r
  flex-shrink: 0;\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  padding: 14px 0 12px;\r
  transition: width 0.28s ease;\r
  overflow: hidden;\r
}\r
.dsh-music .app-menu.expanded { width: 168px; align-items: flex-start; }\r
.dsh-music .app-menu .logo {\r
  width: 40px;\r
  height: 40px;\r
  border-radius: 12px;\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  background: linear-gradient(135deg, #22c55e, #0e9f6e);\r
  color: #fff;\r
  box-shadow: 0 6px 18px rgba(34, 197, 94, 0.35);\r
  cursor: pointer;\r
  margin-left: 14px;\r
  flex-shrink: 0;\r
  transition: transform 0.2s;\r
}\r
.dsh-music .app-menu .logo:hover { transform: scale(1.06); }\r
.dsh-music .app-menu .logo svg { width: 22px; height: 22px; }\r
.dsh-music .app-menu .logo-text {\r
  display: none;\r
  margin-left: 10px;\r
  font-weight: 800;\r
  font-size: 15px;\r
  letter-spacing: 0.02em;\r
  white-space: nowrap;\r
}\r
.dsh-music .app-menu.expanded .logo-text { display: block; }\r
.dsh-music .menu-list {\r
  margin-top: 18px;\r
  width: 100%;\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  gap: 2px;\r
  overflow-y: auto;\r
  overflow-x: hidden;\r
  scrollbar-width: none;\r
}\r
.dsh-music .menu-list::-webkit-scrollbar { width: 0; }\r
.dsh-music .app-menu.expanded .menu-list { align-items: flex-start; padding-left: 14px; }\r
.dsh-music .menu-item {\r
  position: relative;\r
  display: flex;\r
  align-items: center;\r
  width: 72px;\r
  height: 46px;\r
  justify-content: center;\r
  border-radius: 12px;\r
  color: var(--muted);\r
  transition: color 0.18s, background 0.18s;\r
  flex-shrink: 0;\r
}\r
.dsh-music .app-menu.expanded .menu-item { width: 140px; justify-content: flex-start; padding-left: 14px; }\r
.dsh-music .menu-item svg { width: 25px; height: 25px; flex-shrink: 0; transition: transform 0.18s; }\r
.dsh-music .menu-item:hover { color: var(--text); background: var(--hover); }\r
.dsh-music .menu-item:hover svg { transform: scale(1.06); }\r
.dsh-music .menu-item.on { color: var(--primary); }\r
.dsh-music .menu-item .menu-label {\r
  display: none;\r
  margin-left: 12px;\r
  font-size: 14px;\r
  font-weight: 500;\r
  white-space: nowrap;\r
}\r
.dsh-music .app-menu.expanded .menu-item .menu-label { display: block; }\r
.dsh-music .menu-item .menu-tip {\r
  position: absolute;\r
  left: 76px;\r
  top: 50%;\r
  transform: translateY(-50%) scale(0.96);\r
  padding: 5px 10px;\r
  border-radius: 8px;\r
  background: var(--panel-2);\r
  color: var(--text);\r
  font-size: 12px;\r
  white-space: nowrap;\r
  opacity: 0;\r
  pointer-events: none;\r
  transition: opacity 0.15s, transform 0.15s;\r
  box-shadow: var(--shadow);\r
  z-index: 60;\r
}\r
.dsh-music .menu-item:hover .menu-tip { opacity: 1; transform: translateY(-50%) scale(1); }\r
.dsh-music .app-menu.expanded .menu-item .menu-tip { display: none; }\r
\r
/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u9876\u680F / \u641C\u7D22 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
.dsh-music .search-bar {\r
  height: 62px;\r
  flex-shrink: 0;\r
  display: flex;\r
  align-items: center;\r
  gap: 10px;\r
  padding: 0 var(--page-x) 10px 6px;\r
}\r
.dsh-music .tabs {\r
  display: flex;\r
  align-items: center;\r
  gap: 2px;\r
  background: var(--panel);\r
  border-radius: 9999px;\r
  padding: 4px;\r
  flex-shrink: 0;\r
}\r
.dsh-music .tab {\r
  display: inline-flex;\r
  align-items: center;\r
  gap: 6px;\r
  height: 32px;\r
  padding: 0 14px;\r
  border-radius: 9999px;\r
  font-size: 13px;\r
  color: var(--muted);\r
  white-space: nowrap;\r
  transition: color 0.18s, background 0.18s;\r
}\r
.dsh-music .tab svg { width: 15px; height: 15px; }\r
.dsh-music .tab:hover { color: var(--text); }\r
.dsh-music .tab.on { background: var(--primary); color: #fff; font-weight: 600; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); }\r
.dsh-music .back-btn {\r
  width: 34px; height: 34px; border-radius: 9999px; display: flex; align-items: center;\r
  justify-content: center; color: var(--muted); flex-shrink: 0;\r
}\r
.dsh-music .back-btn:hover { background: var(--hover); color: var(--text); }\r
.dsh-music .back-btn svg { width: 20px; height: 20px; }\r
.dsh-music .nav-title {\r
  font-size: 14px; font-weight: 600; max-width: 260px; overflow: hidden;\r
  text-overflow: ellipsis; white-space: nowrap;\r
}\r
.dsh-music .search-wrap { margin-left: auto; position: relative; }\r
.dsh-music .search-box {\r
  display: flex; align-items: center; gap: 8px; height: 36px; width: 230px;\r
  padding: 0 14px; border-radius: 9999px; background: var(--panel);\r
  border: 1px solid transparent; transition: width 0.25s ease, border-color 0.2s, background 0.2s;\r
  color: var(--muted);\r
}\r
.dsh-music .search-box:focus-within { width: 320px; border-color: var(--primary); background: var(--bg); }\r
.dsh-music .search-box svg { width: 16px; height: 16px; flex-shrink: 0; }\r
.dsh-music .search-box input {\r
  flex: 1; min-width: 0; background: none; border: none; outline: none; color: var(--text); font-size: 13px;\r
}\r
.dsh-music .search-box input::placeholder { color: var(--muted-2); }\r
.dsh-music .suggest {\r
  position: absolute; right: 0; top: 42px; width: 320px; background: var(--panel);\r
  border: 1px solid var(--line); border-radius: 12px; box-shadow: var(--shadow);\r
  padding: 6px; z-index: 70; max-height: 300px; overflow-y: auto;\r
}\r
.dsh-music .suggest-row {\r
  display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 8px;\r
  font-size: 13px; color: var(--text-2); cursor: pointer;\r
}\r
.dsh-music .suggest-row:hover { background: var(--hover); color: var(--text); }\r
.dsh-music .suggest-row svg { width: 14px; height: 14px; color: var(--muted); }\r
.dsh-music .user-btn {\r
  display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 4px; border-radius: 9999px;\r
  flex-shrink: 0;\r
}\r
.dsh-music .avatar { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; background: var(--panel-2); }\r
.dsh-music .avatar.sm { width: 26px; height: 26px; }\r
.dsh-music .login-link {\r
  font-size: 13px; color: var(--muted); padding: 6px 12px; border-radius: 9999px;\r
  border: 1px solid var(--line);\r
}\r
.dsh-music .login-link:hover { color: var(--primary); border-color: var(--primary); }\r
.dsh-music .icon-btn {\r
  width: 34px; height: 34px; border-radius: 9999px; display: inline-flex; align-items: center;\r
  justify-content: center; color: var(--muted); flex-shrink: 0; transition: color 0.16s, background 0.16s;\r
}\r
.dsh-music .icon-btn:hover { color: var(--text); background: var(--hover); }\r
.dsh-music .icon-btn.on { color: var(--primary); }\r
.dsh-music .icon-btn svg { width: 19px; height: 19px; }\r
.dsh-music .icon-btn.sm { width: 30px; height: 30px; }\r
.dsh-music .icon-btn.sm svg { width: 16px; height: 16px; }\r
\r
/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u5185\u5BB9\u533A \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
.dsh-music .main-content { flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden; position: relative; }\r
.dsh-music .page { padding: 0 var(--page-x) 130px; min-height: 100%; }\r
.dsh-music .page.tight { padding-top: 4px; }\r
.dsh-music .page-title { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; }\r
.dsh-music .page-sub { color: var(--muted); font-size: 14px; margin-top: 8px; }\r
\r
/* \u533A\u5757\u6807\u9898 */\r
.dsh-music .sec-head { display: flex; align-items: center; justify-content: space-between; margin: 34px 0 18px; }\r
.dsh-music .sec-title { display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 800; letter-spacing: -0.01em; }\r
.dsh-music .sec-title .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary); }\r
.dsh-music .sec-more {\r
  display: inline-flex; align-items: center; gap: 2px; font-size: 13px; font-weight: 600; color: var(--muted-2);\r
  transition: color 0.16s;\r
}\r
.dsh-music .sec-more:hover { color: var(--primary); }\r
.dsh-music .sec-more svg { width: 16px; height: 16px; transition: transform 0.16s; }\r
.dsh-music .sec-more:hover svg { transform: translateX(3px); }\r
\r
/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u9996\u9875 Hero \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
.dsh-music .hero-grid { display: grid; grid-template-columns: 3fr 2fr; gap: 12px; margin-top: 6px; }\r
.dsh-music .hero-card {\r
  position: relative; border-radius: var(--radius); overflow: hidden; height: 172px;\r
  background: var(--panel); cursor: pointer; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);\r
  transition: box-shadow 0.3s, transform 0.3s;\r
  animation: m-rise 0.5s ease both;\r
}\r
.dsh-music .hero-card:hover { box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22); }\r
.dsh-music .hero-card .hero-bg {\r
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;\r
  transition: transform 0.7s ease;\r
}\r
.dsh-music .hero-card:hover .hero-bg { transform: scale(1.05); }\r
.dsh-music .hero-card .shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,.72), rgba(0,0,0,.4) 55%, rgba(0,0,0,.18)); }\r
.dsh-music .hero-card .inner { position: relative; height: 100%; padding: 20px 22px; display: flex; flex-direction: column; justify-content: space-between; }\r
.dsh-music .hero-title { font-size: 27px; font-weight: 900; letter-spacing: 0.04em; color: #fff; line-height: 1.15; }\r
.dsh-music .hero-badge {\r
  display: inline-flex; align-items: center; gap: 4px; margin-top: 7px; padding: 2px 8px;\r
  border-radius: 6px; background: rgba(255, 255, 255, 0.16); color: rgba(255, 255, 255, 0.85);\r
  font-size: 11px; font-weight: 600; backdrop-filter: blur(4px); width: fit-content;\r
}\r
.dsh-music .hero-badge svg { width: 12px; height: 12px; }\r
.dsh-music .hero-bottom { display: flex; align-items: flex-end; justify-content: space-between; gap: 14px; }\r
.dsh-music .hero-songs { min-width: 0; flex: 1; max-width: 430px; display: flex; flex-direction: column; gap: 3px; }\r
.dsh-music .hero-song { display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255, 255, 255, 0.9); }\r
.dsh-music .hero-song .n { width: 14px; text-align: center; color: rgba(255, 255, 255, 0.45); font-size: 11px; flex-shrink: 0; }\r
.dsh-music .hero-song .t { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }\r
.dsh-music .hero-song .a { color: rgba(255, 255, 255, 0.45); font-size: 11px; max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\r
.dsh-music .hero-play {\r
  width: 44px; height: 44px; border-radius: 50%; background: rgba(255, 255, 255, 0.92); color: #111;\r
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;\r
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); transition: transform 0.2s, background 0.2s;\r
}\r
.dsh-music .hero-play:hover { transform: scale(1.08); background: #fff; }\r
.dsh-music .hero-play svg { width: 20px; height: 20px; margin-left: 2px; }\r
\r
.dsh-music .fm-card { display: flex; align-items: center; gap: 16px; height: 100%; padding: 18px 20px; position: relative; overflow: hidden; }\r
.dsh-music .hero-card .fm-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.3; filter: blur(28px); transform: scale(1.5); }\r
.dsh-music .hero-card .fm-veil { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,0,0,.52), rgba(0,0,0,.66)); }\r
.dsh-music .fm-cover { width: 118px; height: 118px; border-radius: 12px; object-fit: cover; flex-shrink: 0; box-shadow: 0 10px 26px rgba(0,0,0,.4); position: relative; }\r
.dsh-music .fm-info { position: relative; min-width: 0; flex: 1; display: flex; flex-direction: column; justify-content: space-between; height: 118px; }\r
.dsh-music .fm-name { color: #fff; font-size: 17px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\r
.dsh-music .fm-artist { color: rgba(255,255,255,.62); font-size: 13px; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\r
.dsh-music .fm-actions { display: flex; align-items: center; gap: 12px; }\r
.dsh-music .fm-actions .icon-btn { color: rgba(255,255,255,.6); }\r
.dsh-music .fm-actions .icon-btn:hover { color: #fff; background: rgba(255,255,255,.14); }\r
.dsh-music .fm-play { width: 38px; height: 38px; border-radius: 50%; background: rgba(255,255,255,.2); color: #fff; display: flex; align-items: center; justify-content: center; }\r
.dsh-music .fm-play:hover { background: rgba(255,255,255,.3); transform: scale(1.05); }\r
.dsh-music .fm-play svg { width: 18px; height: 18px; }\r
.dsh-music .fm-tag { position: absolute; right: 18px; bottom: 16px; display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; color: rgba(255,255,255,.5); }\r
.dsh-music .fm-tag svg { width: 13px; height: 13px; }\r
.dsh-music .eq { display: flex; align-items: flex-end; gap: 2px; height: 14px; }\r
.dsh-music .eq i { width: 3px; border-radius: 3px; background: var(--primary); animation: m-eq 0.8s ease-in-out infinite; }\r
.dsh-music .eq i:nth-child(1) { height: 6px; }\r
.dsh-music .eq i:nth-child(2) { height: 12px; animation-delay: 0.15s; }\r
.dsh-music .eq i:nth-child(3) { height: 8px; animation-delay: 0.3s; }\r
\r
/* 2x2 \u5C01\u9762\u5899(\u672A\u767B\u5F55\u65F6 hero \u53F3\u5361) */\r
.dsh-music .wall { position: absolute; inset: 0; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }\r
.dsh-music .wall img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s; }\r
.dsh-music .hero-card:hover .wall img { transform: scale(1.05); }\r
.dsh-music .wall-veil { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.34); }\r
.dsh-music .wall-inner { position: relative; height: 100%; padding: 18px 20px; display: flex; flex-direction: column; justify-content: space-between; }\r
.dsh-music .wall-badge { display: inline-flex; align-items: center; gap: 4px; width: fit-content; padding: 2px 8px; border-radius: 6px; background: rgba(0,0,0,.32); color: #fff; font-size: 11px; font-weight: 700; backdrop-filter: blur(4px); }\r
.dsh-music .wall-badge svg { width: 12px; height: 12px; }\r
.dsh-music .wall-title { color: #fff; font-size: 18px; font-weight: 800; }\r
.dsh-music .wall-sub { color: rgba(255,255,255,.7); font-size: 13px; margin-top: 3px; }\r
.dsh-music .wall-go { width: 38px; height: 38px; border-radius: 50%; background: rgba(255,255,255,.2); color: #fff; display: flex; align-items: center; justify-content: center; }\r
.dsh-music .wall-go svg { width: 19px; height: 19px; }\r
\r
/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u5C01\u9762\u7F51\u683C\u5361\u7247 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
.dsh-music .cover-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 24px 22px; }\r
.dsh-music .cover-card { cursor: pointer; min-width: 0; animation: m-rise 0.45s ease both; }\r
.dsh-music .cover-card .thumb {\r
  position: relative; aspect-ratio: 1; border-radius: var(--radius); overflow: hidden;\r
  background: var(--panel); box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12); transition: box-shadow 0.3s;\r
}\r
.dsh-music .cover-card:hover .thumb { box-shadow: 0 16px 34px rgba(0, 0, 0, 0.28); }\r
.dsh-music .cover-card .thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }\r
.dsh-music .cover-card:hover .thumb img { transform: scale(1.08); }\r
.dsh-music .cover-card .thumb .ph { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: var(--muted-2); background: linear-gradient(135deg, var(--panel-2), var(--panel)); }\r
.dsh-music .cover-card .thumb .ph svg { width: 34px; height: 34px; opacity: 0.5; }\r
.dsh-music .cover-card .thumb .veil { position: absolute; inset: 0; background: transparent; transition: background 0.3s; }\r
.dsh-music .cover-card:hover .thumb .veil { background: rgba(0, 0, 0, 0.22); }\r
.dsh-music .thumb-play {\r
  position: absolute; left: 50%; top: 50%; width: 48px; height: 48px; margin: -24px 0 0 -24px;\r
  border-radius: 50%; background: rgba(255, 255, 255, 0.92); color: #111; display: flex;\r
  align-items: center; justify-content: center; opacity: 0; transform: scale(0.75);\r
  transition: all 0.28s ease; box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);\r
}\r
.dsh-music .cover-card:hover .thumb-play { opacity: 1; transform: scale(1); }\r
.dsh-music .thumb-play:hover { transform: scale(1.08); background: #fff; }\r
.dsh-music .thumb-play svg { width: 20px; height: 20px; margin-left: 2px; }\r
.dsh-music .badge {\r
  position: absolute; display: flex; align-items: center; gap: 4px; padding: 3px 8px;\r
  border-radius: 8px; background: rgba(0, 0, 0, 0.42); color: #fff; font-size: 11px;\r
  font-weight: 700; backdrop-filter: blur(8px); opacity: 0; transition: opacity 0.25s;\r
}\r
.dsh-music .badge svg { width: 11px; height: 11px; }\r
.dsh-music .badge.play { top: 10px; right: 10px; }\r
.dsh-music .badge.time { bottom: 10px; left: 10px; }\r
.dsh-music .cover-card:hover .badge { opacity: 1; }\r
.dsh-music .cover-card .cap { margin-top: 10px; padding: 0 2px; }\r
.dsh-music .cover-card .cap .t {\r
  font-size: 15px; font-weight: 700; line-height: 1.35; overflow: hidden; text-overflow: ellipsis;\r
  white-space: nowrap; transition: color 0.16s;\r
}\r
.dsh-music .cover-card:hover .cap .t { color: var(--primary); }\r
.dsh-music .cover-card .cap .s { font-size: 13px; color: var(--muted); margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\r
.dsh-music .cover-card.round .thumb { border-radius: 50%; }\r
.dsh-music .cover-card.round .cap { text-align: center; }\r
\r
/* \u60AC\u505C\u66F2\u76EE\u9884\u89C8(\u53C2\u8003 HomeListItem) */\r
.dsh-music .hover-tracks {\r
  position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end;\r
  gap: 6px; padding: 16px; opacity: 0; transition: opacity 0.35s ease;\r
  background: linear-gradient(to top, rgba(0, 0, 0, 0.94) 0%, rgba(0, 0, 0, 0.7) 55%, rgba(0, 0, 0, 0.15) 100%);\r
}\r
.dsh-music .cover-card:hover .hover-tracks { opacity: 1; }\r
.dsh-music .hover-track { display: flex; align-items: center; gap: 8px; color: rgba(255, 255, 255, 0.95); font-size: 13px; font-weight: 600; transform: translateY(6px); transition: transform 0.35s; }\r
.dsh-music .cover-card:hover .hover-track { transform: none; }\r
.dsh-music .hover-track .n { width: 16px; color: rgba(255, 255, 255, 0.45); font-size: 11px; text-align: center; flex-shrink: 0; }\r
.dsh-music .hover-track .t { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\r
.dsh-music .hover-play-btn {\r
  position: absolute; right: 14px; bottom: 14px; width: 44px; height: 44px; border-radius: 50%;\r
  background: #fff; color: #111; display: flex; align-items: center; justify-content: center;\r
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4); opacity: 0; transform: translateY(8px);\r
  transition: all 0.35s;\r
}\r
.dsh-music .cover-card:hover .hover-play-btn { opacity: 1; transform: none; }\r
.dsh-music .hover-play-btn:hover { transform: scale(1.08); }\r
.dsh-music .hover-play-btn svg { width: 19px; height: 19px; margin-left: 2px; }\r
\r
/* \u6B4C\u624B\u884C */\r
.dsh-music .artist-row { display: flex; gap: 30px; overflow-x: auto; padding: 4px 0 10px; }\r
.dsh-music .artist-row::-webkit-scrollbar { height: 6px; }\r
.dsh-music .artist-card { flex-shrink: 0; width: 118px; text-align: center; cursor: pointer; }\r
.dsh-music .artist-card .av {\r
  width: 108px; height: 108px; margin: 0 auto; border-radius: 50%; overflow: hidden;\r
  background: var(--panel); box-shadow: 0 8px 22px rgba(0, 0, 0, 0.18); transition: transform 0.4s, box-shadow 0.4s;\r
}\r
.dsh-music .artist-card:hover .av { transform: scale(1.07); box-shadow: 0 14px 30px rgba(34, 197, 94, 0.24); }\r
.dsh-music .artist-card .av img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(0.15); transition: filter 0.4s; }\r
.dsh-music .artist-card:hover .av img { filter: none; }\r
.dsh-music .artist-card .n { margin-top: 10px; font-size: 13px; font-weight: 600; color: var(--text-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\r
.dsh-music .artist-card:hover .n { color: var(--primary); }\r
\r
/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u6B4C\u66F2\u5217\u8868 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
.dsh-music .song-list { display: flex; flex-direction: column; gap: 2px; }\r
.dsh-music .song-head {\r
  display: grid; grid-template-columns: 42px minmax(0, 1.7fr) minmax(0, 1fr) 62px 150px;\r
  gap: 14px; align-items: center; height: 34px; padding: 0 12px; color: var(--muted-2);\r
  font-size: 12px; font-weight: 600;\r
}\r
.dsh-music .song-row {\r
  display: grid; grid-template-columns: 42px minmax(0, 1.7fr) minmax(0, 1fr) 62px 150px;\r
  gap: 14px; align-items: center; height: 60px; padding: 0 12px; border-radius: 12px;\r
  cursor: default; transition: background 0.15s; position: relative;\r
}\r
.dsh-music .song-row:hover { background: var(--hover); }\r
.dsh-music .song-row.playing { background: var(--primary-soft); }\r
.dsh-music .song-row .idx { color: var(--muted-2); font-size: 13px; font-variant-numeric: tabular-nums; text-align: center; }\r
.dsh-music .song-row .idx svg { width: 15px; height: 15px; }\r
.dsh-music .song-row.playing .idx { color: var(--primary); }\r
.dsh-music .song-main { display: flex; align-items: center; gap: 12px; min-width: 0; }\r
.dsh-music .song-cover { width: 44px; height: 44px; border-radius: 10px; object-fit: cover; background: var(--panel-2); flex-shrink: 0; }\r
.dsh-music .song-text { min-width: 0; flex: 1; }\r
.dsh-music .song-name {\r
  font-size: 14px; font-weight: 600; color: var(--text); overflow: hidden; text-overflow: ellipsis;\r
  white-space: nowrap; display: flex; align-items: center; gap: 6px;\r
}\r
.dsh-music .song-row.playing .song-name { color: var(--primary); }\r
.dsh-music .song-name .alias { color: var(--muted-2); font-weight: 400; font-size: 12px; }\r
.dsh-music .song-vip {\r
  font-size: 10px; font-weight: 700; color: #e8b34b; border: 1px solid rgba(232, 179, 75, 0.45);\r
  border-radius: 4px; padding: 0 3px; flex-shrink: 0; line-height: 14px;\r
}\r
.dsh-music .song-artist {\r
  margin-top: 3px; font-size: 12px; color: var(--muted); overflow: hidden; text-overflow: ellipsis;\r
  white-space: nowrap; display: flex; align-items: center; gap: 4px;\r
}\r
.dsh-music .song-artist .link:hover { color: var(--primary); cursor: pointer; }\r
.dsh-music .song-album { font-size: 13px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\r
.dsh-music .song-album:hover { color: var(--text); cursor: pointer; }\r
.dsh-music .song-dur { font-size: 12px; color: var(--muted-2); font-variant-numeric: tabular-nums; text-align: right; }\r
.dsh-music .song-ops { display: flex; align-items: center; justify-content: flex-end; gap: 2px; opacity: 0; transition: opacity 0.16s; }\r
.dsh-music .song-row:hover .song-ops, .dsh-music .song-row.playing .song-ops, .dsh-music .song-ops.show { opacity: 1; }\r
.dsh-music .song-op-play {\r
  width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;\r
  border: 1px solid var(--line); color: var(--text); background: var(--bg); margin-left: 6px;\r
  transition: all 0.16s;\r
}\r
.dsh-music .song-op-play:hover { background: var(--primary); border-color: var(--primary); color: #fff; }\r
.dsh-music .song-op-play svg { width: 17px; height: 17px; }\r
.dsh-music .song-row.compact { grid-template-columns: minmax(0, 1fr) 56px; height: 56px; }\r
.dsh-music .song-row.compact .song-cover { width: 40px; height: 40px; border-radius: 8px; }\r
.dsh-music .song-row.compact .song-name { font-size: 13px; }\r
.dsh-music .song-row.compact .song-artist { font-size: 11px; }\r
\r
/* \u9996\u9875\u65B0\u6B4C\u5361 */\r
.dsh-music .new-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px 14px; }\r
.dsh-music .new-card {\r
  display: flex; align-items: center; gap: 12px; padding: 8px; border-radius: 12px; cursor: pointer;\r
  transition: background 0.16s; min-width: 0;\r
}\r
.dsh-music .new-card:hover { background: var(--hover); }\r
.dsh-music .new-card .cv { width: 56px; height: 56px; border-radius: 10px; object-fit: cover; background: var(--panel-2); flex-shrink: 0; position: relative; overflow: hidden; }\r
.dsh-music .new-card .cv .pl { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.28); color: #fff; opacity: 0; transition: opacity 0.2s; }\r
.dsh-music .new-card:hover .cv .pl { opacity: 1; }\r
.dsh-music .new-card .cv .pl svg { width: 20px; height: 20px; }\r
.dsh-music .new-card .meta { min-width: 0; flex: 1; }\r
.dsh-music .new-card .meta .t { font-size: 14px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\r
.dsh-music .new-card:hover .meta .t { color: var(--primary); }\r
.dsh-music .new-card.playing .meta .t { color: var(--primary); }\r
.dsh-music .new-card .meta .a { font-size: 12px; color: var(--muted); margin-top: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\r
\r
/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u8BE6\u60C5\u9875(\u6B4C\u5355 / \u4E13\u8F91 / \u6B4C\u624B) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
.dsh-music .detail { position: relative; padding-top: 10px; }\r
.dsh-music .detail-bg { position: absolute; inset: -40px calc(var(--page-x) * -1) auto calc(var(--page-x) * -1); height: 420px; overflow: hidden; pointer-events: none; }\r
.dsh-music .detail-bg .img { position: absolute; inset: 0; background-size: cover; background-position: center; filter: blur(64px) saturate(1.2); opacity: 0.4; transform: scale(1.2); }\r
.dsh-music .detail-bg .fade { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, var(--bg) 82%); }\r
.dsh-music .detail-head { position: relative; display: flex; gap: 30px; align-items: flex-end; padding: 16px 0 22px; }\r
.dsh-music .detail-cover {\r
  width: 218px; height: 218px; border-radius: 18px; object-fit: cover; flex-shrink: 0;\r
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45); background: var(--panel); position: relative;\r
}\r
.dsh-music .detail-cover-wrap { position: relative; flex-shrink: 0; border-radius: 18px; overflow: hidden; }\r
.dsh-music .detail-cover-wrap .cover-play {\r
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;\r
  background: rgba(0, 0, 0, 0); transition: background 0.25s; cursor: pointer;\r
}\r
.dsh-music .detail-cover-wrap:hover .cover-play { background: rgba(0, 0, 0, 0.3); }\r
.dsh-music .detail-cover-wrap .cover-play button {\r
  width: 62px; height: 62px; border-radius: 50%; background: rgba(255, 255, 255, 0.92); color: #111;\r
  display: flex; align-items: center; justify-content: center; opacity: 0; transform: scale(0.8);\r
  transition: all 0.25s; box-shadow: 0 14px 32px rgba(0, 0, 0, 0.4);\r
}\r
.dsh-music .detail-cover-wrap:hover .cover-play button { opacity: 1; transform: scale(1); }\r
.dsh-music .detail-cover-wrap .cover-play svg { width: 26px; height: 26px; margin-left: 3px; }\r
.dsh-music .detail-info { flex: 1; min-width: 0; padding-bottom: 4px; }\r
.dsh-music .detail-kind {\r
  display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 9999px;\r
  background: var(--primary-soft); color: var(--primary); font-size: 11px; font-weight: 700;\r
  letter-spacing: 0.08em; text-transform: uppercase;\r
}\r
.dsh-music .detail-name { font-size: 34px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; margin: 10px 0 12px; }\r
.dsh-music .detail-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 13px; color: var(--muted); }\r
.dsh-music .detail-meta .who { display: flex; align-items: center; gap: 7px; font-weight: 600; color: var(--text-2); }\r
.dsh-music .detail-meta .who img { width: 26px; height: 26px; border-radius: 50%; object-fit: cover; background: var(--panel-2); }\r
.dsh-music .detail-meta .sep { width: 3px; height: 3px; border-radius: 50%; background: var(--muted-2); }\r
.dsh-music .detail-desc {\r
  margin-top: 12px; font-size: 13px; color: var(--muted); line-height: 1.7; max-width: 820px;\r
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;\r
}\r
.dsh-music .detail-desc.open { -webkit-line-clamp: unset; }\r
.dsh-music .action-bar {\r
  position: sticky; top: 0; z-index: 20; display: flex; align-items: center; gap: 12px;\r
  padding: 14px 0; background: var(--bg); background: color-mix(in srgb, var(--bg) 86%, transparent);\r
  backdrop-filter: blur(14px); border-bottom: 1px solid var(--line); margin-bottom: 6px;\r
}\r
.dsh-music .pill-btn {\r
  display: inline-flex; align-items: center; gap: 7px; height: 38px; padding: 0 20px;\r
  border-radius: 9999px; font-size: 13px; font-weight: 700; transition: all 0.18s;\r
}\r
.dsh-music .pill-btn svg { width: 17px; height: 17px; }\r
.dsh-music .pill-btn.primary { background: var(--primary); color: #fff; box-shadow: 0 8px 20px rgba(34, 197, 94, 0.28); }\r
.dsh-music .pill-btn.primary:hover { background: var(--primary-dark); transform: scale(1.03); }\r
.dsh-music .pill-btn.ghost { border: 1px solid var(--line); background: var(--panel); color: var(--text-2); }\r
.dsh-music .pill-btn.ghost:hover { background: var(--panel-2); }\r
.dsh-music .pill-btn.ghost.on { color: #ef4444; border-color: rgba(239, 68, 68, 0.3); }\r
.dsh-music .pill-btn.icon { width: 38px; padding: 0; justify-content: center; }\r
\r
/* \u5206\u7C7B chips */\r
.dsh-music .chips { display: flex; gap: 8px; flex-wrap: wrap; margin: 4px 0 18px; }\r
.dsh-music .chips.cats { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }\r
.dsh-music .chips.cats::-webkit-scrollbar { height: 0; }\r
.dsh-music .chips.cats .chip { flex-shrink: 0; }\r
.dsh-music .chip {\r
  height: 32px; padding: 0 14px; border-radius: 9999px; background: var(--panel); color: var(--muted);\r
  font-size: 13px; font-weight: 600; transition: all 0.16s;\r
}\r
.dsh-music .chip:hover { color: var(--text); background: var(--panel-2); }\r
.dsh-music .chip.on { background: var(--primary); color: #fff; }\r
\r
/* \u641C\u7D22\u9875 */\r
.dsh-music .search-hero { padding: 8px 0 4px; }\r
.dsh-music .search-hero h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; }\r
.dsh-music .hot-list { display: flex; flex-direction: column; gap: 2px; max-width: 620px; }\r
.dsh-music .hot-row { display: flex; align-items: center; gap: 12px; height: 42px; padding: 0 10px; border-radius: 10px; cursor: pointer; }\r
.dsh-music .hot-row:hover { background: var(--hover); }\r
.dsh-music .hot-row .n { width: 22px; text-align: center; font-weight: 800; color: var(--muted-2); font-variant-numeric: tabular-nums; }\r
.dsh-music .hot-row:nth-child(-n + 3) .n { color: var(--primary); }\r
.dsh-music .hot-row .k { flex: 1; font-size: 14px; }\r
.dsh-music .hot-row .s { font-size: 11px; color: var(--muted-2); }\r
.dsh-music .history-chips { display: flex; gap: 8px; flex-wrap: wrap; }\r
\r
/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u64AD\u653E\u6761 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
.dsh-music .playbar {\r
  position: absolute; left: 0; right: 0; bottom: 0; height: 80px; z-index: 40;\r
  display: flex; align-items: center; gap: 14px; padding: 0 var(--page-x);\r
  background: var(--bg); box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.28); cursor: pointer;\r
}\r
.dsh-music .playbar.idle { justify-content: center; color: var(--muted); font-size: 13px; cursor: default; }\r
.dsh-music .pb-progress { position: absolute; top: -8px; left: 0; right: 0; height: 20px; display: flex; align-items: center; cursor: pointer; touch-action: none; outline: none; }\r
.dsh-music .pb-progress.off { cursor: default; }\r
.dsh-music .pb-progress .track { position: relative; height: 4px; width: 100%; border-radius: 0; background: var(--panel-2); transition: height 0.15s; overflow: visible; }\r
.dsh-music .pb-progress:hover .track, .dsh-music .pb-progress.dragging .track { height: 6px; }\r
.dsh-music .pb-progress .fill { position: absolute; inset: 0 auto 0 0; background: var(--primary); border-radius: 0; }\r
.dsh-music .pb-progress .knob {\r
  position: absolute; top: 50%; width: 12px; height: 12px; border-radius: 50%; background: var(--primary);\r
  transform: translate(-50%, -50%); opacity: 0; transition: opacity 0.15s; box-shadow: 0 1px 4px rgba(0,0,0,.4);\r
}\r
.dsh-music .pb-progress:hover .knob, .dsh-music .pb-progress.dragging .knob { opacity: 1; }\r
.dsh-music .pb-range {\r
  position: absolute; inset: 0; z-index: 1; width: 100%; height: 100%; margin: 0; padding: 0;\r
  opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: transparent;\r
}\r
.dsh-music .pb-range:disabled { cursor: default; }\r
.dsh-music .pb-progress:focus-within .knob { opacity: 1; }\r
.dsh-music .pb-progress .hint {\r
  position: absolute; top: -26px; transform: translateX(-50%); background: var(--panel-2); color: var(--text);\r
  font-size: 11px; padding: 3px 7px; border-radius: 6px; pointer-events: none; white-space: nowrap; opacity: 0;\r
  transition: opacity 0.15s;\r
}\r
.dsh-music .pb-progress:hover .hint { opacity: 1; }\r
\r
.dsh-music .pb-cover-wrap { position: relative; width: 56px; height: 56px; flex-shrink: 0; border-radius: 16px; overflow: hidden; }\r
.dsh-music .pb-cover { width: 100%; height: 100%; object-fit: cover; background: var(--panel-2); }\r
.dsh-music .pb-cover-wrap .arrow {\r
  position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center;\r
  justify-content: center; gap: 1px; background: rgba(0, 0, 0, 0.5); color: #fff; opacity: 0;\r
  transition: opacity 0.25s;\r
}\r
.dsh-music .pb-cover-wrap:hover .arrow { opacity: 1; }\r
.dsh-music .pb-cover-wrap .arrow svg { width: 22px; height: 22px; }\r
.dsh-music .pb-cover-wrap .arrow span { font-size: 9px; transform: scale(0.92); }\r
.dsh-music .pb-loading {\r
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;\r
  background: rgba(0, 0, 0, 0.45); color: #fff;\r
}\r
.dsh-music .pb-loading svg { width: 22px; height: 22px; animation: m-spin 1s linear infinite; }\r
.dsh-music .pb-meta { width: 210px; min-width: 0; }\r
.dsh-music .pb-meta .t { display: flex; align-items: center; gap: 6px; font-size: 15px; font-weight: 600; }\r
.dsh-music .pb-meta .t .txt { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\r
.dsh-music .pb-meta .a { margin-top: 4px; font-size: 12px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\r
.dsh-music .pb-meta .a .link:hover { color: var(--primary); cursor: pointer; }\r
.dsh-music .pb-meta .err { color: #f87171; }\r
.dsh-music .pb-rate { font-size: 10px; font-weight: 700; color: var(--primary); background: var(--primary-soft); border-radius: 4px; padding: 1px 4px; }\r
.dsh-music .pb-buttons { flex: 1; display: flex; align-items: center; justify-content: center; gap: 18px; }\r
.dsh-music .pb-buttons .icon-btn { width: 40px; height: 40px; color: var(--text-2); }\r
.dsh-music .pb-buttons .icon-btn svg { width: 22px; height: 22px; }\r
.dsh-music .pb-play {\r
  width: 76px; height: 46px; border-radius: 9999px; display: flex; align-items: center; justify-content: center;\r
  background: var(--panel); color: var(--text); transition: background 0.16s, color 0.16s;\r
}\r
.dsh-music .pb-play:hover { background: var(--panel-2); color: var(--primary); }\r
.dsh-music .pb-play svg { width: 26px; height: 26px; }\r
.dsh-music .pb-side { display: flex; align-items: center; gap: 2px; }\r
.dsh-music .pb-side .icon-btn { width: 38px; height: 38px; }\r
.dsh-music .pb-side .icon-btn svg { width: 20px; height: 20px; }\r
.dsh-music .pb-time { font-size: 12px; color: var(--muted-2); font-variant-numeric: tabular-nums; margin-right: 8px; white-space: nowrap; }\r
.dsh-music .volume-wrap { position: relative; display: flex; align-items: center; }\r
.dsh-music .volume-pop {\r
  position: absolute; bottom: 42px; left: 50%; transform: translateX(-50%); width: 46px; height: 186px;\r
  border-radius: 14px; background: var(--panel); border: 1px solid var(--line); box-shadow: var(--shadow);\r
  display: flex; align-items: center; justify-content: center; padding: 12px 0;\r
}\r
.dsh-music .volume-pop .pct {\r
  position: absolute; top: -26px; left: 50%; transform: translateX(-50%); font-size: 11px;\r
  background: var(--panel-2); border-radius: 6px; padding: 2px 7px; white-space: nowrap;\r
}\r
.dsh-music .vslider { position: relative; width: 6px; height: 130px; border-radius: 3px; background: var(--panel-3); cursor: pointer; touch-action: none; }\r
.dsh-music .vslider .fill { position: absolute; bottom: 0; left: 0; width: 100%; border-radius: 3px; background: var(--primary); pointer-events: none; }\r
.dsh-music .vslider .knob {\r
  position: absolute; left: 50%; transform: translate(-50%, 50%); width: 13px; height: 13px; border-radius: 50%;\r
  background: #fff; box-shadow: 0 1px 5px rgba(0, 0, 0, 0.5); pointer-events: none;\r
}\r
\r
/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u64AD\u653E\u5217\u8868\u62BD\u5C49 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
.dsh-music .drawer-mask { position: absolute; inset: 0; z-index: 48; background: transparent; }\r
.dsh-music .queue-panel {\r
  position: absolute; right: 0; top: 15%; height: 70%; width: 360px; z-index: 50;\r
  border-radius: 14px 0 0 14px; background: var(--bg); border: 1px solid var(--line);\r
  border-right: none; box-shadow: -20px 0 50px rgba(0, 0, 0, 0.35); display: flex; flex-direction: column;\r
  overflow: hidden; animation: m-slide-left 0.35s cubic-bezier(0.22, 1, 0.36, 1);\r
}\r
.dsh-music .qp-head {\r
  display: flex; align-items: center; gap: 6px; padding: 10px 12px 10px 18px;\r
  border-bottom: 1px solid var(--line); background: var(--bg); background: color-mix(in srgb, var(--bg) 78%, transparent);\r
  backdrop-filter: blur(10px); flex-shrink: 0;\r
}\r
.dsh-music .qp-head .title { font-size: 15px; font-weight: 600; }\r
.dsh-music .qp-head .n { font-size: 12px; color: var(--muted); }\r
.dsh-music .qp-head .grow { flex: 1; }\r
.dsh-music .qp-list { flex: 1; overflow-y: auto; padding: 4px 4px 10px; }\r
.dsh-music .qp-item { display: flex; align-items: center; gap: 10px; padding: 6px 8px; border-radius: 10px; cursor: pointer; }\r
.dsh-music .qp-item:hover { background: var(--hover); }\r
.dsh-music .qp-item.playing .t { color: var(--primary); }\r
.dsh-music .qp-item .cv { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; background: var(--panel-2); flex-shrink: 0; }\r
.dsh-music .qp-item .meta { flex: 1; min-width: 0; display: flex; flex-direction: column; }\r
.dsh-music .qp-item .t { font-size: 13px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\r
.dsh-music .qp-item .a { font-size: 11px; color: var(--muted); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\r
.dsh-music .qp-item .del { opacity: 0; }\r
.dsh-music .qp-item:hover .del { opacity: 1; }\r
\r
/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u6C89\u6D78\u5F0F\u64AD\u653E\u9875 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
.dsh-music .music-full { position: absolute; inset: 0; z-index: 60; overflow: hidden; display: flex; flex-direction: column; animation: m-fade 0.3s ease; background: #080808; }\r
.dsh-music .mf-bg { position: absolute; inset: -10%; background-size: cover; background-position: center; filter: blur(72px) saturate(1.3); opacity: 0.55; transform: scale(1.2); }\r
.dsh-music .mf-veil { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.72)); }\r
.dsh-music .mf-top { position: relative; display: flex; align-items: center; justify-content: space-between; padding: 22px 28px; z-index: 2; }\r
.dsh-music .mf-top .icon-btn { color: rgba(255, 255, 255, 0.75); }\r
.dsh-music .mf-top .icon-btn:hover { color: #fff; background: rgba(255, 255, 255, 0.12); }\r
.dsh-music .mf-body { position: relative; flex: 1; display: flex; min-height: 0; padding: 0 56px 56px; gap: 56px; z-index: 2; }\r
.dsh-music .mf-left { width: 42%; max-width: 470px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; min-width: 0; }\r
.dsh-music .mf-cover-wrap { width: 100%; max-width: 360px; aspect-ratio: 1; border-radius: 22px; overflow: hidden; box-shadow: 0 40px 90px rgba(0, 0, 0, 0.6); position: relative; }\r
.dsh-music .mf-cover-wrap img { width: 100%; height: 100%; object-fit: cover; }\r
.dsh-music .mf-info { text-align: center; max-width: 420px; }\r
.dsh-music .mf-info .t { color: #fff; font-size: 24px; font-weight: 800; letter-spacing: -0.01em; }\r
.dsh-music .mf-info .a { color: rgba(255, 255, 255, 0.62); font-size: 13px; margin-top: 8px; }\r
.dsh-music .mf-info .a .link:hover { color: var(--primary); cursor: pointer; }\r
.dsh-music .mf-mini { width: 100%; max-width: 420px; margin-top: 6px; }\r
.dsh-music .mf-mini .row { display: flex; align-items: center; gap: 14px; color: rgba(255,255,255,.85); }\r
.dsh-music .mf-mini .row .icon-btn { color: rgba(255,255,255,.72); }\r
.dsh-music .mf-mini .row .icon-btn:hover { color: #fff; background: rgba(255,255,255,.12); }\r
.dsh-music .mf-mini .play { width: 58px; height: 58px; border-radius: 50%; background: rgba(255,255,255,.16); color: #fff; display: flex; align-items: center; justify-content: center; }\r
.dsh-music .mf-mini .play:hover { background: rgba(255,255,255,.26); }\r
.dsh-music .mf-mini .play svg { width: 26px; height: 26px; }\r
.dsh-music .mf-mini .time { font-size: 11px; color: rgba(255,255,255,.55); font-variant-numeric: tabular-nums; }\r
.dsh-music .mf-mini .bar { position: relative; top: 0; left: 0; right: 0; margin-top: 12px; }\r
.dsh-music .mf-mini .bar .track { background: rgba(255,255,255,.18); }\r
.dsh-music .mf-mini .bar .fill { background: #fff; }\r
.dsh-music .mf-right { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }\r
.dsh-music .lyric-box { position: relative; flex: 1; overflow-y: auto; padding: 30vh 24px 34vh; scroll-behavior: smooth; max-height: 100%; }\r
.dsh-music .lyric-box::-webkit-scrollbar { width: 0; }\r
.dsh-music .lyric-line {\r
  padding: 8px 0; font-size: 16px; line-height: 1.5; color: rgba(255, 255, 255, 0.42);\r
  transition: color 0.25s, transform 0.25s, font-size 0.25s; transform-origin: left center; cursor: pointer;\r
}\r
.dsh-music .lyric-line:hover { color: rgba(255, 255, 255, 0.72); }\r
.dsh-music .lyric-line.on { color: #fff; font-size: 21px; font-weight: 800; transform: scale(1.02); }\r
.dsh-music .lyric-line .tr { display: block; margin-top: 4px; font-size: 12px; font-weight: 400; color: rgba(255, 255, 255, 0.5); }\r
.dsh-music .lyric-line.on .tr { color: rgba(255, 255, 255, 0.7); }\r
.dsh-music .lyric-empty { color: rgba(255,255,255,.5); font-size: 14px; padding: 40px 0; }\r
\r
/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u8BBE\u7F6E / \u6211\u7684 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
.dsh-music .settings { max-width: 880px; }\r
.dsh-music .set-tabs { display: flex; gap: 6px; margin: 16px 0 8px; flex-wrap: wrap; }\r
.dsh-music .set-section { margin-top: 8px; }\r
.dsh-music .set-row { display: flex; align-items: center; gap: 16px; min-height: 64px; padding: 10px 2px; border-bottom: 1px solid var(--line); }\r
.dsh-music .set-row .lab { flex: 1; min-width: 0; }\r
.dsh-music .set-row .lab .t { font-size: 14px; font-weight: 600; }\r
.dsh-music .set-row .lab .d { font-size: 12px; color: var(--muted); margin-top: 4px; line-height: 1.6; }\r
.dsh-music .seg { display: flex; gap: 2px; padding: 3px; border-radius: 10px; background: var(--panel); flex-shrink: 0; }\r
.dsh-music .seg button { padding: 5px 12px; border-radius: 8px; font-size: 12.5px; color: var(--muted); }\r
.dsh-music .seg button.on { background: var(--primary); color: #fff; font-weight: 600; }\r
.dsh-music .switch { width: 42px; height: 24px; border-radius: 12px; background: var(--panel-3); position: relative; cursor: pointer; transition: background 0.18s; flex-shrink: 0; }\r
.dsh-music .switch.on { background: var(--primary); }\r
.dsh-music .switch i { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: left 0.18s; }\r
.dsh-music .switch.on i { left: 21px; }\r
.dsh-music .ghost-btn {\r
  display: inline-flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 9999px;\r
  background: var(--panel); color: var(--text-2); font-size: 12.5px; font-weight: 600;\r
}\r
.dsh-music .ghost-btn:hover { background: var(--panel-2); color: var(--text); }\r
.dsh-music .ghost-btn.sm { padding: 5px 11px; font-size: 12px; }\r
.dsh-music .set-row .lab .path {\r
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11.5px;\r
  color: var(--text-2); word-break: break-all;\r
}\r
.dsh-music .set-row .lab code {\r
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11.5px;\r
  padding: 1px 4px; border-radius: 4px; background: var(--panel-2); color: var(--text-2);\r
}\r
.dsh-music .dl-head { display: flex; align-items: center; gap: 10px; padding: 18px 2px 6px; }\r
.dsh-music .dl-head .t { font-size: 14px; font-weight: 600; }\r
.dsh-music .dl-head .n { font-size: 12px; color: var(--muted); }\r
.dsh-music .dl-head .grow { flex: 1; }\r
.dsh-music .dl-empty { padding: 16px 2px; font-size: 12.5px; color: var(--muted); }\r
.dsh-music .dl-list { display: flex; flex-direction: column; }\r
.dsh-music .dl-item { display: flex; align-items: center; gap: 12px; padding: 8px 10px; border-radius: 10px; transition: background 0.15s; }\r
.dsh-music .dl-item:hover { background: var(--hover); }\r
.dsh-music .dl-item .n { flex: 1; min-width: 0; font-size: 13px; color: var(--text-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\r
.dsh-music .dl-item .n em {\r
  font-style: normal; font-size: 10px; font-weight: 700; color: #e8b34b; line-height: 14px;\r
  border: 1px solid rgba(232, 179, 75, 0.45); border-radius: 4px; padding: 0 3px; margin-left: 6px;\r
}\r
.dsh-music .dl-item .m { flex-shrink: 0; font-size: 11.5px; color: var(--muted-2); font-variant-numeric: tabular-nums; }\r
.dsh-music .qr-panel {\r
  margin-top: 14px; display: inline-flex; flex-direction: column; align-items: center; gap: 10px;\r
  background: #fff; border-radius: 16px; padding: 14px; box-shadow: var(--shadow);\r
}\r
.dsh-music .qr-panel img { width: 172px; height: 172px; }\r
.dsh-music .qr-panel img.dim { opacity: 0.28; }\r
.dsh-music .qr-msg { font-size: 12.5px; color: #161616; font-weight: 600; }\r
.dsh-music .qr-msg.expired { color: #c0392b; }\r
.dsh-music .qr-msg.scanned { color: #0f9d58; }\r
.dsh-music .qr-tip { font-size: 11.5px; color: #8f93a3; }\r
.dsh-music .account-card {\r
  display: flex; align-items: center; gap: 14px; padding: 18px; border-radius: 16px;\r
  background: var(--panel); margin-top: 12px;\r
}\r
.dsh-music .account-card .av { width: 58px; height: 58px; border-radius: 50%; object-fit: cover; background: var(--panel-2); }\r
.dsh-music .account-card .n { font-size: 17px; font-weight: 700; }\r
.dsh-music .account-card .d { font-size: 12px; color: var(--muted); margin-top: 4px; }\r
.dsh-music .account-card .grow { flex: 1; }\r
\r
/* \u53F3\u952E\u83DC\u5355 */\r
.dsh-music .ctx-mask { position: fixed; inset: 0; z-index: 98; }\r
.dsh-music .ctx-menu {\r
  position: fixed; z-index: 99; width: 200px; padding: 6px; border-radius: 12px;\r
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--shadow);\r
  display: flex; flex-direction: column; gap: 1px; animation: m-pop 0.14s ease;\r
}\r
.dsh-music .ctx-item {\r
  display: flex; align-items: center; gap: 9px; width: 100%; height: 34px; padding: 0 10px;\r
  border-radius: 8px; font-size: 13px; color: var(--text-2); text-align: left;\r
}\r
.dsh-music .ctx-item:hover { background: var(--hover); color: var(--text); }\r
.dsh-music .ctx-item:disabled { opacity: 0.5; }\r
.dsh-music .ctx-item svg { width: 16px; height: 16px; flex-shrink: 0; }\r
.dsh-music .ctx-sep { height: 1px; margin: 4px 6px; background: var(--line); }\r
\r
/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u901A\u7528 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
.dsh-music .empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 80px 0; color: var(--muted); font-size: 13px; }\r
.dsh-music .empty svg { width: 46px; height: 46px; opacity: 0.25; }\r
.dsh-music .err { color: #f87171; font-size: 13px; padding: 24px 0; }\r
.dsh-music .skeleton {\r
  border-radius: var(--radius);\r
  background: linear-gradient(90deg, var(--panel) 25%, var(--panel-2) 45%, var(--panel) 65%);\r
  background-size: 200% 100%; animation: m-shimmer 1.4s infinite;\r
}\r
.dsh-music .spinner { width: 16px; height: 16px; animation: m-spin 1s linear infinite; }\r
.dsh-music .loading-row { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 28px 0; color: var(--muted); font-size: 13px; }\r
.dsh-music .toast-wrap { position: absolute; left: 50%; bottom: 104px; transform: translateX(-50%); z-index: 90; display: flex; flex-direction: column; gap: 8px; align-items: center; pointer-events: none; }\r
.dsh-music .toast {\r
  display: flex; align-items: center; gap: 8px; padding: 9px 18px; border-radius: 20px;\r
  background: var(--panel); background: color-mix(in srgb, var(--panel) 88%, transparent); border: 1px solid var(--line);\r
  backdrop-filter: blur(16px); box-shadow: var(--shadow); font-size: 13px; color: var(--text);\r
  animation: m-toast 0.25s ease;\r
}\r
.dsh-music .toast.ok { color: var(--primary); }\r
.dsh-music .toast.err { color: #f87171; }\r
.dsh-music .toast svg { width: 16px; height: 16px; }\r
.dsh-music .toast .toast-msg { max-width: 420px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\r
.dsh-music .toast-action {\r
  pointer-events: auto; margin-left: 4px; padding: 3px 10px; border-radius: 9999px; font-size: 12px;\r
  font-weight: 600; color: var(--primary); background: var(--primary-soft); border: 1px solid transparent;\r
  transition: border-color 0.15s, background 0.15s;\r
}\r
.dsh-music .toast-action:hover { border-color: var(--primary); background: var(--primary-soft); }\r
.dsh-music .modal-mask { position: absolute; inset: 0; z-index: 95; background: rgba(0, 0, 0, 0.45); display: flex; align-items: center; justify-content: center; animation: m-fade 0.18s; }\r
.dsh-music .modal {\r
  width: 340px; border-radius: 16px; background: var(--bg); border: 1px solid var(--line);\r
  box-shadow: var(--shadow); padding: 22px; animation: m-pop 0.2s ease;\r
}\r
.dsh-music .modal h3 { font-size: 16px; font-weight: 700; }\r
.dsh-music .modal p { margin-top: 8px; font-size: 13px; color: var(--muted); line-height: 1.7; }\r
.dsh-music .modal .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }\r
.dsh-music .modal .actions button { height: 34px; padding: 0 16px; border-radius: 9999px; font-size: 13px; font-weight: 600; }\r
.dsh-music .modal .actions .cancel { background: var(--panel); color: var(--muted); }\r
.dsh-music .modal .actions .ok { background: var(--primary); color: #fff; }\r
.dsh-music .modal .actions .danger { background: #ef4444; color: #fff; }\r
\r
@keyframes m-spin { to { transform: rotate(360deg); } }\r
@keyframes m-fade { from { opacity: 0; } to { opacity: 1; } }\r
@keyframes m-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }\r
@keyframes m-pop { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: none; } }\r
@keyframes m-slide-left { from { transform: translateX(100%); opacity: 0.4; } to { transform: none; opacity: 1; } }\r
@keyframes m-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }\r
@keyframes m-toast { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }\r
@keyframes m-eq { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.7); } }\r
\r
/* \u7A84\u7A97\u53E3\u9002\u914D(DSH \u4E3B\u533A\u57DF\u53EF\u80FD\u88AB\u4FA7\u680F\u538B\u7F29) */\r
@media (max-width: 1080px) {\r
  .dsh-music { --page-x: 22px; }\r
  .dsh-music .hero-grid { grid-template-columns: 1fr; }\r
  .dsh-music .hero-card { height: 158px; }\r
  .dsh-music .cover-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px 18px; }\r
  .dsh-music .new-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }\r
  .dsh-music .detail-cover { width: 168px; height: 168px; }\r
  .dsh-music .detail-name { font-size: 27px; }\r
  .dsh-music .pb-meta { width: 160px; }\r
  .dsh-music .pb-time { display: none; }\r
  .dsh-music .mf-body { padding: 0 30px 40px; gap: 32px; }\r
  .dsh-music .mf-left { width: 46%; }\r
}\r
@media (max-width: 900px) {\r
  .dsh-music .cover-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }\r
  .dsh-music .new-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }\r
}\r
@media (max-width: 680px) {\r
  .dsh-music .cover-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }\r
  .dsh-music .new-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }\r
}\r
@media (max-width: 860px) {\r
  .dsh-music .tabs .tab span { display: none; }\r
  .dsh-music .tabs .tab { padding: 0 11px; }\r
  .dsh-music .search-box { width: 170px; }\r
  .dsh-music .search-box:focus-within { width: 220px; }\r
  .dsh-music .song-head, .dsh-music .song-row { grid-template-columns: 34px minmax(0, 1fr) 60px 138px; }\r
  .dsh-music .song-album, .dsh-music .song-head .album-col { display: none; }\r
  .dsh-music .mf-body { flex-direction: column; gap: 18px; align-items: center; overflow-y: auto; padding-bottom: 120px; }\r
  .dsh-music .mf-left { width: 100%; max-width: 300px; }\r
  .dsh-music .mf-cover-wrap { max-width: 220px; }\r
  .dsh-music .mf-right { width: 100%; }\r
  .dsh-music .lyric-box { padding: 10px 8px; }\r
}\r
`;async function getJson(pathname,params){let clean={};for(let[k,v]of Object.entries(params??{}))v!=null&&v!==""&&(clean[k]=v);let qs=Object.keys(clean).length?"?"+new URLSearchParams(clean).toString():"",res=await fetch("/music/api"+pathname+qs);if(!res.ok){let message=`HTTP ${res.status}`;try{let body=await res.json();body?.error&&(message=body.error)}catch{}throw new Error(message)}return res.json()}var api={health:()=>getJson("/health"),account:()=>getJson("/account"),qrKey:()=>getJson("/login/qr/key"),qrCreate:key=>getJson("/login/qr/create",{key}),qrCheck:key=>getJson("/login/qr/check",{key}),logout:()=>getJson("/logout"),home:()=>getJson("/home"),daily:()=>getJson("/daily"),fm:()=>getJson("/personal/fm"),playlists:(cat="\u5168\u90E8",limit=42,offset=0)=>getJson("/playlists",{cat,limit,offset}),playlistCategories:()=>getJson("/playlists/categories"),playlistDetail:id=>getJson("/playlist/detail",{id}),playlistTracks:(id,limit=200,offset=0)=>getJson("/playlist/tracks",{id,limit,offset}),toplists:()=>getJson("/toplists"),toplistTracks:(id,limit=100)=>getJson("/toplist/tracks",{id,limit}),albums:(limit=20,area="ALL")=>getJson("/album/new",{limit,area}),albumDetail:id=>getJson("/album/detail",{id}),artists:(limit=12,offset=0)=>getJson("/artist/top",{limit,offset}),artistDetail:id=>getJson("/artist/detail",{id}),artistAlbums:(id,limit=12,offset=0)=>getJson("/artist/albums",{id,limit,offset}),search:(keywords,type="song",limit=30,offset=0)=>getJson("/search",{keywords,type,limit,offset}),searchSuggest:keywords=>getJson("/search/suggest",{keywords}),searchHot:()=>getJson("/search/hot"),songDetail:ids=>getJson("/song/detail",{ids:[].concat(ids).join(",")}),songUrls:(ids,level)=>getJson("/song/urls",{ids:[].concat(ids).join(","),level}),lyric:id=>getJson("/lyric",{id}),like:(id,like=!0)=>getJson("/like",{id,like}),userPlaylists:(limit=30)=>getJson("/user/playlists",{limit}),download:({id,name,artist,level})=>getJson("/download",{id,name:name??"",artist:artist??"",...level?{level}:{}}),downloadInfo:()=>getJson("/download/info"),openDownloadDir:name=>getJson("/download/open",name?{name}:{})};function parseLrc(text){let lines=[];for(let raw of(text||"").split(`
`)){let matches=[...raw.matchAll(/\[(\d+):(\d+)(?:[.:](\d+))?\]/g)];if(matches.length===0)continue;let content=raw.replace(/\[[^\]]*\]/g,"").trim();if(content!=="\u6682\u65E0\u6B4C\u8BCD")for(let m of matches){let time=Number(m[1])*60+Number(m[2])+(m[3]?+`0.${m[3]}`:0);lines.push({time,text:content})}}return lines.sort((a,b)=>a.time-b.time)}function mediaBase(){let base=typeof globalThis>"u"?void 0:globalThis.__DSH_TRANSPORT__?.streamBaseUrl;return typeof base=="string"?base.replace(/\/+$/,""):""}function streamUrl(songId,level){return`${mediaBase()}/music/stream/${songId}${level?`?level=${encodeURIComponent(level)}`:""}`}function formatCount(n){return typeof n!="number"||!Number.isFinite(n)?"":n>=1e8?`${(n/1e8).toFixed(1).replace(/\.0$/,"")}\u4EBF`:n>=1e4?`${(n/1e4).toFixed(1).replace(/\.0$/,"")}\u4E07`:String(n)}function formatTime(sec){if(!Number.isFinite(sec))return"0:00";let s=Math.max(0,Math.round(sec));return`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`}function formatDate(ts){if(!ts)return"";let d=new Date(ts);return Number.isNaN(d.getTime())?"":`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}var import_react=require("react"),cache={status:"loading",account:null},listeners=new Set;async function refreshAccount(){try{cache={status:"ready",account:await api.account()}}catch{cache={status:"ready",account:{loggedIn:!1}}}for(let l of[...listeners])l(cache);return cache}function useAccount(){let[snap,setSnap]=(0,import_react.useState)(cache);return(0,import_react.useEffect)(()=>(listeners.add(setSnap),cache.status==="loading"&&refreshAccount(),()=>listeners.delete(setSnap)),[]),snap}var import_jsx_runtime=require("react/jsx-runtime");var PLAY_MODES=["loop","one","shuffle"];function nextIndex(queue,index,mode,rand=Math.random){let n=(queue??[]).length;if(n===0)return-1;if(mode==="one")return index;if(mode==="shuffle"){if(n<=1)return 0;let skip=1+Math.floor((rand()<0?0:rand())*(n-1));return(index+skip)%n}return(index+1)%n}function prevIndex(queue,index){let n=(queue??[]).length;return n===0?-1:(index-1+n)%n}function insertNext(queue,index,track){let list=queue??[];if(!track)return list;let rest=list.filter(t=>t.id!==track.id);if(index<0||index>=rest.length)return[...rest,track];let at=Math.min(index+1,rest.length);return[...rest.slice(0,at),track,...rest.slice(at)]}function shuffled(list,rand=Math.random){let out=(list??[]).slice();for(let i=out.length-1;i>0;i--){let j=Math.floor(rand()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}var import_react2=require("react"),STORE_KEY="dsh-music.player.v2",MAX_HISTORY=200,initial={queue:[],index:-1,playing:!1,loading:!1,position:0,duration:0,canSeek:!1,mode:"loop",volume:.8,muted:!1,level:void 0,rate:1,errorNote:void 0,favorites:[],history:[]},state={...initial},listeners2=new Set;function loadState(){try{let raw=localStorage.getItem(STORE_KEY);if(!raw)return;let s=JSON.parse(raw);if(!s||typeof s!="object")return;Array.isArray(s.queue)&&(state.queue=s.queue),typeof s.index=="number"&&(state.index=Math.min(s.index,state.queue.length-1)),PLAY_MODES.includes(s.mode)&&(state.mode=s.mode),typeof s.volume=="number"&&(state.volume=Math.min(Math.max(s.volume,0),1)),typeof s.level=="string"&&(state.level=s.level),typeof s.rate=="number"&&(state.rate=s.rate),Array.isArray(s.favorites)&&(state.favorites=s.favorites),Array.isArray(s.history)&&(state.history=s.history)}catch{}}var saving=null;function persist(){clearTimeout(saving),saving=setTimeout(()=>{try{localStorage.setItem(STORE_KEY,JSON.stringify({queue:state.queue,index:state.index,mode:state.mode,volume:state.volume,level:state.level,rate:state.rate,favorites:state.favorites.slice(0,500),history:state.history.slice(0,MAX_HISTORY)}))}catch{}},250)}function emit(){let snapshot={...state};for(let l of listeners2)l(snapshot);persist()}function set(patch){Object.assign(state,patch),emit()}var audioEl=null;function getAudio(){return audioEl||(audioEl=new Audio,audioEl.preload="auto"),audioEl}function currentTrack(){return state.index>=0&&state.index<state.queue.length?state.queue[state.index]:null}function seekCeiling(audio){return Number.isFinite(audio.duration)&&audio.duration>0?audio.duration:audio.seekable.length>0?audio.seekable.end(audio.seekable.length-1):null}var pendingSeek=null;function syncMediaMeta(){let audio=getAudio(),ceiling=seekCeiling(audio),duration=Number.isFinite(audio.duration)&&audio.duration>0?audio.duration:ceiling??state.duration;if(set({duration,canSeek:ceiling!==null}),pendingSeek!==null&&ceiling!==null){let sec=pendingSeek;pendingSeek=null,seek(sec)}}function remember(track){if(!track)return;let history=[track,...state.history.filter(t=>t.id!==track.id)].slice(0,MAX_HISTORY);state.history=history}function initPlayer(){if(initPlayer.done)return;initPlayer.done=!0,loadState();let audio=getAudio();audio.volume=state.volume,audio.playbackRate=state.rate,audio.addEventListener("timeupdate",()=>set({position:audio.currentTime})),audio.addEventListener("durationchange",syncMediaMeta),audio.addEventListener("loadedmetadata",syncMediaMeta),audio.addEventListener("canplay",()=>set({loading:!1,canSeek:seekCeiling(audio)!==null})),audio.addEventListener("waiting",()=>set({loading:!0})),audio.addEventListener("playing",()=>set({playing:!0,loading:!1})),audio.addEventListener("play",()=>set({playing:!0})),audio.addEventListener("pause",()=>set({playing:!1})),audio.addEventListener("ended",()=>nextSong(!0)),audio.addEventListener("error",()=>{pendingSeek=null,set({playing:!1,loading:!1,canSeek:!1});let track=currentTrack();track&&diagnosePlayFailure(track.id).then(note=>set({errorNote:note}))}),emit()}function playTrack(index){if(index<0||index>=state.queue.length)return;let track=state.queue[index],audio=getAudio();pendingSeek=null,remember(track),set({index,position:0,duration:track.duration?track.duration/1e3:0,canSeek:!1,loading:!0,errorNote:void 0}),audio.playbackRate=state.rate,audio.src=streamUrl(track.id,state.level),audio.play().catch(()=>set({playing:!1,loading:!1}))}async function diagnosePlayFailure(songId){try{let d=((await api.songUrls([songId])).items||[])[0];return d?!d.url&&d.fee===1?"VIP \u6B4C\u66F2:\u767B\u5F55\u7F51\u6613\u4E91\u8D26\u53F7\u540E\u53EF\u8BD5\u542C\u6216\u64AD\u653E":d.url?d.freeTrialInfo?"VIP \u6B4C\u66F2 \xB7 \u5F53\u524D\u4E3A\u8BD5\u542C\u7247\u6BB5(\u767B\u5F55\u4F1A\u5458\u8D26\u53F7\u53EF\u542C\u5B8C\u6574\u7248)":"\u64AD\u653E\u5931\u8D25,\u8BF7\u91CD\u8BD5":"\u672A\u83B7\u5F97\u64AD\u653E\u94FE\u63A5:\u767B\u5F55\u7F51\u6613\u4E91\u8D26\u53F7\u540E\u91CD\u8BD5":"\u62FF\u4E0D\u5230\u64AD\u653E\u4FE1\u606F:\u6B4C\u66F2\u53EF\u80FD\u5DF2\u4E0B\u67B6"}catch{return"\u64AD\u653E\u5931\u8D25,\u8BF7\u91CD\u8BD5"}}function playQueue(tracks,startIndex=0){!tracks||tracks.length===0||(set({queue:tracks.slice()}),playTrack(Math.min(Math.max(startIndex,0),tracks.length-1)))}function playNext(track){if(!track)return;let current=currentTrack();if(current&&current.id===track.id)return;let queue=insertNext(state.queue,state.index,track);set({queue}),state.index<0&&playTrack(queue.length-1)}function addToQueue(track,playNow=!1){let existing=state.queue.findIndex(t=>t.id===track.id);if(existing>=0){playNow&&playTrack(existing);return}let queue=[...state.queue,track];set({queue}),(playNow||state.index<0)&&playTrack(queue.length-1)}function removeFromQueue(index){if(index<0||index>=state.queue.length)return;let queue=state.queue.filter((_,i)=>i!==index),indexNew=state.index;if(index<state.index)indexNew-=1;else if(index===state.index){let audio=getAudio();audio.pause(),audio.removeAttribute("src"),pendingSeek=null,indexNew=Math.min(index,queue.length-1),set({queue,index:-1,playing:!1,position:0,duration:0,canSeek:!1}),indexNew>=0&&playTrack(indexNew);return}set({queue,index:indexNew})}function clearQueue(){let audio=getAudio();audio.pause(),audio.removeAttribute("src"),pendingSeek=null,set({queue:[],index:-1,playing:!1,position:0,duration:0,canSeek:!1,errorNote:void 0})}function togglePlay(){let audio=getAudio();if(!currentTrack()){state.queue.length>0&&playTrack(0);return}audio.paused?audio.play().catch(()=>set({playing:!1})):audio.pause()}function nextSong(auto=!1){if(state.queue.length===0)return;let mode=auto?state.mode:state.mode==="one"?"loop":state.mode;playTrack(nextIndex(state.queue,state.index,mode))}function prevSong(){state.queue.length!==0&&playTrack(prevIndex(state.queue,state.index))}function seek(sec){if(!Number.isFinite(sec)||sec<0)return;let audio=getAudio(),known=seekCeiling(audio)??(state.duration>0?state.duration:null);if(known===null){pendingSeek=sec;return}let target=Math.max(0,Math.min(sec,known));try{audio.currentTime=target}catch{pendingSeek=sec;return}pendingSeek=null;let realDuration=Number.isFinite(audio.duration)&&audio.duration>0?audio.duration:state.duration;set({position:target,duration:realDuration,canSeek:!0})}function setVolume(v){let volume=Math.min(Math.max(v,0),1),audio=getAudio();audio.volume=volume,audio.muted=!1,set({volume,muted:!1})}function toggleMute(){let audio=getAudio();audio.muted=!audio.muted,set({muted:audio.muted})}function cycleMode(){set({mode:PLAY_MODES[(PLAY_MODES.indexOf(state.mode)+1)%PLAY_MODES.length]})}function setMode(mode){PLAY_MODES.includes(mode)&&set({mode})}function setLevel(level){set({level}),currentTrack()&&state.playing&&playTrack(state.index)}function setRate(rate){let audio=getAudio();audio.playbackRate=rate,set({rate})}function isFavorite(id){return state.favorites.some(t=>t.id===id)}function toggleFavorite(track){let exists=state.favorites.some(t=>t.id===track.id),favorites=exists?state.favorites.filter(t=>t.id!==track.id):[track,...state.favorites];return set({favorites}),api.like(track.id,!exists).catch(()=>{}),!exists}function clearFavorites(){let removed=state.favorites;set({favorites:[]});for(let t of removed)api.like(t.id,!1).catch(()=>{})}function clearHistory(){set({history:[]})}function removeHistory(id){set({history:state.history.filter(t=>t.id!==id)})}function usePlayer(){let[snap,setSnap]=(0,import_react2.useState)({...state});return(0,import_react2.useEffect)(()=>(listeners2.add(setSnap),setSnap({...state}),()=>listeners2.delete(setSnap)),[]),snap}function usePlayerSelector(select,isEqual=Object.is){let selectRef=(0,import_react2.useRef)(select);selectRef.current=select;let[value,setValue]=(0,import_react2.useState)(()=>select(state));(0,import_react2.useEffect)(()=>{let prev=selectRef.current(state),listener=snap=>{let next=selectRef.current(snap);isEqual(prev,next)||(prev=next,setValue(next))};return listeners2.add(listener),listener(state),()=>listeners2.delete(listener)},[]);let current=select(state);return isEqual(value,current)||setValue(current),value}var EMPTY_LYRIC={lines:[],translation:[],loading:!1,error:void 0};function useLyric(songId){let[data,setData]=(0,import_react2.useState)(EMPTY_LYRIC);return(0,import_react2.useEffect)(()=>{let alive=!0;if(!songId){setData(EMPTY_LYRIC);return}return setData({...EMPTY_LYRIC,loading:!0}),api.lyric(songId).then(d=>{alive&&setData({lines:parseLrc(d.lyric),translation:parseLrc(d.translation),loading:!1,error:void 0})}).catch(error=>alive&&setData({...EMPTY_LYRIC,error:error.message})),()=>{alive=!1}},[songId]),data}var PlayerContext=(0,import_react2.createContext)(null);function PlayerProvider({children}){(0,import_react2.useEffect)(()=>{initPlayer()},[]);let value=(0,import_react2.useMemo)(()=>({playQueue,playTrack,playNext,addToQueue,removeFromQueue,clearQueue,togglePlay,nextSong:()=>nextSong(!1),prevSong,seek,setVolume,toggleMute,cycleMode,setMode,setLevel,setRate,toggleFavorite,clearFavorites,clearHistory,removeHistory,getAudio}),[]);return(0,import_jsx_runtime.jsx)(PlayerContext.Provider,{value,children})}function usePlayerActions(){return(0,import_react2.useContext)(PlayerContext)}function useCurrentTrack(){let snap=usePlayer();return snap.index>=0&&snap.index<snap.queue.length?snap.queue[snap.index]:null}function useIsCurrent(trackId){return usePlayerSelector(s=>s.index>=0&&s.queue[s.index]?.id===trackId)}function useFavoriteState(trackId){return usePlayerSelector(s=>s.favorites.some(t=>t.id===trackId))}var import_react3=require("react"),NavContext=(0,import_react3.createContext)(null);function useNav(){return(0,import_react3.useContext)(NavContext)||{page:{name:"home"},nav(){},back(){},canBack:!1,openFull(){},openQueue(){},toast(){},theme:"dark",setTheme(){}}}var import_jsx_runtime3=require("react/jsx-runtime");var import_jsx_runtime2=require("react/jsx-runtime"),import_react4=require("react"),S=({children,size,...rest})=>(0,import_jsx_runtime2.jsx)("svg",{viewBox:"0 0 24 24",width:size,height:size,"aria-hidden":"true",focusable:"false",...rest,children}),F=({d,...p})=>(0,import_jsx_runtime2.jsx)(S,{...p,children:(0,import_jsx_runtime2.jsx)("path",{fill:"currentColor",d})}),L=({d,sw=1.7,...p})=>(0,import_jsx_runtime2.jsx)(S,{...p,children:(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:sw,strokeLinecap:"round",strokeLinejoin:"round",d})}),IconHome=p=>(0,import_jsx_runtime2.jsx)(F,{...p,d:"M12 2.6 2.8 10v11.4h6.4v-6.2h5.6v6.2h6.4V10z"}),IconSearch=p=>(0,import_jsx_runtime2.jsx)(L,{...p,d:"M10.5 3a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Zm5.6 13.1L21 21"}),IconList=p=>(0,import_jsx_runtime2.jsxs)(S,{...p,children:[(0,import_jsx_runtime2.jsx)("path",{fill:"currentColor",d:"M3 5h18v2.2H3zm0 5.9h18v2.2H3zM3 16.8h11v2.2H3z"}),(0,import_jsx_runtime2.jsx)("path",{fill:"currentColor",d:"M17.4 15.3v6.2l4.2-3.1z"})]}),IconAlbum=p=>(0,import_jsx_runtime2.jsx)(S,{...p,children:(0,import_jsx_runtime2.jsx)("path",{fill:"currentColor",d:"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 2.2a7.8 7.8 0 1 1 0 15.6 7.8 7.8 0 0 1 0-15.6m0 4.6a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4"})}),IconToplist=p=>(0,import_jsx_runtime2.jsx)(S,{...p,children:(0,import_jsx_runtime2.jsx)("path",{fill:"currentColor",d:"M3.5 20V11h3.4v9zm6.8 0V4h3.4v16zm6.8 0v-6.4h3.4V20z"})}),IconHistory=p=>(0,import_jsx_runtime2.jsxs)(S,{...p,children:[(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",d:"M3.2 12a8.8 8.8 0 1 0 2.6-6.2M3 3.6v4.6h4.6"}),(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",d:"M12 7.4V12l3.4 2"})]}),IconUser=p=>(0,import_jsx_runtime2.jsx)(S,{...p,children:(0,import_jsx_runtime2.jsx)("path",{fill:"currentColor",d:"M12 12.2a4.6 4.6 0 1 0 0-9.2 4.6 4.6 0 0 0 0 9.2m0 1.9c-4.6 0-8 2.3-8 5.4V21h16v-1.5c0-3.1-3.4-5.4-8-5.4"})}),IconSetting=p=>(0,import_jsx_runtime2.jsx)(S,{...p,children:(0,import_jsx_runtime2.jsx)("path",{fill:"currentColor",d:"M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2m9 5.2v-3.2l-2.3-.5a7.4 7.4 0 0 0-.8-1.9l1.3-2-2.3-2.3-2 1.3a7.4 7.4 0 0 0-1.9-.8L12.5 2h-3.2l-.5 2.3a7.4 7.4 0 0 0-1.9.8l-2-1.3L2.6 6.1l1.3 2a7.4 7.4 0 0 0-.8 1.9L1 10.4v3.2l2.3.5c.2.7.4 1.3.8 1.9l-1.3 2 2.3 2.3 2-1.3c.6.4 1.2.6 1.9.8l.5 2.3h3.2l.5-2.3c.7-.2 1.3-.4 1.9-.8l2 1.3 2.3-2.3-1.3-2c.4-.6.6-1.2.8-1.9z"})}),IconPlay=p=>(0,import_jsx_runtime2.jsx)(F,{...p,d:"M8 4.8v14.4c0 .9 1 1.5 1.8 1l11.4-7.2c.7-.5.7-1.5 0-2L9.8 3.8C9 3.3 8 3.9 8 4.8"}),IconPause=p=>(0,import_jsx_runtime2.jsx)(F,{...p,d:"M6 4h4.2v16H6zm7.8 0H18v16h-4.2z"}),IconPrev=p=>(0,import_jsx_runtime2.jsx)(F,{...p,d:"M5 5h2.4v14H5zm14.1.6v12.8c0 .9-1 1.4-1.7.9l-9.2-6.4a1.1 1.1 0 0 1 0-1.8l9.2-6.4c.7-.5 1.7 0 1.7.9"}),IconNext=p=>(0,import_jsx_runtime2.jsx)(F,{...p,d:"M16.6 5H19v14h-2.4zM4.9 5.6v12.8c0 .9 1 1.4 1.7.9l9.2-6.4a1.1 1.1 0 0 0 0-1.8L6.6 4.7c-.7-.5-1.7 0-1.7.9"}),IconVolume=p=>(0,import_jsx_runtime2.jsxs)(S,{...p,children:[(0,import_jsx_runtime2.jsx)("path",{fill:"currentColor",d:"M3.6 9.2v5.6h3.5l4.6 4.4V4.8L7.1 9.2z"}),(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",d:"M15.2 8.6a4.8 4.8 0 0 1 0 6.8m2.6-9.4a8 8 0 0 1 0 12"})]}),IconVolumeLow=p=>(0,import_jsx_runtime2.jsxs)(S,{...p,children:[(0,import_jsx_runtime2.jsx)("path",{fill:"currentColor",d:"M3.6 9.2v5.6h3.5l4.6 4.4V4.8L7.1 9.2z"}),(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",d:"M15.2 8.6a4.8 4.8 0 0 1 0 6.8"})]}),IconMute=p=>(0,import_jsx_runtime2.jsxs)(S,{...p,children:[(0,import_jsx_runtime2.jsx)("path",{fill:"currentColor",d:"M3.6 9.2v5.6h3.5l4.6 4.4V4.8L7.1 9.2z"}),(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",d:"m15.4 9.6 5 5m0-5-5 5"})]}),IconRepeat=p=>(0,import_jsx_runtime2.jsxs)(S,{...p,children:[(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",d:"M17 3.6 20.4 7 17 10.4M7 20.4 3.6 17 7 13.6"}),(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",d:"M20.4 7H7.6A4 4 0 0 0 3.6 11M3.6 17h12.8a4 4 0 0 0 4-4"})]}),IconOne=p=>(0,import_jsx_runtime2.jsxs)(S,{...p,children:[(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",d:"M17 3.6 20.4 7 17 10.4M7 20.4 3.6 17 7 13.6"}),(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",d:"M20.4 7H7.6A4 4 0 0 0 3.6 11M3.6 17h12.8a4 4 0 0 0 4-4"}),(0,import_jsx_runtime2.jsx)("path",{fill:"currentColor",d:"M11.2 9.4h1.6v5.2h-1.6v-3.6l-1 .4v-1.4z"})]}),IconShuffle=p=>(0,import_jsx_runtime2.jsx)(S,{...p,children:(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",d:"M3.6 6.4h3.2c1.2 0 2 .6 2.8 1.7l4.8 7.8c.8 1.1 1.6 1.7 2.8 1.7h2.4m-4.2-11.2h4.2m0 0-2.4-2.4m2.4 2.4-2.4 2.4M3.6 17.6h3.2c1.2 0 2-.6 2.8-1.7l1.3-2.1m3.3-4.6 1-1.1c.8-1.1 1.6-1.7 2.8-1.7h2.4m0 9.6-2.4-2.4m2.4 2.4-2.4 2.4"})}),IconHeart=({filled,...p})=>(0,import_jsx_runtime2.jsx)(S,{...p,children:(0,import_jsx_runtime2.jsx)("path",{fill:filled?"currentColor":"none",stroke:"currentColor",strokeWidth:filled?0:1.8,strokeLinejoin:"round",d:"M12 20.7s-7.6-4.7-9.5-9.1C1 8 3 4.6 6.4 4.6c2.1 0 3.7 1.2 5.6 3.3 1.9-2.1 3.5-3.3 5.6-3.3 3.4 0 5.4 3.4 3.9 7-1.9 4.4-9.5 9.1-9.5 9.1Z"})}),IconDownload=p=>(0,import_jsx_runtime2.jsx)(S,{...p,children:(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",d:"M12 3.4v11.2m0 0 4.2-4.2M12 14.6l-4.2-4.2M4 18.6v1.6h16v-1.6"})}),IconQueue=p=>(0,import_jsx_runtime2.jsxs)(S,{...p,children:[(0,import_jsx_runtime2.jsx)("path",{fill:"currentColor",d:"M3 5.2h13.4v2.1H3zm0 5.8h13.4v2.1H3zm0 5.8h9.6v2.1H3z"}),(0,import_jsx_runtime2.jsx)("path",{fill:"currentColor",d:"M16.8 16.2v5.2l4-2.6z"})]}),IconTrash=p=>(0,import_jsx_runtime2.jsx)(S,{...p,children:(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",d:"M4.4 6.6h15.2M9.4 6.6V4.4h5.2v2.2M6.4 6.6l.9 13.4h9.4l.9-13.4M10 10.4v6.2m4-6.2v6.2"})}),IconClose=p=>(0,import_jsx_runtime2.jsx)(L,{...p,d:"m6 6 12 12M18 6 6 18",sw:1.8}),IconChevronDown=p=>(0,import_jsx_runtime2.jsx)(L,{...p,d:"m5.6 9 6.4 6.4L18.4 9",sw:1.9}),IconChevronUp=p=>(0,import_jsx_runtime2.jsx)(L,{...p,d:"m5.6 15 6.4-6.4L18.4 15",sw:1.9}),IconChevronRight=p=>(0,import_jsx_runtime2.jsx)(L,{...p,d:"m9 5.6 6.4 6.4L9 18.4",sw:1.9}),IconArrowLeft=p=>(0,import_jsx_runtime2.jsx)(L,{...p,d:"M20 12H4.4m0 0 6-6m-6 6 6 6",sw:1.9}),IconMore=p=>(0,import_jsx_runtime2.jsx)(S,{...p,children:(0,import_jsx_runtime2.jsx)("path",{fill:"currentColor",d:"M6 10.4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2m6 0a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2m6 0a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2"})}),IconCheck=p=>(0,import_jsx_runtime2.jsx)(L,{...p,d:"m4.6 12.4 4.6 4.6 10-10",sw:2}),IconPlayCircle=p=>(0,import_jsx_runtime2.jsxs)(S,{...p,children:[(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.7",d:"M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18"}),(0,import_jsx_runtime2.jsx)("path",{fill:"currentColor",d:"M10 8.4v7.2l5.6-3.6z"})]}),IconPlayFill=p=>(0,import_jsx_runtime2.jsx)(F,{...p,d:"M8 4.8v14.4c0 .9 1 1.5 1.8 1l11.4-7.2c.7-.5.7-1.5 0-2L9.8 3.8C9 3.3 8 3.9 8 4.8"}),IconMusic=p=>(0,import_jsx_runtime2.jsx)(S,{...p,children:(0,import_jsx_runtime2.jsx)("path",{fill:"currentColor",d:"M20.4 3.4 9 5.9v9.3a3.9 3.9 0 1 0 2 3.4V8.9l7.4-1.7v5.4a3.9 3.9 0 1 0 2 3.4z"})}),IconClock=p=>(0,import_jsx_runtime2.jsxs)(S,{...p,children:[(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.7",d:"M12 3.2a8.8 8.8 0 1 0 0 17.6 8.8 8.8 0 0 0 0-17.6Z"}),(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",d:"M12 7.4V12l3.2 1.9"})]}),IconRadio=p=>(0,import_jsx_runtime2.jsxs)(S,{...p,children:[(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",d:"M8.4 8.4a5.1 5.1 0 0 0 0 7.2m-2.8 2.6a9 9 0 0 1 0-12.4M15.6 8.4a5.1 5.1 0 0 1 0 7.2m2.8 2.6a9 9 0 0 0 0-12.4"}),(0,import_jsx_runtime2.jsx)("circle",{cx:"12",cy:"12",r:"2.2",fill:"currentColor"})]}),IconFullscreen=p=>(0,import_jsx_runtime2.jsx)(S,{...p,children:(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",d:"M4 9V4h5M20 9V4h-5M4 15v5h5m11-5v5h-5"})}),IconLyric=p=>(0,import_jsx_runtime2.jsxs)(S,{...p,children:[(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",d:"M4 5.4h16v10.2H9.4L4 19.6z"}),(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",d:"M7.4 9h9.2M7.4 12.2h5.6"})]}),IconPlus=p=>(0,import_jsx_runtime2.jsx)(L,{...p,d:"M12 5v14M5 12h14",sw:1.9}),IconSpinner=p=>(0,import_jsx_runtime2.jsx)(S,{...p,children:(0,import_jsx_runtime2.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",d:"M12 3.4a8.6 8.6 0 1 1-6.1 2.5"})}),IconVolumeWheel=IconVolume;var import_react5=__toESM(require("react"),1),MODE_ICON={loop:IconRepeat,one:IconOne,shuffle:IconShuffle},MODE_LABEL={loop:"\u5217\u8868\u5FAA\u73AF",one:"\u5355\u66F2\u5FAA\u73AF",shuffle:"\u968F\u673A\u64AD\u653E"},SEEK_BUILD="1.0.3";function SeekBar({position,duration,canSeek=!0,onSeek,showHint=!0,className=""}){let ref=(0,import_react5.useRef)(null),[hoverPct,setHoverPct]=(0,import_react5.useState)(null),[dragValue,setDragValue]=(0,import_react5.useState)(null),dragTimer=(0,import_react5.useRef)(null),seekTimer=(0,import_react5.useRef)(null),lastSeekAt=(0,import_react5.useRef)(0),max=duration>0?duration:0,interactive=max>0||canSeek,shown=dragValue!==null?dragValue:Math.min(position,max||0),pct=max>0?Math.min(shown/max*100,100):0,latest=(0,import_react5.useRef)({onSeek,max});latest.current={onSeek,max},(0,import_react5.useEffect)(()=>()=>{clearTimeout(dragTimer.current),clearTimeout(seekTimer.current)},[]);let ratioOf=clientX=>{let rect=ref.current?.getBoundingClientRect();return!rect||!rect.width?0:Math.min(Math.max((clientX-rect.left)/rect.width,0),1)},scheduleSeek=value=>{setDragValue(value),clearTimeout(dragTimer.current),dragTimer.current=setTimeout(()=>setDragValue(null),900);let wait=Math.max(0,120-(Date.now()-lastSeekAt.current));clearTimeout(seekTimer.current),seekTimer.current=setTimeout(()=>{lastSeekAt.current=Date.now(),latest.current.onSeek(value)},wait)},commit=()=>{clearTimeout(seekTimer.current),dragValue!==null&&(lastSeekAt.current=Date.now(),latest.current.onSeek(dragValue)),setDragValue(null)},onKeyDown=e=>{let step={ArrowLeft:-5,ArrowRight:5,PageDown:-15,PageUp:15}[e.key],target=e.key==="Home"?0:e.key==="End"?max-1:step===void 0?null:shown+step;target!==null&&(e.preventDefault(),onSeek(Math.min(Math.max(target,0),Math.max(max-.5,0))))};return(0,import_jsx_runtime3.jsxs)("div",{ref,className:`pb-progress${dragValue!==null?" dragging":""}${interactive?"":" off"} ${className}`,title:interactive?`\u70B9\u51FB\u6216\u62D6\u52A8\u8C03\u6574\u8FDB\u5EA6 (v${SEEK_BUILD})`:"\u8FDB\u5EA6\u6682\u4E0D\u53EF\u8C03\u6574(\u97F3\u9891\u672A\u5C31\u7EEA)",onPointerMove:e=>{interactive&&setHoverPct(ratioOf(e.clientX))},onPointerLeave:()=>setHoverPct(null),children:[(0,import_jsx_runtime3.jsxs)("div",{className:"track",children:[(0,import_jsx_runtime3.jsx)("div",{className:"fill",style:{width:`${pct}%`}}),(0,import_jsx_runtime3.jsx)("div",{className:"knob",style:{left:`${pct}%`}})]}),(0,import_jsx_runtime3.jsx)("input",{className:"pb-range",type:"range",min:0,max:max||1,step:.1,value:Math.min(shown,max||1),disabled:!interactive,"aria-label":"\u64AD\u653E\u8FDB\u5EA6",onChange:e=>scheduleSeek(Number(e.target.value)),onPointerUp:commit,onPointerCancel:commit,onBlur:commit,onKeyDown,onKeyUp:commit}),showHint&&hoverPct!==null&&max>0?(0,import_jsx_runtime3.jsx)("span",{className:"hint",style:{left:`${hoverPct*100}%`},children:formatTime(hoverPct*max)}):null]})}function VerticalSlider({value,onChange}){let ref=(0,import_react5.useRef)(null),drag=(0,import_react5.useRef)(!1),apply=e=>{let rect=ref.current.getBoundingClientRect();onChange(Math.min(Math.max(1-(e.clientY-rect.top)/rect.height,0),1))};return(0,import_jsx_runtime3.jsxs)("div",{ref,className:"vslider",onPointerDown:e=>{drag.current=!0;try{e.currentTarget.setPointerCapture(e.pointerId)}catch{}apply(e)},onPointerMove:e=>{drag.current&&apply(e)},onPointerUp:()=>{drag.current=!1},onPointerCancel:()=>{drag.current=!1},children:[(0,import_jsx_runtime3.jsx)("div",{className:"fill",style:{height:`${value*100}%`}}),(0,import_jsx_runtime3.jsx)("div",{className:"knob",style:{bottom:`calc(${value*100}% - 6px)`}})]})}function DownloadButton({track,level,className="",menuItem=!1,onStart}){let[busy,setBusy]=(0,import_react5.useState)(!1),[done,setDone]=(0,import_react5.useState)(!1),{toast}=useNav(),start=async e=>{if(e?.stopPropagation?.(),!busy){onStart?.(),setBusy(!0),toast(`\u5F00\u59CB\u4E0B\u8F7D:${track.name}`,"");try{let r=await api.download({id:track.id,name:track.name,artist:track.artist,level});setDone(!0);let fileName=r.fileName||String(r.path).split(/[\\/]/).pop(),dirName=String(r.dir??"").split(/[\\/]/).filter(Boolean).pop()||"\u4E0B\u8F7D\u76EE\u5F55",hint=r.trial?"(\u8BD5\u542C\u7247\u6BB5)":"";toast(`\u5DF2\u4FDD\u5B58\u5230\u300C${dirName}\u300D${hint}:${fileName}`,"ok",{label:"\u6253\u5F00\u76EE\u5F55",onClick:()=>api.openDownloadDir(fileName).catch(()=>{})})}catch(error){toast(`\u4E0B\u8F7D\u5931\u8D25:${error.message}`,"err")}finally{setBusy(!1)}}};return menuItem?(0,import_jsx_runtime3.jsxs)("button",{className:"ctx-item",onClick:start,disabled:busy,children:[busy?(0,import_jsx_runtime3.jsx)(IconSpinner,{className:"spinner"}):done?(0,import_jsx_runtime3.jsx)(IconCheck,{}):(0,import_jsx_runtime3.jsx)(IconDownload,{}),(0,import_jsx_runtime3.jsx)("span",{children:busy?"\u4E0B\u8F7D\u4E2D\u2026":done?"\u5DF2\u4E0B\u8F7D":"\u4E0B\u8F7D"})]}):(0,import_jsx_runtime3.jsx)("button",{className:`icon-btn sm ${className}${done?" on":""}`,onClick:start,title:done?"\u5DF2\u4E0B\u8F7D":"\u4E0B\u8F7D",children:busy?(0,import_jsx_runtime3.jsx)(IconSpinner,{className:"spinner"}):done?(0,import_jsx_runtime3.jsx)(IconCheck,{}):(0,import_jsx_runtime3.jsx)(IconDownload,{})})}function SongRow({track,index,onPlay,showAlbum=!0,onRemove,extraOps}){let actions=usePlayerActions(),nav=useNav(),fav=useFavoriteState(track.id),isCurrent=useIsCurrent(track.id),playing=usePlayerSelector(s=>s.playing),level=usePlayerSelector(s=>s.level),sounding=isCurrent&&playing,[hover,setHover]=(0,import_react5.useState)(!1),[menu,setMenu]=(0,import_react5.useState)(null),dur=track.duration?formatTime(track.duration/1e3):"",play=()=>{onPlay?onPlay():actions.addToQueue(track,!0)};return(0,import_jsx_runtime3.jsxs)("div",{className:`song-row${isCurrent?" playing":""}`,onDoubleClick:play,onMouseEnter:()=>setHover(!0),onMouseLeave:()=>setHover(!1),onContextMenu:e=>{e.preventDefault();let x=Math.min(e.clientX,window.innerWidth-210),y=Math.min(e.clientY,window.innerHeight-286);setMenu({x,y})},children:[(0,import_jsx_runtime3.jsx)("span",{className:"idx",children:hover||isCurrent?(0,import_jsx_runtime3.jsx)("button",{className:"icon-btn sm",onClick:play,title:sounding?"\u6682\u505C":"\u64AD\u653E",children:sounding?(0,import_jsx_runtime3.jsx)(IconPause,{}):(0,import_jsx_runtime3.jsx)(IconPlay,{})}):(index??0)+1}),(0,import_jsx_runtime3.jsxs)("span",{className:"song-main",children:[track.cover?(0,import_jsx_runtime3.jsx)("img",{className:"song-cover",src:track.cover,alt:"",loading:"lazy"}):(0,import_jsx_runtime3.jsx)("span",{className:"song-cover"}),(0,import_jsx_runtime3.jsxs)("span",{className:"song-text",children:[(0,import_jsx_runtime3.jsxs)("span",{className:"song-name",children:[(0,import_jsx_runtime3.jsx)("span",{style:{overflow:"hidden",textOverflow:"ellipsis"},children:track.name}),track.alias?(0,import_jsx_runtime3.jsxs)("span",{className:"alias",children:["(",track.alias,")"]}):null,track.fee===1?(0,import_jsx_runtime3.jsx)("span",{className:"song-vip",children:"VIP"}):null]}),(0,import_jsx_runtime3.jsx)("span",{className:"song-artist",children:(track.artists?.length?track.artists:[{id:0,name:track.artist}]).map((a,i)=>(0,import_jsx_runtime3.jsxs)(import_react5.default.Fragment,{children:[i>0?(0,import_jsx_runtime3.jsx)("span",{children:"/"}):null,(0,import_jsx_runtime3.jsx)("span",{className:a.id?"link":"",onClick:e=>{a.id&&(e.stopPropagation(),nav.nav("artist",{id:a.id,name:a.name}))},children:a.name})]},`${a.id}-${i}`))})]})]}),showAlbum?(0,import_jsx_runtime3.jsx)("span",{className:"song-album",title:track.album,onClick:e=>{e.stopPropagation(),track.albumId&&nav.nav("album",{id:track.albumId,name:track.album})},children:track.album||"\u2014"}):(0,import_jsx_runtime3.jsx)("span",{}),(0,import_jsx_runtime3.jsx)("span",{className:"song-dur",children:dur}),(0,import_jsx_runtime3.jsxs)("span",{className:"song-ops",children:[(0,import_jsx_runtime3.jsx)("button",{className:`icon-btn sm${fav?" on":""}`,style:fav?{color:"#ef4444"}:void 0,onClick:e=>{e.stopPropagation(),actions.toggleFavorite(track)},title:fav?"\u53D6\u6D88\u6536\u85CF":"\u6536\u85CF",children:(0,import_jsx_runtime3.jsx)(IconHeart,{filled:fav})}),(0,import_jsx_runtime3.jsx)(DownloadButton,{track,level}),(0,import_jsx_runtime3.jsx)("button",{className:"icon-btn sm",onClick:e=>{e.stopPropagation(),actions.playNext(track),nav.toast(`\u5DF2\u52A0\u5165\u4E0B\u4E00\u9996\u64AD\u653E:${track.name}`,"ok")},title:"\u4E0B\u4E00\u9996\u64AD\u653E",children:(0,import_jsx_runtime3.jsx)(IconNext,{})}),extraOps,(0,import_jsx_runtime3.jsx)("button",{className:"song-op-play",onClick:e=>{e.stopPropagation(),play()},title:sounding?"\u6682\u505C":"\u64AD\u653E",children:sounding?(0,import_jsx_runtime3.jsx)(IconPause,{}):(0,import_jsx_runtime3.jsx)(IconPlay,{})})]}),menu?(0,import_jsx_runtime3.jsx)(SongContextMenu,{track,menu,onClose:()=>setMenu(null),onPlay:play,onRemove}):null]})}function SongContextMenu({track,menu,onClose,onPlay,onRemove}){let actions=usePlayerActions(),nav=useNav(),snap=usePlayer(),fav=useFavoriteState(track.id),item=(label,onClick,icon)=>(0,import_jsx_runtime3.jsxs)("button",{className:"ctx-item",onClick:()=>{onClick(),onClose()},children:[icon,(0,import_jsx_runtime3.jsx)("span",{children:label})]});return(0,import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment,{children:[(0,import_jsx_runtime3.jsx)("div",{className:"ctx-mask",onClick:onClose,onContextMenu:e=>{e.preventDefault(),onClose()}}),(0,import_jsx_runtime3.jsxs)("div",{className:"ctx-menu",style:{left:menu.x,top:menu.y},onClick:e=>e.stopPropagation(),children:[item("\u64AD\u653E",onPlay,(0,import_jsx_runtime3.jsx)(IconPlay,{})),item("\u4E0B\u4E00\u9996\u64AD\u653E",()=>{actions.playNext(track),nav.toast(`\u5DF2\u52A0\u5165\u4E0B\u4E00\u9996\u64AD\u653E:${track.name}`,"ok")},(0,import_jsx_runtime3.jsx)(IconNext,{})),item(fav?"\u53D6\u6D88\u6536\u85CF":"\u6536\u85CF",()=>actions.toggleFavorite(track),(0,import_jsx_runtime3.jsx)(IconHeart,{filled:fav})),(0,import_jsx_runtime3.jsx)("div",{className:"ctx-sep"}),track.albumId?item("\u67E5\u770B\u4E13\u8F91",()=>nav.nav("album",{id:track.albumId,name:track.album}),(0,import_jsx_runtime3.jsx)(IconMusic,{})):null,track.artists?.[0]?.id?item("\u67E5\u770B\u6B4C\u624B",()=>nav.nav("artist",{id:track.artists[0].id,name:track.artists[0].name}),(0,import_jsx_runtime3.jsx)(IconUser,{})):null,(0,import_jsx_runtime3.jsx)("div",{className:"ctx-sep"}),(0,import_jsx_runtime3.jsx)(DownloadButton,{track,level:snap.level,menuItem:!0,onStart:onClose}),onRemove?item("\u4ECE\u5217\u8868\u79FB\u9664",onRemove,(0,import_jsx_runtime3.jsx)(IconTrash,{})):null]})]})}function MiniSongRow({track,index,active,onPlay,onRemove}){let[hover,setHover]=(0,import_react5.useState)(!1);return(0,import_jsx_runtime3.jsxs)("div",{className:`qp-item${active?" playing":""}`,onMouseEnter:()=>setHover(!0),onMouseLeave:()=>setHover(!1),onClick:onPlay,children:[(0,import_jsx_runtime3.jsx)("span",{style:{width:18,textAlign:"center",fontSize:11,color:"var(--muted-2)",flexShrink:0},children:hover?(0,import_jsx_runtime3.jsx)(IconPlay,{style:{width:13,height:13}}):(index??0)+1}),track.cover?(0,import_jsx_runtime3.jsx)("img",{className:"cv",src:track.cover,alt:"",loading:"lazy"}):(0,import_jsx_runtime3.jsx)("span",{className:"cv"}),(0,import_jsx_runtime3.jsxs)("span",{className:"meta",children:[(0,import_jsx_runtime3.jsx)("span",{className:"t",children:track.name}),(0,import_jsx_runtime3.jsx)("span",{className:"a",children:track.artist})]}),onRemove?(0,import_jsx_runtime3.jsx)("button",{className:"icon-btn sm del",onClick:e=>{e.stopPropagation(),onRemove()},title:"\u79FB\u9664",children:(0,import_jsx_runtime3.jsx)(IconClose,{})}):null]})}function CoverCard({cover,name,sub,playCount,updateFrequency,onClick,onPlay,tracks,round,badge}){let hoverable=Array.isArray(tracks)&&tracks.length>0;return(0,import_jsx_runtime3.jsxs)("div",{className:`cover-card${round?" round":""}`,onClick,children:[(0,import_jsx_runtime3.jsxs)("div",{className:"thumb",children:[cover?(0,import_jsx_runtime3.jsx)("img",{src:cover,alt:"",loading:"lazy"}):(0,import_jsx_runtime3.jsx)("div",{className:"ph",children:(0,import_jsx_runtime3.jsx)(IconMusic,{})}),(0,import_jsx_runtime3.jsx)("div",{className:"veil"}),hoverable?(0,import_jsx_runtime3.jsx)("div",{className:"hover-tracks",children:tracks.slice(0,3).map((t,i)=>(0,import_jsx_runtime3.jsxs)("div",{className:"hover-track",children:[(0,import_jsx_runtime3.jsx)("span",{className:"n",children:i+1}),(0,import_jsx_runtime3.jsx)("span",{className:"t",children:t.name})]},`${t.id}-${i}`))}):null,onPlay?(0,import_jsx_runtime3.jsx)("button",{className:"hover-play-btn",onClick:e=>{e.stopPropagation(),onPlay()},title:"\u64AD\u653E",children:(0,import_jsx_runtime3.jsx)(IconPlayFill,{})}):(0,import_jsx_runtime3.jsx)("span",{className:"thumb-play",children:(0,import_jsx_runtime3.jsx)(IconPlay,{})}),playCount?(0,import_jsx_runtime3.jsxs)("span",{className:"badge play",children:[(0,import_jsx_runtime3.jsx)(IconPlayFill,{}),formatCount(playCount)]}):null,updateFrequency?(0,import_jsx_runtime3.jsx)("span",{className:"badge time",children:updateFrequency}):null,badge?(0,import_jsx_runtime3.jsx)("span",{className:"badge play",style:{opacity:1},children:badge}):null]}),(0,import_jsx_runtime3.jsxs)("div",{className:"cap",children:[(0,import_jsx_runtime3.jsx)("div",{className:"t",title:name,children:name}),sub?(0,import_jsx_runtime3.jsx)("div",{className:"s",title:sub,children:sub}):null]})]})}function SectionHead({title,onMore,moreText="\u66F4\u591A",action}){return(0,import_jsx_runtime3.jsxs)("div",{className:"sec-head",children:[(0,import_jsx_runtime3.jsxs)("div",{className:"sec-title",children:[title,(0,import_jsx_runtime3.jsx)("span",{className:"dot"})]}),action??(onMore?(0,import_jsx_runtime3.jsxs)("button",{className:"sec-more",onClick:onMore,children:[moreText,(0,import_jsx_runtime3.jsx)(IconChevronRightMini,{})]}):null)]})}var IconChevronRightMini=()=>(0,import_jsx_runtime3.jsx)("svg",{viewBox:"0 0 24 24",width:"16",height:"16","aria-hidden":"true",children:(0,import_jsx_runtime3.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",d:"m9 5.6 6.4 6.4L9 18.4"})});function SkeletonGrid({n=10}){return(0,import_jsx_runtime3.jsx)("div",{className:"cover-grid",children:Array.from({length:n},(_,i)=>(0,import_jsx_runtime3.jsxs)("div",{children:[(0,import_jsx_runtime3.jsx)("div",{className:"skeleton",style:{aspectRatio:"1",borderRadius:16}}),(0,import_jsx_runtime3.jsx)("div",{className:"skeleton",style:{height:14,width:"70%",marginTop:12,borderRadius:6}}),(0,import_jsx_runtime3.jsx)("div",{className:"skeleton",style:{height:12,width:"45%",marginTop:8,borderRadius:6}})]},i))})}function Empty({text="\u8FD9\u91CC\u7A7A\u7A7A\u5982\u4E5F",icon:Icon=IconMusic}){return(0,import_jsx_runtime3.jsxs)("div",{className:"empty",children:[(0,import_jsx_runtime3.jsx)(Icon,{}),(0,import_jsx_runtime3.jsx)("span",{children:text})]})}function Loading({text="\u52A0\u8F7D\u4E2D\u2026"}){return(0,import_jsx_runtime3.jsxs)("div",{className:"loading-row",children:[(0,import_jsx_runtime3.jsx)(IconSpinner,{className:"spinner"}),text]})}function PlayBar(){let snap=usePlayer(),actions=usePlayerActions(),nav=useNav(),[volOpen,setVolOpen]=(0,import_react5.useState)(!1),barRef=(0,import_react5.useRef)(null),track=snap.index>=0?snap.queue[snap.index]:null,fav=useFavoriteState(track?.id??0);if(!track)return(0,import_jsx_runtime3.jsx)("div",{className:"playbar idle",children:"\u64AD\u653E\u5217\u8868\u662F\u7A7A\u7684,\u53BB\u6311\u4E00\u9996\u6B4C\u5427"});let ModeIcon=MODE_ICON[snap.mode]??IconRepeat,volIcon=snap.muted||snap.volume===0?(0,import_jsx_runtime3.jsx)(IconMute,{}):snap.volume<.5?(0,import_jsx_runtime3.jsx)(IconVolumeLow,{}):(0,import_jsx_runtime3.jsx)(IconVolume,{});return(0,import_jsx_runtime3.jsxs)("div",{className:"playbar",ref:barRef,onClick:e=>{e.target.closest(".pb-buttons, .pb-side, .pb-progress, .pb-cover-wrap, .volume-wrap")||nav.openFull()},children:[(0,import_jsx_runtime3.jsx)(SeekBar,{position:snap.position,duration:snap.duration,canSeek:snap.canSeek,onSeek:actions.seek}),(0,import_jsx_runtime3.jsxs)("div",{className:"pb-cover-wrap",onClick:()=>nav.openFull(),title:"\u5C55\u5F00\u64AD\u653E\u8BE6\u60C5",children:[track.cover?(0,import_jsx_runtime3.jsx)("img",{className:"pb-cover",src:track.cover,alt:""}):(0,import_jsx_runtime3.jsx)("div",{className:"pb-cover"}),snap.loading?(0,import_jsx_runtime3.jsx)("div",{className:"pb-loading",children:(0,import_jsx_runtime3.jsx)(IconSpinner,{})}):null,(0,import_jsx_runtime3.jsxs)("div",{className:"arrow",children:[(0,import_jsx_runtime3.jsx)(IconChevronUp,{}),(0,import_jsx_runtime3.jsx)("span",{children:"\u5C55\u5F00"})]})]}),(0,import_jsx_runtime3.jsxs)("div",{className:"pb-meta",children:[(0,import_jsx_runtime3.jsxs)("div",{className:"t",children:[(0,import_jsx_runtime3.jsx)("span",{className:"txt",title:track.name,children:track.name}),snap.rate!==1?(0,import_jsx_runtime3.jsxs)("span",{className:"pb-rate",children:[snap.rate,"x"]}):null]}),(0,import_jsx_runtime3.jsx)("div",{className:`a${snap.errorNote?" err":""}`,title:snap.errorNote||track.artist,children:snap.errorNote??(track.artists?.length?track.artists.map((a,i)=>(0,import_jsx_runtime3.jsxs)(import_react5.default.Fragment,{children:[i>0?" / ":"",(0,import_jsx_runtime3.jsx)("span",{className:"link",onClick:e=>{e.stopPropagation(),a.id&&nav.nav("artist",{id:a.id,name:a.name})},children:a.name})]},a.id)):track.artist)})]}),(0,import_jsx_runtime3.jsxs)("div",{className:"pb-buttons",children:[(0,import_jsx_runtime3.jsx)("button",{className:"icon-btn",onClick:actions.prevSong,title:"\u4E0A\u4E00\u9996",children:(0,import_jsx_runtime3.jsx)(IconPrev,{})}),(0,import_jsx_runtime3.jsx)("button",{className:"pb-play",onClick:actions.togglePlay,title:snap.playing?"\u6682\u505C":"\u64AD\u653E",children:snap.playing?(0,import_jsx_runtime3.jsx)(IconPause,{}):(0,import_jsx_runtime3.jsx)(IconPlay,{})}),(0,import_jsx_runtime3.jsx)("button",{className:"icon-btn",onClick:()=>actions.nextSong(),title:"\u4E0B\u4E00\u9996",children:(0,import_jsx_runtime3.jsx)(IconNext,{})})]}),(0,import_jsx_runtime3.jsxs)("span",{className:"pb-time",children:[formatTime(snap.position)," / ",formatTime(snap.duration)]}),(0,import_jsx_runtime3.jsxs)("div",{className:"pb-side",children:[(0,import_jsx_runtime3.jsxs)("div",{className:"volume-wrap",onMouseEnter:()=>setVolOpen(!0),onMouseLeave:()=>setVolOpen(!1),onWheel:e=>{e.preventDefault(),actions.setVolume(snap.volume+(e.deltaY<0?.05:-.05))},children:[(0,import_jsx_runtime3.jsx)("button",{className:"icon-btn",onClick:actions.toggleMute,title:"\u9759\u97F3",children:volIcon}),volOpen?(0,import_jsx_runtime3.jsxs)("div",{className:"volume-pop",children:[(0,import_jsx_runtime3.jsxs)("span",{className:"pct",children:[Math.round((snap.muted?0:snap.volume)*100),"%"]}),(0,import_jsx_runtime3.jsx)(VerticalSlider,{value:snap.muted?0:snap.volume,onChange:actions.setVolume})]}):null]}),(0,import_jsx_runtime3.jsx)("button",{className:"icon-btn",onClick:actions.cycleMode,title:MODE_LABEL[snap.mode],children:(0,import_jsx_runtime3.jsx)(ModeIcon,{})}),(0,import_jsx_runtime3.jsx)("button",{className:`icon-btn${fav?" on":""}`,style:fav?{color:"#ef4444"}:void 0,onClick:()=>actions.toggleFavorite(track),title:"\u559C\u6B22",children:(0,import_jsx_runtime3.jsx)(IconHeart,{filled:fav})}),(0,import_jsx_runtime3.jsx)(DownloadButton,{track,level:snap.level}),(0,import_jsx_runtime3.jsx)("button",{className:"icon-btn",onClick:()=>nav.openQueue(),title:"\u64AD\u653E\u5217\u8868",children:(0,import_jsx_runtime3.jsx)(IconQueue,{})})]})]})}function PlayingListDrawer({open,onClose}){let snap=usePlayer(),actions=usePlayerActions(),[confirm,setConfirm]=(0,import_react5.useState)(!1);return open?(0,import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment,{children:[(0,import_jsx_runtime3.jsx)("div",{className:"drawer-mask",onClick:onClose}),(0,import_jsx_runtime3.jsxs)("div",{className:"queue-panel",children:[(0,import_jsx_runtime3.jsxs)("div",{className:"qp-head",children:[(0,import_jsx_runtime3.jsx)("span",{className:"title",children:"\u64AD\u653E\u5217\u8868"}),(0,import_jsx_runtime3.jsxs)("span",{className:"n",children:["(",snap.queue.length,")"]}),(0,import_jsx_runtime3.jsx)("span",{className:"grow"}),(0,import_jsx_runtime3.jsx)("button",{className:"icon-btn sm",title:"\u6E05\u7A7A\u5217\u8868",onClick:()=>setConfirm(!0),children:(0,import_jsx_runtime3.jsx)(IconTrash,{})}),(0,import_jsx_runtime3.jsx)("button",{className:"icon-btn sm",title:"\u5173\u95ED",onClick:onClose,children:(0,import_jsx_runtime3.jsx)(IconClose,{})})]}),(0,import_jsx_runtime3.jsxs)("div",{className:"qp-list",children:[snap.queue.length===0?(0,import_jsx_runtime3.jsx)(Empty,{text:"\u64AD\u653E\u5217\u8868\u662F\u7A7A\u7684"}):null,snap.queue.map((track,i)=>(0,import_jsx_runtime3.jsx)(MiniSongRow,{track,index:i,active:i===snap.index,onPlay:()=>actions.playTrack(i),onRemove:()=>actions.removeFromQueue(i)},`${track.id}-${i}`))]})]}),(0,import_jsx_runtime3.jsx)(Confirm,{open:confirm,title:"\u6E05\u7A7A\u64AD\u653E\u5217\u8868",text:"\u6E05\u7A7A\u540E\u5F53\u524D\u64AD\u653E\u4E5F\u4F1A\u505C\u6B62,\u786E\u5B9A\u7EE7\u7EED\u5417?",okText:"\u6E05\u7A7A",danger:!0,onCancel:()=>setConfirm(!1),onOk:()=>{actions.clearQueue(),setConfirm(!1)}})]}):null}function MusicFull({open,onClose}){let snap=usePlayer(),actions=usePlayerActions(),nav=useNav(),track=snap.index>=0?snap.queue[snap.index]:null,lyric=useLyric(track?.id),boxRef=(0,import_react5.useRef)(null),[showTrans,setShowTrans]=(0,import_react5.useState)(!0),[fontScale,setFontScale]=(0,import_react5.useState)(1),[settingsOpen,setSettingsOpen]=(0,import_react5.useState)(!1),fav=useFavoriteState(track?.id??0),activeIndex=(0,import_react5.useMemo)(()=>{if(!lyric.lines.length)return-1;let idx=-1;for(let i=0;i<lyric.lines.length&&lyric.lines[i].time<=snap.position+.15;i++)idx=i;return idx},[lyric.lines,snap.position]);if((0,import_react5.useEffect)(()=>{let box=boxRef.current;if(!box)return;let el=box.querySelector(".lyric-line.on");el&&(box.scrollTop=Math.max(0,el.offsetTop-box.clientHeight*.42))},[activeIndex,lyric.lines.length]),!open||!track)return null;let transByTime=new Map(lyric.translation.map(l=>[Math.round(l.time*10)/10,l.text])),ModeIcon=MODE_ICON[snap.mode]??IconRepeat;return(0,import_jsx_runtime3.jsxs)("div",{className:"music-full",children:[track.cover?(0,import_jsx_runtime3.jsx)("div",{className:"mf-bg",style:{backgroundImage:`url("${track.cover}")`}}):null,(0,import_jsx_runtime3.jsx)("div",{className:"mf-veil"}),(0,import_jsx_runtime3.jsxs)("div",{className:"mf-top",children:[(0,import_jsx_runtime3.jsx)("button",{className:"icon-btn",onClick:onClose,title:"\u6536\u8D77",children:(0,import_jsx_runtime3.jsx)(IconChevronDown,{})}),(0,import_jsx_runtime3.jsxs)("div",{style:{display:"flex",gap:6},children:[(0,import_jsx_runtime3.jsxs)("div",{style:{position:"relative"},children:[(0,import_jsx_runtime3.jsx)("button",{className:"icon-btn",onClick:()=>setSettingsOpen(v=>!v),title:"\u6B4C\u8BCD\u8BBE\u7F6E",children:(0,import_jsx_runtime3.jsx)(IconLyric,{})}),settingsOpen?(0,import_jsx_runtime3.jsxs)("div",{className:"modal",style:{position:"absolute",right:0,top:44,width:250,zIndex:5},children:[(0,import_jsx_runtime3.jsx)("h3",{style:{fontSize:14},children:"\u6B4C\u8BCD\u8BBE\u7F6E"}),(0,import_jsx_runtime3.jsxs)("div",{className:"set-row",style:{minHeight:48,borderBottom:"none"},children:[(0,import_jsx_runtime3.jsx)("div",{className:"lab",children:(0,import_jsx_runtime3.jsx)("div",{className:"t",children:"\u663E\u793A\u7FFB\u8BD1"})}),(0,import_jsx_runtime3.jsx)("div",{className:`switch${showTrans?" on":""}`,onClick:()=>setShowTrans(v=>!v),children:(0,import_jsx_runtime3.jsx)("i",{})})]}),(0,import_jsx_runtime3.jsxs)("div",{className:"set-row",style:{minHeight:48,borderBottom:"none"},children:[(0,import_jsx_runtime3.jsx)("div",{className:"lab",children:(0,import_jsx_runtime3.jsx)("div",{className:"t",children:"\u5B57\u53F7"})}),(0,import_jsx_runtime3.jsx)("div",{className:"seg",children:[.9,1,1.15].map(s=>(0,import_jsx_runtime3.jsx)("button",{className:fontScale===s?"on":"",onClick:()=>setFontScale(s),children:{.9:"\u5C0F",1:"\u4E2D",1.15:"\u5927"}[s]},s))})]})]}):null]}),(0,import_jsx_runtime3.jsx)("button",{className:"icon-btn",onClick:()=>nav.openQueue(),title:"\u64AD\u653E\u5217\u8868",children:(0,import_jsx_runtime3.jsx)(IconQueue,{})})]})]}),(0,import_jsx_runtime3.jsxs)("div",{className:"mf-body",children:[(0,import_jsx_runtime3.jsxs)("div",{className:"mf-left",children:[(0,import_jsx_runtime3.jsx)("div",{className:"mf-cover-wrap",children:track.cover?(0,import_jsx_runtime3.jsx)("img",{src:track.cover,alt:""}):(0,import_jsx_runtime3.jsx)("div",{style:{width:"100%",height:"100%",background:"var(--panel-2)"}})}),(0,import_jsx_runtime3.jsxs)("div",{className:"mf-info",children:[(0,import_jsx_runtime3.jsx)("div",{className:"t",children:track.name}),(0,import_jsx_runtime3.jsx)("div",{className:"a",children:track.artists?.length?track.artists.map((a,i)=>(0,import_jsx_runtime3.jsxs)(import_react5.default.Fragment,{children:[i>0?" / ":"",(0,import_jsx_runtime3.jsx)("span",{className:"link",onClick:()=>{a.id&&(onClose(),nav.nav("artist",{id:a.id,name:a.name}))},children:a.name})]},a.id)):track.artist})]}),(0,import_jsx_runtime3.jsxs)("div",{className:"mf-mini",children:[(0,import_jsx_runtime3.jsxs)("div",{className:"row",children:[(0,import_jsx_runtime3.jsx)("button",{className:"icon-btn",onClick:actions.prevSong,children:(0,import_jsx_runtime3.jsx)(IconPrev,{})}),(0,import_jsx_runtime3.jsx)("button",{className:"play",onClick:actions.togglePlay,children:snap.playing?(0,import_jsx_runtime3.jsx)(IconPause,{}):(0,import_jsx_runtime3.jsx)(IconPlay,{})}),(0,import_jsx_runtime3.jsx)("button",{className:"icon-btn",onClick:()=>actions.nextSong(),children:(0,import_jsx_runtime3.jsx)(IconNext,{})}),(0,import_jsx_runtime3.jsxs)("span",{className:"time",style:{marginLeft:"auto"},children:[formatTime(snap.position)," / ",formatTime(snap.duration)]})]}),(0,import_jsx_runtime3.jsx)(SeekBar,{className:"bar",position:snap.position,duration:snap.duration,canSeek:snap.canSeek,onSeek:actions.seek}),(0,import_jsx_runtime3.jsxs)("div",{className:"row",style:{marginTop:12,gap:4},children:[(0,import_jsx_runtime3.jsx)("button",{className:`icon-btn${fav?" on":""}`,style:fav?{color:"#ef4444"}:void 0,onClick:()=>actions.toggleFavorite(track),title:"\u559C\u6B22",children:(0,import_jsx_runtime3.jsx)(IconHeart,{filled:fav})}),(0,import_jsx_runtime3.jsx)(DownloadButton,{track,level:snap.level}),(0,import_jsx_runtime3.jsx)("button",{className:"icon-btn",onClick:actions.cycleMode,title:MODE_LABEL[snap.mode],children:(0,import_jsx_runtime3.jsx)(ModeIcon,{})}),(0,import_jsx_runtime3.jsx)("span",{style:{marginLeft:"auto",fontSize:11,color:"rgba(255,255,255,.4)"},children:snap.errorNote??""})]})]})]}),(0,import_jsx_runtime3.jsx)("div",{className:"mf-right",children:(0,import_jsx_runtime3.jsx)("div",{className:"lyric-box",ref:boxRef,style:{fontSize:`${fontScale*16}px`},children:lyric.lines.length===0?(0,import_jsx_runtime3.jsx)("div",{className:"lyric-empty",children:lyric.loading?"\u6B4C\u8BCD\u52A0\u8F7D\u4E2D\u2026":lyric.error?`\u6B4C\u8BCD\u52A0\u8F7D\u5931\u8D25:${lyric.error}`:"\u7EAF\u97F3\u4E50,\u8BF7\u6B23\u8D4F"}):lyric.lines.map((line,i)=>{let tr=transByTime.get(Math.round(line.time*10)/10);return(0,import_jsx_runtime3.jsxs)("div",{className:`lyric-line${i===activeIndex?" on":""}`,onClick:()=>actions.seek(line.time),children:[line.text||"\xB7\xB7\xB7",showTrans&&tr?(0,import_jsx_runtime3.jsx)("span",{className:"tr",children:tr}):null]},i)})})})]})]})}function Confirm({open,title,text,okText="\u786E\u5B9A",cancelText="\u53D6\u6D88",danger,onOk,onCancel}){return open?(0,import_jsx_runtime3.jsx)("div",{className:"modal-mask",onClick:onCancel,children:(0,import_jsx_runtime3.jsxs)("div",{className:"modal",onClick:e=>e.stopPropagation(),children:[(0,import_jsx_runtime3.jsx)("h3",{children:title}),text?(0,import_jsx_runtime3.jsx)("p",{children:text}):null,(0,import_jsx_runtime3.jsxs)("div",{className:"actions",children:[(0,import_jsx_runtime3.jsx)("button",{className:"cancel",onClick:onCancel,children:cancelText}),(0,import_jsx_runtime3.jsx)("button",{className:danger?"danger":"ok",onClick:onOk,children:okText})]})]})}):null}var import_jsx_runtime4=require("react/jsx-runtime"),import_react6=require("react");function useAsync(fn,deps){let[state2,setState]=(0,import_react6.useState)({loading:!0,data:null,error:null});return(0,import_react6.useEffect)(()=>{let alive=!0;return setState({loading:!0,data:null,error:null}),fn().then(data=>alive&&setState({loading:!1,data,error:null})).catch(error=>alive&&setState({loading:!1,data:null,error})),()=>{alive=!1}},deps),state2}function totalDuration(tracks){let ms=(tracks??[]).reduce((sum,t)=>sum+(t.duration||0),0),min=Math.round(ms/6e4);return min>0?`${min} \u5206\u949F`:""}function PlaylistCard({item,onOpen}){let[tracks,setTracks]=(0,import_react6.useState)(null),loadingRef=(0,import_react6.useRef)(!1),actions=usePlayerActions(),load=()=>{tracks||loadingRef.current||(loadingRef.current=!0,api.playlistTracks(item.id,3).then(d=>setTracks((d.tracks??[]).slice(0,3))).catch(()=>setTracks([])))},play=async()=>{try{let d=await api.playlistTracks(item.id,100);d.tracks?.length&&actions.playQueue(d.tracks,0)}catch{}};return(0,import_jsx_runtime4.jsx)("div",{onMouseEnter:load,children:(0,import_jsx_runtime4.jsx)(CoverCard,{cover:item.cover,name:item.name,sub:item.copywriter||(item.creator?`by ${item.creator}`:""),playCount:item.playCount,tracks:tracks??[],onClick:onOpen,onPlay:play})})}function HomePage(){let nav=useNav(),actions=usePlayerActions(),currentId=usePlayerSelector(s=>s.index>=0?s.queue[s.index]?.id:null),playing=usePlayerSelector(s=>s.playing),home=useAsync(()=>api.home(),[]),{account}=useAccount(),[fm,setFm]=(0,import_react6.useState)(null),[fmBusy,setFmBusy]=(0,import_react6.useState)(!1),data=home.data,daily=data?.daily,dailyTracks=daily?.tracks??[],loggedIn=!!account?.loggedIn,loadFm=async()=>{setFmBusy(!0);try{let d=await api.fm();setFm(d.items?.[0]??null)}catch{}finally{setFmBusy(!1)}};(0,import_react6.useEffect)(()=>{loggedIn&&!fm&&loadFm()},[loggedIn]);let isFmCurrent=!!(fm&&currentId===fm.id),toggleFm=e=>{e?.stopPropagation(),fm&&(isFmCurrent?actions.togglePlay():actions.playQueue([fm],0))},playDaily=e=>{e?.stopPropagation(),dailyTracks.length&&actions.playQueue(dailyTracks,0)};return(0,import_jsx_runtime4.jsxs)("div",{className:"page",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"hero-grid",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"hero-card",onClick:()=>{dailyTracks.length&&nav.nav("musiclist",{kind:"daily",name:daily?.name??"\u6BCF\u65E5\u63A8\u8350",cover:dailyTracks[0]?.cover,tracks:dailyTracks})},children:[dailyTracks[0]?.cover?(0,import_jsx_runtime4.jsx)("img",{className:"hero-bg",src:dailyTracks[0].cover,alt:""}):null,(0,import_jsx_runtime4.jsx)("div",{className:"shade"}),(0,import_jsx_runtime4.jsxs)("div",{className:"inner",children:[(0,import_jsx_runtime4.jsxs)("div",{children:[(0,import_jsx_runtime4.jsx)("div",{className:"hero-title",children:daily?.name??"\u6BCF\u65E5\u63A8\u8350"}),(0,import_jsx_runtime4.jsxs)("span",{className:"hero-badge",children:[(0,import_jsx_runtime4.jsx)(IconRadio,{}),dailyTracks.length," \u9996\u6B4C\u66F2"]})]}),(0,import_jsx_runtime4.jsxs)("div",{className:"hero-bottom",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"hero-songs",children:[dailyTracks.slice(0,3).map((t,i)=>(0,import_jsx_runtime4.jsxs)("div",{className:"hero-song",children:[(0,import_jsx_runtime4.jsx)("span",{className:"n",children:i+1}),(0,import_jsx_runtime4.jsx)("span",{className:"t",children:t.name}),(0,import_jsx_runtime4.jsx)("span",{className:"a",children:t.artist})]},t.id)),dailyTracks.length===0?(0,import_jsx_runtime4.jsx)("span",{style:{color:"rgba(255,255,255,.6)",fontSize:13},children:"\u6682\u65E0\u65E5\u63A8,\u5148\u53BB\u767B\u5F55\u8D26\u53F7"}):null]}),(0,import_jsx_runtime4.jsx)("button",{className:"hero-play",onClick:playDaily,title:"\u64AD\u653E\u5168\u90E8",children:(0,import_jsx_runtime4.jsx)(IconPlay,{})})]})]})]}),loggedIn?(0,import_jsx_runtime4.jsxs)("div",{className:"hero-card",onClick:toggleFm,children:[fm?.cover?(0,import_jsx_runtime4.jsx)("img",{className:"fm-bg",src:fm.cover,alt:""}):null,(0,import_jsx_runtime4.jsx)("div",{className:"fm-veil"}),(0,import_jsx_runtime4.jsxs)("div",{className:"fm-card",children:[fm?.cover?(0,import_jsx_runtime4.jsx)("img",{className:"fm-cover",src:fm.cover,alt:""}):(0,import_jsx_runtime4.jsx)("div",{className:"fm-cover",style:{background:"rgba(255,255,255,.12)"}}),(0,import_jsx_runtime4.jsxs)("div",{className:"fm-info",children:[(0,import_jsx_runtime4.jsxs)("div",{children:[(0,import_jsx_runtime4.jsx)("div",{className:"fm-name",children:fm?.name??(fmBusy?"\u6B63\u5728\u83B7\u53D6\u79C1\u4EBA FM\u2026":"\u79C1\u4EBA\u6F2B\u6E38")}),(0,import_jsx_runtime4.jsx)("div",{className:"fm-artist",children:fm?.artist??"\u6839\u636E\u4F60\u7684\u53E3\u5473\u6301\u7EED\u63A8\u8350"})]}),(0,import_jsx_runtime4.jsxs)("div",{className:"fm-actions",children:[(0,import_jsx_runtime4.jsx)("button",{className:"icon-btn sm",title:"\u6362\u4E00\u9996",onClick:e=>{e.stopPropagation(),loadFm()},children:(0,import_jsx_runtime4.jsx)(IconChevronRight,{})}),(0,import_jsx_runtime4.jsx)("button",{className:"fm-play",onClick:toggleFm,title:isFmCurrent&&playing?"\u6682\u505C":"\u64AD\u653E",children:isFmCurrent&&playing?(0,import_jsx_runtime4.jsx)(IconPause,{}):(0,import_jsx_runtime4.jsx)(IconPlay,{})}),fm?(0,import_jsx_runtime4.jsxs)("span",{className:"eq",children:[(0,import_jsx_runtime4.jsx)("i",{}),(0,import_jsx_runtime4.jsx)("i",{}),(0,import_jsx_runtime4.jsx)("i",{})]}):null]})]}),(0,import_jsx_runtime4.jsxs)("span",{className:"fm-tag",children:[(0,import_jsx_runtime4.jsx)(IconRadio,{}),"\u79C1\u4EBA FM"]})]})]}):(0,import_jsx_runtime4.jsxs)("div",{className:"hero-card",onClick:()=>nav.nav("list"),children:[(0,import_jsx_runtime4.jsx)("div",{className:"wall",children:(data?.playlists??[]).slice(0,4).map((p,i)=>p.cover?(0,import_jsx_runtime4.jsx)("img",{src:p.cover,alt:""},i):(0,import_jsx_runtime4.jsx)("div",{style:{background:"var(--panel-2)"}},i))}),(0,import_jsx_runtime4.jsx)("div",{className:"wall-veil"}),(0,import_jsx_runtime4.jsxs)("div",{className:"wall-inner",children:[(0,import_jsx_runtime4.jsxs)("span",{className:"wall-badge",children:[(0,import_jsx_runtime4.jsx)(IconMusic,{}),"\u70ED\u95E8\u6B4C\u5355"]}),(0,import_jsx_runtime4.jsxs)("div",{style:{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:12},children:[(0,import_jsx_runtime4.jsxs)("div",{children:[(0,import_jsx_runtime4.jsx)("div",{className:"wall-title",children:"\u53D1\u73B0\u597D\u6B4C\u5355"}),(0,import_jsx_runtime4.jsx)("div",{className:"wall-sub",children:"\u6BCF\u5929\u90FD\u6709\u65B0\u7684\u63A8\u8350"})]}),(0,import_jsx_runtime4.jsx)("span",{className:"wall-go",children:(0,import_jsx_runtime4.jsx)(IconChevronRight,{})})]})]})]})]}),(0,import_jsx_runtime4.jsx)(SectionHead,{title:"\u63A8\u8350\u6B4C\u5355",onMore:()=>nav.nav("list")}),home.loading?(0,import_jsx_runtime4.jsx)(SkeletonGrid,{n:10}):(0,import_jsx_runtime4.jsx)("div",{className:"cover-grid",children:(data?.playlists??[]).map(p=>(0,import_jsx_runtime4.jsx)(PlaylistCard,{item:p,onOpen:()=>nav.nav("musiclist",{kind:"playlist",id:p.id,name:p.name,cover:p.cover})},p.id))}),(data?.artists??[]).length>0?(0,import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment,{children:[(0,import_jsx_runtime4.jsx)(SectionHead,{title:"\u70ED\u95E8\u6B4C\u624B"}),(0,import_jsx_runtime4.jsx)("div",{className:"artist-row",children:data.artists.map(a=>(0,import_jsx_runtime4.jsxs)("div",{className:"artist-card",onClick:()=>nav.nav("artist",{id:a.id,name:a.name}),children:[(0,import_jsx_runtime4.jsx)("div",{className:"av",children:a.cover?(0,import_jsx_runtime4.jsx)("img",{src:a.cover,alt:"",loading:"lazy"}):null}),(0,import_jsx_runtime4.jsx)("div",{className:"n",children:a.name})]},a.id))})]}):null,(data?.albums??[]).length>0?(0,import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment,{children:[(0,import_jsx_runtime4.jsx)(SectionHead,{title:"\u65B0\u789F\u4E0A\u67B6",onMore:()=>nav.nav("albums")}),(0,import_jsx_runtime4.jsx)("div",{className:"cover-grid",children:data.albums.map(a=>(0,import_jsx_runtime4.jsx)(CoverCard,{cover:a.cover,name:a.name,sub:a.artist,onClick:()=>nav.nav("album",{id:a.id,name:a.name})},a.id))})]}):null,(0,import_jsx_runtime4.jsx)(SectionHead,{title:"\u65B0\u6B4C\u901F\u9012",action:(0,import_jsx_runtime4.jsxs)("button",{className:"sec-more",onClick:()=>{let list=data?.newSongs??[];list.length&&actions.playQueue(list,0)},children:[(0,import_jsx_runtime4.jsx)(IconPlay,{style:{width:14,height:14}}),"\u64AD\u653E\u5168\u90E8"]})}),home.loading?(0,import_jsx_runtime4.jsx)(Loading,{}):(0,import_jsx_runtime4.jsx)("div",{className:"new-grid",children:(data?.newSongs??[]).map(t=>{let idx=(data.newSongs??[]).findIndex(x=>x.id===t.id);return(0,import_jsx_runtime4.jsxs)("div",{className:"new-card",onClick:()=>actions.playQueue(data.newSongs,idx),children:[(0,import_jsx_runtime4.jsxs)("div",{className:"cv",children:[t.cover?(0,import_jsx_runtime4.jsx)("img",{src:t.cover,alt:"",loading:"lazy",style:{width:"100%",height:"100%",objectFit:"cover"}}):null,(0,import_jsx_runtime4.jsx)("span",{className:"pl",children:(0,import_jsx_runtime4.jsx)(IconPlay,{})})]}),(0,import_jsx_runtime4.jsxs)("div",{className:"meta",children:[(0,import_jsx_runtime4.jsx)("div",{className:"t",children:t.name}),(0,import_jsx_runtime4.jsx)("div",{className:"a",children:t.artist})]})]},t.id)})})]})}function PlaylistListPage(){let nav=useNav(),cats=useAsync(()=>api.playlistCategories(),[]),[cat,setCat]=(0,import_react6.useState)("\u5168\u90E8"),[items,setItems]=(0,import_react6.useState)([]),[page,setPage]=(0,import_react6.useState)(0),[more,setMore]=(0,import_react6.useState)(!0),[loading,setLoading]=(0,import_react6.useState)(!0),[loadingMore,setLoadingMore]=(0,import_react6.useState)(!1),sentinel=(0,import_react6.useRef)(null),load=async(nextCat,nextPage,append)=>{append?setLoadingMore(!0):setLoading(!0);try{let d=await api.playlists(nextCat,42,nextPage*42);setItems(prev=>append?[...prev,...d.items??[]]:d.items??[]),setMore(!!d.more&&(d.items??[]).length>0),setPage(nextPage)}catch{append||setItems([]),setMore(!1)}finally{setLoading(!1),setLoadingMore(!1)}};return(0,import_react6.useEffect)(()=>{load(cat,0,!1)},[cat]),(0,import_react6.useEffect)(()=>{let el=sentinel.current;if(!el)return;let io=new IntersectionObserver(entries=>{entries[0].isIntersecting&&more&&!loading&&!loadingMore&&load(cat,page+1,!0)},{rootMargin:"240px"});return io.observe(el),()=>io.disconnect()},[more,loading,loadingMore,page,cat]),(0,import_jsx_runtime4.jsxs)("div",{className:"page",children:[(0,import_jsx_runtime4.jsx)("div",{className:"page-title",children:"\u6B4C\u5355\u5E7F\u573A"}),(0,import_jsx_runtime4.jsx)("div",{className:"page-sub",children:"\u6309\u5FC3\u60C5\u4E0E\u573A\u666F,\u627E\u5230\u4ECA\u5929\u60F3\u542C\u7684\u90A3\u4E00\u5F20"}),(0,import_jsx_runtime4.jsx)("div",{className:"chips cats",style:{marginTop:18},children:(cats.data?.categories??["\u5168\u90E8"]).map(c=>(0,import_jsx_runtime4.jsx)("button",{className:`chip${cat===c?" on":""}`,onClick:()=>{setCat(c),setItems([])},children:c},c))}),loading?(0,import_jsx_runtime4.jsx)(SkeletonGrid,{n:15}):(0,import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment,{children:[(0,import_jsx_runtime4.jsx)("div",{className:"cover-grid",children:items.map(p=>(0,import_jsx_runtime4.jsx)(PlaylistCard,{item:p,onOpen:()=>nav.nav("musiclist",{kind:"playlist",id:p.id,name:p.name,cover:p.cover})},`${p.id}-${p.name}`))}),items.length===0?(0,import_jsx_runtime4.jsx)(Empty,{text:"\u8FD9\u4E2A\u5206\u7C7B\u4E0B\u6682\u65F6\u6CA1\u6709\u6B4C\u5355"}):null,(0,import_jsx_runtime4.jsx)("div",{ref:sentinel,style:{height:1}}),loadingMore?(0,import_jsx_runtime4.jsx)(Loading,{text:"\u52A0\u8F7D\u66F4\u591A\u2026"}):null,!more&&items.length>0?(0,import_jsx_runtime4.jsx)("div",{className:"loading-row",style:{color:"var(--muted-2)"},children:"\u6CA1\u6709\u66F4\u591A\u4E86"}):null]})]})}function ToplistPage(){let nav=useNav(),list=useAsync(()=>api.toplists(),[]);return(0,import_jsx_runtime4.jsxs)("div",{className:"page",children:[(0,import_jsx_runtime4.jsx)("div",{className:"page-title",children:"\u6392\u884C\u699C"}),(0,import_jsx_runtime4.jsx)("div",{className:"page-sub",children:"\u5B9E\u65F6\u66F4\u65B0,\u770B\u770B\u5927\u5BB6\u6700\u8FD1\u90FD\u5728\u542C\u4EC0\u4E48"}),(0,import_jsx_runtime4.jsx)("div",{style:{height:22}}),list.loading?(0,import_jsx_runtime4.jsx)(SkeletonGrid,{n:10}):(0,import_jsx_runtime4.jsx)("div",{className:"cover-grid",children:(list.data?.items??[]).map(item=>(0,import_jsx_runtime4.jsx)(CoverCard,{cover:item.cover,name:item.name,sub:item.updateFrequency,playCount:item.playCount,onClick:()=>nav.nav("musiclist",{kind:"toplist",id:item.id,name:item.name,cover:item.cover,updateFrequency:item.updateFrequency})},item.id))})]})}var AREAS=[["ALL","\u5168\u90E8"],["ZH","\u534E\u8BED"],["EA","\u6B27\u7F8E"],["JP","\u65E5\u672C"],["KR","\u97E9\u56FD"]];function AlbumListPage(){let nav=useNav(),[area,setArea]=(0,import_react6.useState)("ALL"),albums=useAsync(()=>api.albums(24,area),[area]);return(0,import_jsx_runtime4.jsxs)("div",{className:"page",children:[(0,import_jsx_runtime4.jsx)("div",{className:"page-title",children:"\u65B0\u789F\u4E0A\u67B6"}),(0,import_jsx_runtime4.jsx)("div",{className:"page-sub",children:"\u6700\u65B0\u53D1\u884C\u7684\u4E13\u8F91,\u7B2C\u4E00\u65F6\u95F4\u542C\u5230"}),(0,import_jsx_runtime4.jsx)("div",{className:"chips",style:{marginTop:18},children:AREAS.map(([k,label])=>(0,import_jsx_runtime4.jsx)("button",{className:`chip${area===k?" on":""}`,onClick:()=>setArea(k),children:label},k))}),albums.loading?(0,import_jsx_runtime4.jsx)(SkeletonGrid,{n:12}):(0,import_jsx_runtime4.jsx)("div",{className:"cover-grid",children:(albums.data?.items??[]).map(a=>(0,import_jsx_runtime4.jsx)(CoverCard,{cover:a.cover,name:a.name,sub:a.artist,onClick:()=>nav.nav("album",{id:a.id,name:a.name})},a.id))})]})}var KIND_LABEL={playlist:"Playlist",toplist:"Ranking",daily:"Daily",favorite:"Favorites",history:"History"};function MusicListPage({params}){let nav=useNav(),favorites=usePlayerSelector(s=>s.favorites),history=usePlayerSelector(s=>s.history),actions=usePlayerActions(),[clearFav,setClearFav]=(0,import_react6.useState)(!1),kind=params.kind,local=kind==="favorite"||kind==="history",detail=useAsync(()=>kind==="playlist"?api.playlistDetail(params.id):Promise.resolve(null),[kind,params.id]),tracksRes=useAsync(()=>kind==="playlist"?api.playlistTracks(params.id,300):kind==="toplist"?api.toplistTracks(params.id,200):Promise.resolve({tracks:params.tracks??[]}),[kind,params.id]),tracks=local?kind==="favorite"?favorites:history:tracksRes.data?.tracks??[],info=detail.data??{},name=local?kind==="favorite"?"\u6211\u559C\u6B22\u7684\u97F3\u4E50":"\u6700\u8FD1\u64AD\u653E":info.name??params.name??"\u6B4C\u5355",cover=local?tracks[0]?.cover??"":info.cover??params.cover??tracks[0]?.cover??"",desc=local?kind==="favorite"?"\u6536\u85CF\u8FC7\u7684\u6B4C\u66F2\u90FD\u5728\u8FD9\u91CC,\u767B\u5F55\u540E\u53EF\u540C\u6B65\u5230\u7F51\u6613\u4E91\u300C\u6211\u559C\u6B22\u7684\u97F3\u4E50\u300D":"\u6700\u8FD1\u64AD\u653E\u8FC7\u7684\u6B4C\u66F2,\u6309\u65F6\u95F4\u5012\u5E8F":info.description??"",creator=info.creator??"",creatorAvatar=info.creatorAvatar??"",updateFrequency=kind==="toplist"?params.updateFrequency??"":"",playAll=()=>{tracks.length&&actions.playQueue(tracks,0)},shufflePlay=()=>{tracks.length&&actions.playQueue(shuffled(tracks),0)};return(0,import_jsx_runtime4.jsxs)("div",{className:"page",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"detail",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"detail-bg",children:[cover?(0,import_jsx_runtime4.jsx)("div",{className:"img",style:{backgroundImage:`url("${cover}")`}}):null,(0,import_jsx_runtime4.jsx)("div",{className:"fade"})]}),(0,import_jsx_runtime4.jsxs)("div",{className:"detail-head",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"detail-cover-wrap",children:[cover?(0,import_jsx_runtime4.jsx)("img",{className:"detail-cover",src:cover,alt:""}):(0,import_jsx_runtime4.jsx)("div",{className:"detail-cover"}),(0,import_jsx_runtime4.jsx)("div",{className:"cover-play",children:(0,import_jsx_runtime4.jsx)("button",{onClick:playAll,title:"\u64AD\u653E\u5168\u90E8",children:(0,import_jsx_runtime4.jsx)(IconPlay,{})})})]}),(0,import_jsx_runtime4.jsxs)("div",{className:"detail-info",children:[(0,import_jsx_runtime4.jsx)("span",{className:"detail-kind",children:KIND_LABEL[kind]??"Playlist"}),(0,import_jsx_runtime4.jsx)("div",{className:"detail-name",children:name}),(0,import_jsx_runtime4.jsxs)("div",{className:"detail-meta",children:[creator?(0,import_jsx_runtime4.jsxs)("span",{className:"who",children:[creatorAvatar?(0,import_jsx_runtime4.jsx)("img",{src:creatorAvatar,alt:""}):null,creator]}):null,creator?(0,import_jsx_runtime4.jsx)("span",{className:"sep"}):null,(0,import_jsx_runtime4.jsxs)("span",{children:[tracks.length," \u9996"]}),info.playCount?(0,import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment,{children:[(0,import_jsx_runtime4.jsx)("span",{className:"sep"}),(0,import_jsx_runtime4.jsxs)("span",{children:["\u64AD\u653E ",formatCount(info.playCount)]})]}):null,totalDuration(tracks)?(0,import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment,{children:[(0,import_jsx_runtime4.jsx)("span",{className:"sep"}),(0,import_jsx_runtime4.jsx)("span",{children:totalDuration(tracks)})]}):null,updateFrequency?(0,import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment,{children:[(0,import_jsx_runtime4.jsx)("span",{className:"sep"}),(0,import_jsx_runtime4.jsx)("span",{children:updateFrequency})]}):null]}),desc?(0,import_jsx_runtime4.jsx)("div",{className:"detail-desc",title:desc,children:desc}):null]})]}),(0,import_jsx_runtime4.jsxs)("div",{className:"action-bar",children:[(0,import_jsx_runtime4.jsxs)("button",{className:"pill-btn primary",onClick:playAll,children:[(0,import_jsx_runtime4.jsx)(IconPlay,{}),"\u64AD\u653E\u5168\u90E8"]}),(0,import_jsx_runtime4.jsxs)("button",{className:"pill-btn ghost",onClick:shufflePlay,children:[(0,import_jsx_runtime4.jsx)(IconRadio,{}),"\u968F\u673A\u64AD\u653E"]}),kind==="favorite"&&tracks.length>0?(0,import_jsx_runtime4.jsxs)("button",{className:"pill-btn ghost",onClick:()=>setClearFav(!0),children:[(0,import_jsx_runtime4.jsx)(IconHeart,{}),"\u53D6\u6D88\u5168\u90E8\u6536\u85CF"]}):null,(0,import_jsx_runtime4.jsx)("span",{style:{flex:1}}),kind==="history"&&tracks.length>0?(0,import_jsx_runtime4.jsxs)("button",{className:"pill-btn ghost",onClick:()=>actions.clearHistory(),children:[(0,import_jsx_runtime4.jsx)(IconTrash,{}),"\u6E05\u7A7A\u8BB0\u5F55"]}):null]}),tracksRes.loading&&!local?(0,import_jsx_runtime4.jsx)(Loading,{}):null,tracksRes.error?(0,import_jsx_runtime4.jsxs)("div",{className:"err",children:["\u52A0\u8F7D\u5931\u8D25:",tracksRes.error.message]}):null,!tracksRes.loading&&tracks.length===0?(0,import_jsx_runtime4.jsx)(Empty,{text:kind==="favorite"?"\u8FD8\u6CA1\u6709\u6536\u85CF\u4EFB\u4F55\u6B4C\u66F2":kind==="history"?"\u8FD8\u6CA1\u6709\u64AD\u653E\u8BB0\u5F55":"\u8FD9\u4E2A\u6B4C\u5355\u662F\u7A7A\u7684"}):null,tracks.length>0?(0,import_jsx_runtime4.jsxs)("div",{className:"song-list",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"song-head",children:[(0,import_jsx_runtime4.jsx)("span",{style:{textAlign:"center"},children:"#"}),(0,import_jsx_runtime4.jsx)("span",{children:"\u6807\u9898"}),(0,import_jsx_runtime4.jsx)("span",{className:"album-col",children:"\u4E13\u8F91"}),(0,import_jsx_runtime4.jsx)("span",{style:{textAlign:"right"},children:"\u65F6\u957F"}),(0,import_jsx_runtime4.jsx)("span",{style:{textAlign:"right",paddingRight:8},children:"\u64CD\u4F5C"})]}),tracks.map((t,i)=>(0,import_jsx_runtime4.jsx)(SongRow,{track:t,index:i,onPlay:()=>actions.playQueue(tracks,i),extraOps:kind==="history"?(0,import_jsx_runtime4.jsx)("button",{className:"icon-btn sm",title:"\u4ECE\u8BB0\u5F55\u4E2D\u79FB\u9664",onClick:e=>{e.stopPropagation(),actions.removeHistory(t.id)},children:(0,import_jsx_runtime4.jsx)(IconTrash,{})}):null},`${t.id}-${i}`))]}):null]}),(0,import_jsx_runtime4.jsx)(Confirm,{open:clearFav,title:"\u53D6\u6D88\u5168\u90E8\u6536\u85CF",text:`\u5C06\u4ECE\u6536\u85CF\u4E2D\u79FB\u9664\u5168\u90E8 ${tracks.length} \u9996\u6B4C\u66F2(\u5DF2\u767B\u5F55\u65F6\u4F1A\u540C\u65F6\u53D6\u6D88\u4E91\u7AEF\u559C\u6B22),\u786E\u5B9A\u7EE7\u7EED\u5417?`,okText:"\u5168\u90E8\u53D6\u6D88",danger:!0,onCancel:()=>setClearFav(!1),onOk:()=>{actions.clearFavorites(),setClearFav(!1)}})]})}function AlbumDetailPage({params}){let actions=usePlayerActions(),album=useAsync(()=>api.albumDetail(params.id),[params.id]),a=album.data?.album,tracks=album.data?.tracks??[];return(0,import_jsx_runtime4.jsx)("div",{className:"page",children:(0,import_jsx_runtime4.jsxs)("div",{className:"detail",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"detail-bg",children:[a?.cover??params.cover?(0,import_jsx_runtime4.jsx)("div",{className:"img",style:{backgroundImage:`url("${a?.cover??params.cover}")`}}):null,(0,import_jsx_runtime4.jsx)("div",{className:"fade"})]}),(0,import_jsx_runtime4.jsxs)("div",{className:"detail-head",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"detail-cover-wrap",children:[a?.cover?(0,import_jsx_runtime4.jsx)("img",{className:"detail-cover",src:a.cover,alt:""}):(0,import_jsx_runtime4.jsx)("div",{className:"detail-cover"}),(0,import_jsx_runtime4.jsx)("div",{className:"cover-play",children:(0,import_jsx_runtime4.jsx)("button",{onClick:()=>tracks.length&&actions.playQueue(tracks,0),children:(0,import_jsx_runtime4.jsx)(IconPlay,{})})})]}),(0,import_jsx_runtime4.jsxs)("div",{className:"detail-info",children:[(0,import_jsx_runtime4.jsx)("span",{className:"detail-kind",children:"Album"}),(0,import_jsx_runtime4.jsx)("div",{className:"detail-name",children:a?.name??params.name}),(0,import_jsx_runtime4.jsxs)("div",{className:"detail-meta",children:[a?.artist?(0,import_jsx_runtime4.jsxs)("span",{className:"who",children:[a.artistCover?(0,import_jsx_runtime4.jsx)("img",{src:a.artistCover,alt:""}):null,a.artist]}):null,a?.artist?(0,import_jsx_runtime4.jsx)("span",{className:"sep"}):null,(0,import_jsx_runtime4.jsxs)("span",{children:[tracks.length," \u9996"]}),a?.publishTime?(0,import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment,{children:[(0,import_jsx_runtime4.jsx)("span",{className:"sep"}),(0,import_jsx_runtime4.jsxs)("span",{children:[formatDate(a.publishTime)," \u53D1\u884C"]})]}):null,a?.company?(0,import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment,{children:[(0,import_jsx_runtime4.jsx)("span",{className:"sep"}),(0,import_jsx_runtime4.jsx)("span",{children:a.company})]}):null]}),a?.description?(0,import_jsx_runtime4.jsx)("div",{className:"detail-desc",title:a.description,children:a.description}):null]})]}),(0,import_jsx_runtime4.jsx)("div",{className:"action-bar",children:(0,import_jsx_runtime4.jsxs)("button",{className:"pill-btn primary",onClick:()=>tracks.length&&actions.playQueue(tracks,0),children:[(0,import_jsx_runtime4.jsx)(IconPlay,{}),"\u64AD\u653E\u5168\u90E8"]})}),album.loading?(0,import_jsx_runtime4.jsx)(Loading,{}):null,album.error?(0,import_jsx_runtime4.jsxs)("div",{className:"err",children:["\u52A0\u8F7D\u5931\u8D25:",album.error.message]}):null,tracks.length>0?(0,import_jsx_runtime4.jsxs)("div",{className:"song-list",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"song-head",children:[(0,import_jsx_runtime4.jsx)("span",{style:{textAlign:"center"},children:"#"}),(0,import_jsx_runtime4.jsx)("span",{children:"\u6807\u9898"}),(0,import_jsx_runtime4.jsx)("span",{className:"album-col",children:"\u4E13\u8F91"}),(0,import_jsx_runtime4.jsx)("span",{style:{textAlign:"right"},children:"\u65F6\u957F"}),(0,import_jsx_runtime4.jsx)("span",{style:{textAlign:"right",paddingRight:8},children:"\u64CD\u4F5C"})]}),tracks.map((t,i)=>(0,import_jsx_runtime4.jsx)(SongRow,{track:t,index:i,onPlay:()=>actions.playQueue(tracks,i)},t.id))]}):null]})})}function ArtistDetailPage({params}){let actions=usePlayerActions(),nav=useNav(),data=useAsync(()=>api.artistDetail(params.id),[params.id]),albums=useAsync(()=>api.artistAlbums(params.id,12),[params.id]),artist=data.data?.artist,songs=data.data?.hotSongs??[];return(0,import_jsx_runtime4.jsx)("div",{className:"page",children:(0,import_jsx_runtime4.jsxs)("div",{className:"detail",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"detail-bg",children:[artist?.cover?(0,import_jsx_runtime4.jsx)("div",{className:"img",style:{backgroundImage:`url("${artist.cover}")`}}):null,(0,import_jsx_runtime4.jsx)("div",{className:"fade"})]}),(0,import_jsx_runtime4.jsxs)("div",{className:"detail-head",style:{alignItems:"center"},children:[(0,import_jsx_runtime4.jsx)("div",{className:"detail-cover-wrap",style:{borderRadius:"50%"},children:artist?.cover?(0,import_jsx_runtime4.jsx)("img",{className:"detail-cover",style:{borderRadius:"50%"},src:artist.cover,alt:""}):(0,import_jsx_runtime4.jsx)("div",{className:"detail-cover"})}),(0,import_jsx_runtime4.jsxs)("div",{className:"detail-info",children:[(0,import_jsx_runtime4.jsx)("span",{className:"detail-kind",children:"Artist"}),(0,import_jsx_runtime4.jsx)("div",{className:"detail-name",children:artist?.name??params.name}),(0,import_jsx_runtime4.jsxs)("div",{className:"detail-meta",children:[artist?.alias?(0,import_jsx_runtime4.jsx)("span",{children:artist.alias}):null,artist?.alias?(0,import_jsx_runtime4.jsx)("span",{className:"sep"}):null,(0,import_jsx_runtime4.jsxs)("span",{children:[artist?.musicSize??songs.length," \u9996\u6B4C\u66F2"]}),(0,import_jsx_runtime4.jsx)("span",{className:"sep"}),(0,import_jsx_runtime4.jsxs)("span",{children:[artist?.albumSize??0," \u5F20\u4E13\u8F91"]})]}),artist?.briefDesc?(0,import_jsx_runtime4.jsx)("div",{className:"detail-desc",children:artist.briefDesc}):null]})]}),(0,import_jsx_runtime4.jsx)("div",{className:"action-bar",children:(0,import_jsx_runtime4.jsxs)("button",{className:"pill-btn primary",onClick:()=>songs.length&&actions.playQueue(songs,0),children:[(0,import_jsx_runtime4.jsx)(IconPlay,{}),"\u64AD\u653E\u70ED\u95E8\u6B4C\u66F2"]})}),data.loading?(0,import_jsx_runtime4.jsx)(Loading,{}):null,songs.length>0?(0,import_jsx_runtime4.jsxs)("div",{className:"song-list",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"song-head",children:[(0,import_jsx_runtime4.jsx)("span",{style:{textAlign:"center"},children:"#"}),(0,import_jsx_runtime4.jsx)("span",{children:"\u70ED\u95E8\u6B4C\u66F2"}),(0,import_jsx_runtime4.jsx)("span",{className:"album-col",children:"\u4E13\u8F91"}),(0,import_jsx_runtime4.jsx)("span",{style:{textAlign:"right"},children:"\u65F6\u957F"}),(0,import_jsx_runtime4.jsx)("span",{style:{textAlign:"right",paddingRight:8},children:"\u64CD\u4F5C"})]}),songs.map((t,i)=>(0,import_jsx_runtime4.jsx)(SongRow,{track:t,index:i,onPlay:()=>actions.playQueue(songs,i)},t.id))]}):null,(albums.data?.items??[]).length>0?(0,import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment,{children:[(0,import_jsx_runtime4.jsx)(SectionHead,{title:"\u4E13\u8F91"}),(0,import_jsx_runtime4.jsx)("div",{className:"cover-grid",children:albums.data.items.map(al=>(0,import_jsx_runtime4.jsx)(CoverCard,{cover:al.cover,name:al.name,sub:al.publishTime?formatDate(al.publishTime):"",onClick:()=>nav.nav("album",{id:al.id,name:al.name})},al.id))})]}):null]})})}var SEARCH_TYPES=[["song","\u5355\u66F2"],["playlist","\u6B4C\u5355"],["album","\u4E13\u8F91"],["artist","\u6B4C\u624B"]],HISTORY_KEY="dsh-music.searchHistory.v2";function SearchPage({initialKeyword}){let nav=useNav(),[keyword,setKeyword]=(0,import_react6.useState)(initialKeyword??""),[submitted,setSubmitted]=(0,import_react6.useState)(initialKeyword??""),[type,setType]=(0,import_react6.useState)("song"),[history,setHistory]=(0,import_react6.useState)(()=>{try{return JSON.parse(localStorage.getItem(HISTORY_KEY)||"[]")}catch{return[]}}),hot=useAsync(()=>api.searchHot(),[]);(0,import_react6.useEffect)(()=>{initialKeyword&&(setKeyword(initialKeyword),setSubmitted(initialKeyword))},[initialKeyword]);let submit=kw=>{let k=String(kw??"").trim();k&&(setKeyword(k),setSubmitted(k),setType("song"),setHistory(prev=>{let next=[k,...prev.filter(h=>h!==k)].slice(0,12);try{localStorage.setItem(HISTORY_KEY,JSON.stringify(next))}catch{}return next}))};return submitted?(0,import_jsx_runtime4.jsx)(SearchResult,{keyword:submitted,type,onType:setType,nav,onBack:()=>setSubmitted("")}):(0,import_jsx_runtime4.jsxs)("div",{className:"page",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"search-hero",children:[(0,import_jsx_runtime4.jsx)("h1",{children:"\u641C\u7D22"}),(0,import_jsx_runtime4.jsx)("div",{className:"page-sub",children:"\u6B4C\u66F2\u3001\u6B4C\u624B\u3001\u4E13\u8F91\u3001\u6B4C\u5355,\u60F3\u542C\u4EC0\u4E48\u76F4\u63A5\u641C"}),(0,import_jsx_runtime4.jsxs)("div",{className:"search-box",style:{width:420,marginTop:18,height:44,background:"var(--panel)"},children:[(0,import_jsx_runtime4.jsx)(IconSearch,{}),(0,import_jsx_runtime4.jsx)("input",{autoFocus:!0,placeholder:"\u641C\u7D22\u97F3\u4E50",value:keyword,onChange:e=>setKeyword(e.target.value),onKeyDown:e=>{e.key==="Enter"&&submit(keyword)}})]})]}),(0,import_jsx_runtime4.jsx)(SectionHead,{title:"\u70ED\u641C\u699C"}),(0,import_jsx_runtime4.jsxs)("div",{className:"hot-list",children:[(hot.data?.items??[]).map((h,i)=>(0,import_jsx_runtime4.jsxs)("div",{className:"hot-row",onClick:()=>submit(h.keyword),children:[(0,import_jsx_runtime4.jsx)("span",{className:"n",children:i+1}),(0,import_jsx_runtime4.jsx)("span",{className:"k",children:h.keyword}),(0,import_jsx_runtime4.jsx)("span",{className:"s",children:formatCount(h.score)})]},h.keyword)),hot.loading?(0,import_jsx_runtime4.jsx)(Loading,{}):null]}),history.length>0?(0,import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment,{children:[(0,import_jsx_runtime4.jsx)(SectionHead,{title:"\u641C\u7D22\u5386\u53F2",action:(0,import_jsx_runtime4.jsx)("button",{className:"sec-more",onClick:()=>{setHistory([]),localStorage.removeItem(HISTORY_KEY)},children:"\u6E05\u7A7A"})}),(0,import_jsx_runtime4.jsx)("div",{className:"history-chips",children:history.map(h=>(0,import_jsx_runtime4.jsx)("button",{className:"chip",onClick:()=>submit(h),children:h},h))})]}):null]})}function SearchResult({keyword,type,onType,nav,onBack}){let actions=usePlayerActions(),res=useAsync(()=>api.search(keyword,type,50),[keyword,type]),items=res.data?.items??[],songs=type==="song"?items:[];return(0,import_jsx_runtime4.jsxs)("div",{className:"page",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"search-hero",children:[(0,import_jsx_runtime4.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:10},children:[(0,import_jsx_runtime4.jsx)("button",{className:"back-btn",onClick:onBack,title:"\u8FD4\u56DE",children:(0,import_jsx_runtime4.jsx)(IconArrowLeft,{})}),(0,import_jsx_runtime4.jsx)("h1",{style:{fontSize:26},children:keyword})]}),(0,import_jsx_runtime4.jsx)("div",{className:"page-sub",children:res.data?.total?`\u5171 ${formatCount(res.data.total)} \u6761\u7ED3\u679C`:"\u641C\u7D22\u7ED3\u679C"})]}),(0,import_jsx_runtime4.jsx)("div",{className:"chips",style:{marginTop:16},children:SEARCH_TYPES.map(([k,label])=>(0,import_jsx_runtime4.jsx)("button",{className:`chip${type===k?" on":""}`,onClick:()=>onType(k),children:label},k))}),res.loading?(0,import_jsx_runtime4.jsx)(Loading,{text:"\u641C\u7D22\u4E2D\u2026"}):null,res.error?(0,import_jsx_runtime4.jsxs)("div",{className:"err",children:["\u641C\u7D22\u5931\u8D25:",res.error.message]}):null,!res.loading&&items.length===0?(0,import_jsx_runtime4.jsx)(Empty,{text:"\u6CA1\u6709\u627E\u5230\u76F8\u5173\u5185\u5BB9",icon:IconSearch}):null,type==="song"&&songs.length>0?(0,import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment,{children:[(0,import_jsx_runtime4.jsxs)("div",{className:"action-bar",style:{position:"static",background:"transparent",backdropFilter:"none",borderBottom:"none"},children:[(0,import_jsx_runtime4.jsxs)("button",{className:"pill-btn primary",onClick:()=>actions.playQueue(songs,0),children:[(0,import_jsx_runtime4.jsx)(IconPlay,{}),"\u64AD\u653E\u5168\u90E8"]}),(0,import_jsx_runtime4.jsxs)("span",{style:{color:"var(--muted)",fontSize:13},children:[songs.length," \u9996"]})]}),(0,import_jsx_runtime4.jsxs)("div",{className:"song-list",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"song-head",children:[(0,import_jsx_runtime4.jsx)("span",{style:{textAlign:"center"},children:"#"}),(0,import_jsx_runtime4.jsx)("span",{children:"\u6807\u9898"}),(0,import_jsx_runtime4.jsx)("span",{className:"album-col",children:"\u4E13\u8F91"}),(0,import_jsx_runtime4.jsx)("span",{style:{textAlign:"right"},children:"\u65F6\u957F"}),(0,import_jsx_runtime4.jsx)("span",{style:{textAlign:"right",paddingRight:8},children:"\u64CD\u4F5C"})]}),songs.map((t,i)=>(0,import_jsx_runtime4.jsx)(SongRow,{track:t,index:i,onPlay:()=>actions.playQueue(songs,i)},t.id))]})]}):null,type==="playlist"&&items.length>0?(0,import_jsx_runtime4.jsx)("div",{className:"cover-grid",children:items.map(p=>(0,import_jsx_runtime4.jsx)(PlaylistCard,{item:p,onOpen:()=>nav.nav("musiclist",{kind:"playlist",id:p.id,name:p.name,cover:p.cover})},p.id))}):null,type==="album"&&items.length>0?(0,import_jsx_runtime4.jsx)("div",{className:"cover-grid",children:items.map(a=>(0,import_jsx_runtime4.jsx)(CoverCard,{cover:a.cover,name:a.name,sub:a.artist,onClick:()=>nav.nav("album",{id:a.id,name:a.name})},a.id))}):null,type==="artist"&&items.length>0?(0,import_jsx_runtime4.jsx)("div",{className:"cover-grid",children:items.map(a=>(0,import_jsx_runtime4.jsx)(CoverCard,{cover:a.cover,name:a.name,sub:`${a.musicSize||0} \u9996\u6B4C\u66F2`,round:!0,onClick:()=>nav.nav("artist",{id:a.id,name:a.name})},a.id))}):null]})}function UserPage(){let nav=useNav(),favorites=usePlayerSelector(s=>s.favorites),history=usePlayerSelector(s=>s.history),{account,status}=useAccount(),playlists=useAsync(()=>account?.loggedIn?api.userPlaylists(24):Promise.resolve({items:[]}),[account?.loggedIn]);return(0,import_jsx_runtime4.jsxs)("div",{className:"page",children:[(0,import_jsx_runtime4.jsx)("div",{className:"page-title",children:"\u6211\u7684\u97F3\u4E50"}),(0,import_jsx_runtime4.jsxs)("div",{className:"account-card",children:[account?.avatar?(0,import_jsx_runtime4.jsx)("img",{className:"av",src:account.avatar,alt:""}):(0,import_jsx_runtime4.jsx)("div",{className:"av"}),(0,import_jsx_runtime4.jsxs)("div",{className:"grow",children:[(0,import_jsx_runtime4.jsx)("div",{className:"n",children:account?.loggedIn?account.nickname:"\u672A\u767B\u5F55"}),(0,import_jsx_runtime4.jsx)("div",{className:"d",children:account?.loggedIn?`${account.cookieSource==="config"?"\u767B\u5F55\u6001\u6765\u81EA\u63D2\u4EF6\u914D\u7F6E":"\u5DF2\u767B\u5F55\u7F51\u6613\u4E91\u8D26\u53F7"}${account.vipType?" \xB7 \u4F1A\u5458":""}`:status==="loading"?"\u6B63\u5728\u68C0\u6D4B\u767B\u5F55\u72B6\u6001\u2026":"\u767B\u5F55\u540E\u53EF\u540C\u6B65\u6BCF\u65E5\u63A8\u8350\u3001\u79C1\u4EBA FM \u4E0E\u559C\u6B22\u7684\u97F3\u4E50"})]}),account?.loggedIn?(0,import_jsx_runtime4.jsx)("button",{className:"ghost-btn",onClick:()=>nav.nav("settings"),children:"\u8D26\u53F7\u8BBE\u7F6E"}):(0,import_jsx_runtime4.jsx)("button",{className:"pill-btn primary",onClick:()=>nav.nav("settings"),children:"\u53BB\u767B\u5F55"})]}),(0,import_jsx_runtime4.jsxs)("div",{className:"cover-grid",style:{marginTop:22},children:[(0,import_jsx_runtime4.jsx)(CoverCard,{cover:favorites[0]?.cover??"",name:"\u6211\u559C\u6B22\u7684\u97F3\u4E50",sub:`${favorites.length} \u9996`,onClick:()=>nav.nav("musiclist",{kind:"favorite",name:"\u6211\u559C\u6B22\u7684\u97F3\u4E50"})}),(0,import_jsx_runtime4.jsx)(CoverCard,{cover:history[0]?.cover??"",name:"\u6700\u8FD1\u64AD\u653E",sub:`${history.length} \u9996`,onClick:()=>nav.nav("musiclist",{kind:"history",name:"\u6700\u8FD1\u64AD\u653E"})})]}),account?.loggedIn?(0,import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment,{children:[(0,import_jsx_runtime4.jsx)(SectionHead,{title:"\u6211\u7684\u6B4C\u5355"}),playlists.loading?(0,import_jsx_runtime4.jsx)(SkeletonGrid,{n:5}):(0,import_jsx_runtime4.jsx)("div",{className:"cover-grid",children:(playlists.data?.items??[]).map(p=>(0,import_jsx_runtime4.jsx)(PlaylistCard,{item:p,onOpen:()=>nav.nav("musiclist",{kind:"playlist",id:p.id,name:p.name,cover:p.cover})},p.id))})]}):null]})}var VIP_NAMES={0:"",10:"\u666E\u901A\u4F1A\u5458",11:"\u8C6A\u534E\u4F1A\u5458"};function LoginPanel(){let{status,account}=useAccount(),[qr,setQr]=(0,import_react6.useState)(null),[busy,setBusy]=(0,import_react6.useState)(!1),timerRef=(0,import_react6.useRef)(null),stopPoll=()=>{clearInterval(timerRef.current),timerRef.current=null};(0,import_react6.useEffect)(()=>()=>stopPoll(),[]);let poll=async key=>{let r;try{r=await api.qrCheck(key)}catch{return}if(r.code===803){stopPoll(),r.ok?(setQr(null),await refreshAccount()):setQr(q=>({...q,state:"error",message:r.message??"\u767B\u5F55\u672A\u5B8C\u6210"}));return}if(r.code===800){stopPoll(),setQr(q=>({...q,state:"expired",message:r.message??"\u4E8C\u7EF4\u7801\u5DF2\u8FC7\u671F"}));return}setQr(q=>q&&{...q,state:r.code===802?"scanned":"active",message:r.message??q.message})},startLogin=async()=>{stopPoll(),setBusy(!0);try{let{key}=await api.qrKey(),{qrimg,qrurl}=await api.qrCreate(key);if(!qrimg)throw new Error("\u63A5\u53E3\u672A\u8FD4\u56DE\u4E8C\u7EF4\u7801");setQr({img:qrimg,url:qrurl??"",key,state:"active",message:"\u7B49\u5F85\u626B\u7801"}),timerRef.current=setInterval(()=>poll(key),2500)}catch(e){setQr({state:"error",message:`\u83B7\u53D6\u4E8C\u7EF4\u7801\u5931\u8D25:${e.message}`})}finally{setBusy(!1)}},doLogout=async()=>{setBusy(!0);try{await api.logout(),await refreshAccount()}finally{setBusy(!1)}},loggedIn=account?.loggedIn,failed=qr&&(qr.state==="expired"||qr.state==="error");return(0,import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment,{children:[(0,import_jsx_runtime4.jsxs)("div",{className:"account-card",style:{marginTop:4},children:[loggedIn&&account.avatar?(0,import_jsx_runtime4.jsx)("img",{className:"av",src:account.avatar,alt:""}):(0,import_jsx_runtime4.jsx)("div",{className:"av"}),(0,import_jsx_runtime4.jsxs)("div",{className:"grow",children:[(0,import_jsx_runtime4.jsx)("div",{className:"n",children:status==="loading"?"\u68C0\u6D4B\u4E2D\u2026":loggedIn?account.nickname:"\u672A\u767B\u5F55"}),(0,import_jsx_runtime4.jsx)("div",{className:"d",children:loggedIn?`\u5DF2\u767B\u5F55${account.cookieSource==="config"?"(\u53D6\u81EA\u63D2\u4EF6\u914D\u7F6E)":""}${VIP_NAMES[account.vipType]?` \xB7 ${VIP_NAMES[account.vipType]}`:""}`:"\u626B\u7801\u767B\u5F55\u540E\u53EF\u540C\u6B65\u6BCF\u65E5\u63A8\u8350\u3001\u79C1\u4EBA FM \u4E0E VIP \u8BD5\u542C"})]}),status==="ready"?loggedIn?(0,import_jsx_runtime4.jsx)("button",{className:"ghost-btn",onClick:doLogout,disabled:busy,children:"\u9000\u51FA\u767B\u5F55"}):(0,import_jsx_runtime4.jsx)("button",{className:"pill-btn primary",onClick:startLogin,disabled:busy,children:busy?"\u83B7\u53D6\u4E8C\u7EF4\u7801\u2026":"\u626B\u7801\u767B\u5F55"}):null]}),qr?(0,import_jsx_runtime4.jsxs)("div",{className:"qr-panel",children:[qr.img?(0,import_jsx_runtime4.jsx)("img",{src:qr.img,alt:"\u7F51\u6613\u4E91\u767B\u5F55\u4E8C\u7EF4\u7801",className:failed?"dim":""}):null,(0,import_jsx_runtime4.jsx)("div",{className:`qr-msg${failed?" expired":qr.state==="scanned"?" scanned":""}`,children:qr.message}),qr.img?(0,import_jsx_runtime4.jsx)("div",{className:"qr-tip",children:qr.state==="scanned"?"\u5728\u624B\u673A\u4E0A\u70B9\u786E\u8BA4\u5373\u53EF\u81EA\u52A8\u5B8C\u6210\u767B\u5F55":"\u6253\u5F00\u7F51\u6613\u4E91\u97F3\u4E50 App \u626B\u4E00\u626B"}):null,failed?(0,import_jsx_runtime4.jsx)("button",{className:"ghost-btn",onClick:startLogin,disabled:busy,children:"\u91CD\u65B0\u83B7\u53D6\u4E8C\u7EF4\u7801"}):qr.state==="active"?(0,import_jsx_runtime4.jsx)("button",{className:"ghost-btn",onClick:()=>{stopPoll(),setQr(null)},children:"\u53D6\u6D88"}):null,qr.url&&failed?(0,import_jsx_runtime4.jsx)("a",{className:"qr-link",style:{fontSize:11.5,color:"#4d7cff"},href:qr.url,target:"_blank",rel:"noreferrer",children:"\u5728\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00\u6388\u6743\u9875"}):null]}):null]})}var LEVELS=[["standard","\u6807\u51C6"],["exhigh","\u8F83\u9AD8"],["higher","\u9AD8"],["lossless","\u65E0\u635F"]],RATES=[.75,1,1.25,1.5];function formatSize(bytes){if(!Number.isFinite(bytes)||bytes<=0)return"\u2014";let mb=bytes/1024/1024;return mb>=1?`${mb.toFixed(1)} MB`:`${Math.max(1,Math.round(bytes/1024))} KB`}function StoragePanel(){let nav=useNav(),[state2,setState]=(0,import_react6.useState)({loading:!0,data:null,error:null}),load=()=>{setState(prev=>({...prev,loading:!0})),api.downloadInfo().then(data2=>setState({loading:!1,data:data2,error:null})).catch(error=>setState({loading:!1,data:null,error}))};(0,import_react6.useEffect)(load,[]);let open=name=>{api.openDownloadDir(name).catch(error=>nav.toast(`\u6253\u5F00\u5931\u8D25:${error.message}`,"err"))},data=state2.data,items=data?.items??[];return(0,import_jsx_runtime4.jsxs)("div",{className:"set-section",children:[(0,import_jsx_runtime4.jsx)(SectionHead,{title:"\u4E0B\u8F7D"}),(0,import_jsx_runtime4.jsxs)("div",{className:"set-row",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"lab",children:[(0,import_jsx_runtime4.jsx)("div",{className:"t",children:"\u4E0B\u8F7D\u76EE\u5F55"}),(0,import_jsx_runtime4.jsxs)("div",{className:"d",children:[(0,import_jsx_runtime4.jsx)("span",{className:"path",children:data?.dir??"\u8BFB\u53D6\u4E2D\u2026"}),(0,import_jsx_runtime4.jsx)("br",{}),"\u6B4C\u66F2\u7531\u5BBF\u4E3B\u76F4\u63A5\u843D\u76D8\u5230\u8FD9\u91CC\u3002\u8981\u6362\u4F4D\u7F6E\u8BF7\u4FEE\u6539\u63D2\u4EF6\u914D\u7F6E ",(0,import_jsx_runtime4.jsx)("code",{children:"downloadDir"}),"(\u7EDD\u5BF9\u8DEF\u5F84)\u3002"]})]}),(0,import_jsx_runtime4.jsx)("button",{className:"ghost-btn",onClick:()=>open(),disabled:state2.loading,children:"\u6253\u5F00\u76EE\u5F55"})]}),(0,import_jsx_runtime4.jsxs)("div",{className:"dl-head",children:[(0,import_jsx_runtime4.jsx)("span",{className:"t",children:"\u6700\u8FD1\u4E0B\u8F7D"}),(0,import_jsx_runtime4.jsx)("span",{className:"n",children:data?.total?`\u5171 ${data.total} \u4E2A\u97F3\u9891\u6587\u4EF6`:""}),(0,import_jsx_runtime4.jsx)("span",{className:"grow"}),(0,import_jsx_runtime4.jsx)("button",{className:"ghost-btn sm",onClick:load,disabled:state2.loading,children:state2.loading?"\u5237\u65B0\u4E2D\u2026":"\u5237\u65B0"})]}),state2.error?(0,import_jsx_runtime4.jsxs)("div",{className:"dl-empty",children:["\u8BFB\u53D6\u4E0B\u8F7D\u76EE\u5F55\u5931\u8D25:",state2.error.message]}):null,!state2.error&&!state2.loading&&items.length===0?(0,import_jsx_runtime4.jsx)("div",{className:"dl-empty",children:data?.exists?"\u76EE\u5F55\u91CC\u8FD8\u6CA1\u6709\u97F3\u9891\u6587\u4EF6,\u6311\u4E00\u9996\u6B4C\u70B9\u4E0B\u8F7D\u8BD5\u8BD5":"\u8FD8\u6CA1\u4E0B\u8F7D\u8FC7\u6B4C\u66F2,\u9996\u6B21\u4E0B\u8F7D\u4F1A\u81EA\u52A8\u521B\u5EFA\u8BE5\u76EE\u5F55"}):null,(0,import_jsx_runtime4.jsx)("div",{className:"dl-list",children:items.map(it=>(0,import_jsx_runtime4.jsxs)("div",{className:"dl-item",children:[(0,import_jsx_runtime4.jsxs)("span",{className:"n",title:it.path,children:[it.name,it.trial?(0,import_jsx_runtime4.jsx)("em",{children:"\u8BD5\u542C"}):null]}),(0,import_jsx_runtime4.jsxs)("span",{className:"m",children:[formatSize(it.sizeBytes)," \xB7 ",formatDate(it.mtime)]}),(0,import_jsx_runtime4.jsx)("button",{className:"ghost-btn sm",onClick:()=>open(it.name),children:"\u5B9A\u4F4D"})]},it.path))})]})}function SettingsPage({theme,setTheme,menuExpanded,setMenuExpanded}){let snap=usePlayer(),actions=usePlayerActions(),[tab,setTab]=(0,import_react6.useState)("basic");return(0,import_jsx_runtime4.jsxs)("div",{className:"page settings",children:[(0,import_jsx_runtime4.jsx)("div",{className:"page-title",children:"\u8BBE\u7F6E"}),(0,import_jsx_runtime4.jsx)("div",{className:"set-tabs",children:[["basic","\u8D26\u53F7"],["playback","\u64AD\u653E"],["appearance","\u5916\u89C2"],["storage","\u5B58\u50A8"],["about","\u5173\u4E8E"]].map(([k,label])=>(0,import_jsx_runtime4.jsx)("button",{className:`chip${tab===k?" on":""}`,onClick:()=>setTab(k),children:label},k))}),tab==="basic"?(0,import_jsx_runtime4.jsxs)("div",{className:"set-section",children:[(0,import_jsx_runtime4.jsx)(SectionHead,{title:"\u7F51\u6613\u4E91\u8D26\u53F7"}),(0,import_jsx_runtime4.jsx)(LoginPanel,{}),(0,import_jsx_runtime4.jsx)("div",{className:"set-row",children:(0,import_jsx_runtime4.jsxs)("div",{className:"lab",children:[(0,import_jsx_runtime4.jsx)("div",{className:"t",children:"\u767B\u5F55\u6001\u5B58\u50A8"}),(0,import_jsx_runtime4.jsx)("div",{className:"d",children:"\u626B\u7801\u6210\u529F\u540E Cookie \u4FDD\u5B58\u5728 ~/.dsh/music-cookie.json,\u91CD\u542F\u540E\u4ECD\u7136\u6709\u6548;\u9000\u51FA\u767B\u5F55\u4F1A\u6E05\u9664\u8BE5\u6587\u4EF6\u3002"})]})})]}):null,tab==="playback"?(0,import_jsx_runtime4.jsxs)("div",{className:"set-section",children:[(0,import_jsx_runtime4.jsx)(SectionHead,{title:"\u64AD\u653E"}),(0,import_jsx_runtime4.jsxs)("div",{className:"set-row",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"lab",children:[(0,import_jsx_runtime4.jsx)("div",{className:"t",children:"\u9ED8\u8BA4\u97F3\u8D28"}),(0,import_jsx_runtime4.jsx)("div",{className:"d",children:"\u97F3\u9891\u4EE3\u7406\u7684\u9ED8\u8BA4\u7801\u7387;\u66F4\u9AD8\u97F3\u8D28\u9700\u8981\u767B\u5F55\u8D26\u53F7\u4E0E\u4F1A\u5458"})]}),(0,import_jsx_runtime4.jsx)("div",{className:"seg",children:LEVELS.map(([lv,label])=>(0,import_jsx_runtime4.jsx)("button",{className:(snap.level??"standard")===lv?"on":"",onClick:()=>actions.setLevel(lv),children:label},lv))})]}),(0,import_jsx_runtime4.jsxs)("div",{className:"set-row",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"lab",children:[(0,import_jsx_runtime4.jsx)("div",{className:"t",children:"\u64AD\u653E\u901F\u5EA6"}),(0,import_jsx_runtime4.jsx)("div",{className:"d",children:"\u53D8\u901F\u64AD\u653E\u53EA\u5F71\u54CD\u5F53\u524D\u4F1A\u8BDD"})]}),(0,import_jsx_runtime4.jsx)("div",{className:"seg",children:RATES.map(r=>(0,import_jsx_runtime4.jsxs)("button",{className:snap.rate===r?"on":"",onClick:()=>actions.setRate(r),children:[r,"x"]},r))})]}),(0,import_jsx_runtime4.jsxs)("div",{className:"set-row",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"lab",children:[(0,import_jsx_runtime4.jsx)("div",{className:"t",children:"\u64AD\u653E\u6A21\u5F0F"}),(0,import_jsx_runtime4.jsx)("div",{className:"d",children:"\u5217\u8868\u5FAA\u73AF / \u5355\u66F2\u5FAA\u73AF / \u968F\u673A\u64AD\u653E"})]}),(0,import_jsx_runtime4.jsx)("div",{className:"seg",children:[["loop","\u5217\u8868"],["one","\u5355\u66F2"],["shuffle","\u968F\u673A"]].map(([m,label])=>(0,import_jsx_runtime4.jsx)("button",{className:snap.mode===m?"on":"",onClick:()=>actions.setMode(m),children:label},m))})]})]}):null,tab==="appearance"?(0,import_jsx_runtime4.jsxs)("div",{className:"set-section",children:[(0,import_jsx_runtime4.jsx)(SectionHead,{title:"\u5916\u89C2"}),(0,import_jsx_runtime4.jsxs)("div",{className:"set-row",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"lab",children:[(0,import_jsx_runtime4.jsx)("div",{className:"t",children:"\u4E3B\u9898"}),(0,import_jsx_runtime4.jsx)("div",{className:"d",children:"\u6DF1\u8272\u4E0E\u6D45\u8272\u4E24\u5957\u914D\u8272,\u4E0E AlgerMusicPlayer \u4FDD\u6301\u4E00\u81F4"})]}),(0,import_jsx_runtime4.jsxs)("div",{className:"seg",children:[(0,import_jsx_runtime4.jsx)("button",{className:theme==="dark"?"on":"",onClick:()=>setTheme("dark"),children:"\u6DF1\u8272"}),(0,import_jsx_runtime4.jsx)("button",{className:theme==="light"?"on":"",onClick:()=>setTheme("light"),children:"\u6D45\u8272"})]})]}),(0,import_jsx_runtime4.jsxs)("div",{className:"set-row",children:[(0,import_jsx_runtime4.jsxs)("div",{className:"lab",children:[(0,import_jsx_runtime4.jsx)("div",{className:"t",children:"\u5C55\u5F00\u4FA7\u8FB9\u83DC\u5355"}),(0,import_jsx_runtime4.jsx)("div",{className:"d",children:"\u5C55\u5F00\u540E\u83DC\u5355\u663E\u793A\u6587\u5B57,\u6536\u8D77\u65F6\u4EC5\u663E\u793A\u56FE\u6807"})]}),(0,import_jsx_runtime4.jsx)("div",{className:`switch${menuExpanded?" on":""}`,onClick:()=>setMenuExpanded(!menuExpanded),children:(0,import_jsx_runtime4.jsx)("i",{})})]})]}):null,tab==="storage"?(0,import_jsx_runtime4.jsx)(StoragePanel,{}):null,tab==="about"?(0,import_jsx_runtime4.jsxs)("div",{className:"set-section",children:[(0,import_jsx_runtime4.jsx)(SectionHead,{title:"\u5173\u4E8E"}),(0,import_jsx_runtime4.jsx)("div",{className:"set-row",children:(0,import_jsx_runtime4.jsxs)("div",{className:"lab",children:[(0,import_jsx_runtime4.jsx)("div",{className:"t",children:"DSH Music 1.0.3"}),(0,import_jsx_runtime4.jsx)("div",{className:"d",children:"\u754C\u9762\u590D\u523B\u81EA AlgerMusicPlayer 5.1(MIT),\u6570\u636E\u6765\u81EA\u7F51\u6613\u4E91\u97F3\u4E50\u5F00\u653E\u63A5\u53E3(\u793E\u533A\u7EF4\u62A4)\u3002 \u97F3\u4E50\u7248\u6743\u5F52\u7F51\u6613\u4E91\u53CA\u7248\u6743\u65B9\u6240\u6709,\u4EC5\u4F9B\u4E2A\u4EBA\u5B66\u4E60\u7814\u7A76,\u8BF7\u52FF\u7528\u4E8E\u5546\u4E1A\u7528\u9014\u3002"})]})}),(0,import_jsx_runtime4.jsx)("div",{className:"set-row",children:(0,import_jsx_runtime4.jsxs)("div",{className:"lab",children:[(0,import_jsx_runtime4.jsx)("div",{className:"t",children:"\u5BBF\u4E3B\u8DEF\u7531"}),(0,import_jsx_runtime4.jsx)("div",{className:"d",children:"/music/api/* \u6570\u636E\u63A5\u53E3,/music/stream/:id \u97F3\u9891\u6D41\u4EE3\u7406(\u652F\u6301 Range)\u3002"})]})})]}):null]})}var import_react7=require("react"),MENU=[{id:"home",label:"\u9996\u9875",icon:IconHome},{id:"search",label:"\u641C\u7D22",icon:IconSearch},{id:"list",label:"\u6B4C\u5355",icon:IconList},{id:"albums",label:"\u65B0\u789F\u4E0A\u67B6",icon:IconAlbum},{id:"toplist",label:"\u6392\u884C\u699C",icon:IconToplist},{id:"history",label:"\u6700\u8FD1\u64AD\u653E",icon:IconHistory},{id:"user",label:"\u6211\u7684\u97F3\u4E50",icon:IconUser},{id:"settings",label:"\u8BBE\u7F6E",icon:IconSetting}],TABS=[{id:"home",label:"\u9996\u9875",icon:IconHome},{id:"list",label:"\u6B4C\u5355",icon:IconList},{id:"albums",label:"\u65B0\u789F\u4E0A\u67B6",icon:IconAlbum},{id:"toplist",label:"\u6392\u884C\u699C",icon:IconToplist}],THEME_KEY="dsh-music.theme",MENU_KEY="dsh-music.menuExpanded";function readTheme(){try{return localStorage.getItem(THEME_KEY)==="light"?"light":"dark"}catch{return"dark"}}function MusicApp(){let[stack,setStack]=(0,import_react7.useState)([{name:"home",params:void 0}]),[theme,setThemeState]=(0,import_react7.useState)(readTheme),[menuExpanded,setMenuExpandedState]=(0,import_react7.useState)(()=>{try{return localStorage.getItem(MENU_KEY)==="1"}catch{return!1}}),[keyword,setKeyword]=(0,import_react7.useState)(""),[suggest,setSuggest]=(0,import_react7.useState)(null),[queueOpen,setQueueOpen]=(0,import_react7.useState)(!1),[fullOpen,setFullOpen]=(0,import_react7.useState)(!1),[toasts,setToasts]=(0,import_react7.useState)([]),contentRef=(0,import_react7.useRef)(null),suggestTimer=(0,import_react7.useRef)(null),{account}=useAccount(),actions=usePlayerActions(),page=stack[stack.length-1],setTheme=(0,import_react7.useCallback)(next=>{setThemeState(next);try{localStorage.setItem(THEME_KEY,next)}catch{}},[]),setMenuExpanded=(0,import_react7.useCallback)(next=>{setMenuExpandedState(next);try{localStorage.setItem(MENU_KEY,next?"1":"0")}catch{}},[]),nav=(0,import_react7.useCallback)((name,params)=>{setStack(prev=>{let cur=prev[prev.length-1];return cur.name===name&&JSON.stringify(cur.params??null)===JSON.stringify(params??null)?prev:["home","search","list","albums","toplist","user","settings"].includes(name)&&prev.length>1?[{name,params}]:[...prev,{name,params}]}),setSuggest(null)},[]),back=(0,import_react7.useCallback)(()=>{setStack(prev=>prev.length>1?prev.slice(0,-1):prev)},[]),toast=(0,import_react7.useCallback)((msg,type="",action=null)=>{let id=Math.random().toString(36).slice(2);setToasts(prev=>[...prev.slice(-2),{id,msg,type,action}]),setTimeout(()=>setToasts(prev=>prev.filter(t=>t.id!==id)),action?7e3:2800)},[]);(0,import_react7.useEffect)(()=>{contentRef.current&&(contentRef.current.scrollTop=0)},[page.name,page.params]),(0,import_react7.useEffect)(()=>{let onKey=e=>{let tag=e.target?.tagName;if(!(tag==="INPUT"||tag==="TEXTAREA"||e.target?.isContentEditable)&&!e.target?.closest?.('[role="slider"]')){if(e.code==="Space"){if(e.target?.closest?.("button"))return;e.preventDefault(),actions.togglePlay();return}if(e.key==="Escape"){setQueueOpen(!1),setFullOpen(!1),setSuggest(null);return}(e.key==="ArrowRight"||e.key==="ArrowLeft")&&(e.preventDefault(),actions.seek(Math.max(0,actions.getAudio().currentTime+(e.key==="ArrowRight"?5:-5)))),(e.key==="ArrowUp"||e.key==="ArrowDown")&&(e.preventDefault(),actions.setVolume(actions.getAudio().volume+(e.key==="ArrowUp"?.05:-.05)))}};return window.addEventListener("keydown",onKey),()=>window.removeEventListener("keydown",onKey)},[actions]);let onKeyword=value=>{if(setKeyword(value),clearTimeout(suggestTimer.current),!value.trim()){setSuggest(null);return}suggestTimer.current=setTimeout(()=>{api.searchSuggest(value.trim()).then(d=>setSuggest(d.items?.length?d.items:null)).catch(()=>setSuggest(null))},260)},doSearch=kw=>{let k=String(kw??keyword).trim();k&&(setKeyword(k),setSuggest(null),nav("search",{keyword:k}))},activeMenu=page.name==="musiclist"?page.params?.kind==="toplist"?"toplist":page.params?.kind==="history"?"history":page.params?.kind==="favorite"?"user":"list":page.name,isDetail=["musiclist","album","artist"].includes(page.name),title=page.name==="musiclist"?page.params?.name??"\u6B4C\u5355":page.name==="album"?page.params?.name??"\u4E13\u8F91":page.name==="artist"?page.params?.name??"\u6B4C\u624B":"",navValue={page,nav,back,canBack:stack.length>1,openFull:()=>setFullOpen(!0),openQueue:()=>setQueueOpen(!0),toast,theme,setTheme,menuExpanded,setMenuExpanded};return(0,import_jsx_runtime5.jsx)(NavContext.Provider,{value:navValue,children:(0,import_jsx_runtime5.jsxs)("div",{className:"dsh-music","data-theme":theme,children:[(0,import_jsx_runtime5.jsx)("style",{children:theme_default}),(0,import_jsx_runtime5.jsxs)("div",{className:"app-body",children:[(0,import_jsx_runtime5.jsxs)("div",{className:`app-menu${menuExpanded?" expanded":""}`,children:[(0,import_jsx_runtime5.jsx)("div",{className:"logo",onClick:()=>setMenuExpanded(!menuExpanded),title:"DSH Music",children:(0,import_jsx_runtime5.jsx)(IconMusic,{})}),(0,import_jsx_runtime5.jsx)("div",{className:"menu-list",children:MENU.map(({id,label,icon:Icon})=>(0,import_jsx_runtime5.jsxs)("button",{className:`menu-item${activeMenu===id?" on":""}`,onClick:()=>{id==="history"?nav("musiclist",{kind:"history",name:"\u6700\u8FD1\u64AD\u653E"}):nav(id)},children:[(0,import_jsx_runtime5.jsx)(Icon,{}),(0,import_jsx_runtime5.jsx)("span",{className:"menu-label",children:label}),(0,import_jsx_runtime5.jsx)("span",{className:"menu-tip",children:label})]},id))})]}),(0,import_jsx_runtime5.jsxs)("div",{className:"app-main",children:[(0,import_jsx_runtime5.jsxs)("div",{className:"search-bar",children:[isDetail?(0,import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment,{children:[(0,import_jsx_runtime5.jsx)("button",{className:"back-btn",onClick:back,title:"\u8FD4\u56DE",children:(0,import_jsx_runtime5.jsx)(IconArrowLeft,{})}),(0,import_jsx_runtime5.jsx)("span",{className:"nav-title",children:title})]}):(0,import_jsx_runtime5.jsx)("div",{className:"tabs",children:TABS.map(({id,label,icon:Icon})=>(0,import_jsx_runtime5.jsxs)("button",{className:`tab${activeMenu===id?" on":""}`,onClick:()=>nav(id),children:[(0,import_jsx_runtime5.jsx)(Icon,{}),(0,import_jsx_runtime5.jsx)("span",{children:label})]},id))}),(0,import_jsx_runtime5.jsxs)("div",{className:"search-wrap",children:[(0,import_jsx_runtime5.jsxs)("div",{className:"search-box",children:[(0,import_jsx_runtime5.jsx)(IconSearch,{}),(0,import_jsx_runtime5.jsx)("input",{placeholder:"\u641C\u7D22\u97F3\u4E50",value:keyword,onChange:e=>onKeyword(e.target.value),onBlur:()=>setTimeout(()=>setSuggest(null),160),onKeyDown:e=>{e.key==="Enter"&&doSearch(),e.key==="Escape"&&setSuggest(null)}})]}),suggest?(0,import_jsx_runtime5.jsx)("div",{className:"suggest",style:{zIndex:70},children:suggest.map(s=>(0,import_jsx_runtime5.jsxs)("div",{className:"suggest-row",onMouseDown:e=>{e.preventDefault(),doSearch(s)},children:[(0,import_jsx_runtime5.jsx)(IconSearch,{}),s]},s))}):null]}),(0,import_jsx_runtime5.jsx)("button",{className:"user-btn",onClick:()=>nav(account?.loggedIn?"user":"settings"),title:account?.loggedIn?account.nickname:"\u767B\u5F55\u7F51\u6613\u4E91\u8D26\u53F7",children:account?.loggedIn&&account.avatar?(0,import_jsx_runtime5.jsx)("img",{className:"avatar sm",src:account.avatar,alt:""}):(0,import_jsx_runtime5.jsx)("span",{className:"login-link",children:"\u767B\u5F55"})})]}),(0,import_jsx_runtime5.jsxs)("div",{className:"main-content",ref:contentRef,children:[page.name==="home"?(0,import_jsx_runtime5.jsx)(HomePage,{}):null,page.name==="search"?(0,import_jsx_runtime5.jsx)(SearchPage,{initialKeyword:page.params?.keyword},page.params?.keyword??"search"):null,page.name==="list"?(0,import_jsx_runtime5.jsx)(PlaylistListPage,{}):null,page.name==="toplist"?(0,import_jsx_runtime5.jsx)(ToplistPage,{}):null,page.name==="albums"?(0,import_jsx_runtime5.jsx)(AlbumListPage,{}):null,page.name==="musiclist"?(0,import_jsx_runtime5.jsx)(MusicListPage,{params:page.params??{}}):null,page.name==="album"?(0,import_jsx_runtime5.jsx)(AlbumDetailPage,{params:page.params??{}}):null,page.name==="artist"?(0,import_jsx_runtime5.jsx)(ArtistDetailPage,{params:page.params??{}}):null,page.name==="user"?(0,import_jsx_runtime5.jsx)(UserPage,{}):null,page.name==="settings"?(0,import_jsx_runtime5.jsx)(SettingsPage,{theme,setTheme,menuExpanded,setMenuExpanded}):null]})]})]}),(0,import_jsx_runtime5.jsx)(PlayBar,{}),(0,import_jsx_runtime5.jsx)(PlayingListDrawer,{open:queueOpen,onClose:()=>setQueueOpen(!1)}),(0,import_jsx_runtime5.jsx)(MusicFull,{open:fullOpen,onClose:()=>setFullOpen(!1)}),(0,import_jsx_runtime5.jsx)("div",{className:"toast-wrap",children:toasts.map(t=>(0,import_jsx_runtime5.jsxs)("div",{className:`toast ${t.type}`,children:[t.type==="ok"?(0,import_jsx_runtime5.jsx)(IconCheck,{}):t.type==="err"?(0,import_jsx_runtime5.jsx)(IconClose,{}):(0,import_jsx_runtime5.jsx)(IconPlay,{}),(0,import_jsx_runtime5.jsx)("span",{className:"toast-msg",children:t.msg}),t.action?(0,import_jsx_runtime5.jsx)("button",{className:"toast-action",onClick:()=>{t.action.onClick?.(),setToasts(prev=>prev.filter(x=>x.id!==t.id))},children:t.action.label}):null]},t.id))})]})})}var import_react8=__toESM(require("react"),1),PANEL_ID="music",__dsh_music_face={inject:["slots"],apply(ctx){installGlobalErrorOverlay(),ctx.slots.inject("main",()=>ctx.slots.register({name:"main",key:PANEL_ID},MusicPage)),ctx.slots.inject("sidebar.panellist",()=>ctx.slots.register({name:"sidebar.panellist",id:PANEL_ID,order:7,label:()=>"\u97F3\u4E50"},MusicRailIcon))}};function MusicPage(){return(0,import_jsx_runtime6.jsx)(ErrorBoundary,{children:(0,import_jsx_runtime6.jsx)(PlayerProvider,{children:(0,import_jsx_runtime6.jsx)(MusicApp,{})})})}var ErrorBoundary=class extends import_react8.default.Component{constructor(props){super(props),this.state={error:null}}static getDerivedStateFromError(error){return{error}}render(){return this.state.error?(0,import_jsx_runtime6.jsxs)("div",{style:{padding:24,color:"#ff7a7a",fontSize:13,whiteSpace:"pre-wrap",fontFamily:"monospace"},children:[(0,import_jsx_runtime6.jsx)("div",{style:{fontWeight:700,marginBottom:8},children:"DSH Music \u6E32\u67D3\u51FA\u9519(\u8BF7\u622A\u56FE\u53CD\u9988):"}),String(this.state.error?.stack||this.state.error)]}):this.props.children}};function installGlobalErrorOverlay(){if(window.__dshMusicErrorOverlayInstalled)return;window.__dshMusicErrorOverlayInstalled=!0;let show=(label,message)=>{let box=document.getElementById("dsh-music-error-overlay");box||(box=document.createElement("div"),box.id="dsh-music-error-overlay",box.setAttribute("style","position:fixed;inset:auto 0 0 0;z-index:999999;max-height:45vh;overflow:auto;background:rgba(40,0,0,.94);color:#ffb4b4;font:12px/1.5 monospace;padding:12px 16px;white-space:pre-wrap;"),document.body&&document.body.appendChild(box)),box.textContent+=`[${label}] ${message}

`};window.addEventListener("error",e=>{let t=e.target;t&&t!==window&&t.tagName&&/^(AUDIO|IMG|SOURCE|VIDEO|LINK)$/.test(t.tagName)||show("error",e.message||e.error&&(e.error.stack||e.error.message)||String(e.error??"\u672A\u77E5\u9519\u8BEF"))},!0),window.addEventListener("unhandledrejection",e=>show("promise",String(e.reason&&(e.reason.stack||e.reason.message)||e.reason)))}function MusicRailIcon(){return(0,import_jsx_runtime6.jsx)("svg",{viewBox:"0 0 24 24",width:20,height:20,"aria-hidden":"true",children:(0,import_jsx_runtime6.jsx)("path",{fill:"currentColor",d:"M12 3v10.6a4 4 0 1 0 2 3.4V7h4V3h-6z"})})}

  return __dsh_music_face;
  },
});
