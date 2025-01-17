export const SITE = {
  name: 'CRO.CAFE',
  title: 'CRO.CAFE - Conversion Rate Optimization Podcast',
  description:
    "Join 14K+ subscribers for the world's most exciting, raw discussions on experimentation, CRO, user research and digital marketing from the industry leaders who live and breathe it\.",
  defaultLanguage: 'en',
  languages: ['en', 'nl', 'de', 'es'],
} as const;

export const UI = {
  theme: 'system',
} as const;

export const METADATA = {
  author: 'Guido X. Jansen',
  social: {
    twitter: 'https://twitter.com/cro_cafe',
  },
} as const;

export const PAGINATION = {
  EPISODES_PER_PAGE: 15,
} as const;

export const APP_BLOG = {
  enabled: true,
  postsPerPage: 6,
  post: {
    path: '/blog',
    permalink: '/blog/:slug',
    isEnabled: true,
    robots: 'index, follow',
  },
  list: {
    isEnabled: true,
    robots: 'index, follow',
  },
  category: {
    isEnabled: true,
    robots: 'index, follow',
  },
  tag: {
    isEnabled: true,
    robots: 'index, follow',
  },
  isRelatedPostsEnabled: true,
} as const;
