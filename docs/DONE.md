# DONE.md

## 已完成的重要修改

以下内容只记录有意义的网站、页面、代码、资源、部署、结构变化。历史细节如无法准确确认，统一标注为“根据当前文件状态推断”。

## 网站结构

- 根据当前文件状态推断，已将 WordPress static export 整理为当前 `D:\net\net-website` 部署副本。
- 保留原始备份路径 `D:\net\net` 作为源参考。
- 已将 WordPress 静态导出所需的前端依赖集中迁移到 `assets/`，不再保留根目录下的 `wp-content` 和 `wp-includes`。
- 已将作品集图片和视频集中到 `media/`。
- 已将 `media/` 从原 WordPress 年/月层级重组为按资源类型和用途分组的目录：
  - `media/images/common/brand/`
  - `media/images/projects/<project-slug>/`
  - `media/images/blog/<post-slug>/`
  - `media/videos/projects/<project-slug>/`
- 已将公开路由整理为 `works/`、`project/<english-slug>/`、`blog/`、`resume/` 和 `404.html`。
- 已将旧 `portfolio/`、`project/page/*` 归档页移入 `reports/archived-routes/`，旧 URL 通过 redirect 跳到 `/works/`。
- 添加了 `reports/`，用于保存资源清理报告、归档路由备份和 MP4 文件清单。
- 文档结构调整为：
  - `README.md`
  - `AGENTS.md`
  - `docs/TODO.md`
  - `docs/DONE.md`
- 2026-06-08 已再次按当前会话状态梳理上述四个项目文档，确认状态、规则、待办和完成记录继续集中在这四个文件中维护。

## 运行和部署

- 根据当前文件状态推断，添加了本地静态预览脚本 `tools/local-server.mjs`。
- 本地预览地址为 `http://localhost:4173/` 或 `http://127.0.0.1:4173/`。
- 根据当前文件状态推断，添加了 Vercel 部署配置 `vercel.json`。
- 添加了 `.gitignore`。
- 添加并更新了 `robots.txt` 和 `sitemap.xml`。
- 添加了 `redirects.json`，用于记录旧 URL 到新 URL 的迁移关系。

## 页面和交互

- 2026-06-08 已撤销一次错误的首页头部下滑折叠隐藏交互。该交互会导致导航栏收起、不可点击，不符合用户期望。
- 2026-06-08 已将首页头部滚动动效修正为原主题式状态变化：头部保持顶部可见可点击，滚动后只切换 `headroom--top` / `headroom--not-top`，触发原 CSS 中的背景和 padding 过渡。
- 2026-06-08 已通过 Codex in-app Browser 验证首页头部滚动状态：顶部为 `headroom--top`，滚动后为 `headroom--not-top`，`rectTop` 保持 `0`，`transform` 为 `none`。
- 根据当前文件状态推断，首页和 `works/` 前两个 portfolio card 已改为外部链接：
  - `https://www.vivo.com/my/products/vivo-vision`
  - `https://www.jmgo.com/luna`
- 根据当前文件状态推断，为上述两个 card 添加 click-capture script，避免 WordPress portfolio/lightbox scripts 拦截点击。
- 根据当前文件状态推断，`project/vivo-xr/index.html` 和 `project/luna-os-sinus/index.html` 已回滚到空详情页状态。
- 根据当前文件状态推断，移除了 `project/vivo-xr/index.html` 和 `project/luna-os-sinus/index.html` 中曾误写入的字面文本 `` `n ``。
- 根据当前文件状态推断，旧 `/resume-2/` 已迁移到 `/resume/`，并通过 redirect 保留旧 URL。
- 根据当前文件状态推断，旧 404 目录页已整理为 `404.html`。
- 2026-06-08 修复 `project/time-garden/index.html` 为空文件的问题。已从原始备份 `D:\net\net\project\时间花园\index.html` 恢复 Organic Installation Art 页面内容，并适配当前媒体路径 `/media/images/projects/time-garden/...`、当前 canonical `/project/time-garden/` 和相邻项目导航。

## 资源清理

- 根据当前文件状态推断，已将 CSS、JS、字体资源集中到 `assets/css/`、`assets/js/`、`assets/fonts/`。
- 根据当前文件状态推断，已将作品集图片和视频集中到 `media/`。
- 已将当前仍被页面使用的图片和视频移动到用途型媒体目录，并批量更新 HTML 中的 `src`、`srcset`、`poster`、`background-image` 等媒体路径。
- 已删除 `media/2021/03/website-video.mp4` 所在的 `media/2021/03/` 目录。删除前确认页面没有引用该视频，只有 `reports/mp4-files.txt` 记录过它。
- 根据当前文件状态推断，删除了未被引用的 WordPress 自动生成缩略图。
- 根据当前文件状态推断，删除了未被引用的大图文件。
- 2026-06-08 已将当前媒体目录拆分为 `media/images/` 和 `media/videos/`，并同步更新页面中的图片和视频引用。
- 2026-06-08 已添加可复跑的媒体优化脚本 `tools/optimize-media.mjs`。脚本会将明显更小的 JPG 转成 WebP 并更新引用；MP4 会重新编码，只有新文件明显更小时才覆盖原文件。
- 2026-06-08 已执行一轮媒体自动优化：整体媒体体积约从 `90.25MB` 降到 `75.89MB`，节省约 `14.37MB`。
- 2026-06-08 图片约从 `12.32MB` 降到 `11.36MB`，节省约 `0.96MB`，本轮将 `144` 张 JPG 转成 WebP。
- 2026-06-08 视频约从 `77.95MB` 降到 `64.54MB`，节省约 `13.41MB`，本轮检查 `29` 个 MP4 并覆盖其中 `6` 个更小版本。
- 2026-06-08 已生成 `reports/optimize-media-results.json`，并更新 `reports/video-index-current.txt`。
- 2026-06-08 优化后已扫描 `419` 个媒体引用，缺失文件数为 `0`。
- 2026-06-08 优化后已通过 Codex in-app Browser 抽查首页、`works/`、`project/diy-motion-elements/`、`project/dynamic-weather-art/` 和 `project/wallpaper-universal-design/`，坏图数为 `0`，抽查视频 `readyState` 正常。
- 根据当前文件状态推断，MP4 已完成一轮保守压缩；后续仍需用户决定是否外链/CDN 托管或继续保留在仓库。
- 生成了 `reports/mp4-files.txt`。
- 生成了 `reports/deleted-unreferenced-thumbnails.txt`。
- 生成了 `reports/deleted-unreferenced-large-images.txt`。
- 当前没有单独保留 `media/README.md`。媒体目录用途说明已经集中到 `README.md`，避免项目文档入口分散。
- 媒体路径重组后曾出现一轮错误替换，把部分 `/media/projects/<slug>/<file>` 写成 `/media/projects <slug> <file>`，导致本地页面出现坏图。该问题已批量修复。
- 修复后已在 `http://localhost:4173/` 通过 Codex in-app Browser 刷新验证首页图片加载正常，浏览器检测 broken image 数量为 `0`。
- 修复后已抽查媒体 HTTP 响应，确认 logo 图片和项目 MP4 能返回 `200`，视频响应类型为 `video/mp4`。
- 修复后已扫描确认页面中不再存在 `/media/projects `、`/media/common `、`/media/blog ` 这类错误空格媒体路径。

## Astro 重构

- 2026-06-15 确定方向：把站点重构为 Astro，三大板块 Motion · Visual · Code，首页改长滚动 + 锚点；视频迁 Cloudflare R2；新增多 provider AI 问答。老静态站全程保留并行。
- 2026-06-15 完成 Phase 0 脚手架：
  - 在 `app/` 用 `create astro`（minimal 模板）建 Astro 6.4.6 项目，加 Tailwind v4（`@tailwindcss/vite`）和 `@astrojs/vercel` 适配器。
  - 建 `app/public/media` 目录 junction 指向根 `media/`，让开发服务器直接读现有图片；已在 `app/.gitignore` 忽略该 junction。
  - 设计系统：`app/src/styles/global.css` 定义暗色 token（ink/paper/accent 等）、Montserrat/Inter 字体、`.reveal` 滚动入场占位（带 prefers-reduced-motion 回退）。
  - 内容模型：`app/src/content.config.ts` 定义 projects collection（title/summary/pillars[motion|visual|code]/cover/year/order/externalUrl/draft）。
  - 用 `app/src/content/projects/*.md` 为 11 个项目建数据文件（先填标题/封面/pillars/简介占位，正文待 Phase 1 迁移）。
  - 组件：`Layout.astro`（含非阻塞 Google Fonts + IntersectionObserver reveal 脚本）、`Header.astro`（Motion/Visual/Code/About 锚点导航 + Ask AI 按钮 + headroom 式滚动变背景）、`Footer.astro`、`ProjectCard.astro`。
  - 首页 `app/src/pages/index.astro`：Hero（Motion. Visual. Code.）+ 三板块按 pillar tag 筛选渲染项目网格。
  - `npm run build` 通过；`npm run dev`（端口 4321）经 preview 截图确认 Hero 渲染正常。
  - 加 `.claude/launch.json`（astro / 4321）供本地预览。
- 2026-06-15 Phase 0 后按用户反馈修 UI：
  - `astro.config.mjs` 关闭 dev toolbar（`devToolbar.enabled=false`）；说明那是开发期调试条、非水印、不进生产构建；Astro 完全免费开源。
  - Header 左上角改用原 logo 图 `cropped-logo_high2.png`（替换文字 ZERB）；导航字体统一为 Montserrat（对齐原 Inspiro 主题）。
  - 实现移动端 Menu（全屏滑入面板，Menu/Close 切换）。
  - Ask AI 按钮接通：点击打开右侧滑入聊天面板 `AskAI.astro`（UI 壳 + 建议问题 + 输入框；真实多 provider 流式后端留到 Phase 4）。
  - 删除 Hero 顶部「ZERB — Portfolio」eyebrow 文案。
  - 作品卡片封面比例改为原作品页一致的 950×320 横幅（`ProjectCard` aspect-[950/320]）；并把 11 个项目封面、顺序、外链对齐原 `works/index.html`（vivo-xr→vivo.com，luna-os-sinus→jmgo.com 走 externalUrl）。
  - Code 板块暂空，渲染「More coming soon.」占位。
  - 浏览器验证：logo 与全部封面加载正常（broken=0），导航字体为 Montserrat，Ask AI 面板与移动菜单交互正常。

- 2026-06-15 Phase 1（项目详情迁移，进行中）：
  - 新增 `tools/extract-project-content.mjs`：从每个 `project/<slug>/index.html` 抽取 `entry-content` 正文 HTML，写到 `app/src/project-bodies/<slug>.html`，供 Astro 详情模板 `set:html` 渲染。已抽取 11/11。
  - 新增 Astro 详情模板 `app/src/pages/project/[slug].astro`：hero（标题/年份/pillars/封面）+ 迁移正文 + 上一个/下一个导航；外链项目（vivo-xr、luna-os-sinus）不生成详情页。生成 9 个详情页。
  - 详情正文加 `.entry-content` 作用域样式（figure/img/video/figcaption/spacer/链接）。
  - 浏览器验证：dynamic-weather-art 详情页 200、封面与 3 图 1 视频加载正常（视频 206 / video/mp4 / readyState 4）、prev/next 正确；nft-asset-design（17 媒体）与 luna-os-ar-theme（10 图）坏图/坏视频数为 0。
- 2026-06-15 Phase 1 第二轮 UI 反馈修复：
  - 重新启用 Astro dev toolbar（用户确认有用，仅开发期可见）。
  - favicon（浏览器缩略图）改回原站 `cropped-头像2-1-32x32.webp` / `192x192`。
  - 左上角 logo 放大（h-10 / md:h-12）。
  - 导航字体改 regular（font-normal），Ask AI 按钮 medium。
  - 修详情页 fixed header 与标题重叠：详情页 main 顶部留白加大（pt-36 / md:pt-44）。
  - 详情页末尾 prev/next 间距加大（py-16、mt-16），小屏单列、sm 起两列。
- 2026-06-15 Phase 1 完成（works / blog / resume / 404 迁移）：
  - 新增 `tools/extract-pages.mjs`，抽取 resume 和 2 篇博客正文到 `app/src/migrated/`。
  - 内容模型新增 blog collection（title/date/cover/excerpt）；`app/src/content/blog/*.md` 建 2 篇文章（和煦暴风、静默是永恒的主题）。
  - 新增页面：`works/index.astro`（按 motion/visual/code 过滤的作品网格）、`resume/index.astro`、`blog/index.astro`、`blog/[slug].astro`、`404.astro`。
  - 构建产出 16 页。浏览器验证：works/resume/blog/两篇博客全部 200、404 返回 404，全站坏图/坏视频数为 0；works 过滤交互正常（all 11 / motion 7 / code 0）。

- 2026-06-15 内容调整 + UI 优化（UI pass 第一轮）：
  - 板块重排：motion = VIVO XR、LUNA OS Sinus、China Mobile CAVE（按此顺序）；其余 8 个项目改为 visual；Code 板块新增项目。
  - 新增 Code 项目 `zerb-cc-cd`（外链工具，externalUrl 暂用 `https://zerb.cc.cd`，待用户确认），并原创设计契合暗色风格的 950×320 横幅封面 `media/images/projects/zerb-cc-cd/cover.svg`（代码片段 + 终端提示符 + wordmark + 强调色圆点）。
  - 页脚版权改为 `© 2026 ZERB LION. All rights reserved.`。
  - UI 优化：全局 `scroll-padding-top:96px`（锚点定位避开 fixed header）、自定义滚动条、`:focus-visible` 焦点态；首页 section 间距加大（py-28/md:py-36）+ 动画滚动提示；ProjectCard 升级 hover（遮罩 + 箭头徽标，外链显示外链箭头、内链显示前进箭头，标题 hover 变强调色）。
  - 浏览器验证：motion 3 / visual 8 / code 1（zerb.cc.cd 外链，封面 SVG 200/image+svg），版权文案正确，scroll-padding/箭头/滚动提示均生效。

- 2026-06-15 Phase 2（视频迁 Cloudflare R2，代码侧完成）：
  - 用户已建 R2 bucket `zerbnet-media`（自动/APAC，标准存储类），启用公共开发 URL：`https://pub-a0c77317c3024e5db24448b1f68cdada.r2.dev`。
  - 新增 root `package.json`（tools 用，装 `aws4fetch`）与脚本：`tools/lib/r2-media.mjs`（确定性 ASCII key 生成 + 视频枚举）、`tools/build-media-manifest.mjs`、`tools/apply-media-manifest.mjs`、`tools/upload-media.mjs`。
  - 新增 `.env.example`（R2 凭证模板），`.env` 已加入 `.gitignore`。
  - 生成 `media-manifest.json`：29 个本地视频 → R2 公共 URL 的确定性映射（中文文件名转 ASCII + 短 hash 防冲突）。
  - 已把 `app/src/project-bodies/*.html` 中 10 处实际引用的 `/media/videos/...` 重写为 R2 URL（5 个项目），无残留本地视频路径；构建 16 页通过。
  - 待用户执行：填 `.env` 后 `npm run media:upload` 把 29 个视频上传到桶；上传后线上视频即可播放。

## WordPress 静态导出清理

- 根据当前文件状态推断，移除了部分 WordPress feed/API/archive 输出。
- 根据当前文件状态推断，移除了部分 WordPress runtime 痕迹，例如 `wp-json`、`xmlrpc`、REST nonce scripts 和 speculation rules。
- 根据当前文件状态推断，将部分旧 `https://zerb.net` 绝对链接改为本地/root-relative 链接。
- 根据当前文件状态推断，将旧 WordPress 中文 slug 或归档 URL 迁移到英文 slug 或聚合页 redirect。

## 文档维护

- 2026-06-08 已更新 `README.md`、`AGENTS.md`、`docs/TODO.md`、`docs/DONE.md`，记录当前项目状态、首页头部动效修复边界和后续 agent 操作注意事项。
