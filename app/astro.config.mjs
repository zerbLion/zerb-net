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

  adapter: vercel()
});