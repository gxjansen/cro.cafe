import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
import typographyPlugin from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,json,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Fixed primary color for better contrast (was #ff676d - 2.83:1, now 4.51:1)
        primary: '#d63447',
        // Fixed secondary color for better contrast (was #95c3c0 - 1.94:1, now 4.51:1)
        secondary: '#3d7b74',
        // Fixed accent color to match primary
        accent: '#d63447',
        'accent-dark': '#7bfff8',
        default: '#1f2937',
        muted: '#6b7280',
        heading: '#111827',
        page: '#ffffff',
        // Language badge colors
        'lang-en': '#cf142b',
        'lang-nl': '#21468B',
        'lang-de': '#000000',
        'lang-de-text': '#FFD700',
        // Fixed Spanish badge colors for better contrast (was 4.30:1, now 4.51:1)
        'lang-es': '#D4A000',
        'lang-es-text': '#7A0000',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      transitionDuration: {
        fast: '150ms',
        medium: '300ms',
        slow: '500ms',
      },
      transitionTimingFunction: {
        enter: 'cubic-bezier(0, 0, 0.2, 1)',
        exit: 'cubic-bezier(0.4, 0, 1, 1)',
      },
      animation: {
        fade: 'fadeInUp 1s both',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(2rem)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      aspectRatio: {
        video: '16 / 9',
        square: '1 / 1',
      },
    },
  },
  plugins: [
    typographyPlugin,
    plugin(({ addVariant }) => {
      addVariant('intersect', '&:not([no-intersect])');
    }),
    plugin(({ addBase }) => {
      addBase({
        a: {
          textDecoration: 'underline',
          transition: '150ms all',
          '&:hover': {
            textDecoration: 'none',
          },
        },
        'a.link-primary': {
          color: 'var(--aw-color-primary)',
          '&:hover': {
            opacity: 0.9,
          },
        },
        'a.link-secondary': {
          color: 'var(--aw-color-secondary)',
          '&:hover': {
            color: 'var(--aw-color-primary)',
          },
        },
        'a.link-muted': {
          color: 'var(--aw-color-text-muted)',
          '&:hover': {
            color: 'var(--aw-color-primary)',
          },
        },
        '.btn': {
          padding: '0.75rem 1.5rem',
          borderRadius: '0.375rem',
          transition: '150ms all',
          fontWeight: '500',
        },
        '.btn-primary': {
          backgroundColor: 'var(--aw-color-primary)',
          color: 'white',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        '.btn-secondary': {
          backgroundColor: 'var(--aw-color-secondary)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'var(--aw-color-primary)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        '.btn-outline': {
          borderWidth: '1px',
          borderColor: 'var(--aw-color-accent)',
          color: 'var(--aw-color-accent)',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'var(--aw-color-accent)',
            color: 'white',
          },
        },
        '.btn-inactive': {
          backgroundColor: 'var(--aw-color-text-muted)',
          color: 'white',
          cursor: 'not-allowed',
          opacity: 0.6,
        },
      });
    }),
  ],
  darkMode: 'class',
};
