import { z } from 'zod';

// Language validation
export const LanguageSchema = z.enum(['en', 'de', 'es', 'nl']);

// Common props validation
export const MetadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  canonicalUrl: z.string().optional(),
  type: z.enum(['website', 'article']).optional(),
  publishedTime: z.string().optional(),
  modifiedTime: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Layout component props
export const LayoutPropsSchema = z.object({
  metadata: MetadataSchema.optional(),
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
  episodeId: z.string(),
  title: z.string(),
  description: z.string().optional(),
});

export const EpisodeGridPropsSchema = z.object({
  language: LanguageSchema,
  limit: z.number().optional(),
  featured: z.boolean().optional(),
  showGuests: z.boolean().optional(),
  columns: z.enum(['2', '3', '4']).optional(),
});

// Episode data validation
export const EpisodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  publishDate: z.string(),
  audioUrl: z.string(),
  duration: z.string(),
  language: LanguageSchema,
  guests: z
    .array(
      z.object({
        name: z.string(),
        role: z.string().optional(),
        company: z.string().optional(),
      })
    )
    .optional(),
  tags: z.array(z.string()).optional(),
});

export const EpisodeCardPropsSchema = z.object({
  episode: EpisodeSchema,
  showGuests: z.boolean().optional(),
});

export const SingleEpisodePropsSchema = z.object({
  episode: EpisodeSchema,
  availableLanguages: z.array(LanguageSchema).min(1),
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
