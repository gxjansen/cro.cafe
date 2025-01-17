declare module '@astrojs/rss' {
  import type { AstroGlobal } from 'astro';

  export interface RSSFeedItem {
    title: string;
    description?: string;
    link: string;
    pubDate: Date;
    guid?: string;
    enclosure?: {
      url: string;
      length?: number;
      type?: string;
    };
    categories?: string[];
    author?: string;
    comments?: string;
    source?: {
      url: string;
      title: string;
    };
  }

  export interface RSSFeedOptions {
    title: string;
    description: string;
    site: string;
    items: RSSFeedItem[];
    customData?: string;
    stylesheet?: string;
    xmlns?: Record<string, string>;
    trailingSlash?: boolean;
  }

  export function getRSSString(options: RSSFeedOptions): string;
  export function getRSSResponse(options: RSSFeedOptions): Response;
}
