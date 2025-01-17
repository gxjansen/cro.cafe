declare module '@astrojs/rss' {
  import type { AstroGlobal } from 'astro';

  export interface RSSFeedItem {
    title: string;
    link: string;
    pubDate: Date;
    description?: string;
    content?: string;
    author?: string;
    categories?: string[];
    enclosure?: {
      url: string;
      length?: number;
      type?: string;
    };
  }

  export interface RSSOptions {
    title: string;
    description: string;
    site: string;
    items: RSSFeedItem[];
    customData?: string;
    stylesheet?: string;
  }

  export function getRSS(options: RSSOptions): string;
  export function getRSSFeed(options: RSSOptions): string;
}
