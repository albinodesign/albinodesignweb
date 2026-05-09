// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  compressHTML: true,
  site: 'https://albinodesign.de',
  outDir: './dist',
  vite: {
    build: {
      minify: true,
      cssMinify: true,
    },
    css: {
      postcss: './postcss.config.js',
    },
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
