# Data Import Guide

This guide explains how to import data from RSS feeds and CSV files into the CRO.CAFE content collections.

## RSS Feed Import

### Feed URLs
- English: https://feeds.transistor.fm/cro-cafe
- Dutch: https://feeds.transistor.fm/cro-cafe-nl
- German: https://feeds.transistor.fm/cro-cafe-deutsch
- Spanish: https://feeds.transistor.fm/cro-cafe-es

### RSS Import Script

```typescript
// scripts/import/rss.ts
import { XMLParser } from 'fast-xml-parser';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { z } from 'zod';

// RSS Feed item schema
const RSSItemSchema = z.object({
  title: z.string(),
  'itunes:episode': z.string(),
  'itunes:season': z.string(),
  pubDate: z.string(),
  description: z.string(),
  'itunes:duration': z.string(),
  'itunes:episodeType': z.string(),
  enclosure: z.object({
    '@_url': z.string(),
  }),
});

interface FeedConfig {
  url: string;
  language: 'en' | 'de' | 'es' | 'nl';
}

const FEEDS: FeedConfig[] = [
  { url: 'https://feeds.transistor.fm/cro-cafe', language: 'en' },
  { url: 'https://feeds.transistor.fm/cro-cafe-nl', language: 'nl' },
  { url: 'https://feeds.transistor.fm/cro-cafe-deutsch', language: 'de' },
  { url: 'https://feeds.transistor.fm/cro-cafe-es', language: 'es' },
];

async function importRSSFeeds() {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });

  for (const feed of FEEDS) {
    console.log(`Importing ${feed.language} feed...`);
    
    // Fetch and parse feed
    const response = await fetch(feed.url);
    const xml = await response.text();
    const data = parser.parse(xml);
    
    // Process each item
    for (const item of data.rss.channel.item) {
      const parsed = RSSItemSchema.parse(item);
      
      // Generate slug from title
      const slug = parsed.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Extract episode ID from enclosure URL
      const episodeId = parsed.enclosure['@_url'].split('/').pop()?.slice(0, 8);
      
      // Create MDX content
      const content = `---
title: ${parsed.title}
pubDate: ${new Date(parsed.pubDate).toISOString()}
season: ${parseInt(parsed['itunes:season'])}
episode: ${parseInt(parsed['itunes:episode'])}
description: ${parsed.description}
audioUrl: ${parsed.enclosure['@_url']}
duration: ${parsed['itunes:duration']}
episodeType: ${parsed['itunes:episodeType']}
language: ${feed.language}
shortId: ${episodeId}
---

${parsed.description}
`;
      
      // Save to file
      const dir = join('src/content/episodes', feed.language, `season-${parsed['itunes:season']}`);
      await writeFile(join(dir, `${slug}.mdx`), content);
    }
  }
}

// Run import
importRSSFeeds().catch(console.error);
```

## CSV Data Import

### Available CSV Files
Located in `project/current-site-data/{Language}/`:
- Episodes.csv
- People.csv (Guests)
- Platforms.csv
- Quotes.csv
- Brand listeners.csv

### CSV Import Script

```typescript
// scripts/import/csv.ts
import { parse } from 'csv-parse/sync';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

interface CSVImportConfig {
  inputPath: string;
  outputPath: string;
  transform: (row: Record<string, string>) => Promise<string>;
}

async function importCSVData(config: CSVImportConfig) {
  // Read CSV file
  const content = await readFile(config.inputPath, 'utf-8');
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
  });

  // Process each row
  for (const row of records) {
    const transformed = await config.transform(row);
    const slug = row.Slug || generateSlug(row.Name || row.Title);
    await writeFile(join(config.outputPath, `${slug}.mdx`), transformed);
  }
}

// Example guest transform function
async function transformGuest(row: Record<string, string>) {
  return `---
name: ${row.Name}
title: ${row.Title}
company: ${row.Company}
language: ${row.Language}
bio: ${row.Bio}
shortBio: ${row.ShortBio || row.Bio.slice(0, 160)}
image: ${row.Image}
linkedin: ${row.LinkedIn || ''}
twitter: ${row.Twitter || ''}
website: ${row.Website || ''}
episodes: ${JSON.stringify(row.Episodes?.split(',') || [])}
---

${row.Bio}
`;
}

// Import guests for each language
const languages = ['en', 'de', 'es', 'nl'];
for (const lang of languages) {
  await importCSVData({
    inputPath: `project/current-site-data/${lang}/People.csv`,
    outputPath: `src/content/guests/${lang}`,
    transform: transformGuest,
  });
}
```

## Image Import

### Image Processing Script

```typescript
// scripts/import/images.ts
import sharp from 'sharp';
import { join } from 'path';
import { writeFile } from 'fs/promises';

async function downloadAndOptimizeImage(url: string, outputPath: string) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  
  // Process with sharp
  await sharp(buffer)
    .resize(800, 800, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toFile(outputPath);
}

// Example usage for guest images
async function processGuestImages() {
  const guests = await getCollection('guests');
  
  for (const guest of guests) {
    if (guest.data.image) {
      const outputPath = join(
        'src/assets/images/guests',
        `${guest.slug}.webp`
      );
      await downloadAndOptimizeImage(guest.data.image, outputPath);
    }
  }
}
```

## Validation & Error Handling

### Data Validation

```typescript
// scripts/import/validate.ts
import { getCollection } from 'astro:content';

async function validateContent() {
  // Check episodes
  const episodes = await getCollection('episodes');
  for (const episode of episodes) {
    // Verify audio URL is accessible
    const audioResponse = await fetch(episode.data.audioUrl);
    if (!audioResponse.ok) {
      console.error(`Invalid audio URL for ${episode.id}`);
    }
    
    // Check guest references exist
    if (episode.data.guests) {
      const guests = await getCollection('guests');
      for (const guestId of episode.data.guests) {
        if (!guests.find(g => g.id === guestId)) {
          console.error(`Invalid guest reference in ${episode.id}: ${guestId}`);
        }
      }
    }
  }
}
```

## Implementation Checklist

- [ ] Install required dependencies:
  ```bash
  npm install fast-xml-parser csv-parse sharp
  ```
- [ ] Create import scripts directory:
  ```bash
  mkdir -p scripts/import
  ```
- [ ] Implement and test RSS import
- [ ] Implement and test CSV import
- [ ] Implement and test image processing
- [ ] Run validation checks
- [ ] Set up GitHub Action for RSS sync
- [ ] Document any manual data cleanup needed

## Error Recovery

1. Keep backup of original data
2. Log all import operations
3. Implement retry logic for network requests
4. Validate output before overwriting existing files
5. Create rollback scripts if needed

## Maintenance Notes

- Run RSS sync hourly via GitHub Actions
- Manually trigger sync when needed
- Monitor error logs
- Periodically validate content integrity
- Update scripts when feed structure changes
