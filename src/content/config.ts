import { defineCollection, z } from 'astro:content';

// Host collection schema
const hostCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    role: z.string().optional(),
    bio: z.string(),
    image_url: z.string(),
    social_links: z
      .array(
        z.object({
          platform: z.string(),
          url: z.string(),
        })
      )
      .optional(),
    languages: z.array(z.string()),
    type: z.literal('host'),
  }),
});

// Blog collection schema
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    updateDate: z.date().optional(),
    author: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
  }),
});

// Episode collection schema
const episodeCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    type: z.literal('episode'),
    attributes: z.object({
      title: z.string(),
      summary: z.string().nullable(),
      description: z.string(),
      status: z.enum(['published', 'draft', 'scheduled']).nullable().optional(),
      published_at: z.string(),
      media_url: z.string(),
      duration: z.number(),
      duration_in_mmss: z.string(),
      formatted_published_at: z.string(),
      formatted_description: z.string().nullable().optional(),
      clean_description: z.string().nullable().optional(),
      image_url: z.string().nullable().optional(),
      video_url: z.string().nullable().optional(),
      transcript_url: z.string().nullable().optional(),
      share_url: z.string(),
      embed_html: z.string(),
      embed_html_dark: z.string(),
      slug: z.string(),
      number: z.number().nullable().optional(),
      season: z.number().nullable().optional(),
      explicit: z.boolean().nullable().optional(),
      keywords: z.array(z.string()).nullable().optional(),
      alternate_url: z.string().nullable().optional(),
      author: z.string().nullable().optional(),
      created_at: z.string().nullable().optional(),
      updated_at: z.string().nullable().optional(),
      formatted_summary: z.string().nullable().optional(),
      audio_processing: z.boolean().nullable().optional(),
      email_notifications: z.record(z.unknown()).nullable().optional(),
      keywords_raw: z.string().optional(),
      local_image_url: z.string().optional(),
      featured: z.boolean().optional(),
      guests: z
        .array(
          z.object({
            name: z.string(),
            slug: z.string(),
          })
        )
        .optional(),
    }),
    relationships: z.object({
      show: z.object({
        data: z.object({
          id: z.string(),
          type: z.string(),
        }),
      }),
      guests: z
        .array(
          z.object({
            id: z.string(),
            type: z.literal('guest'),
          })
        )
        .optional(),
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
    company: z.string().optional(), // Add company field
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

// Define collections
export const collections = {
  post: blogCollection,
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
  // Hosts
  'hosts': hostCollection,
};
