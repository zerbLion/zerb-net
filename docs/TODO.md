# TODO.md

## 当前目标

- 维护线上 Astro 站（`app/`，Vercel，zerb.net），保留作品集视觉效果。
- SEO：目标是品牌词「zerblion / zerb lion」搜索第一（注意"zerb"单词被一位音乐人占据，短期不追）。
- 内容：12 个项目详情页正文已全部补齐（2026-07-05，每页 100-180 词起步 + 站内互链）；后续可再加深个别页或由用户补充一手细节。
- 让用户能自助更新内容（加作品 = 加 `app/src/content/projects/*.md` + 图片进 `app/public/media/images/projects/<slug>/` + push main）。

## 正在处理

**Astro 重建版已上线，`app/` 是站点唯一实现**（根目录 WordPress 静态导出已于 2026-07-04 删除，git 历史可找回）：

- 线上地址：**`https://zerb.net`**（Vercel 项目 `net-website-mu.vercel.app`，Root Directory = `app`，生产分支 `main`，push main 即部署）。zerb.net 的 DNS 在 Cloudflare：橙云（已代理）+ 缓存，SSL 用 Full/Full(strict)。
- 改 `app/` 前**必读 `AGENTS.md`「Astro 重建版工作规则」**（架构 + View Transitions/遮罩/Lenis/光标/预览环境等踩坑总结）。
- 视频在 Cloudflare R2（`zerbnet-media`，公共域名 r2.dev）；图片在 `app/public/media/images`；字体自托管（Montserrat 标题 + Mulish 正文）；AI 问答 `/api/chat` 多 provider（Gemini key 在 Vercel 环境变量）。
- 站内中文已全部翻成英文（项目正文/博客/标题）。
- 首页 = Hero 三段进场（蒙版/模糊/打字）+ 三板块 featured-first 网格 + 「AI Ask」内联引导块（复用侧边栏）。

### 当前待办 / 待用户决定

- **AI 限流（可选，用户操作）**：限流器支持 Upstash Redis（REST）跨实例共享计数（`app/src/lib/ratelimit.ts`），未配置时自动回退内存版、Redis 出错时 fail-open 不影响问答。激活只差一步：在 https://upstash.com 建免费 Redis → 把 `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`（或 Vercel KV 的 `KV_REST_API_URL` / `KV_REST_API_TOKEN`）加到 Vercel 环境变量并重新部署。限流本身已在生产生效（2026-06-22 实测 per-min=5、全站 cap=200），Upstash 仅为跨实例共享计数。
- **媒体高清**：Motion 的 featured（VIVO XR / GLASS）只有 950px 源图，全宽横幅略糊；想清晰需用户给 ≥1600px 高清横图。其余 featured 已用高清源（dynamic-weather 用 1920px）。
- **项目 `year` 未填**：所有 `app/src/content/projects/*.md` 都没填 `year`，featured 叠层不显示年份——要显示就补。
- **Code 板块**：目前只有 MotionSheet 一个作品，是否补内容待定。
- **可选打磨**：详情页正文（`app/src/project-bodies/*.html`）部分仍含 WordPress 导出的冗余 class/空块，可逐页清理；桌面 featured 卡片高度可再微调（现 ~3.7:1）。
- **R2 自定义域名（可选）**：r2.dev 有速率限制，可换 `media.zerb.net` + Cloudflare CDN，只需改 `.env` 的 `R2_PUBLIC_BASE` 重跑 `npm run media:manifest && npm run media:apply`。
- **国内访问再加速（可选）**：现橙云 + 缓存后国内可正常访问；要更快才需国内 CDN/备案。

更早的历史（Astro 重构 Phase 1-5、2026-07-04 根目录清理与 SEO 修正、2026-06-08 媒体优化等）见 `docs/DONE.md`。

## 未完成事项

- SEO 双线作战计划（2026-07-04 定，目标：`zerblion` 通吃 + 长期抢下 `zerb`，两线共用同一实体/内容/外链）：
  - **第 0 阶段（用户）**：GSC 确认域名级资源 + sitemap 状态"成功"；GitHub/X/blog 签名统一 `ZERB (zerblion) — zerb.net`。站内技术项（schema/重定向/sitemap）2026-07-04 已完成。
  - **第 1 阶段（内容冲刺）**：12 个项目详情页正文已于 2026-07-05 全部补齐；剩余顺手项：项目 `.md` 补 `year`；blog 用 "ZERB" 锚文本链回 zerb.net；个别页可继续加深。
  - **第 2 阶段（1-3 月，外部权重，攻 zerb 的关键）**：Behance/Dribbble/ArtStation/站酷建档（名字 ZERB、链 zerb.net）；投 Awwwards/CSSDA/siteInspire；每月初看 GSC 查询报告（zerb/zerblion/zerb lion 趋势）。
  - **检查点**：2 周 → zerblion 第一、索引 ≥13 页；1-2 月 → zerb lion 第一、zerb 进第一页；3-6 月 → zerb 前三。

## 已知问题

- 详情页正文（`app/src/project-bodies/*.html`）和 `app/src/migrated/about.html` 部分仍是 WordPress 导出的长行压缩 HTML（含冗余 class），大段 patch 风险较高，改动要小步、改完浏览器验证。
- Motion featured（VIVO XR / GLASS）无 ≥1600px 高清源，全宽横幅略糊（见待办）。
- GSC 有 15 页"已发现/已抓取-尚未编入索引"，属新站正常，等消化，月度复查即可。

## 下一步

1. 先阅读 `README.md`、`AGENTS.md`（改 `app/` 必读「Astro 重建版工作规则」）、`docs/TODO.md`、`docs/DONE.md`。
2. 本地开发：

```bash
cd app
npm install   # 首次
npm run dev   # http://localhost:4321/
```

3. 检查首页、`works/`、`about/`、关键 `project/` 页面；涉及导航、滚动、hover 等动效时先对照线上原效果，再小范围改动。
4. 上线前构建验证：`cd app && npm run build`（构建内含 `patch-vercel-redirects.mjs` 重定向后处理）。
5. 媒体：图片放 `app/public/media/images/...`；视频走 R2——根目录 `npm run media:upload` 上传、`npm run media:manifest && npm run media:apply` 更新引用（需 `.env` 里的 R2 凭据）。
6. 改完 commit 并 push `main`（生产分支，push 即触发 Vercel 部署）。
7. 文档只维护 `README.md`、`AGENTS.md`、`docs/TODO.md`、`docs/DONE.md`，不要新增分散状态文件。

## 注意事项

- 删除资源前必须确认没有页面/组件引用。
- 改写媒体路径后必须用浏览器验证，不要只依赖文本扫描。
- 不要过度压缩作品集图片。
- 不要创建或使用 `MIGRATION_NOTES.md`、`TASK_STATE.md`、`CHANGELOG.md`、`WEB_STATE.md`、`WEB_LOG.md`、`WEB_TODO.md`、`WEB_DONE.md`。
- 修改业务代码前先说明计划；复杂修改不要直接大改。
- 修改已有动效前必须先对照原效果，不要新增用户没有要求的折叠、隐藏或布局位移。
