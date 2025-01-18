import type { CollectionEntry } from 'astro:content';

export type Episode = CollectionEntry<
  'en-episodes' | 'nl-episodes' | 'de-episodes' | 'es-episodes'
>;

export interface EpisodeData {
  id: string;
  type: 'episode';
  attributes: {
    title: string;
    summary: string | null;
    description: string;
    status?: 'published' | 'draft' | 'scheduled' | null;
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
}
