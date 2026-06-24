<div align="center">

# ⚡ ZERB — Motion · Visual · Code

[English](README.md) · **中文**

**一位动效设计师 & 视觉艺术家的作品集 —— 长滚动、电影感的网站,内置多 provider 的 AI,能回答关于作品的问题。**

[![Live](https://img.shields.io/badge/live-zerb.net-e7503a)](https://zerb.net)
![Stack](https://img.shields.io/badge/stack-Astro%206%20%2B%20Tailwind%20v4-ff5d01)
![Motion](https://img.shields.io/badge/motion-GSAP%20%2B%20Lenis-88ce02)
![AI](https://img.shields.io/badge/Ask%20AI-Gemini%20%2F%20OpenAI%20%2F%20Claude-7c3aed)
![Hosting](https://img.shields.io/badge/hosting-Vercel-000000)
![Media](https://img.shields.io/badge/media-Cloudflare%20R2-f38020)

</div>

---

## 🤔 这是什么

**ZERB(Zerb Lion)** 的个人作品集 —— 动效、视觉、代码合于一处。它原本是一份 WordPress 静态导出,后来用 **Astro** 从零重建为一个快速、以动效为先的站点,围绕三大板块组织:

- **Motion** —— 运动的系统,会呼吸的界面。
- **Visual** —— 世界、表面与光。
- **Code** —— 不只是设计,是真的造出来。

不再是"导航 + 一堆短页面"的死板结构,而是一整页可滑到底、用锚点定位的长滚动;外加一个 **「AI Ask」** 面板,能回答任意项目、创作过程、或如何联系的问题。

## ✨ 亮点

- 🎬 **动效优先** —— Lenis 平滑滚动 + GSAP,逐行 Hero 进场(蒙版擦除 / 模糊 / 打字),差值混合的自定义光标(带情境标签),以及会被光标磁吸的强调色小球。
- 🤖 **Ask AI** —— 侧边滑入的助手,从多 provider 端点流式输出(Gemini → OpenAI → Claude),知识库由项目内容编译而来。带限流与配额保护。
- 🖼 **图片优先的网格** —— 每板块 featured 优先;封面静止时盖一层中性遮罩,桌面 hover 复色、触屏默认全亮。
- 🎞 **视频托管在 R2** —— 大体积媒体放 Cloudflare R2(免流量费),不进 Git。
- 🔤 **字体自托管** —— Montserrat(标题)+ Mulish(正文),预加载,无字体跳变,不用被墙的 Google Fonts。
- ⚡ **Astro + View Transitions** —— 静态般快;导航间保留 Header / 光标 / AI 面板。

## 🧭 技术栈

```
Astro 6  +  Tailwind v4          →  站点本体          (app/)
GSAP  +  Lenis                   →  动效 & 平滑滚动
/api/chat  (serverless)          →  多 provider AI,流式
Cloudflare R2                    →  视频托管
Vercel  (根目录: app/)           →  部署  ·  zerb.net
```

仓库根目录还保留着最初的 **WordPress 静态导出** 作参考 —— 线上跑的是 `app/` 里的 Astro 重建版。

## 🚀 本地运行

```bash
cd app
npm install
npm run dev            # http://localhost:4321
```

```bash
cp .env.example .env   # 填一个 GEMINI_API_KEY(或 OpenAI / Anthropic)给 AI 面板用
npm run build          # 生产构建
```

> 媒体 + AI 的密钥放在 `.env`(已 gitignore)。没填 key 时 Ask AI 面板会优雅降级。

## 🗺 路线图

- [ ] 媒体在国内的稳定加速(CDN / 镜像)
- [ ] Motion 板块的高清封面
- [ ] Code 板块补更多作品
- [ ] 用 Upstash 做跨实例的 AI 限流

## 📜 许可 —— 保留所有权利

本仓库**仅公开供参考,并非开源**。所有内容 —— **代码** 和 **作品**(图、视频、文字、品牌)—— 均 **© 2026 ZERB LION,保留所有权利**。欢迎阅读、学习,但**未经许可不得**复制、再用或转发任何部分。详见 [LICENSE](LICENSE)。

---

<div align="center">

由 [**@ZerbLion**](https://github.com/ZerbLion) 设计、撰写、构建 · [zerb.net](https://zerb.net)

</div>
