// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    // Load the shared repo-root .env (R2 + AI keys) in local dev.
    envDir: '..'
  },

  // Legacy URL redirects migrated from the old static site (redirects.json /
  // vercel.json) so old WordPress links keep working after cutover.
  redirects: {
    '/resume-2/': '/resume/',
    '/project/': '/works/',
    '/project/page/2/': '/works/',
    '/project/page/3/': '/works/',
    '/project/page/4/': '/works/',
    '/portfolio/': '/works/',
    '/portfolio/nfts/': '/works/',
    '/portfolio/projects/': '/works/',
    '/portfolio/works/': '/works/',
    '/project/xr/': '/project/vivo-xr/',
    '/project/open-title/': '/project/talos-principle/',
  },

  adapter: vercel()
});