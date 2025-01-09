import { defineCollection, z } from 'astro:content';
import { EpisodeSchema, PersonSchema, PlatformSchema } from '../utils/content-schemas';

// Define RSS collection schema
const RSSSchema = z.object({
  id: z.string(),
  content: z.string(),
  date: z.string().datetime(),
  language: z.enum(['en', 'es', 'de', 'nl']),
});

// Base schema for language collections
const LanguageSchema = z.object({
  language: z.enum(['en', 'es', 'de', 'nl']),
});

// Create collections for each language
export const collections = {
  // Root language collections
  de: defineCollection({ type: 'data', schema: LanguageSchema }),
  en: defineCollection({ type: 'data', schema: LanguageSchema }),
  es: defineCollection({ type: 'data', schema: LanguageSchema }),
  nl: defineCollection({ type: 'data', schema: LanguageSchema }),

  // English collections
  'en/episodes': defineCollection({ type: 'data', schema: EpisodeSchema }),
  'en/guests': defineCollection({ type: 'data', schema: PersonSchema }),
  'en/platforms': defineCollection({ type: 'data', schema: PlatformSchema }),

  // Spanish collections
  'es/episodes': defineCollection({ type: 'data', schema: EpisodeSchema }),
  'es/guests': defineCollection({ type: 'data', schema: PersonSchema }),

  // German collections
  'de/episodes': defineCollection({ type: 'data', schema: EpisodeSchema }),
  'de/guests': defineCollection({ type: 'data', schema: PersonSchema }),
  'de/platforms': defineCollection({ type: 'data', schema: PlatformSchema }),

  // Dutch collections
  'nl/episodes': defineCollection({ type: 'data', schema: EpisodeSchema }),
  'nl/guests': defineCollection({ type: 'data', schema: PersonSchema }),

  // RSS collection
  rss: defineCollection({ type: 'data', schema: RSSSchema }),
};
