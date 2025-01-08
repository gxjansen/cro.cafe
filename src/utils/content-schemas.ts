import { z } from 'zod';

// Define Zod schema for Episode
export const EpisodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string().datetime(),
  duration: z.number(),
  audio_url: z.string().url().optional(),
  transcript_url: z.string().url().optional(),
  youtube_url: z.string().url().optional(),
  main_image: z.string().url().optional(),
  show_notes: z.string().optional(),
  guests: z.array(z.string()),
  language: z.enum(['en', 'es', 'de', 'nl']),
  canonicalUrl: z.string().url().optional(),
});

// Define Zod schema for Person (Guest)
export const PersonSchema = z.object({
  id: z.string(),
  name: z.string(),
  bio: z.string(),
  image_url: z.string().url().optional(),
  role: z.string(),
  social_links: z.array(z.string()),
  language: z.enum(['en', 'es', 'de', 'nl']),
  canonicalUrl: z.string().url().optional(),
});

// Define Zod schema for Quote
export const QuoteSchema = z.object({
  id: z.string(),
  text: z.string(),
  timestamp: z.number(),
  episode: z.object({
    id: z.string(),
    title: z.string(),
  }),
  author: z.object({
    id: z.string(),
    name: z.string(),
  }),
  language: z.enum(['en', 'es', 'de', 'nl']),
  canonicalUrl: z.string().url().optional(),
});

// Define Zod schema for Platform
export const PlatformSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  url: z.string().url(),
  icon_url: z.string().url().optional(),
  language: z.enum(['en', 'es', 'de', 'nl']),
  canonicalUrl: z.string().url().optional(),
});

// Define Zod schema for Brand
export const BrandSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  logo_url: z.string().url().optional(),
  url: z.string().url().optional(),
  language: z.enum(['en', 'es', 'de', 'nl']),
  canonicalUrl: z.string().url().optional(),
});
