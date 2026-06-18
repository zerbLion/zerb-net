# AGENTS.md

## Codex 工作规则

本文件写给 Codex/AI agent。每次开始任务前，必须先阅读：

- `README.md`
- `docs/TODO.md`
- `docs/DONE.md`

## 基本原则

- 不要做无关重构。
- 不要随意删除 WordPress 静态导出目录、旧路由记录和媒体资源。
- 不要随意删除已有页面、样式、图片、视频或其他资源。
- 删除资源前，必须确认没有 HTML/CSS/JS 引用。
- 批量移动或改写媒体路径后，必须同时检查本地文件存在和浏览器实际加载状态。
- 媒体 URL 中不应出现 `/media/projects `、`/media/common `、`/media/blog ` 这类用空格代替斜杠的路径。
- 修改前先理解现有结构，尤其是 `media/`、`assets/`、`redirects.json` 和旧 WordPress URL 的关系。
- 修改视觉动效前，必须先确认原效果来自当前页面、备份目录或线上页面中的哪一种状态；不要凭空新增未被要求的交互。
- 首页头部导航的滚动动效应保持导航栏可见、可点击。当前期望是切换 `headroom--top` / `headroom--not-top` 触发背景和间距变化，不要改成下滑折叠或隐藏导航栏。
- 不确定的信息写“待确认”，不要编造。
- 每轮任务结束前，必须更新 `docs/TODO.md`。
- 如果本轮涉及网站、页面、代码、资源、部署、结构变化，需要同步更新 `docs/DONE.md`。
- 更新项目文档时，按 `README.md` → `AGENTS.md` → `docs/TODO.md` → `docs/DONE.md` 的顺序处理，先写当前状态和规则，再写待办，最后记录已完成事实。
- 修改业务代码前先说明计划。
- 复杂修改不要直接大改，先说明拆分步骤和风险。
- 除非用户明确要求，不要修改原始备份目录 `D:\net\net`。
- 当前工作副本和部署副本是 `D:\net\net-website`。

## 文档规则

当前只使用以下 md 文件：

- `README.md`
- `AGENTS.md`
- `docs/TODO.md`
- `docs/DONE.md`

不要使用或重新创建：

- `WEB_STATE.md`
- `WEB_LOG.md`
- `WEB_TODO.md`
- `WEB_DONE.md`
- `TASK_STATE.md`
- `CHANGELOG.md`
- `MIGRATION_NOTES.md`
- `media/README.md`

职责划分：

- `README.md`：给人看的项目说明、运行方式、部署方式、WordPress 静态导出说明。
- `AGENTS.md`：Codex 工作规则。
- `docs/TODO.md`：当前目标、正在处理、未完成事项、已知问题、下一步、注意事项。
- `docs/DONE.md`：已经完成的重要网站、页面、代码、资源、部署、结构变化。

更新顺序建议：

1. 先更新 `README.md` 中面向人的项目现状。
2. 再更新 `AGENTS.md` 中面向 Codex 的操作规则。
3. 然后更新 `docs/TODO.md` 中仍待处理的下一步。
4. 最后更新 `docs/DONE.md` 中本轮已经完成的事实。

## 本地预览规则

本项目可以不依赖 WordPress 直接在本地运行。

常用命令：

```powershell
cd D:\net\net-website
node tools/local-server.mjs
```

访问地址：

```text
http://localhost:4173/
```

也可以使用：

```text
http://127.0.0.1:4173/
```

如果 `node` 不可用，先使用 `load_workspace_dependencies` 查找 Codex 内置 Node runtime。当前会话中曾使用：

```powershell
C:\Users\chenchen4.zhao\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools/local-server.mjs
```

检查本地服务是否运行：

```powershell
Get-NetTCPConnection -LocalPort 4173 -ErrorAction SilentlyContinue
```

## Codex 内置浏览器规则

需要预览页面时，优先使用 Codex in-app Browser 打开：

```text
http://127.0.0.1:4173/
```

修改 HTML/CSS/JS 后，刷新 Codex in-app Browser。做视觉检查时，尽量确认关键页面坏图数量为 `0`。

头部导航或滚动动效改动后的推荐检查：

- 顶部状态：`#masthead` 应包含 `headroom--top`，导航栏在顶部可见。
- 滚动状态：`#masthead` 应包含 `headroom--not-top`，导航栏仍在顶部可见且可点击。
- 不应出现 `transform: translateY(-100%)` 或 `headroom--unpinned` 导致导航栏收起不可点的行为，除非用户明确要求这种交互。

媒体路径改动后的推荐检查：

```powershell
rg -n --hidden --glob '!node_modules' --glob '!.git' --glob '!reports/**' '/media/projects |/media/common |/media/blog ' D:\net\net-website
```

并在浏览器中检查首页或关键页面的图片加载状态，确认 broken image 数量为 `0`。视频改动时，至少抽查一个项目视频 URL 返回 `200` 和 `video/mp4`。

## Astro 重建版工作规则（2026-06 起，必读）

当前线上站点已经是 Astro 重建版，不再是根目录的 WordPress 静态导出。下面这些是本轮反复踩坑后总结的硬规则，改 `app/` 前必读，避免重复犯错。

### 架构速览
- Astro 项目在 `app/`，部署到 Vercel，**Vercel Root Directory = `app`**；`main` 分支是生产部署分支（dev 改完合并到 main）。
- 视频托管在 Cloudflare R2（公共域名 `https://pub-...r2.dev`，引用见 `media-manifest.json`），不进 Git。
- 图片是真实文件，提交在 `app/public/media/images/`（约 12MB）；`app/public/media/videos` 被忽略。
- 字体**自托管**在 `app/public/fonts/`（`montserrat-latin.woff2` 显示字体、`mulish-latin.woff2` 正文字体），`@font-face` + `font-display:block` + `<link rel=preload>`。**不要用 Google Fonts**（国内慢/被墙、首屏字体跳变）。
- AI 问答：`app/src/pages/api/chat.ts`（多 provider 流式，Gemini/OpenAI/Anthropic），key 在 Vercel 环境变量（`GEMINI_API_KEY` 等）；本机受 GFW 影响连不上 Gemini，需 VPN 或线上测。
- 动效系统：`app/src/scripts/motion.ts`（Lenis 平滑滚动 + GSAP + 自定义光标 + Hero 进场 + 小球磁吸）。

### View Transitions 大坑（本轮最多 bug 的来源）
Layout 用了 `<ClientRouter>`（Astro View Transitions），Header / AskAI / 光标用 `transition:persist`。**组件 `<script>` 只在首次加载执行一次，不随导航重跑。** 因此：
- **绝不要在模块顶层用 `getElementById` 捕获 DOM 引用后长期复用**——导航后这些引用会失效，导致"点了没反应"（Ask AI 打不开就是这个原因）。
- **正确做法**：交互发生时**重新查询 DOM**（封装 `const $x = () => document.getElementById(...)`），或用 **document 级事件委托**（`document.addEventListener('click', e => e.target.closest(...))`）。
- **每次导航重置临时 UI 状态**：在 `astro:page-load` 里复位光标 hover 态、关闭移动菜单、解锁 `body.overflow`（否则光标卡成大白球、菜单卡死、页面锁滚动）。
- 动效生命周期处理器要 try/catch 包裹，throw 不能冒泡进 View Transition，否则路由会卡住、点击不跳转。

### 预览环境的真实局限（别被它骗）
本会话的 Claude Preview 预览器：**视口宽约等于 0、CSS 过渡与 rAF/GSAP 时间线会停滞、截图基本超时**。所以：
- **看不到任何动画/视觉效果**，截图不可靠。验证只能靠 DOM/eval：`getComputedStyle`、类名检查、`fetch` 状态码、坏图计数。
- 不要凭预览声称"视觉没问题"。视觉好坏交给用户判断，明确说"预览看不到，需你实测"。

### 发布与"假 bug"
- push 后 Vercel 要 1-2 分钟才生效。用户立刻测会看到**旧版本**，误报"还有 bug"。每次发完都要提示：**等部署完 + `Ctrl+Shift+R` 硬刷新**再测。本会话多个"bug"其实是旧部署。
- 改完**先自测所有交互**再发：移动菜单开/关（toggle/Esc/背景/导航后）、Ask AI 导航后能否打开、导航点击是否跳转、works 筛选、光标各状态、全站页面 200 + 坏图 0，桌面端 + 移动端都要过。不要发完让用户当测试。

### 国内访问
- `*.vercel.app` 国内常被限速/墙；自定义域名能绕过（frad.me 即如此）。建议把 `zerb.net` 绑到 Vercel 项目。媒体走 Cloudflare、AI 在服务端调 Gemini，都不受影响。

### 自定义光标
- lerp 跟随过松会导致**可见球滞后于真实指针 → 误点**；保持紧跟（0.35）并给可点元素**加大热区**（导航链接 `px-3 py-3`）。
- hover 态白球别太大（盖住按钮内容），约 50px；球内始终有标签文字（View/Open/Go/Home/Mail）。

## Git 规则

如果 Git 可用，任务开始或结束时按需检查：

```powershell
git status --short --branch
git diff --stat
git log --oneline -5
```

当前环境中 `git` 是否可用为“待确认”。如果不可用，不要声称已经检查过 Git status/diff/log。
