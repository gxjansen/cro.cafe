/// <reference types="astro/client" />
/// <reference types="astro/api" />

interface ImportMetaEnv {
  readonly SITE_URL: string;
  readonly PUBLIC_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'astro:content' {
  interface AstroContentCollectionEntry<C> {
    id: string;
    slug: string;
    collection: C;
    data: any;
    render(): Promise<{
      Content: import('astro').MarkdownInstance<{}>['Content'];
      headings: import('astro').MarkdownHeading[];
      remarkPluginFrontmatter: Record<string, any>;
    }>;
  }

  type BaseCollectionConfig = {
    schema?: any;
  };

  type ContentCollectionConfig = BaseCollectionConfig & {
    type: 'content';
  };

  type DataCollectionConfig = BaseCollectionConfig & {
    type: 'data';
  };

  type CollectionConfig = ContentCollectionConfig | DataCollectionConfig;

  type Collections = {
    post: ContentCollectionConfig;
    'en-episodes': DataCollectionConfig;
    'nl-episodes': DataCollectionConfig;
    'de-episodes': DataCollectionConfig;
    'es-episodes': DataCollectionConfig;
    'en-guests': DataCollectionConfig;
    'nl-guests': DataCollectionConfig;
    'de-guests': DataCollectionConfig;
    'es-guests': DataCollectionConfig;
    'en-platforms': DataCollectionConfig;
    'nl-platforms': DataCollectionConfig;
    'de-platforms': DataCollectionConfig;
    'es-platforms': DataCollectionConfig;
    'en-quotes': DataCollectionConfig;
    'nl-quotes': DataCollectionConfig;
    'de-quotes': DataCollectionConfig;
    'es-quotes': DataCollectionConfig;
  };

  type ContentConfig = {
    collections: Collections;
  };

  type PostData = {
    title: string;
    description: string;
    publishDate: Date;
    excerpt?: string;
    image?: string;
    category?: string;
    tags?: string[];
    draft?: boolean;
    updateDate?: Date;
    author?: string;
    metadata?: Record<string, unknown>;
  };

  type EpisodeData = {
    id: string;
    type: 'episode';
    attributes: {
      title: string;
      summary: string | null;
      description: string;
      status?: 'published' | 'draft' | 'scheduled';
      published_at: string;
      media_url: string;
      duration: number;
      duration_in_mmss: string;
      formatted_published_at: string;
      formatted_description?: string | null;
      clean_description?: string | null;
      image_url?: string | null;
      video_url?: string | null;
      transcript_url?: string | null;
      share_url: string;
      embed_html: string;
      embed_html_dark: string;
      slug: string;
      number?: number | null;
      season?: number | null;
      explicit?: boolean | null;
      keywords?: string[] | null;
      alternate_url?: string | null;
      author?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
      formatted_summary?: string | null;
      audio_processing?: boolean | null;
      email_notifications?: Record<string, unknown> | null;
      keywords_raw?: string;
      local_image_url?: string;
      featured?: boolean;
    };
    relationships: {
      show: {
        data: {
          id: string;
          type: string;
        };
      };
      guests?: Array<{
        id: string;
        type: 'guest';
      }>;
    };
  };

  type CollectionEntry<C extends keyof Collections> = C extends 'post'
    ? {
        id: string;
        slug: string;
        collection: C;
        data: PostData;
        render(): Promise<{
          Content: import('astro').MarkdownInstance<{}>['Content'];
          headings: import('astro').MarkdownHeading[];
          remarkPluginFrontmatter: Record<string, any>;
        }>;
      }
    : C extends `${string}-episodes`
      ? {
          id: string;
          slug: string;
          collection: C;
          data: EpisodeData;
        }
      : {
          id: string;
          slug: string;
          collection: C;
          data: any;
        };

  type ContentEntryMap = {
    [C in keyof Collections]: CollectionEntry<C>;
  };

  type DataEntryMap = ContentEntryMap;

  export function getCollection<C extends keyof Collections>(
    collection: C,
    options?: {
      type?: 'content' | 'data';
      filter?: (entry: CollectionEntry<C>) => boolean;
    }
  ): Promise<CollectionEntry<C>[]>;
}

declare module 'astro' {
  export interface APIRoute {
    get?: (context: APIContext) => Promise<Response> | Response;
    post?: (context: APIContext) => Promise<Response> | Response;
    put?: (context: APIContext) => Promise<Response> | Response;
    delete?: (context: APIContext) => Promise<Response> | Response;
    all?: (context: APIContext) => Promise<Response> | Response;
  }

  export interface APIContext {
    params: Record<string, string>;
    request: Request;
    cookies: AstroCookies;
    url: URL;
    site: URL | undefined;
    generator: string;
    props: Record<string, any>;
    redirect(path: string, status?: 301 | 302 | 303 | 307 | 308): Response;
  }

  export interface AstroCookies {
    get(key: string): { value: string } | undefined;
    has(key: string): boolean;
    set(
      key: string,
      value: string,
      options?: {
        domain?: string;
        expires?: Date;
        httpOnly?: boolean;
        maxAge?: number;
        path?: string;
        sameSite?: 'Strict' | 'Lax' | 'None';
        secure?: boolean;
      }
    ): void;
    delete(key: string, options?: { path?: string; domain?: string }): void;
  }
}
