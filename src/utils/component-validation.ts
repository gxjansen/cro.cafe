import { z } from 'zod';

// Language validation
export const LanguageSchema = z.enum(['en', 'de', 'es', 'nl']);

// Common props validation
export const MetadataSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  image: z.string().nullable().optional(),
  canonicalUrl: z.string().optional(),
  type: z.enum(['website', 'article']).optional(),
  publishedTime: z.string().optional(),
  modifiedTime: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  alternateLanguages: z.record(z.string()).optional(),
});

// Layout component props
export const LayoutPropsSchema = z.object({
  metadata: MetadataSchema,
  availableLanguages: z.array(LanguageSchema),
  currentLang: LanguageSchema,
});

// Navigation component props
export const NavigationPropsSchema = z.object({
  currentLang: LanguageSchema,
  currentPath: z.string(),
});

// Footer component props
export const FooterPropsSchema = z.object({
  currentLang: LanguageSchema,
});

// Episode components props
export const EpisodePlayerPropsSchema = z.object({
  audio_url: z.string().url(),
  title: z.string(),
  description: z.string().optional(),
});

// Episode data validation matching Transistor API structure
export const EpisodeSchema = z.object({
  id: z.string(),
  type: z.literal('episode'),
  attributes: z.object({
    title: z.string(),
    summary: z.string().nullable(),
    description: z.string(),
    published_at: z.string(),
    media_url: z.string(),
    duration: z.number(),
    duration_in_mmss: z.string(),
    formatted_published_at: z.string(),
    formatted_description: z.string(),
    image_url: z.string().nullable().optional(),
    video_url: z.string().nullable().optional(),
    transcript_url: z.string().nullable().optional(),
    share_url: z.string(),
    embed_html: z.string(),
    embed_html_dark: z.string(),
    slug: z.string(),
  }),
  relationships: z.object({
    show: z.object({
      data: z.object({
        id: z.string(),
        type: z.string(),
      }),
    }),
  }),
});

export const EpisodeGridPropsSchema = z.object({
  episodes: z.array(
    z.object({
      id: z.string(),
      collection: z.string(),
      data: EpisodeSchema,
    })
  ),
  limit: z.number().optional(),
  featured: z.boolean().optional(),
  columns: z.enum(['2', '3', '4']).optional(),
  loading: z.boolean().optional(),
});

export const EpisodeCardPropsSchema = z.object({
  episode: EpisodeSchema,
  loading: z.boolean().optional(),
});

export const SingleEpisodePropsSchema = z.object({
  episode: EpisodeSchema,
  availableLanguages: z.array(LanguageSchema).min(1),
  loading: z.boolean().optional(),
});

// Structured data props
export const StructuredDataPropsSchema = z.object({
  type: z.string(),
  data: z.record(z.any()),
  canonicalUrl: z.string(),
  availableLanguages: z.array(LanguageSchema),
});

// Error boundary props
export const ErrorBoundaryPropsSchema = z.object({
  fallback: z.string(),
});

// Helper function to validate props
export function validateProps<T>(schema: z.ZodSchema<T>, props: unknown): T {
  try {
    return schema.parse(props);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Props validation failed:', error.errors);
      throw new Error(`Props validation failed: ${error.message}`);
    }
    throw error;
  }
}
