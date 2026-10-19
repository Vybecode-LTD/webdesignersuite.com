// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://webdesignersuite.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    // /install is built as install.html; Caddy serves it at /install.
    format: 'file',
    // Every style is a hashed file: no inline <style>, so the CSP needs no 'unsafe-inline'.
    inlineStylesheets: 'never',
  },
  integrations: [mdx(), sitemap()],
});
