#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import DOMPurify from 'isomorphic-dompurify';

const LANGUAGES = ['en', 'nl', 'de', 'es'];

// Helper function to clean content
function cleanContent(text: string): string {
  if (!text) return '';

  // First remove HTML comments and their content
  const withoutComments = text.replace(/<!--[\s\S]*?-->/g, '');
  // Then sanitize the HTML
  const sanitized = DOMPurify.sanitize(withoutComments, { ALLOWED_TAGS: [] });

  // Remove timestamps (e.g., "00:00 - ", "(00:00) - ")
  const withoutTimestamps = sanitized.replace(/(?:\d{2}:\d{2}|\(\d{2}:\d{2}\))\s*-\s*/g, '');

  // Find where guest information starts
  const guestMarkers = ['Guest 1:', 'Guest:', ' Guest 1 ', ' Guest '];
  let earliestIndex = withoutTimestamps.length;

  for (const marker of guestMarkers) {
    const index = withoutTimestamps.indexOf(marker);
    if (index !== -1 && index < earliestIndex) {
      earliestIndex = index;
    }
  }

  // Cut off the text at the earliest guest marker
  let cleanedText = withoutTimestamps.substring(0, earliestIndex).trim();

  // Remove any remaining URLs and normalize whitespace
  return cleanedText
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
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
        const attrs = episode.attributes;

        // Clean both formatted_summary and formatted_description
        const cleanedSummary = attrs.formatted_summary ? cleanContent(attrs.formatted_summary) : '';
        const cleanedDescription = attrs.formatted_description
          ? cleanContent(attrs.formatted_description)
          : '';

        // Use the longer cleaned text to avoid duplicate content
        episode.attributes.clean_description =
          cleanedSummary.length >= cleanedDescription.length ? cleanedSummary : cleanedDescription;
        fs.writeFileSync(filePath, JSON.stringify(episode, null, 2));
        console.log(`Updated ${lang} episode: ${file}`);
      } catch (error) {
        console.error(`Error processing ${lang} episode ${file}:`, error);
      }
    }
  }
}

// Run the script
addCleanDescriptions().catch(console.error);
