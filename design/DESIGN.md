# dsh-music 独立插件 · 原型设计说明

> 版本:v0.1 原型(待审批)
> 原型预览:启动 `python -m http.server 8391` 于本目录,打开 <http://127.0.0.1:8391/prototype.html>(左侧可切换 6 屏)
> 参考基准:AlgerMusicPlayer 5.1 UI 结构,重新设计为 DSH 内嵌页面形态

## 1. 定位

**独立的 DSH 音乐播放器插件**——不依赖本机是否安装 AlgerMusicPlayer。插件自带:

- 完整播放器 UI(内嵌 DSH 主区域,左侧 icon 栏新增「音乐」入口)
- 内置网易云数据层(复用 AlgerMusicPlayer 同款 npm 包 `netease-cloud-music-api-alger`,以库函数调用)
- 内置音频播放(HTML5 Audio,经宿主本地代理流式播放,解决混合内容限制)

## 2. 架构(已对照 DSH 0.2.0-rc.2 运行时源码验证)

```
DSH 桌面端
├── 宿主侧插件(Node, cordis)
│   ├── netease-cloud-music-api-alger(搜索/链接/歌词/歌单/榜单/每日推荐)
│   ├── WebServer 路由 /music/stream/:id —— 音频流代理(Range 支持)
│   └── WebServer 路由 /music/api/* —— 数据接口(搜索/歌词/歌单/榜单/账号/扫码登录/下载)
└── 客户端 UI 插件(React, ModuleLoader bundle)
    ├── sidebar.panellist 挂「音乐」图标
    ├── slots("main") 挂播放器整页
    ├── <audio> 播放 http://127.0.0.1:<port>/music/stream/...
    └── 队列/收藏/设置持久化(localStorage)
```

参照实证:`dsh-connect-workbuddy`(宿主+UI 双端第三方插件)、`dshmarket`(整页 UI 插件)、`dsh-client-ui-schedule`(slots/remote API)。

## 3. 六屏原型

| # | 屏幕 | 文件 | 要点 |
|---|------|------|------|
| ① | 发现(首页) | `prototype-1-home.png` | 每日推荐 banner、精选歌单卡、热门歌单网格(播放量角标)、悬浮播放按钮 |
| ② | 歌单详情 | `prototype-2-playlist.png` | 大封面 + 描述 + 播放全部/下载/收藏;曲目表(序号/标题/VIP标/歌手/专辑/时长),当前播放行绿色高亮 |
| ③ | 搜索 | `prototype-3-search.png` | 大搜索框(聚焦态)、综合/单曲/歌单/歌手/专辑 tabs、结果行内播放/收藏、相关歌单 |
| ④ | 正在播放 | `prototype-4-nowplaying.png` | 模糊渐变背景、大封面 + 黑胶、逐行歌词(当前行加粗高亮、上下渐隐) |
| ⑤ | 播放队列 | `prototype-5-queue.png` | 右下浮层面板(对照 AlgerMusicPlayer),当前行高亮、单曲播放/收藏、清空队列 |
| ⑥ | 设置 | `prototype-6-settings.png` | 账号(Cookie 登录态)、播放(默认音质/播放模式/桌面歌词)、外观(跟随 DSH 主题)、存储(缓存/下载目录)、免责声明 |

共用框架:左 icon 栏(DSH 外壳示意)、顶栏(品牌 + 页签 + 搜索 + 登录态)、底部播放条(封面/进度/控制/音量/循环/歌词/队列)。

## 4. 关键设计决策

1. **内嵌而非独立窗口**:作为 DSH 主区域的一页(与 Plugin Market 同机制),保持 DSH 交互一致;播放条常驻页面底部(切页不断歌)。
2. **深色优先**:默认深色主题(与用户当前 DSH 主题一致),支持跟随 DSH 主题切换。
3. **绿色主色** `#24d183`:延续网易云系播放器的认知习惯,在深色 UI 上对比度好。
4. **VIP 歌曲策略**:无 Cookie 时可播标准音质/试听;VIP 歌曲打标签,提示配置 Cookie,不做灰色解锁。
5. **登录以扫码为主、Cookie 兜底**:设置页走网易云扫码登录(宿主用 `qrcode` 库绘制授权链接二维码 —— 依赖库自带的 qrimg 已是「不支持二维码登录」占位图),登录态落盘 `~/.dsh/music-cookie.json`;配置里的 `cookie` 仅在用户从未在界面登录/退出过时生效,界面操作优先。
6. **MV/本地音乐暂不做**:首版聚焦 搜/播/词/单;MV 版权与本地扫描放入后续里程碑。
7. **下载由宿主落盘,客户端只报意图**:UI 传 `id + 曲名 + 歌手 + 音质`,宿主解析直链后写入 `downloadDir`(默认 `~/Music/DSH`),先写 `.part` 再改名;曲名/歌手里的 `/ \ * ? " < > |` 与 `..` 全部清洗,保证写不出目录之外。未登录时 VIP 曲目只会下到试听片段,文件名追加 `(试听)` 以免误当完整版收藏。**落盘位置必须可见**:下载完成的提示条带「打开目录」动作,设置 → 存储 展示完整路径与最近下载列表(`/api/download/info`),每条都能「定位」到文件(`/api/download/open` 调系统文件管理器,越界文件名一律退化成打开目录)。
8. **进度可跳转的判定跟着媒体元素走**:网易云匿名直链常只给 30/45s 试听,列表时长不可信;进度条以 `<audio>` 的 `duration`/`seekable` 为准,元数据未到时记下跳转意图等 `loadedmetadata` 补跳,拿不到上限则整条置灰(避免"点了没反应")。

## 5. 里程碑(批准后执行)

| 阶段 | 交付 |
|------|------|
| M0 骨架 | bundle 双端结构(host + client UI)、页面路由、播放条 + <audio> 代理链路打通(能搜能播) |
| M1 完整 UI | 六屏全部落地:发现/歌单详情/搜索/正在播放/队列/设置,队列与收藏持久化 |
| M2 打磨 | 下载(已落地:v0.2 宿主落盘 + 文件名清洗)、错误兜底(已落地:播放失败人话提示)、主题跟随、缓存、桌面歌词(实验) |
| M3 发布 | npm publish + awesome-dsh-plugin 收录 PR + README/截图 |

---

# v1.0 落地记录(对照 AlgerMusicPlayer 5.1 的 1:1 复刻)

原型阶段只规划了六屏;v1.0 按参考项目的真实信息架构补齐为 11 个页面 + 4 个浮层。

## 页面

| 页面 | 文件 | 对照参考 |
| --- | --- | --- |
| 发现 | `src/ui/pages.jsx` `HomePage` | `views/home` + `HomeHero` / `HomePlaylistSection` / `HomeArtists` / `HomeAlbumSection` / `HomeNewSongs` |
| 歌单广场 | `PlaylistListPage` | `views/list`(分类 + 无限滚动) |
| 排行榜 | `ToplistPage` | `views/toplist` |
| 新碟上架 | `AlbumListPage` | `views/album` |
| 歌单 / 榜单 / 收藏 / 历史 | `MusicListPage` | `views/music/MusicListPage` |
| 专辑详情 | `AlbumDetailPage` | 同上(`isAlbum` 分支) |
| 歌手详情 | `ArtistDetailPage` | `views/artist/detail` |
| 搜索 | `SearchPage` / `SearchResult` | `views/search` + `SearchBar` 联想 |
| 我的音乐 | `UserPage` | `views/user` |
| 设置 | `SettingsPage` | `views/set`(账号 / 播放 / 外观 / 关于) |

## 浮层与共享组件

| 组件 | 文件 | 对照参考 |
| --- | --- | --- |
| 播放条 | `components.jsx` `PlayBar` | `components/player/PlayBar.vue` |
| 播放列表抽屉 | `PlayingListDrawer` | `components/player/PlayingListDrawer.vue` |
| 沉浸式播放页 | `MusicFull` | `components/lyric/MusicFull.vue` |
| 歌曲右键菜单 | `SongContextMenu` | `songItemCom/SongItemDropdown.vue` |
| 标准歌曲行 / 迷你行 / 封面卡 | `SongRow` / `MiniSongRow` / `CoverCard` | `songItemCom/*` / `HomeListItem` |

## 与参考实现对齐的细节

- 左侧菜单 100px,点 logo 展开到 168px 显示文字;图标 25px、当前项主色高亮
- 顶栏胶囊页签(首页 / 歌单 / 新碟上架 / 排行榜)+ 右侧搜索框(聚焦加宽)、搜索联想、登录态头像
- 首页 Hero 3:2 布局,卡片高度 172px;未登录时右卡为 2×2 封面墙
- 封面卡悬停:图片放大、暗色遮罩、前三首曲目预览、白色圆形播放按钮、播放量/更新频率角标
- 详情页:模糊封面背景、218px 大封面、吸顶操作栏(播放全部 / 随机播放)
- 播放条:80px 高,顶边 4px 进度条(悬停加粗 + 时间提示)、56px 圆角封面(悬停展开箭头)、76×46 胶囊播放键、音量悬浮竖滑条
- 播放列表:360px 宽、右侧 15% 起始、70% 高,滑入动画
- 沉浸式页:封面模糊背景、左封面右歌词、当前行放大加粗、翻译开关、字号切换
- 深色 / 浅色双主题,深色为默认(与 DSH 当前主题一致)

## 截图

`design/shots/*.jpg` 由 `design/render-test/preview.html` 在 1440×900 下渲染并截图,场景与页面一一对应。
