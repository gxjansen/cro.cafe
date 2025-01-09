export const headerData = {
  links: [
    {
      text: 'Episodes',
      links: [
        {
          text: 'Latest Episodes',
          href: '/#episodes',
        },
        {
          text: 'All Episodes',
          href: '/episodes',
        },
        {
          text: 'By Topic',
          href: '/topics',
        },
      ],
    },
    {
      text: 'Guests',
      href: '/guests',
    },
    {
      text: 'About',
      links: [
        {
          text: 'About CRO.CAFE',
          href: '/#about',
        },
        {
          text: 'Contact',
          href: '/contact',
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
};

export const footerData = {
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
        { text: 'Episodes', href: '/episodes' },
        { text: 'Guests', href: '/guests' },
        { text: 'Topics', href: '/topics' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { text: 'Terms', href: '/terms' },
        { text: 'Privacy Policy', href: '/privacy' },
      ],
    },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: '/rss.xml' },
  ],
  footNote: `
    <span>CRO.CAFE · All rights reserved.</span>
  `,
};
