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

## Git 规则

如果 Git 可用，任务开始或结束时按需检查：

```powershell
git status --short --branch
git diff --stat
git log --oneline -5
```

当前环境中 `git` 是否可用为“待确认”。如果不可用，不要声称已经检查过 Git status/diff/log。
