import { defineCollection } from 'astro:content';
import { EpisodeSchema, PersonSchema, PlatformSchema } from '../utils/content-schemas';

export const collections = {
  // Episodes collections
  'en/episodes': defineCollection({
    type: 'data',
    schema: EpisodeSchema,
  }),
  'de/episodes': defineCollection({
    type: 'data',
    schema: EpisodeSchema,
  }),
  'es/episodes': defineCollection({
    type: 'data',
    schema: EpisodeSchema,
  }),
  'nl/episodes': defineCollection({
    type: 'data',
    schema: EpisodeSchema,
  }),

  // Guests collections
  'en/guests': defineCollection({
    type: 'data',
    schema: PersonSchema,
  }),
  'de/guests': defineCollection({
    type: 'data',
    schema: PersonSchema,
  }),
  'es/guests': defineCollection({
    type: 'data',
    schema: PersonSchema,
  }),
  'nl/guests': defineCollection({
    type: 'data',
    schema: PersonSchema,
  }),

  // Platform collections (only for en and de)
  'en/platforms': defineCollection({
    type: 'data',
    schema: PlatformSchema,
  }),
  'de/platforms': defineCollection({
    type: 'data',
    schema: PlatformSchema,
  }),

  // Quotes collections (for en, de, es, nl)
  'en/quotes': defineCollection({
    type: 'data',
    schema: ({ image }) => ({
      id: 'string',
      language: 'enum',
      type: 'string',
      canonicalUrl: 'string?',
      title: 'string',
      description: 'string',
      image: image(),
      pubDate: 'date',
      author: 'string',
      tags: 'string[]',
      draft: 'boolean?',
    }),
  }),
  'de/quotes': defineCollection({
    type: 'data',
    schema: ({ image }) => ({
      id: 'string',
      language: 'enum',
      type: 'string',
      canonicalUrl: 'string?',
      title: 'string',
      description: 'string',
      image: image(),
      pubDate: 'date',
      author: 'string',
      tags: 'string[]',
      draft: 'boolean?',
    }),
  }),
  'es/quotes': defineCollection({
    type: 'data',
    schema: ({ image }) => ({
      id: 'string',
      language: 'enum',
      type: 'string',
      canonicalUrl: 'string?',
      title: 'string',
      description: 'string',
      image: image(),
      pubDate: 'date',
      author: 'string',
      tags: 'string[]',
      draft: 'boolean?',
    }),
  }),
  'nl/quotes': defineCollection({
    type: 'data',
    schema: ({ image }) => ({
      id: 'string',
      language: 'enum',
      type: 'string',
      canonicalUrl: 'string?',
      title: 'string',
      description: 'string',
      image: image(),
      pubDate: 'date',
      author: 'string',
      tags: 'string[]',
      draft: 'boolean?',
    }),
  }),
};
