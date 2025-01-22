import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { config } from 'dotenv';
import { getTransistorApi, SHOW_IDS, getLanguageFromShowId } from '../src/utils/transistor-api.ts';
import type { TransistorEpisode } from '../src/types/transistor';
import { extractGuests } from './extract-guests.ts';

// Load environment variables
config();

// Get API instance
const transistorApi = getTransistorApi();

// Ensure content directory exists
async function ensureContentDirectory(language: string) {
  const dir = join(process.cwd(), 'src', 'content', `${language}-episodes`);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  return dir;
}

// Process and save episode to content collection
async function saveEpisode(episode: TransistorEpisode, language: string) {
  const dir = await ensureContentDirectory(language);
  const filePath = join(dir, `${episode.attributes.slug}.json`);

  // Extract guests from description first (for names)
  const { guests: descriptionGuests } = extractGuests(episode.attributes.description || '');

  // Then extract from formatted_summary (for URLs)
  const { guests: summaryGuests, cleanDescription } = extractGuests(
    episode.attributes.formatted_summary || ''
  );

  // Combine guests from both sources, preferring summaryGuests if available
  const allGuests = [...descriptionGuests];
  for (const summaryGuest of summaryGuests) {
    if (!allGuests.some((g) => g.slug === summaryGuest.slug)) {
      allGuests.push(summaryGuest);
    }
  }

  if (allGuests.length > 0) {
    console.log(`Found ${allGuests.length} guests:`, allGuests);
  }

  // Update episode with guest information and clean description
  episode.attributes.guests = allGuests;
  episode.attributes.clean_description = cleanDescription;

  await writeFile(filePath, JSON.stringify(episode, null, 2));
}

// Sync episodes for a show
async function syncShow(showId: string) {
  console.log(`Syncing show ${showId}...`);
  const language = getLanguageFromShowId(showId);

  try {
    const episodes = await transistorApi.getAllEpisodes(showId);

    // Save only published episodes
    for (const episode of episodes) {
      if (episode.attributes.status === 'published') {
        await saveEpisode(episode, language);
        console.log(`Saved published episode: ${episode.attributes.title}`);
      } else {
        console.log(`Skipped non-published episode: ${episode.attributes.title}`);
      }
    }
  } catch (error) {
    console.error(`Error syncing show ${showId}:`, error);
    throw error;
  }
}

// Main sync function
async function syncAllShows() {
  try {
    for (const [language, showId] of Object.entries(SHOW_IDS)) {
      console.log(`\nSyncing ${language.toUpperCase()} show...`);
      await syncShow(showId);
    }
    console.log('\nSync completed successfully!');
  } catch (error) {
    console.error('Sync failed:', error);
    process.exit(1);
  }
}

// Run sync if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  // Check if a specific episode ID is provided
  const episodeId = process.argv[2];
  if (episodeId) {
    // Sync a single episode
    const showId = SHOW_IDS['en']; // Default to English show
    transistorApi
      .getEpisode(episodeId)
      .then(async (episode) => {
        if (episode) {
          await saveEpisode(episode, 'en');
          console.log('Single episode sync completed!');
        }
      })
      .catch((error) => {
        console.error('Failed to sync episode:', error);
        process.exit(1);
      });
  } else {
    // Sync all episodes
    syncAllShows()
      .then(() => {
        process.exit(0);
      })
      .catch((error) => {
        console.error('Failed to sync all episodes:', error);
        process.exit(1);
      });
  }
}

export { saveEpisode };
