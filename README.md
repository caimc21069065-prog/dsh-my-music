# dsh-plugin-music

**DSH Music** — 内嵌 DeepSeek Harness 的独立音乐播放器插件。UI 复刻自 [AlgerMusicPlayer](https://github.com/algerkong/AlgerMusicPlayer)(MIT),去除原品牌,作为干净的 DSH 原生插件运行;**不依赖本机安装任何播放器**。

- 宿主侧(Node/cordis):网易云音乐数据层(`netease-cloud-music-api-alger`)+ 本地 webserver 路由(数据 API + 音频流代理)
- 客户端(React,DSH 主区域整页):发现 / 歌单 / 排行榜 / 搜索 / 沉浸式歌词 / 播放队列 / 设置,底部常驻播放条;支持点按与拖动进度跳转、曲目下载到本机
- 附加:聊天内可直接调用的 4 个工具(`music_search` / `music_song_url` / `music_lyric` / `music_playlist_tracks`)

## 安装

### 手动(推荐,当前未发布 npm)

编辑 `~/.dsh/profiles/desktop/package.json`:

```json
"dependencies": {
  "dsh-plugin-music": "file:C:/path/to/dsh-music"
},
"dsh": {
  "profile": {
    "bundles": ["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app", "dsh-plugin-music"]
  }
}
```

然后在该目录 `pnpm install`,重启 DSH;左侧图标栏会出现「音乐」。

### 发布后

```bash
dsh plugin --profile desktop add dsh-plugin-music
```

或通过 dshmarket 插件市场安装(收录后)。

## 配置(`~/.dsh/profiles/desktop/cordis.patch.yml`)

```yaml
- id: music
  config:
    cookie: 'MUSIC_U=xxxxxxxx'   # 可选兜底;界面扫码登录/退出后不再起作用
    requestTimeoutMs: 15000
    defaultLevel: standard       # 音频代理默认音质
    downloadDir: 'C:/Users/you/Music/DSH'  # 客户端下载目录,必须是绝对路径(不展开 ~);留空用 ~/Music/DSH
```

## 下载

播放条右侧、歌曲行悬停区、以及「正在播放」页都有下载按钮,走宿主 `/music/api/download`:按当前音质解析直链后由 Node 落盘,先写 `.part` 再改名,文件名里的 `/ \ * ? " < > |` 与 `..` 一律清洗,写入不会逃出 `downloadDir`。未登录时 VIP 曲目只能拿到试听片段,文件名会带 `(试听)` 后缀。

## 登录

音乐页 → 设置 → 账号 → **扫码登录**,用网易云音乐 App 扫一扫即可(等待扫码 → 已扫码待确认 → 登录成功自动刷新账号)。二维码由本插件按网易云授权链接实时绘制,授权成功后 `MUSIC_U` 等 Cookie 落盘在 `~/.dsh/music-cookie.json`,无需重启即对全部接口与音频代理生效。

- 未登录只能播标准音质/试听,VIP 歌曲需要登录后才有完整链接。
- 界面上的登录/退出**优先于**配置里的 `cookie`(退出后配置的 Cookie 也不会复活);想改回用配置 Cookie,删除该登录态文件即可。
- 不想扫码也可以在 DSH → 设置 → 插件 → dsh-plugin-music 的配置表单里直接填 `cookie`。

## 开发

```bash
npm install
npm run build   # esbuild 打包 src/client.jsx → lib/client.js(ModuleLoader 工厂格式,CSS 内联)
npm test        # 冒烟:工具 + /music/api/* + /music/stream 音频代理(真实网络)
```

构建产物 `lib/client.js` 是单文件客户端模块(react/react-dom 为 external,由 DSH 浏览器模块表提供);修改 UI 后需重新 `npm run build` 并重启 DSH(或开启 profile 的 patchReload)。

两条已被冒烟测试守住的约束:

- `src/ui` 里只能用静态 `import` 引入本地模块。构建参数 `minifyIdentifiers: false` 下,esbuild 会把动态引入的解构变量编译成未改名的自由引用,运行期 `ReferenceError` 又被 `.catch` 吞掉,现象是"歌词永远空白"。
- 歌词取经典 `lyric` 接口(带 `_nmclfl`)而不是 `lyric_new`:后者把头部若干行返回成 JSON 富文本,纯音乐/逐字歌词缺失时反而整段丢行。

## 架构

```
DSH 桌面端
├─ 宿主插件 lib/index.js
│   ├─ /music/api/*      数据接口(搜索/歌词/歌单/榜单/每日推荐/账号/扫码登录/下载)
│   ├─ /music/stream/:id 音频流代理(Range 透传,<audio> 直接指向此处)
│   └─ 4 个 agent 工具
└─ 客户端 lib/client.js(React,slots: main + sidebar.panellist)
    └─ UI 与宿主同源通信(无需 CORS),音频走本地代理解决混合内容
```

## 免责声明

UI 结构参考 AlgerMusicPlayer(MIT,感谢原作者 algerkong);数据依赖社区维护的第三方接口库,仅供个人学习研究。音乐内容版权归网易云及版权方所有,请遵守当地法律,勿用于商业用途。不包含任何音源解锁组件。

## License

MIT
