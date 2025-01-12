import { defineCollection, z } from 'astro:content';
import { EpisodeSchema, PersonSchema, PlatformSchema } from '../utils/content-schemas';

export const collections = {
  // Episodes collections
  'en-episodes': defineCollection({
    type: 'data',
    schema: EpisodeSchema,
  }),
  'de-episodes': defineCollection({
    type: 'data',
    schema: EpisodeSchema,
  }),
  'es-episodes': defineCollection({
    type: 'data',
    schema: EpisodeSchema,
  }),
  'nl-episodes': defineCollection({
    type: 'data',
    schema: EpisodeSchema,
  }),

  // Guests collections
  'en-guests': defineCollection({
    type: 'data',
    schema: PersonSchema,
  }),
  'de-guests': defineCollection({
    type: 'data',
    schema: PersonSchema,
  }),
  'es-guests': defineCollection({
    type: 'data',
    schema: PersonSchema,
  }),
  'nl-guests': defineCollection({
    type: 'data',
    schema: PersonSchema,
  }),

  // Platform collections
  'en-platforms': defineCollection({
    type: 'data',
    schema: PlatformSchema,
  }),
  'de-platforms': defineCollection({
    type: 'data',
    schema: PlatformSchema,
  }),
  'es-platforms': defineCollection({
    type: 'data',
    schema: PlatformSchema,
  }),
  'nl-platforms': defineCollection({
    type: 'data',
    schema: PlatformSchema,
  }),

  // Quotes collections (for en, de, es, nl)
  'en-quotes': defineCollection({
    type: 'data',
    schema: ({ image }) =>
      z.object({
        id: z.string(),
        language: z.enum(['en', 'de', 'es', 'nl']),
        type: z.string(),
        canonicalUrl: z.string().optional(),
        title: z.string(),
        description: z.string(),
        image: image(),
        pubDate: z.date(),
        author: z.string(),
        tags: z.array(z.string()),
        draft: z.boolean().optional(),
      }),
  }),
  'de-quotes': defineCollection({
    type: 'data',
    schema: ({ image }) =>
      z.object({
        id: z.string(),
        language: z.enum(['en', 'de', 'es', 'nl']),
        type: z.string(),
        canonicalUrl: z.string().optional(),
        title: z.string(),
        description: z.string(),
        image: image(),
        pubDate: z.date(),
        author: z.string(),
        tags: z.array(z.string()),
        draft: z.boolean().optional(),
      }),
  }),
  'es-quotes': defineCollection({
    type: 'data',
    schema: ({ image }) =>
      z.object({
        id: z.string(),
        language: z.enum(['en', 'de', 'es', 'nl']),
        type: z.string(),
        canonicalUrl: z.string().optional(),
        title: z.string(),
        description: z.string(),
        image: image(),
        pubDate: z.date(),
        author: z.string(),
        tags: z.array(z.string()),
        draft: z.boolean().optional(),
      }),
  }),
  'nl-quotes': defineCollection({
    type: 'data',
    schema: ({ image }) =>
      z.object({
        id: z.string(),
        language: z.enum(['en', 'de', 'es', 'nl']),
        type: z.string(),
        canonicalUrl: z.string().optional(),
        title: z.string(),
        description: z.string(),
        image: image(),
        pubDate: z.date(),
        author: z.string(),
        tags: z.array(z.string()),
        draft: z.boolean().optional(),
      }),
  }),
};
