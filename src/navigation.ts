// Helper to prefix URLs with language
const withLang = (path: string, lang: string) => `/${lang}${path}`;

// Get navigation data for a specific language
export const getHeaderData = (lang: string) => ({
  links: [
    {
      text:
        lang === 'de'
          ? 'Episoden'
          : lang === 'nl'
            ? 'Afleveringen'
            : lang === 'es'
              ? 'Episodios'
              : 'Episodes',
      links: [
        {
          text: 'English Episodes',
          href: '/en/episodes',
        },
        {
          text: 'Deutsche Episoden',
          href: '/de/episodes',
        },
        {
          text: 'Nederlandse Afleveringen',
          href: '/nl/episodes',
        },
        {
          text: 'Episodios en Español',
          href: '/es/episodes',
        },
      ],
    },
    {
      text: 'Guests',
      href: withLang('/guests', lang),
    },
    {
      text: 'About',
      links: [
        {
          text: 'About CRO.CAFE',
          href: withLang('/#about', lang),
        },
      ],
    },
  ],
  actions: [
    {
      text: 'Subscribe',
      href: '#',
      icon: 'tabler:rss',
      target: '_blank',
      variant: 'primary',
    },
  ],
});

export const getFooterData = (lang: string) => ({
  links: [
    {
      title: 'Listen On',
      links: [
        { text: 'Spotify', href: '#', icon: 'tabler:brand-spotify' },
        { text: 'Apple Podcasts', href: '#', icon: 'tabler:brand-apple' },
        { text: 'Google Podcasts', href: '#', icon: 'tabler:brand-google' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'Episodes', href: withLang('/episodes', lang) },
        { text: 'Guests', href: withLang('/guests', lang) },
        { text: 'Topics', href: withLang('/topics', lang) },
      ],
    },
    {
      title: 'Legal',
      links: [
        { text: 'Terms', href: withLang('/terms', lang) },
        { text: 'Privacy Policy', href: withLang('/privacy', lang) },
      ],
    },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: withLang('/rss.xml', lang) },
  ],
  footNote: `
    <span>CRO.CAFE · All rights reserved.</span>
  `,
});

// Export default English navigation for backwards compatibility
export const headerData = getHeaderData('en');
export const footerData = getFooterData('en');
