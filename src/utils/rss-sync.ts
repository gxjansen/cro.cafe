import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';
import { generateSlug } from './permalinks';
import type { Episode } from '../types';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Podcast RSS feed URLs
const RSS_FEEDS = {
  en: 'https://feeds.transistor.fm/cro-cafe',
  nl: 'https://feeds.transistor.fm/cro-cafe-nl',
  de: 'https://feeds.transistor.fm/cro-cafe-deutsch',
  es: 'https://feeds.transistor.fm/cro-cafe-es',
};

// Directory to save the CSV files
const CSV_DIR = path.join(__dirname, '..', '..', 'cline_docs', 'current-site-data');

// Ensure the content directory exists
function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Function to fetch and parse the RSS feed
async function fetchRSSFeed(url: string) {
  console.log(`Fetching RSS feed from: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Failed to fetch RSS feed: ${response.statusText}`);
    throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
  }
  const data = await response.text();
  console.log('RSS feed fetched successfully');
  console.log('Response data:', data.substring(0, 500)); // Log the first 500 characters of the response
  return new JSDOM(data, { contentType: 'text/xml' }).window.document;
}

// Function to create or update CSV files based on the RSS feed items
async function updateContentFromRSS() {
  try {
    console.log('Starting RSS sync process...');

    for (const [lang, feedUrl] of Object.entries(RSS_FEEDS)) {
      console.log(`Processing ${lang} feed: ${feedUrl}`);

      const langDir =
        lang === 'en' ? 'English' : lang === 'nl' ? 'Dutch' : lang === 'de' ? 'German' : 'Spanish';

      const csvDir = path.join(CSV_DIR, langDir);
      ensureDirectoryExists(csvDir);

      const doc = await fetchRSSFeed(feedUrl);
      const items = Array.from(doc.querySelectorAll('item'));
      console.log(`Found ${items.length} items in the ${lang} feed`);

      if (items.length === 0) {
        console.error(`No items found in the ${lang} feed. Check if the feed format is correct.`);
        continue;
      }

      // Create CSV content
      const csvRows = ['Title,Description,Date,Duration,Audio URL,YouTube URL'];

      // Helper functions
      const normalizeTitle = (title: string): string => {
        if (!title) return '';

        // Remove special characters and extra spaces
        return (
          title
            .toLowerCase()
            // Remove guest names after common prefixes
            .replace(/(?:with|met|:).*$/i, '')
            // Replace special chars with spaces
            .replace(/[^a-z0-9]+/g, ' ')
            // Remove common prefixes
            .replace(/^(?:emerce (?:conversion )?(?:livestream|interview):?\s*)/i, '')
            .trim()
        );
      };

      // Process all items and collect rows
      const newRows: string[] = [];
      for (const item of items) {
        const title = item.querySelector('title')?.textContent?.replace(/"/g, '""') || '';
        const description =
          item.querySelector('description')?.textContent?.replace(/"/g, '""') || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        const durationNode = Array.from(item.getElementsByTagName('*')).find(
          (node) => node.nodeName.toLowerCase() === 'itunes:duration'
        );
        const duration = durationNode?.textContent || '0';
        const audioUrl = item.querySelector('enclosure')?.getAttribute('url') || '';

        // Find existing episode by title
        const episodeDir = path.join('src', 'content', `${lang}-episodes`);
        const files = fs.readdirSync(episodeDir);
        const normalizedTitle = normalizeTitle(title);
        const shortSlug = generateSlug(title);
        const shortPath = path.join(episodeDir, `${shortSlug}.json`);

        let existingEpisode: Episode | null = null;
        let existingPath: string | null = null;

        // First check if short slug file exists
        if (fs.existsSync(shortPath)) {
          try {
            existingEpisode = JSON.parse(fs.readFileSync(shortPath, 'utf-8'));
            existingPath = shortPath;
          } catch (error) {
            console.error(`Error reading episode file ${shortPath}:`, error);
          }
        }

        // If not found by short slug, search by title
        if (!existingEpisode) {
          for (const file of files) {
            if (!file.endsWith('.json')) continue;
            const filePath = path.join(episodeDir, file);

            try {
              const episode = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
              if (normalizeTitle(episode.data.attributes.title) === normalizedTitle) {
                existingEpisode = episode;
                existingPath = filePath;
                break;
              }
            } catch (error) {
              console.error(`Error reading episode file ${file}:`, error);
            }
          }
        }

        // Update existing episode
        if (existingEpisode && existingPath) {
          const durationSeconds = Number(duration);
          console.log(`Duration for ${title}: ${duration} -> ${durationSeconds} seconds`);

          // Check if existingEpisode has the expected structure
          if (!existingEpisode?.data?.attributes) {
            console.error(`Episode file ${existingPath} has invalid structure`);
            continue;
          }

          // Create new episode object with updated duration
          const updatedEpisode: Episode = {
            id: shortSlug,
            collection: `${lang}-episodes`,
            data: {
              id: shortSlug,
              type: 'episode',
              attributes: {
                ...existingEpisode.data.attributes,
                title: existingEpisode.data.attributes.title || title,
                description: existingEpisode.data.attributes.description || description,
                duration: durationSeconds,
                media_url: existingEpisode.data.attributes.media_url || audioUrl,
              },
              relationships: existingEpisode.data.relationships || {},
            },
          };

          // If found by long slug, move to short slug
          if (existingPath !== shortPath) {
            fs.unlinkSync(existingPath);
            console.log(`Removed duplicate episode file: ${existingPath}`);
          }

          // Always write to short slug path
          fs.writeFileSync(shortPath, JSON.stringify(updatedEpisode, null, 2));
          console.log(
            `Updated episode at ${shortPath} (duration: ${updatedEpisode.data.attributes.duration}s)`
          );
        } else {
          // Add new episode to rows
          newRows.push(`"${title}","${description}","${pubDate}","${duration}","${audioUrl}",""`);
          console.log(`Created new episode: ${title}`);
        }
      }

      // Add any new episodes to the CSV and write file
      if (newRows.length > 0) {
        csvRows.push(...newRows);
        const csvPath = path.join(
          csvDir,
          `CRO.CAFE${lang === 'en' ? '' : ` ${langDir}`} - Episodes.csv`
        );
        fs.writeFileSync(csvPath, csvRows.join('\n'));
        console.log(`Updated CSV file: ${csvPath}`);
      }
    }
  } catch (error) {
    console.error('Error updating content from RSS feed:', error);
  }
}

// Main function to run the RSS sync
export async function main() {
  await updateContentFromRSS();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
