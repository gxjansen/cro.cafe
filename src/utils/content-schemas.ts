import { z } from 'zod';

// Define Zod schema for Episode
export const EpisodeSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  date: z.string().datetime(),
  duration: z.number(),
  audioUrl: z.string().url(),
  guests: z.array(z.string().uuid()),
  quotes: z.array(z.string().uuid()),
  platforms: z.array(z.string().uuid()),
  language: z.enum(['en', 'es', 'fr', 'de']),
  canonicalUrl: z.string().url().optional(),
});

// Define Zod schema for Person (Guest)
export const PersonSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  bio: z.string(),
  imageUrl: z.string().url().optional(),
  language: z.enum(['en', 'es', 'fr', 'de']),
  canonicalUrl: z.string().url().optional(),
});

// Define Zod schema for Quote
export const QuoteSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  authorId: z.string().uuid(),
  episodeId: z.string().uuid(),
  language: z.enum(['en', 'es', 'fr', 'de']),
  canonicalUrl: z.string().url().optional(),
});

// Define Zod schema for Platform
export const PlatformSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  websiteUrl: z.string().url().optional(),
  language: z.enum(['en', 'es', 'fr', 'de']),
  canonicalUrl: z.string().url().optional(),
});

// Define Zod schema for Brand
export const BrandSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  logoUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  language: z.enum(['en', 'es', 'fr', 'de']),
  canonicalUrl: z.string().url().optional(),
});
