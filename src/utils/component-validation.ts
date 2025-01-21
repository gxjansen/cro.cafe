import { z } from 'zod';

// Language validation
export const LanguageSchema = z.enum(['en', 'de', 'es', 'nl']);

// Person validation
export const PersonSchema = z.object({
  id: z.string(),
  type: z.literal('guest'),
  name: z.string(),
  role: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  image_url: z.string(),
  social_links: z
    .array(
      z.object({
        platform: z.string(),
        url: z.string(),
      })
    )
    .optional(),
  language: LanguageSchema,
});

// Common props validation
export const MetadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().nullable().optional(),
  canonicalUrl: z.string().nullable().optional(),
  type: z
    .union([z.literal('article'), z.literal('website'), z.literal('page'), z.string()])
    .optional(),
  publishedTime: z.string().nullable().optional(),
  modifiedTime: z.string().nullable().optional(),
  author: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  alternateLanguages: z.record(z.string()).nullable().optional(),
});

// Page props validation
export const PagePropsSchema = z.object({
  metadata: MetadataSchema.optional(),
  currentLang: LanguageSchema,
  availableLanguages: z.array(LanguageSchema).min(1),
  children: z.any().optional(),
});

// Layout component props
export const LayoutPropsSchema = z
  .object({
    metadata: z
      .object({
        title: z.string(),
        description: z.string(),
        image: z.string().nullable().optional(),
        canonicalUrl: z.string().nullable().optional(),
        type: z
          .union([z.literal('article'), z.literal('website'), z.literal('page'), z.string()])
          .optional(),
        publishedTime: z.string().nullable().optional(),
        modifiedTime: z.string().nullable().optional(),
        author: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        alternateLanguages: z.record(z.string()).nullable().optional(),
      })
      .optional(),
    currentLang: LanguageSchema,
    availableLanguages: z.array(LanguageSchema).min(1),
  })
  .passthrough(); // Allow additional Astro-specific props

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
export const EpisodePlayerPropsSchema = z
  .object({
    audio_url: z.string().url(),
    title: z.string(),
  })
  .strict();

// Episode data validation matching Content Collection structure
export const EpisodeSchema = z.object({
  id: z.string(),
  collection: z.enum(['en-episodes', 'nl-episodes', 'de-episodes', 'es-episodes']),
  render: z.function().optional(),
  data: z.object({
    type: z.literal('episode'),
    id: z.string(),
    attributes: z.object({
      title: z.string(),
      summary: z.string().nullable(),
      description: z.string(),
      status: z.enum(['published', 'draft', 'scheduled']).nullable().optional(),
      published_at: z.string(),
      media_url: z.string(),
      duration: z.number(),
      duration_in_mmss: z.string(),
      formatted_published_at: z.string(),
      formatted_description: z.string().nullable().optional(),
      clean_description: z.string().nullable().optional(),
      image_url: z.string().nullable().optional(),
      video_url: z.string().nullable().optional(),
      transcript_url: z.string().nullable().optional(),
      share_url: z.string(),
      embed_html: z.string(),
      embed_html_dark: z.string(),
      slug: z.string(),
      number: z.number().nullable().optional(),
      season: z.number().nullable().optional(),
      explicit: z.boolean().nullable().optional(),
      keywords: z.array(z.string()).nullable().optional(),
      alternate_url: z.string().nullable().optional(),
      author: z.string().nullable().optional(),
      created_at: z.string().nullable().optional(),
      updated_at: z.string().nullable().optional(),
      formatted_summary: z.string().nullable().optional(),
      audio_processing: z.boolean().nullable().optional(),
      email_notifications: z.record(z.unknown()).nullable().optional(),
      keywords_raw: z.string().optional(),
      local_image_url: z.string().optional(),
      featured: z.boolean().optional(),
    }),
    relationships: z.object({
      show: z.object({
        data: z.object({
          id: z.string(),
          type: z.string(),
        }),
      }),
      guests: z
        .array(
          z.object({
            id: z.string(),
            type: z.literal('guest'),
          })
        )
        .optional(),
    }),
  }),
});

export const EpisodeGridPropsSchema = z.object({
  episodes: z.array(EpisodeSchema),
  limit: z.number().optional(),
  featured: z.boolean().optional(),
  columns: z.enum(['2', '3', '4']).optional(),
  loading: z.boolean().optional(),
  showId: z.string().optional(),
  season: z.number().optional(),
  orderBy: z.enum(['published_at', 'duration']).optional(),
  orderDirection: z.enum(['asc', 'desc']).optional(),
  button: z
    .object({
      show: z.boolean(),
      text: z.string(),
      link: z.string(),
    })
    .optional(),
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
