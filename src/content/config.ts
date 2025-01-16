import { defineCollection, z } from 'astro:content';

// Episode collection schema
const episodeCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    type: z.literal('episode'),
    attributes: z.object({
      title: z.string(),
      summary: z.string().nullable().optional(),
      description: z.string(),
      published_at: z.string(),
      media_url: z.string(),
      duration: z.number(),
      duration_in_mmss: z.string(),
      formatted_published_at: z.string(),
      formatted_description: z.string().optional(),
      clean_description: z.string().nullable().optional(),
      image_url: z.string().nullable().optional(),
      video_url: z.string().nullable().optional(),
      transcript_url: z.string().nullable().optional(),
      share_url: z.string(),
      embed_html: z.string(),
      embed_html_dark: z.string(),
      slug: z.string(),
      // Additional fields found in Spanish episodes
      number: z.number().nullable().optional(),
      season: z.number().nullable().optional(),
      status: z.string().optional(),
      explicit: z.boolean().optional(),
      keywords: z.array(z.string()).optional(),
      alternate_url: z.string().nullable().optional(),
      author: z.string().nullable().optional(),
      created_at: z.string().nullable().optional(),
      updated_at: z.string().nullable().optional(),
      formatted_summary: z.string().nullable().optional(),
      audio_processing: z.boolean().optional(),
      type: z.string().optional(),
      email_notifications: z.any().optional(),
      keywords_raw: z.string().optional(),
    }),
    relationships: z.object({
      show: z.object({
        data: z.object({
          id: z.string(),
          type: z.string(),
        }),
      }),
    }),
  }),
});

// Guest collection schema
const guestCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    role: z.string().optional(),
    bio: z.string().optional(),
    image_url: z.string(),
    social_links: z
      .array(
        z.object({
          platform: z.string(),
          url: z.string(),
        })
      )
      .optional(),
    language: z.string(),
    type: z.literal('guest'),
  }),
});

// Platform collection schema
const platformCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().optional(),
    logo: z.string().optional(),
  }),
});

// Quote collection schema
const quoteCollection = defineCollection({
  type: 'data',
  schema: z.object({
    text: z.string(),
    author: z.string(),
    episode: z.string().optional(),
    timestamp: z.string().optional(),
  }),
});

// Define collections for each language
export const collections = {
  // Episodes
  'en-episodes': episodeCollection,
  'nl-episodes': episodeCollection,
  'de-episodes': episodeCollection,
  'es-episodes': episodeCollection,
  // Guests
  'en-guests': guestCollection,
  'nl-guests': guestCollection,
  'de-guests': guestCollection,
  'es-guests': guestCollection,
  // Platforms
  'en-platforms': platformCollection,
  'nl-platforms': platformCollection,
  'de-platforms': platformCollection,
  'es-platforms': platformCollection,
  // Quotes
  'en-quotes': quoteCollection,
  'nl-quotes': quoteCollection,
  'de-quotes': quoteCollection,
  'es-quotes': quoteCollection,
};
