# ZERB Static Website

这是用于本地预览、GitHub 托管和 Vercel 部署的 ZERB 静态网站工作副本。

原始备份路径：`D:\net\net`

当前工作目录：`D:\net\net-website`

注意：`D:\net\net` 是本机路径，换电脑后可能不可用。换机器后需要重新确认原始备份位置。

## 当前线上版本：Astro 重建（2026-06 起，重要）

本仓库现在有两套站点：

- **`app/`（线上版本）**：Astro 6 + Tailwind v4 重建版，三大板块 Motion · Visual · Code，长滚动 + 锚点首页、多 provider AI 问答（`/api/chat`）、Lenis/GSAP 动效、自定义光标、内联「AI Ask」+ 侧边栏问答。已部署到 Vercel：<https://net-website-mu.vercel.app>（Vercel Root Directory = `app`，生产分支 `main`，在 `dev` 改完合并到 `main`）。视频托管在 Cloudflare R2（`zerbnet-media`，r2.dev 公共域名），字体自托管（标题 Montserrat / 正文 Mulish）。
- **根目录静态站**（`index.html`、`project/`、`works/`、`assets/`、`media/` 等）：原 WordPress 静态导出，保留作为历史/备份，未删除，但线上已不再使用。

**改 `app/` 前必读 `AGENTS.md`「Astro 重建版工作规则」**——记录了 View Transitions 脚本只跑一次/引用失效、`backdrop-filter` 改变 `position:fixed` 定位基准、预览环境局限、部署延迟需硬刷新（Ctrl+Shift+R）、国内访问 / 自定义域名等关键踩坑。

本文件以下章节描述的是根目录旧静态站的结构与运行方式，对 Astro 版不再适用，仅作历史参考。

## 项目说明

这个项目来自 WordPress static export，但当前已经整理为更接近普通前端静态站点的结构。

当前目标是保留作品集视觉内容，同时减少 WordPress 导出留下的冗余路径和运行痕迹，方便后续上传到 GitHub 并部署到 Vercel。

根据当前文件状态推断，根目录下已不再保留 `wp-content` 和 `wp-includes`。仍被页面引用的 CSS、JS、字体等前端依赖已经集中迁移到 `assets/`，图片和视频资源集中到 `media/`。

## 当前状态

截至 2026-06-08，当前工作副本仍以静态 HTML/CSS/JS 为主，主要在 `D:\net\net-website` 中维护。

当前项目文档只维护四个 Markdown 文件：`README.md`、`AGENTS.md`、`docs/TODO.md`、`docs/DONE.md`。历史状态、待办和完成记录都应继续写入这四个文件，不再新增 `WEB_*`、`TASK_STATE.md`、`CHANGELOG.md` 或 `MIGRATION_NOTES.md`。

首页头部导航使用原 WordPress/Inspiro 静态导出保留下来的 `headroom` 状态类。当前期望效果是：滚动后头部仍停留在顶部并保持可点击，只切换 `headroom--top` / `headroom--not-top` 来触发原主题已有的背景和间距过渡。不要把它改成下滑折叠或隐藏导航栏的效果。

最近一次头部动效修复只在首页 `index.html` 中补充了轻量滚动状态同步脚本，用来恢复原主题式动态效果；未改动压缩主题 JS 或全站页面模板。后续如果要统一到其它页面，需要先对照当前首页和备份/线上效果，再小范围复制同一逻辑。

## 当前结构

- `index.html`：首页。
- `404.html`：静态 404 页面。
- `works/`：作品列表页。
- `project/`：作品详情页，当前使用公开路由 `/project/<english-slug>/`。
- `blog/`：博客列表页和旧文章页。
- `resume/`：简历页，旧 `/resume-2/` 通过 redirect 保留。
- `media/`：图片和视频资源目录，当前按用途分为 `common/`、`projects/`、`blog/`。
- `assets/css/`：页面引用的 CSS 资源。
- `assets/js/`：页面引用的 JS 资源。
- `assets/fonts/`：页面引用的字体资源。
- `docs/TODO.md`：当前目标、正在处理、未完成事项、已知问题、下一步和注意事项。
- `docs/DONE.md`：已经完成的重要网站、页面、代码、资源、部署、结构变化。
- `reports/`：资源清理报告、归档路由备份和文件清单。
- `tools/`：本地预览脚本。
- `redirects.json`：旧 URL 到新 URL 的重定向表。
- `vercel.json`：Vercel 部署配置。
- `robots.txt`、`sitemap.xml`：搜索引擎访问和站点地图配置。

注意：当前没有单独的 `media/README.md`。媒体目录说明集中在本文件的“媒体资源说明”中，避免文档入口再次分散。

## 运行方式

在项目根目录运行：

```powershell
node tools/local-server.mjs
```

访问：

```text
http://localhost:4173/
```

也可以访问：

```text
http://127.0.0.1:4173/
```

如果 `node` 不在 PATH 中，可以使用 Codex 内置运行时：

```powershell
C:\Users\chenchen4.zhao\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools/local-server.mjs
```

检查本地服务是否运行：

```powershell
Get-NetTCPConnection -LocalPort 4173 -ErrorAction SilentlyContinue
```

## 部署方式

当前项目按纯静态网站方式部署，不需要 WordPress 后台或 PHP 服务。

建议流程：

1. 确认 `D:\net\net-website` 是准备部署的目录。
2. 本地预览首页、`works/`、`resume/` 和关键 `project/` 页面。
3. 确认没有坏图、坏视频或样式丢失。
4. 推送到 GitHub。
5. 在 Vercel 导入对应 GitHub 仓库。
6. 部署后检查旧 URL redirect、`robots.txt` 和 `sitemap.xml`。

Git 当前是否可用、GitHub remote、Vercel 项目配置仍需在正式推送前确认。

## WordPress 静态导出说明

这个网站原本来自 WordPress static export。当前保留的是静态页面和前端资源，不计划恢复 WordPress 后台。

原 WordPress 目录中的媒体资源已经集中到 `media/`，前端依赖集中到 `assets/`。这些资源中仍有一部分来自 WordPress theme、plugin 或 WordPress 前端运行文件，但不再放在 `wp-content`、`wp-includes` 这样的 WordPress 根目录命名下。

媒体资源不再按 WordPress 年/月上传目录维护。当前页面引用已经按资源类型拆分，例如 `/media/images/projects/dynamic-weather-art/...` 和 `/media/videos/projects/dynamic-weather-art/...`。如果以后需要追溯原始路径，优先查看页面历史、`reports/` 中的清理记录，或原始备份 `D:\net\net`。

旧 WordPress URL 通过 `redirects.json` 和 `vercel.json` 迁移到新的公开路由。删除或修改旧路由前，需要确认对应 redirect 是否仍然需要保留。

删除 `media/` 或 `assets/` 中的任何文件前，都需要先确认没有 HTML/CSS/JS 引用。

## 媒体资源说明

`media/` 用于保存网站独立图片和视频资源。

资源按用途分组，后续替换项目图片或视频时，优先在对应项目目录中处理：

- `images/common/brand/`：共享 logo、favicon 和品牌资源。
- `images/projects/<project-slug>/`：项目封面和图集图片。
- `images/blog/<post-slug>/`：博客文章图片。
- `videos/projects/<project-slug>/`：项目视频。

新增或替换媒体后，可以运行 `node tools/optimize-media.mjs` 做一轮自动优化。脚本会把可显著缩小的 JPG 转成 WebP 并同步更新页面引用；MP4 会重新编码，只有新文件明显更小时才覆盖原文件。优化报告会写入 `reports/optimize-media-results.json`。

2026-06-08 已完成一轮媒体自动优化：整体媒体体积约从 `90.25MB` 降到 `75.89MB`，节省约 `14.37MB`。其中图片约从 `12.32MB` 降到 `11.36MB`，节省约 `0.96MB`；视频约从 `77.95MB` 降到 `64.54MB`，节省约 `13.41MB`。本轮将 `144` 张 JPG 转成 WebP，检查 `29` 个 MP4 并覆盖其中 `6` 个更小版本。已完成本地引用扫描，`419` 个媒体引用缺失数为 `0`，并用浏览器抽查首页、作品页、DIY 页面、动态天气页和壁纸页。

注意：`tools/optimize-media.mjs` 使用项目外工具目录 `D:\net\.tools\media` 的 `sharp` 和 `D:\net\.tools\ffmpeg` 的 ffmpeg installer，不把这些依赖提交到网站目录。若在新机器上复跑，先安装这些工具或通过环境变量 `SHARP_MODULE_ROOT`、`FFMPEG_INSTALLER_ROOT`、`FFMPEG_PATH` 指向可用工具。

重要：批量替换媒体路径后，必须同时做本地文件存在检查和浏览器加载检查。仅检查磁盘文件存在不足以证明页面可显示。曾出现过把 `/media/projects/<slug>/<file>` 错写成 `/media/projects <slug> <file>` 的问题，后续类似修改要特别检查路径中是否误含空格。
