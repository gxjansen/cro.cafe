import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.cro.cafe',
  trailingSlash: 'ignore',
  integrations: [
    // @ts-expect-error - Type mismatch in internal Astro types
    tailwind({
      applyBaseStyles: false,
    }),
    // @ts-expect-error - Type mismatch in internal Astro types
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
    // @ts-expect-error - Type mismatch in internal Astro types
    mdx(),
    // @ts-expect-error - Type mismatch in internal Astro types
    react({
      include: ['**/react/*'],
      experimentalReactChildren: true,
    }),
    // @ts-expect-error - Type mismatch in internal Astro types
    icon(),
  ],
  output: 'static',
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
    },
  },
});
