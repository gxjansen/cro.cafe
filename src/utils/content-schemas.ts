import { z } from 'zod';

// Define Zod schema for Episode
export const EpisodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string().datetime(),
  duration: z.number(),
  audio_url: z.string().url(), // Required URL for audio
  transcript_url: z.string().optional(), // Changed from URL to string since it contains HTML
  youtube_url: z.union([z.string().url(), z.literal('')]).optional(), // Allow empty string or valid URL
  main_image: z.string().optional(), // Optional relative path
  show_notes: z.string().optional(),
  guests: z.array(
    z.object({
      // Updated to match actual guest object structure
      id: z.string(),
      name: z.string(),
      role: z.string(),
      bio: z.string(),
      image_url: z.string(),
      social_links: z.array(z.string()),
      language: z.enum(['en', 'es', 'de', 'nl']),
      type: z.string(),
    })
  ),
  language: z.enum(['en', 'es', 'de', 'nl']),
  type: z.string().optional(),
  canonicalUrl: z.string().url().optional(),
});

// Define Zod schema for Person (Guest)
export const PersonSchema = z.object({
  id: z.string(),
  name: z.string(),
  bio: z.string(),
  image_url: z.string(), // Allow relative paths
  role: z.string(),
  social_links: z.array(z.string()),
  language: z.enum(['en', 'es', 'de', 'nl']),
  type: z.string().optional(),
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
  icon_url: z.union([z.string().url(), z.literal('')]).optional(), // Allow empty string or valid URL
  language: z.enum(['en', 'es', 'de', 'nl']),
  type: z.string().optional(),
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
