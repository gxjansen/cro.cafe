export interface Episode {
  id: string;
  title: string;
  description: string;
  date: Date;
  duration: number;
  audio_url: string;
  transcript_url: string;
  guests: Person[];
  platforms: Platform[];
  quotes: Quote[];
  language: string;
  type: string;
  canonicalUrl?: string;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  social_links: string[];
  language: string;
  type: string;
  canonicalUrl?: string;
}

export interface Quote {
  id: string;
  text: string;
  author: Person;
  episode: Episode;
  timestamp: number;
  language: string;
  type: string;
  canonicalUrl?: string;
}

export interface Platform {
  id: string;
  name: string;
  description: string;
  url: string;
  icon_url: string;
  language: string;
  type: string;
  canonicalUrl?: string;
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  iconUrl: string;
  language: string;
  type: string;
  canonicalUrl?: string;
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

interface ResvgOptions {
  background?: string;
  fitTo?: {
    mode: 'width' | 'height' | 'zoom';
    value: number;
  };
  font?: {
    fontFiles?: string[];
    loadSystemFonts?: boolean;
    defaultFontFamily?: string;
  };
  logLevel?: 'off' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
  shapeRendering?: number;
  textRendering?: number;
  imageRendering?: number;
}

declare module '@resvg/resvg-js' {
  export class Resvg {
    constructor(svg: string, options?: ResvgOptions);
    render(): {
      asPng: () => Buffer;
    };
  }
}
