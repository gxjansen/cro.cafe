#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import DOMPurify from 'isomorphic-dompurify';

const LANGUAGES = ['en', 'nl', 'de', 'es'];

// Helper function to clean HTML content
function cleanDescription(html: string): string {
  // First remove HTML comments and their content
  const withoutComments = html.replace(/<!--[\s\S]*?-->/g, '');
  // Then sanitize the HTML
  const sanitized = DOMPurify.sanitize(withoutComments, { ALLOWED_TAGS: [] });
  // Remove URLs and "Shownotes:" text
  return sanitized
    .replace(/Shownotes:.*$/m, '') // Remove "Shownotes:" and everything after it on that line
    .replace(/https?:\/\/\S+/g, '') // Remove URLs
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

async function addCleanDescriptions() {
  for (const lang of LANGUAGES) {
    const episodeDir = path.join('src', 'content', `${lang}-episodes`);

    // Skip if directory doesn't exist
    if (!fs.existsSync(episodeDir)) {
      console.log(`Skipping ${lang}: directory ${episodeDir} does not exist`);
      continue;
    }

    const files = fs.readdirSync(episodeDir);

    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const filePath = path.join(episodeDir, file);

      try {
        const episode = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Add clean_description if it doesn't exist
        if (!episode.attributes.clean_description) {
          episode.attributes.clean_description = cleanDescription(episode.attributes.description);
          fs.writeFileSync(filePath, JSON.stringify(episode, null, 2));
          console.log(`Updated ${lang} episode: ${file}`);
        }
      } catch (error) {
        console.error(`Error processing ${lang} episode ${file}:`, error);
      }
    }
  }
}

// Run the script
addCleanDescriptions().catch(console.error);
