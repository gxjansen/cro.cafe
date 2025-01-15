# Data Import Guide

This guide explains how to import podcast episode data using the Transistor API into the CRO.CAFE content collections.

## Transistor API Integration

### Shows

The CRO.CAFE podcast consists of four shows in different languages:

- English: CRO.CAFE (Show ID: 1234)
- Dutch: CRO.CAFE NL (Show ID: 5678)
- German: CRO.CAFE Deutsch (Show ID: 9012)
- Spanish: CRO.CAFE ES (Show ID: 3456)

### Episode Data Structure

We use the exact same field names as the Transistor API to maintain consistency:

```typescript
interface Episode {
  id: string; // Transistor episode ID
  title: string; // Episode title
  number: number; // Episode number in show
  season: number; // Season number
  status: 'published' | 'draft' | 'scheduled';
  published_at: string; // ISO date string
  duration: number; // Duration in seconds
  summary: string; // Short description
  description: string; // Full description/show notes
  media_url: string; // Audio file URL
  share_url: string; // Public sharing URL
  embed_html: string; // Embed player HTML
  embed_url: string; // Embed player URL
  image_url: string; // Episode artwork URL
  type: 'full' | 'trailer' | 'bonus';
  keywords: string[]; // Episode tags/keywords
}
```

### Sync Script

```typescript
// scripts/sync-episodes.ts
import { TransistorClient } from '../src/utils/transistor-api';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const SHOWS = {
  en: { id: '1234', language: 'en' },
  nl: { id: '5678', language: 'nl' },
  de: { id: '9012', language: 'de' },
  es: { id: '3456', language: 'es' },
};

async function syncEpisodes() {
  const client = new TransistorClient(process.env.TRANSISTOR_API_KEY);

  for (const [lang, show] of Object.entries(SHOWS)) {
    console.log(`Syncing ${lang} episodes...`);

    const episodes = await client.getEpisodes(show.id);

    for (const episode of episodes) {
      // Create MDX content with Transistor field names
      const content = `---
id: ${episode.id}
title: ${episode.title}
number: ${episode.number}
season: ${episode.season}
status: ${episode.status}
published_at: ${episode.published_at}
duration: ${episode.duration}
summary: ${episode.summary}
media_url: ${episode.media_url}
share_url: ${episode.share_url}
embed_html: ${episode.embed_html}
embed_url: ${episode.embed_url}
image_url: ${episode.image_url}
type: ${episode.type}
keywords: ${JSON.stringify(episode.keywords)}
language: ${show.language}
---

${episode.description}
`;

      // Save to file using Transistor ID as filename
      const dir = join('src/content/episodes', lang, `season-${episode.season}`);
      await writeFile(join(dir, `${episode.id}.mdx`), content);
    }
  }
}

// Run sync
syncEpisodes().catch(console.error);
```

### Webhook Integration

We use Netlify Functions to handle Transistor webhooks for real-time updates:

```typescript
// netlify/functions/transistor-webhook.ts
import { Handler } from '@netlify/functions';
import { TransistorWebhookPayload } from '../../src/types/transistor';

export const handler: Handler = async (event) => {
  const payload = JSON.parse(event.body!) as TransistorWebhookPayload;

  // Trigger site rebuild when episodes are published/updated
  if (payload.event === 'episode.published' || payload.event === 'episode.updated') {
    await fetch(process.env.NETLIFY_BUILD_HOOK!, {
      method: 'POST',
    });
  }

  return {
    statusCode: 200,
  };
};
```

## Image Processing

Images are downloaded from Transistor's CDN and optimized:

```typescript
// scripts/process-images.ts
import sharp from 'sharp';
import { join } from 'path';
import { writeFile } from 'fs/promises';

async function processEpisodeImage(imageUrl: string, episodeId: string) {
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();

  // Process with sharp
  await sharp(buffer)
    .resize(800, 800, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toFile(join('public/images/episodes', `${episodeId}.webp`));
}
```

## Implementation Checklist

- [ ] Set up Transistor API key in environment variables
- [ ] Configure webhook endpoint in Transistor dashboard
- [ ] Create Netlify build hook for automated deploys
- [ ] Implement and test episode sync
- [ ] Set up image processing pipeline
- [ ] Configure error monitoring

## Error Recovery

1. Log all API operations
2. Implement retry logic for API requests
3. Validate webhook signatures
4. Monitor webhook delivery status
5. Keep backup of episode data

## Maintenance Notes

- Monitor Transistor API rate limits
- Check webhook delivery logs
- Verify image processing pipeline
- Update episode schemas if Transistor adds fields
- Monitor Netlify build minutes usage
