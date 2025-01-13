import { z } from 'zod';

// Common base schemas
const LanguageEnum = z.enum(['en', 'es', 'de', 'nl']);

// Platform schema (kept for future use)
export const PlatformSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().default(''),
    url: z.string().url(),
    icon_url: z.union([z.string().url(), z.literal('')]).optional(),
    language: LanguageEnum,
    type: z.string(),
  })
  .strict();

// Episode schema matching Transistor API data structure
export const EpisodeSchema = z
  .object({
    id: z.string(),
    type: z.literal('episode'),
    attributes: z
      .object({
        title: z.string(),
        number: z.number().optional(),
        season: z.number().optional(),
        status: z.string(),
        published_at: z.string(),
        duration: z.number(),
        explicit: z.boolean(),
        keywords: z.array(z.string()).default([]),
        alternate_url: z.string().optional(),
        media_url: z.string(),
        image_url: z.string().optional(),
        video_url: z.string().optional(),
        author: z.string(),
        summary: z.string(),
        description: z.string(),
        slug: z.string(),
        created_at: z.string(),
        updated_at: z.string(),
        formatted_published_at: z.string(),
        duration_in_mmss: z.string(),
        share_url: z.string(),
        transcript_url: z.string().optional(),
        transcripts: z.array(z.string()).default([]),
        formatted_summary: z.string(),
        formatted_description: z.string(),
        embed_html: z.string(),
        embed_html_dark: z.string(),
        audio_processing: z.boolean(),
        type: z.string(),
        email_notifications: z.string().nullable(),
        keywords_raw: z.string().optional(),
      })
      .strict(),
    relationships: z
      .object({
        show: z
          .object({
            data: z
              .object({
                id: z.string(),
                type: z.string(),
              })
              .strict(),
          })
          .strict(),
      })
      .strict(),
  })
  .strict();
