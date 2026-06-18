# TODO.md

## 当前目标

- 保持 `D:\net\net-website` 作为当前可预览、可部署的静态网站工作副本。
- 保留作品集视觉效果。
- 继续减少 WordPress static export 带来的冗余，但不要误删媒体资源。
- 准备后续 GitHub push 和 Vercel deployment。
- 后续如继续改造，再决定是否进入 Vite/React、Astro 或其他前端重建方案。

## 正在处理

**Astro 重建版已上线。** 6 个 Phase 全部完成并部署到 Vercel：
- 线上地址：`https://net-website-mu.vercel.app`（Vercel Root Directory = `app`，生产分支 `main`，dev 改完合并到 main）。
- 改 `app/` 前**必读 `AGENTS.md`「Astro 重建版工作规则」**（架构 + View Transitions/遮罩/Lenis/光标/预览环境等踩坑总结）。
- 视频已上传 Cloudflare R2（`zerbnet-media`，公共域名 r2.dev）；图片在 `app/public/media/images`；字体自托管（Montserrat 标题 + Mulish 正文）；AI 问答 `/api/chat` 多 provider（Gemini key 在 Vercel 环境变量）。
- 站内中文已全部翻成英文（项目正文/博客/标题）。
- 首页 = Hero 三段进场（蒙版/模糊/打字）+ 三板块 featured-first 网格 + 「AI Ask」内联引导块（复用侧边栏）。

老的根目录静态站（`index.html`、`project/`、`works/` 等）仍保留未删，但线上已是 `app/` 的 Astro 版。

### 当前待办 / 待用户决定
- **国内访问**：`*.vercel.app` 被限速/墙。建议把 `zerb.net`（或子域）绑到 Vercel 项目（Settings → Domains），像 frad.me 那样用自定义域名直连。
- **AI 限流**：当前是内存版，多 serverless 实例间不共享计数。要严格防刷可接 Vercel KV / Upstash。
- **媒体高清**：Motion 的 featured（VIVO XR / GLASS）只有 950px，无更大源，全宽横幅略糊；想清晰需用户给 ≥1600px 高清横图。其余 featured 已用高清源（dynamic-weather 用 1920px）。
- **命名统一**：导航按钮/面板是「Ask AI」，首页内联板块标题是「AI Ask」，顺序不一致，待用户决定是否统一。
- **Code 板块**：目前只有 MotionSheet 一个作品，是否补内容待定。
- **可选打磨**：详情页正文仍是 set:html 渲染的 WordPress 导出 HTML，可逐页清冗余 class/空块；校准各项目 `summary`/`year`。
- **R2 自定义域名（可选）**：r2.dev 有速率限制，可换 `media.zerb.net` + Cloudflare CDN，只需改 `.env` 的 `R2_PUBLIC_BASE` 重跑 `npm run media:manifest && npm run media:apply`。

更早的历史（2026-06-08 媒体目录拆分/优化、WordPress 静态导出清理）见 DONE.md。

当前文档结构已经统一为：

- `README.md`
- `AGENTS.md`
- `docs/TODO.md`
- `docs/DONE.md`

不再使用：

- `WEB_STATE.md`
- `WEB_LOG.md`
- `WEB_TODO.md`
- `WEB_DONE.md`
- `TASK_STATE.md`
- `CHANGELOG.md`
- `MIGRATION_NOTES.md`

最近一次会话中，首页头部滚动动效曾被误改成下滑折叠隐藏导航栏；该错误交互已经撤销。当前首页只保留原主题式状态同步：滚动超过阈值后切换 `headroom--not-top`，让导航背景和间距过渡生效，同时导航栏保持在顶部可点击。

## 未完成事项

- 如果后续要把首页头部滚动状态同步逻辑扩展到其它页面，必须先对照当前首页、备份或线上原效果，确认不是新增折叠隐藏交互。
- 浏览器复查首页头部导航：顶部为 `headroom--top`，滚动后为 `headroom--not-top`，导航栏始终可见可点击。
- 用户确认哪些 MP4 files 保留在仓库，哪些改为外链/CDN 托管。MP4 已完成一轮保守压缩，但仍是当前最大体积来源。
- 手动验证首页和 `works/` 前两个 external portfolio card links：
  - `https://www.vivo.com/my/products/vivo-vision`
  - `https://www.jmgo.com/luna`
- 安装或暴露 Git 后检查：

```powershell
git status --short --branch
git diff --stat
git log --oneline -5
```

- 准备 GitHub push。
- 准备 Vercel deployment。
- 部署前检查 `redirects.json`、`vercel.json`、`robots.txt` 和 `sitemap.xml`。
- 部署前再次用浏览器检查首页、`works/`、`blog/`、`resume/` 和关键 `project/` 页面，确认图片和视频仍能加载。
- 决定继续静态清理，还是进入前端重建阶段。（已决定：进入 Astro 重建。）
- 如果进入前端重建，确认使用 Vite/React、Astro 或其他方案。（已定：Astro 6 + Tailwind v4 + @astrojs/vercel。）

### Astro 重构待办（2026-06-15 起）

- Phase 1：迁移 11 个项目详情页正文（标题/段落/图/视频）到 Astro 详情模板 `app/src/pages/project/[slug].astro`，对照原页面逐个核对。
- Phase 1：迁移 works 列表页、blog、resume、404 到 Astro。
- Phase 1：核对 `app/src/content/projects/*.md` 中我先填的 pillars/summary/year，按真实情况修正；Code 板块目前作品偏少，确认是否补内容。
- Phase 2：写 `tools/upload-media.mjs` 上传视频到 R2，中文文件名规范化为 ASCII slug，生成 `media-manifest.json`，批量替换视频 src/poster。
- Phase 3：接 Lenis + GSAP ScrollTrigger，把当前 `.reveal` IntersectionObserver 占位替换为正式滚动动效；加 Astro View Transitions。
- Phase 4：`app/src/pages/api/chat.ts` 多 provider 抽象 + 流式 + 限流；生成 `.env` 模板；知识库从 content collections 编译。
- Phase 5：把 `redirects.json`/`vercel.json` 跳转迁到 Astro，验证 sitemap/robots，全站浏览器复查后切换 Vercel 构建到 `app/`。
- 待确认：切换上线时 Astro 放根目录还是保持 `app/` 子目录 + 调整 Vercel root directory。
- 待确认：R2 自定义域名（如 `media.zerb.net`）和 Cloudflare 账号。

## 已知问题

- Git 当前在 Codex 环境中不可用或未确认可用，`git status`、`git diff`、`git log` 均为“待确认”。
- `D:\net\net-website\.git` 存在，但 remote、branch、历史提交状态为“待确认”。
- 首页头部动效当前通过首页 `index.html` 的轻量脚本恢复滚动状态类，未全站统一复制。其它页面是否需要同样补丁为“待确认”。
- 视觉动效修改容易误判原始意图。涉及导航、滚动、hover、lightbox 等交互时，必须先查看原效果，再小范围改动。
- 首页和 `works/` 前两个 card 的外链代码已经存在，但用户最终手动确认仍为“待确认”。
- `project/vivo-xr/` 和 `project/luna-os-sinus/` 基本为空。根据当前文件状态推断，原 WordPress 导出中这两个页面的 `entry-content` 本来就是空的。
- WordPress 生成的 HTML 曾多为长行压缩格式，直接大段 patch 风险较高。
- MP4 文件仍是当前体积最大来源。2026-06-08 已完成一轮保守压缩：视频约从 `77.95MB` 降到 `64.54MB`；后续是否删除、保留或外链/CDN 托管仍为“待确认”。
- 图片已完成一轮 WebP 转换和保守压缩：图片约从 `12.32MB` 降到 `11.36MB`，节省约 `0.96MB`。当前图片体积较小，是否继续放 GitHub/Vercel 通常可以接受。
- React/Vite/Astro 等前端重建方案尚未开始，技术选型为“待确认”。
- `redirects.json` 中部分旧中文 URL 当前显示为乱码，是否需要重新从原始导出或线上旧链接恢复为正确编码为“待确认”。
- 媒体目录已经从 WordPress 年/月结构改为用途型结构。后续批量替换媒体路径时，必须确认 URL 里没有把斜杠误写成空格。
- 单纯扫描本地文件是否存在不够，媒体改动后必须刷新本地页面并确认浏览器中 broken image 数量为 `0`。

## 下一步

1. 先阅读 `README.md`、`docs/TODO.md`、`docs/DONE.md`。
2. 确认本地服务是否运行：

```powershell
Get-NetTCPConnection -LocalPort 4173 -ErrorAction SilentlyContinue
```

3. 如果未运行：

```powershell
cd D:\net\net-website
node tools/local-server.mjs
```

4. 打开：

```text
http://localhost:4173/
```

5. 检查首页、`works/`、`resume/`、关键 `project/` 页面。
6. 如果涉及头部导航或滚动动效，先确认导航不折叠、不隐藏，滚动后仍可点击。
7. 如果涉及媒体路径，额外检查：

```powershell
rg -n --hidden --glob '!node_modules' --glob '!.git' --glob '!reports/**' '/media/projects |/media/common |/media/blog ' D:\net\net-website
```

8. 新增或替换媒体后，运行自动优化脚本：

```powershell
cd D:\net\net-website
node tools/optimize-media.mjs
```

该脚本使用项目外工具目录 `D:\net\.tools\media` 和 `D:\net\.tools\ffmpeg`；如果换机器，需要先准备 `sharp` 和 ffmpeg，或设置 `SHARP_MODULE_ROOT`、`FFMPEG_INSTALLER_ROOT`、`FFMPEG_PATH`。

9. 媒体优化或路径替换后，检查 `reports/optimize-media-results.json`、`reports/video-index-current.txt`，并确认本地媒体引用缺失数为 `0`。
10. 与用户一起确认 `reports/video-index-current.txt` 中的 MP4 外链/CDN 处理策略。
11. Git 可用后，再继续 GitHub/Vercel 相关工作。
12. 如果继续整理文档，仍只维护 `README.md`、`AGENTS.md`、`docs/TODO.md`、`docs/DONE.md`，不要新增分散状态文件。

## 注意事项

- 不要删除原始备份目录 `D:\net\net`。
- 不要大范围删除 `media/` 或 `assets/`。
- 删除资源前必须确认没有 HTML/CSS/JS 引用。
- 改写媒体路径后必须用浏览器验证，不要只依赖文本扫描。
- 不要因为项目体积较大就过度裁剪作品集图片。
- 不要创建或使用 `MIGRATION_NOTES.md`。
- 不要创建或使用 `TASK_STATE.md`、`CHANGELOG.md`、`WEB_STATE.md`、`WEB_LOG.md`、`WEB_TODO.md`、`WEB_DONE.md`。
- WordPress 静态导出相关说明放在 `README.md`。
- 如果 Git 不可用，不要声称已经检查过 Git 状态。
- 修改业务代码前先说明计划；复杂修改不要直接大改。
- 修改已有动效前必须先对照原效果，不要新增用户没有要求的折叠、隐藏或布局位移。
