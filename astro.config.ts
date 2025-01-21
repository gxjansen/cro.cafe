import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import icon from 'astro-icon';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.cro.cafe',
  trailingSlash: 'ignore',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          nl: 'nl',
          de: 'de',
          es: 'es',
        },
      },
    }),
    mdx(),
    react({
      include: ['**/react/*'],
      experimentalReactChildren: true,
    }),
    icon(),
  ],
  output: 'server',
  adapter: netlify(),
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.transistor.fm',
      },
    ],
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
    remarkPlugins: [],
    rehypePlugins: [],
    syntaxHighlight: 'shiki',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'transistor-api': ['./src/utils/transistor-api.ts'],
          },
        },
      },
      minify: true,
      sourcemap: false,
    },
    logLevel: 'silent',
    clearScreen: false,
  },
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
});
