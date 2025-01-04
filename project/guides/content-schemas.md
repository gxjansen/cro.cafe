# Content Schema Definitions

This guide defines the Zod schemas for all content collections in the CRO.CAFE project.

## Episode Schema

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const episodeSchema = defineCollection({
  type: 'content',
  schema: z.object({
    // Required RSS feed data
    title: z.string(),
    pubDate: z.date(),
    season: z.number(),
    episode: z.number(),
    description: z.string(),
    audioUrl: z.string().url(),
    duration: z.string(),
    episodeType: z.enum(['normal', 'trailer', 'bonus']),
    
    // Additional metadata
    language: z.enum(['en', 'de', 'es', 'nl']),
    shortId: z.string(),
    overallNumber: z.number(),
    isBonus: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    
    // Relations
    host: z.array(z.string()),
    guests: z.array(z.string()).optional(),
    
    // SEO & Display
    intro: z.string().max(160),
    image: z.string().optional(),
    youtubeEmbed: z.string().optional(),
    transcript: z.string().optional(),
    
    // Additional content
    shownotes: z.string().optional(),
    tags: z.array(z.string()).default([]),
  })
});

## Guest Schema

```typescript
const guestSchema = defineCollection({
  type: 'content',
  schema: z.object({
    // Basic information
    name: z.string(),
    language: z.enum(['en', 'de', 'es', 'nl']),
    title: z.string(),
    company: z.string(),
    
    // Profile content
    bio: z.string(),
    shortBio: z.string().max(160),
    image: z.string(),
    
    // Social links
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    website: z.string().url().optional(),
    
    // Relations
    episodes: z.array(z.string()),
    
    // SEO
    canonicalLanguage: z.enum(['en', 'de', 'es', 'nl']).optional(),
    canonicalSlug: z.string().optional(),
  })
});

## Quote Schema

```typescript
const quoteSchema = defineCollection({
  type: 'content',
  schema: z.object({
    // Quote content
    text: z.string(),
    language: z.enum(['en', 'de', 'es', 'nl']),
    
    // Attribution
    author: z.string(),
    company: z.string(),
    title: z.string().optional(),
    
    // Display
    isFeatured: z.boolean().default(false),
    
    // Translation reference
    originalLanguage: z.enum(['en', 'de', 'es', 'nl']).optional(),
    originalId: z.string().optional(),
  })
});

## Brand Schema

```typescript
const brandSchema = defineCollection({
  type: 'content',
  schema: z.object({
    // Brand information
    name: z.string(),
    website: z.string().url(),
    logo: z.string(),
    
    // Display
    isFeatured: z.boolean().default(false),
    displayOrder: z.number().default(0),
  })
});

## Platform Schema

```typescript
const platformSchema = defineCollection({
  type: 'data', // JSON collection
  schema: z.object({
    // Platform information
    name: z.string(),
    icon: z.string(),
    
    // Language-specific URLs
    urls: z.object({
      en: z.string().url().optional(),
      de: z.string().url().optional(),
      es: z.string().url().optional(),
      nl: z.string().url().optional(),
    }),
    
    // Display
    isPopular: z.boolean().default(false),
    displayOrder: z.number().default(0),
  })
});

## Collection Configuration

```typescript
export const collections = {
  episodes: episodeSchema,
  guests: guestSchema,
  quotes: quoteSchema,
  brands: brandSchema,
  platforms: platformSchema,
};
```

## Implementation Notes

### File Naming Conventions

1. **Episodes**
```
episodes/{language}/season-{number}/{episode-slug}.mdx
```

2. **Guests**
```
guests/{language}/{guest-slug}.mdx
```

3. **Quotes**
```
quotes/{language}/{quote-id}.mdx
```

4. **Brands**
```
brands/{brand-slug}.mdx
```

5. **Platforms**
```
platforms/{platform-slug}.json
```

### Content Validation

1. **Required Fields**
- Ensure all required fields have values
- Validate URL formats
- Check image paths exist

2. **Relations**
- Verify episode-guest relationships
- Check language consistency
- Validate canonical references

3. **Language Support**
- Enforce valid language codes
- Check translation references
- Validate canonical URLs

### Example Usage

```typescript
// src/pages/[lang]/episodes/[...slug].astro
import { getCollection } from 'astro:content';

const episodes = await getCollection('episodes', ({ data }) => {
  return data.language === params.lang;
});

// Type-safe access to episode data
episodes.map(({ data }) => {
  const { title, pubDate, host, guests } = data;
  // ...
});
```

## Validation Checklist

- [ ] All schemas compile without errors
- [ ] Required fields properly enforced
- [ ] URL formats validated
- [ ] Language codes restricted to supported values
- [ ] Relations properly typed
- [ ] File naming conventions followed
- [ ] Content query examples working
