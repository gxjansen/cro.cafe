declare module '@unpic/astro' {
  import type { HTMLAttributes } from 'astro/types';
  export interface ImageProps extends HTMLAttributes<'img'> {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    layout?: 'fixed' | 'constrained' | 'fullWidth';
  }
  export const Image: (props: ImageProps) => any;
}

declare module '@astrojs/rss' {
  export interface RSSOptions {
    title: string;
    description: string;
    site: string;
    items: Array<{
      link: string;
      title: string;
      pubDate: Date;
      description?: string;
      customData?: string;
    }>;
    customData?: string;
    stylesheet?: string;
    trailingSlash?: boolean;
  }

  export function getRssString(options: RSSOptions): Promise<string>;
}

declare module 'astro' {
  export interface ImageMetadata {
    src: string;
    width: number;
    height: number;
    format: 'svg' | 'avif' | 'png' | 'webp' | 'jpeg' | 'jpg' | 'tiff' | 'gif';
    orientation?: number;
    hasAlpha?: boolean;
    space?: string;
    bits?: number;
    density?: number;
    isProgressive?: boolean;
    pages?: number;
    delay?: number[];
    loop?: number;
    palette?: { r: number; g: number; b: number; a?: number }[];
    background?: { r: number; g: number; b: number; a?: number };
    pageHeight?: number;
  }

  export interface AstroConfig {
    site: string;
    base: string;
    outDir: string;
    publicDir: string;
    root: string;
    srcDir: string;
    integrations: Array<{ name: string; [key: string]: unknown }>;
    trailingSlash?: 'always' | 'never' | 'ignore';
    build?: {
      format?: 'file' | 'directory';
    };
    vite?: {
      plugins?: unknown[];
      [key: string]: unknown;
    };
    ANALYTICS?: {
      googleAnalytics: {
        id: string;
        partytown: boolean;
      };
    };
  }

  export interface APIContext {
    params: Record<string, string>;
    request: Request;
    cookies: Map<string, string>;
    url: URL;
    props: Record<string, unknown>;
    locals: Record<string, unknown>;
  }

  export type MiddlewareHandler = (
    context: APIContext,
    next: () => Promise<Response>
  ) => Promise<Response>;

  export type PaginateFunction = <T>(
    data: T[],
    options: {
      pageSize?: number;
      params?: Record<string, string>;
      props?: Record<string, unknown>;
    }
  ) => Promise<Array<{ params: Record<string, string>; props: { page: { data: T[] } } }>>;

  export interface AstroIntegrationHookParams {
    config: AstroConfig;
    command: 'dev' | 'build' | 'preview';
    isRestart: boolean;
    updateConfig: (newConfig: Partial<AstroConfig>) => void;
    addWatchFile: (path: string | URL) => void;
    injectScript: (stage: 'head-inline' | 'before-hydration', content: string) => void;
    injectRoute: (route: { pattern: string; entrypoint: string }) => void;
    logger: {
      info: (message: string) => void;
      warn: (message: string) => void;
      error: (message: string) => void;
      debug: (message: string) => void;
      trace: (message: string) => void;
      fork: (name: string) => Logger;
    };
  }

  export interface Logger {
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
    debug: (message: string) => void;
    trace: (message: string) => void;
    fork: (name: string) => Logger;
  }

  export interface AstroIntegration {
    name: string;
    hooks: {
      'astro:config:setup'?: (params: AstroIntegrationHookParams) => void | Promise<void>;
      'astro:config:done'?: (params: { config: AstroConfig }) => void | Promise<void>;
      'astro:server:setup'?: (params: { logger: Logger }) => void | Promise<void>;
      'astro:server:start'?: (params: { logger: Logger }) => void | Promise<void>;
      'astro:server:done'?: (params: { logger: Logger }) => void | Promise<void>;
      'astro:build:start'?: (params: { logger: Logger }) => void | Promise<void>;
      'astro:build:setup'?: (params: { logger: Logger }) => void | Promise<void>;
      'astro:build:generated'?: (params: { logger: Logger }) => void | Promise<void>;
      'astro:build:ssr'?: (params: { logger: Logger }) => void | Promise<void>;
      'astro:build:done'?: (params: { logger: Logger }) => void | Promise<void>;
    };
  }
}
