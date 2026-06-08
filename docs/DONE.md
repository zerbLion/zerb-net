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

## WordPress 静态导出清理

- 根据当前文件状态推断，移除了部分 WordPress feed/API/archive 输出。
- 根据当前文件状态推断，移除了部分 WordPress runtime 痕迹，例如 `wp-json`、`xmlrpc`、REST nonce scripts 和 speculation rules。
- 根据当前文件状态推断，将部分旧 `https://zerb.net` 绝对链接改为本地/root-relative 链接。
- 根据当前文件状态推断，将旧 WordPress 中文 slug 或归档 URL 迁移到英文 slug 或聚合页 redirect。

## 文档维护

- 2026-06-08 已更新 `README.md`、`AGENTS.md`、`docs/TODO.md`、`docs/DONE.md`，记录当前项目状态、首页头部动效修复边界和后续 agent 操作注意事项。
