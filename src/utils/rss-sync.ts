import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// RSS feed URL for testing
const RSS_FEED_URL = 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml';

// Directory to save the content
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'rss');

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

// Function to create or update content files based on the RSS feed items
async function updateContentFromRSS() {
  try {
    console.log('Starting RSS sync process...');
    ensureDirectoryExists(CONTENT_DIR);

    const doc = await fetchRSSFeed(RSS_FEED_URL);
    console.log('Parsing RSS feed items');
    const items = Array.from(doc.querySelectorAll('item'));
    console.log(`Found ${items.length} items in the RSS feed`);

    if (items.length === 0) {
      console.error('No items found in the RSS feed. Check if the feed format is correct.');
      return;
    }

    items.forEach((item: Element, index: number) => {
      const title = item.querySelector('title')?.textContent || `RSS Item ${index + 1}`;
      const link = item.querySelector('link')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();

      const slug = title
        .toLowerCase()
        .replace(/[\s/\\,:-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const filePath = path.join(CONTENT_DIR, `${slug}.md`);

      const fileContent = `---
title: "${title}"
description: "${description}"
pubDate: "${pubDate}"
---

# ${title}

${description}

**Read more:** [Link](${link})`;

      try {
        fs.writeFileSync(filePath, fileContent);
        console.log(`Updated/Created content file: ${filePath}`);
      } catch (writeError) {
        console.error(`Error writing file ${filePath}:`, writeError);
      }
    });
  } catch (error) {
    console.error('Error updating content from RSS feed:', error);
  }
}

// Main function to run the RSS sync
async function main() {
  await updateContentFromRSS();
}

main();
