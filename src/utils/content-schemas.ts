import { z } from 'zod';

// Common base schemas
const LanguageEnum = z.enum(['en', 'es', 'de', 'nl']);

export const BaseContentSchema = z
  .object({
    id: z.string(),
    language: LanguageEnum,
    type: z.string(),
    canonicalUrl: z.string().url().optional(),
  })
  .strict();

const BaseEntitySchema = BaseContentSchema.extend({
  name: z.string(),
  description: z.string().default(''),
}).strict();

// Nested object schemas
const GuestSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    role: z.string().optional(),
    bio: z.string().optional(),
    image_url: z.string().optional(),
    social_links: z.array(z.string()).optional(),
    language: LanguageEnum,
    type: z.string().optional(),
  })
  .strict();

const ReferenceSchema = z
  .object({
    id: z.string(),
    title: z.string(),
  })
  .strict();

// Main content schemas
export const EpisodeSchema = BaseContentSchema.extend({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  duration: z.number().optional().default(0),
  audio_url: z.string(),
  transcript_url: z.string().default(''),
  youtube_url: z.string().default(''),
  main_image: z.string().optional(),
  show_notes: z.string().default(''),
  guests: z.array(GuestSchema).default([]),
  platforms: z.array(z.string()).default([]), // Array of platform IDs
  quotes: z.array(z.string()).default([]), // Array of quote IDs
  tags: z.array(z.string()).default([]), // Array of tag strings
}).strict();

export const PersonSchema = BaseEntitySchema.extend({
  role: z.string(),
  bio: z.string().default(''),
  image_url: z.string(),
  social_links: z.array(z.string()).default([]),
}).strict();

export const QuoteSchema = BaseContentSchema.extend({
  text: z.string(),
  timestamp: z.number(),
  episode: ReferenceSchema,
  author: ReferenceSchema.extend({
    name: z.string(),
  }).strict(),
}).strict();

export const PlatformSchema = BaseEntitySchema.extend({
  url: z.string().url(),
  icon_url: z.union([z.string().url(), z.literal('')]).optional(),
}).strict();

export const BrandSchema = BaseEntitySchema.extend({
  logo_url: z.string().url().optional(),
  url: z.string().url().optional(),
}).strict();
