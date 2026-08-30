# 前端 UI 重构设计文档（with_brainstoming_refactor）

- 日期：2026-08-30
- 基线：master HEAD `c7d9fa1`（干净分支，不携带工作区修改）
- 流程：brainstorming（设计）→ redesign-existing-projects（审计驱动实现）
- 授权：用户已明确批准——设计决策全部采用推荐设计（推荐方案 B）

## 1. 背景与目标

「云平台数据通信」是 OneNET 物联网监控 App（uni-app Vue3，H5 / Android WebView / 微信小程序三端，4 个 tab：数据展示 / 阈值设置 / 历史数据 / 后台配置）。HEAD 上已有一轮「主题系统 v2」：4 套完整主题（teal / night / amber / steel），每套约 100 个 CSS 变量，通过 `data-theme` / `data-theme-layout` 属性下发。

目标：**不动功能、不动信息架构、不动主题架构**，把视觉与交互质量提升到仪表级水准；同时修复影响观感的数据流缺陷。master 上的在途 WIP 不受影响，本分支独立演进。

## 2. 现状审计（redesign-existing-projects 框架）

**Typography**
- 字栈仅有 `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`，无中文字体声明链，安卓 WebView 中文回退不可控
- 字重粗糙：大量 800/850/900，缺少 500/600 的中间层级
- 数值全部使用比例数字（无 tabular-nums），时间/计数/读数列对不齐——对仪表类 App 是硬伤
- 字号刻度随意（19/21/23/25/27/29/31/40/45rpx），无体系

**Color**
- 告警红硬编码 `#e04040`，与 `--theme-danger` 脱节
- threshold 状态行硬编码 `rgba(13, 201, 176, …)`（旧版 teal 残留，4 套主题下全部偏色）
- HistoryChart 文字硬编码 `#708092`；pages.json tabBar 仍是旧主色 `#0f6b67`

**Icon**
- tab 与菜单用 PNG 位图，颜色固定，无法跟随 4 套主题 accent
- settings 菜单误用 tab 图标（dashboard-active.png）充当语义图标

**States**
- dashboard 无加载骨架，首屏一直显示 `--`
- 刷新按钮无 loading 态；开关无开/合状态文本
- 图表空态是英文 "No data to render"（中文 App）
- EmptyState 无图标、层级弱

**Chart**
- 折线生硬（无平滑）、无面积填充、轴标签弱、无时间参照

**数据流（影响观感的缺陷）**
- mock 模式（默认开启）下 `dataStore.refresh()` 提前返回，`latestValues` 永不回填 → 默认打开仪表盘全是 `--`，调试值也无法生效

## 3. 方案对比

| 方案 | 内容 | 结论 |
| --- | --- | --- |
| A 保守微调 | 仅修硬编码颜色与 bug 级问题 | 提升有限，弃 |
| **B 仪表级精修（推荐，已批准）** | 保留信息架构与主题架构；建立字阶 / tabular-nums / 动效 token；引入内联 SVG 图标系统与骨架屏；补齐加载/空/告警状态；逐页精修 | ✅ 采用 |
| C 信息架构重排 | bento/不对称重排 | 风险高、与 WIP 合并冲突最大化，弃 |

## 4. 设计决策清单（推荐方案 B 全量采纳）

**D1 字体系统（App.vue 全局）**
- 字栈补齐中文链：`-apple-system, "PingFang SC", "HarmonyOS Sans SC", "MiSans", "Noto Sans SC", "Microsoft YaHei", sans-serif`
- 字重收敛：500 次强调 / 600 强调 / 700 标题；去除 850/900
- 新增 `.num` 工具类：`font-variant-numeric: tabular-nums`，所有数值、时间、计数应用；identifier 用 `ui-monospace` 小字号 tertiary 色
- 字阶（rpx）：display 44 / title 36 / section 30 / body 26 / secondary 24 / caption 22 / micro 20 / 数据值 48

**D2 图标系统（新增 `components/AppIcon.vue`）**
- 内联 SVG（Phosphor Icons 路径子集，MIT，33 个），`currentColor` 自动随主题；MP-WEIXIN 无内联 SVG，降级 base64 image
- AppTabBar：PNG → 矢量（gauge / sliders-horizontal / chart-line-up / gear-six），active 为 accent 药丸底 + accent 图标
- settings 菜单语义化：cloud-arrow-up / sliders-horizontal / star / palette / terminal-window / download-simple / upload-simple / arrow-counter-clockwise
- 按钮与徽标配图标（刷新 arrows-clockwise、采样 pulse、清空 trash-simple 等）

**D3 状态补齐**
- 新增 `components/Skeleton.vue`（指标卡形骨架 + shimmer，`prefers-reduced-motion` 降级为静态色块）
- dashboard 首次同步前（`lastSyncedAt === 0`）显示骨架；刷新按钮 loading 时禁用 + 图标旋转
- 开关行增加「已开启 / 已关闭」状态文本
- EmptyState 升级：accent 圆底图标 + title + desc（默认 tray）
- 图表空态与图例文案中文化

**D4 Dashboard 精修**
- hero：eyebrow 加字距、meta 行（productId · deviceName 分隔）、在线状态点呼吸动画、启用主题 `hero-overlay` 变量
- quick 卡：图标 + label + tabular 数值
- metric 卡：value/unit 分离（48 tabular + 22 unit）、进度条 0.4s 宽度过渡、告警态统一走 `--theme-danger` token、告警徽标配 warning 图标、入场 stagger（总时长 ≤ 240ms，reduced-motion 关闭）

**D5 History + 图表**
- HistoryChart：折线二次贝塞尔平滑；首序列下方低透明渐变面积填充；max/min 轴标签；底部首末采样时间；空态中文
- 采样列表：卡片堆叠改紧凑行（时间 tabular 左、数值右对齐），分隔线替代多卡片
- 采样/清空按钮：图标 + 自适应宽度（去定宽与 line-height hack）

**D6 Threshold**
- 状态行颜色 token 化：sending/success 用 accent-light/accent-dark，error 用 danger-bg/danger
- value-badge 数值 tabular、单位弱化；slider 颜色由 JS 传主题实际色值（uni slider 不支持 CSS var）
- 头部 summary chip 配图标

**D7 Settings**
- 菜单卡：语义图标 + accent 染色方块底；恢复出厂用 danger 色
- summary 面板、密码弹窗、表单 label/输入 focus 态、category 分段 tab、quick-chip 精修
- **保留测试锚点**：import textarea（`class="textarea import-textarea"` + `maxlength="-1"`）、`:disabled="emailSending"`、`class="send-loader"`、`class="export-send-progress"`、`@keyframes sendPulse`

**D8 数据流修复（`stores/dataStore.js`，唯一逻辑改动）**
- mock 模式 `refresh()`：调用 `fetchProperties`（本地生成模拟值，支持调试值覆盖）回填 `latestValues`；新增 `mockPinned`：用户手动下发过的点位不被模拟值回灌
- 效果：默认模式下仪表盘 / 阈值 / 历史自动采样均有真实数据流，骨架屏 → 数据过渡可演示

**D9 杂项对齐**
- pages.json：tabBar / globalStyle 颜色对齐默认 amber 主题
- uni.scss：遗留 SCSS 变量对齐 amber 主题值（当前无引用，纯一致性）
- custom-tab-bar（MP）：文本/选中色对齐 amber
- HistoryChart 默认 props 颜色改为主题中性回退值

## 5. 明确不做的事

- 不新增依赖、不引入图表库 / webfont 文件；不迁移 canvas 2d
- 不改路由与信息架构；不改 4 主题变量架构（仅个别 token 微调）
- 不改业务逻辑（轮询 / 下发 / 导入导出 / 管理员验证），D8 除外
- 不打包 APK（遵循 AGENTS.md）

## 6. 新组件接口

- `AppIcon`：`props { name: string（33 个键名之一）, size?: number（rpx，默认 36）, color?: string（仅 MP 需要） }`
- `Skeleton`：无 props，指标卡形态，用于 dashboard 网格
- `EmptyState`：`props { title, desc, icon? }`（icon 默认 tray）

## 7. 验证计划

1. `node` 跑 3 个 `.mjs` 测试文件（11 用例）全过
2. `npm run build:h5` 构建成功
3. dev:h5（127.0.0.1:5173），浏览器 390×844 截图：dashboard / history / threshold / settings（默认 amber）+ dashboard（teal）
4. judge 视觉验收；交互冒烟：主题切换、模拟开关下发、阈值滑条、弹窗开合
5. 全部通过后在分支提交

## 8. 风险与对策

- MP-WEIXIN 不支持内联 SVG → AppIcon 自带 base64 降级
- uni slider 不接受 CSS var → D6 用 JS 取主题色值
- 测试锚点破坏 → settings 改完立即跑测试
