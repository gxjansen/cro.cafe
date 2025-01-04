export interface Episode {
  title: string;
  description: string;
  date: Date;
  duration: number;
  audio_url: string;
  transcript_url: string;
  guests: Person[];
  platforms: Platform[];
  quotes: Quote[];
}

export interface Person {
  name: string;
  role: string;
  bio: string;
  image_url: string;
  social_links: {
    platform: string;
    url: string;
  }[];
}

export interface Platform {
  name: string;
  description: string;
  url: string;
  icon_url: string;
}

export interface Quote {
  text: string;
  author: Person;
  episode: Episode;
  timestamp: number;
}

export interface BrandListener {
  name: string;
  logo_url: string;
  description: string;
  website_url: string;
}

export interface MetadataProps {
  title: string;
  description: string;
  image?: string;
  canonicalUrl?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

export interface OpenGraphImageProps {
  title: string;
  subtitle?: string;
  type: 'episode' | 'guest' | 'quote';
  imageUrl?: string;
  logoUrl?: string;
}

declare module 'satori' {
  export interface SatoriOptions {
    width: number;
    height: number;
    fonts: {
      name: string;
      data: ArrayBuffer;
      weight: number;
      style: 'normal' | 'italic';
    }[];
  }
}

declare module '@resvg/resvg-js' {
  export class Resvg {
    constructor(svg: string, options?: any);
    render(): {
      asPng: () => Buffer;
    };
  }
}
