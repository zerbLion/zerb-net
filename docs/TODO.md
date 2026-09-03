# TODO.md

## 当前目标

- 维护线上 Astro 站（`app/`，Vercel，zerb.net），保留作品集视觉效果。
- SEO：**原目标（zerblion 第一）被 2026-09-03 的更名决定取代**，见下方「品牌更名」段；更名完成前维持现状。
- 内容：12 个项目详情页正文已全部补齐（2026-07-05，每页 100-180 词起步 + 站内互链）；后续可再加深个别页或由用户补充一手细节。
- 让用户能自助更新内容（加作品 = 加 `app/src/content/projects/*.md` + 图片进 `app/public/media/images/projects/<slug>/` + push main）。

## 品牌更名：zerb → zezr（2026-09-03 用户定）

用户拍板：**用 `zezr` 把 `zerb` 换掉**。此前的评估（zezr 无元音、`/zr/` 不是英语合法音节尾、迁移成本高）已提出、用户知情后仍决定换，**不再重开**。

### 前提：先拿下 `zezr.com`
- `zezr.com` 在拍卖（用户告知）。**没拿下之前，站内一个字都不改**——其余全部依赖它。
- 拍卖设死上限，别追价。四字母 .com 是商品类，很容易上头。
  **2026-09-03 定：上限 $150（≈¥1008，按平台 6.72 汇率）。** 打法：**最后 24 小时内**（截止 2026-09-25 23:00 PRC，避开最后几分钟的防狙击延时）
  一次性把上限填进代理出价，之后**不再动**。
  **被超就是答案：更名搁置，维持 `zerb.net` 现状，不用其他后缀。**
  用户 2026-09-03 明确：**`.net` / `.io` / `.dev` 等后缀一概不考虑，一个品牌只认 `.com`**（"别的域名是不可能注册的"）。
  ⚠️ 上限 $150 当初是对着"输了退到 .net"这个退路算的；退路取消后，上限该按"更名本身值多少"重算——
  **数字待用户重新确认，且只确认一次，25 号不再改。**
  背景：对手 bidder 5 是代理出价机器人，每次都在我方出价上 +$1，逐次加价只是在喂它。

### 命名三层
| 层 | 定为 | 备注 |
|---|---|---|
| 域名 | `zezr.com` | **只要 .com**，其他后缀不注册。`zerb.net` 续着做 301 是为了保住已有外链和收藏，不是买后缀——两回事 |
| 全称 / handle | `zezrLion` | GitHub `zezrLion` 空着（实测）。`zezr` 被 2014 年注册、2016 年后无活动的死号占着，可试 GitHub support 的闲置名回收，别指望 |
| 读音 | **自己定，写在站上** | 建议 `/ˈzɛzər/`（"zezzer"）：短 e 跟 zerb 更接近，且避开 `/ˈziːzər/` 和 geezer（老头）押韵 |

### 迁移顺序（严格按序，前一步没完不动下一步）
1. **域名**：拍下 `zezr.com` + 注册上面那几个
2. **GitHub**：Settings → 用户名 `zerbLion` → `zezrLion`。
   - GitHub 会给旧名下的仓库 URL 和 git remote 做重定向，但 **`zerblion.github.io` 的 Pages 站不重定向**——`zero-build-blog` 的地址会断，要在那边同步改。
   - 改完**立刻用旧名 `zerbLion` 注册一个占位账号**，否则被人捡走后重定向随之失效。
   - 站内所有 `github.com/zerbLion/...` 硬链接改成新名，不依赖重定向。
3. **站内（本仓库）**：`zerb` 出现 205 处 / 29 文件（2026-09-03 统计，排除 node_modules/dist/.vercel/.astro）。分三类处理：
   - 域名类：`zerb.net` → `zezr.com`（`astro.config` 的 `site`、sitemap、canonical、`og:url`、Person schema 的 `url`）
   - 品牌类：`ZERB` / `zerbLion` / `Zerb Lion` → `ZEZR` / `zezrLion` / `Zezr Lion`；README 中英双版；LICENSE 署名（**版权人写真名还是艺名由用户定**）
   - **不动**：`astro.config` `redirects` 里的旧 WordPress 路径、git 历史、`zerb-net` 仓库名（改不改单独定）
   - Vercel：加域名 `zezr.com` 设 primary，`zerb.net` 配 301 → `zezr.com`
4. **站外**：Behance / Steam `id/zerblion` / X `lionzerb` / Dribbble（如已建）改 handle 与简介链接；Person schema `sameAs` 同步；`zerb.cc.cd` 是产品站域名，单独决定
5. **makerlion 仓库**：`AGENTS.md` 里"标是 zerbLion 的 Z"改成 zezrLion。**Z 标本身不动**——zezr 有两个 z，标更名正言顺
6. **GSC**：新增 `zezr.com` 资源，用 **Change of Address（地址更改）** 从 `zerb.net` 迁移——Google 官方的域名迁移通道，能带走大部分权重；`zerb.net` 的 sitemap 保留一段时间

### 用户看重的、这次换名真正能拿到的
- **全平台 handle 统一**：现在 X `lionzerb`、Steam `zerblion`、GitHub `zerbLion` 三种写法，因为 zerb 到处被占。zezr 的 .com/.net/.io/.dev/.ai/.cc + GitHub `zezrLion` 全空，四字母能空到这个程度极罕见。
- **身份控制**：搜 zerb 出来 DJ；换后搜出来的每一条都是自己。
- **读音唯一**：zerb 好读但控制不了别人怎么读；zezr 在站上写一行音标，从此只有一种读法。
- **时机**：站上线 3 个月、205 处。两年后是 2000 处，要换只有现在。

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
- **跨项目依赖（2026-07-28 记）**：新站 `makerlion.com`（仓库 `/data/Projects/makerlion`，GitHub `zerbLion/makerlion`，部署 Vercel）**未来唯一可能从本项目移植的东西就是 AI 问答能力**——`app/src/pages/api/chat.ts` + `app/src/lib/{providers,knowledge,ratelimit}.ts` + `app/src/components/AskAI.astro`。现在不做。**大改这几个文件时顺手想一下可移植性**（尤其别把知识库逻辑和作品集内容耦合死）。makerlion 侧的评估写在该仓库 `docs/TODO.md`。

更早的历史（Astro 重构 Phase 1-5、2026-07-04 根目录清理与 SEO 修正、2026-06-08 媒体优化等）见 `docs/DONE.md`。

## 未完成事项

- SEO 双线作战计划（2026-07-04 定，目标：`zerblion` 通吃 + 长期抢下 `zerb`，两线共用同一实体/内容/外链）——**⚠️ 已被 2026-09-03 更名决定取代，下列仅存档；更名落地后按 zezr 重写**：
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
