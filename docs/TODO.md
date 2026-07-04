# TODO.md

## 当前目标

- 维护线上 Astro 站（`app/`，Vercel，zerb.net），保留作品集视觉效果。
- SEO：目标是品牌词「zerblion / zerb lion」搜索第一（注意"zerb"单词被一位音乐人占据，短期不追）。
- 内容：逐步补齐 12 个项目详情页正文（现在多数还是 "_Content migration pending_" 占位——这是当前 SEO 最大短板）。
- 让用户能自助更新内容（加作品 = 加 `app/src/content/projects/*.md` + 图片进 `app/public/media/images/projects/<slug>/` + push main）。

## 正在处理

**Astro 重建版已上线。** 6 个 Phase 全部完成并部署到 Vercel：
- 线上地址：**`https://zerb.net`**（2026-06-23 已绑定自定义域名；Vercel 项目仍是 `net-website-mu.vercel.app`，Root Directory = `app`，生产分支 `main`，dev 改完合并到 main）。zerb.net 的 DNS 在 Cloudflare：`zerb.net A 76.76.21.21` 设**灰云/仅DNS**(橙云会让 Vercel 验证不过)；阿里云老站 A 记录改名 `ali_old` 停车。
- 改 `app/` 前**必读 `AGENTS.md`「Astro 重建版工作规则」**（架构 + View Transitions/遮罩/Lenis/光标/预览环境等踩坑总结）。
- 视频已上传 Cloudflare R2（`zerbnet-media`，公共域名 r2.dev）；图片在 `app/public/media/images`；字体自托管（Montserrat 标题 + Mulish 正文）；AI 问答 `/api/chat` 多 provider（Gemini key 在 Vercel 环境变量）。
- 站内中文已全部翻成英文（项目正文/博客/标题）。
- 首页 = Hero 三段进场（蒙版/模糊/打字）+ 三板块 featured-first 网格 + 「AI Ask」内联引导块（复用侧边栏）。

老的根目录静态站（`index.html`、`project/`、`works/` 等）仍保留未删，但线上已是 `app/` 的 Astro 版。

### 当前待办 / 待用户决定
- **国内访问（2026-06-23 已解决）**：`zerb.net` 已绑到 Vercel（详见 DONE.md）。灰云直连时国内手机图片全挂；**改回 Cloudflare 橙云（已代理）+ 缓存后国内可正常访问**，SSL 用 Full/Full(strict)。要更快才需国内 CDN/备案。
- **AI 限流**：限流器已支持 **Upstash Redis（REST）**做跨实例共享计数（`app/src/lib/ratelimit.ts`），未配置时自动回退内存版、Redis 出错时 fail-open 不影响问答。**激活只差一步**（用户操作）：在 https://upstash.com 建免费 Redis → 把 `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`（或 Vercel KV 的 `KV_REST_API_URL` / `KV_REST_API_TOKEN`）加到 Vercel 环境变量并重新部署。未连前仍是内存版（每个 serverless 实例各自计数）。**2026-06-22 线上实测**：连发 8 次，第 6 次触发 429 → per-min=5 = 代码默认，确认 Vercel **未单独设**这些阈值 env，全站 cap=200 已在线生效、限流在生产确实拦截。阈值这块已 OK；Upstash 仅为跨实例共享，可选。
- **媒体高清**：Motion 的 featured（VIVO XR / GLASS）只有 950px，无更大源，全宽横幅略糊；想清晰需用户给 ≥1600px 高清横图。其余 featured 已用高清源（dynamic-weather 用 1920px）。
- **作品集卡片改版（2026-06-22 已完成，详见 DONE.md）**：featured 叠字 + 中性黑遮罩（桌面 hover 揭开 / 手机不加遮罩）+ 响应式高度（手机 3:2 / 桌面 1600/430）。**剩余可选微调**：桌面 featured 高度仍可调（现 ~3.7:1）；featured 三个项目 `.md` 未填 `year`，叠层不显示年份——要显示就补 `year`。
- **命名统一**：导航按钮/面板是「Ask AI」，首页内联板块标题是「AI Ask」，顺序不一致，待用户决定是否统一。
- **可见性 / 版权（2026-06-23 已定）**：决定**仓库转 public、但不开源** —— `LICENSE` 全部「All Rights Reserved」（代码 + 作品都保留），`Layout.astro` 埋了不可见署名注释。密钥已确认干净。**转 public 的开关由用户在 GitHub → Settings → Danger Zone → Change visibility 自行操作**（改共享权限属用户动作）。
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
- SEO 双线作战计划（2026-07-04 定，目标：`zerblion` 通吃 + 长期抢下 `zerb`，两线共用同一实体/内容/外链）：
  - **第 0 阶段（本周，用户）**：GSC 确认域名级资源 + sitemap 状态"成功"；GitHub/X/blog 签名统一 `ZERB (zerblion) — zerb.net`。站内技术项（schema/重定向/sitemap）2026-07-04 已完成。
  - **第 1 阶段（2-6 周，内容冲刺）**：12 个项目详情页填正文（每周 2 篇，200-400 词英文：背景/做了什么/工具/成果，自然提 ZERB 不堆砌）。素材可给 AI 代写。顺手：featured 三项目补 `year`；blog 用 "ZERB" 锚文本链回 zerb.net。
  - **第 2 阶段（1-3 月，外部权重，攻 zerb 的关键）**：Behance/Dribbble/ArtStation/站酷建档（名字 ZERB、链 zerb.net）；投 Awwwards/CSSDA/siteInspire；每月初看 GSC 查询报告（zerb/zerblion/zerb lion 趋势）。
  - **检查点**：2 周 → zerblion 第一、索引 ≥13 页；1-2 月 → zerb lion 第一、zerb 进第一页；3-6 月 → zerb 前三。
  - GSC"已发现/已抓取-尚未编入索引"15 页属新站正常，等消化，月度复查。

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
