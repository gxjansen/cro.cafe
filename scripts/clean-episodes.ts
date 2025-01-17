#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { generateSlug } from '../src/utils/permalinks';
import type { Episode } from '../src/types';

// Helper function to normalize title for comparison
const normalizeTitle = (title: string): string => {
  if (!title) return '';
  const [baseTitle = title] = title.split(/\s+(?:with|met)\s+/i);
  return baseTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
};

// Main cleanup function
async function cleanupEpisodes() {
  const episodeDir = path.join('src', 'content', 'en', 'episodes');
  const files = fs.readdirSync(episodeDir);

  // Group episodes by normalized title
  const episodeGroups = new Map<string, { files: string[]; episodes: Episode[] }>();

  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const filePath = path.join(episodeDir, file);

    try {
      const episode = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Episode;
      const normalizedTitle = normalizeTitle(episode.data.attributes.title);

      if (!episodeGroups.has(normalizedTitle)) {
        episodeGroups.set(normalizedTitle, { files: [], episodes: [] });
      }

      const group = episodeGroups.get(normalizedTitle)!;
      group.files.push(file);
      group.episodes.push(episode);
    } catch (error) {
      console.error(`Error reading episode file ${file}:`, error);
    }
  }

  // Process each group
  for (const [title, group] of episodeGroups) {
    if (group.files.length > 1) {
      console.log(`Found ${group.files.length} files for "${title}"`);

      // Find the episode with the most complete data
      const bestEpisode = group.episodes.reduce((best, current) => {
        const bestScore = Object.values(best.data.attributes).filter((v) => v).length;
        const currentScore = Object.values(current.data.attributes).filter((v) => v).length;
        return currentScore > bestScore ? current : best;
      });

      // Generate the correct short slug
      const shortSlug = generateSlug(bestEpisode.data.attributes.title);
      const shortPath = path.join(episodeDir, `${shortSlug}.json`);

      // Create updated episode with new ID
      const updatedEpisode: Episode = {
        id: shortSlug,
        collection: bestEpisode.collection,
        data: {
          id: shortSlug,
          type: 'episode',
          attributes: bestEpisode.data.attributes,
          relationships: bestEpisode.data.relationships,
        },
      };

      // Write the best episode to the short slug file
      fs.writeFileSync(shortPath, JSON.stringify(updatedEpisode, null, 2));
      console.log(`Wrote merged episode to ${shortPath}`);

      // Remove all other files for this episode
      for (const file of group.files) {
        const filePath = path.join(episodeDir, file);
        if (filePath !== shortPath) {
          fs.unlinkSync(filePath);
          console.log(`Removed duplicate file: ${file}`);
        }
      }
    }
  }

  console.log('\nCleanup complete. Running RSS sync to update durations...\n');

  // Run the RSS sync to update durations
  const { main } = await import('../src/utils/rss-sync.js');
  await main();
}

// Run the cleanup
cleanupEpisodes().catch(console.error);
