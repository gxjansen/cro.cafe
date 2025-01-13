import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { transistorApi, SHOW_IDS, getLanguageFromShowId } from '../src/utils/transistor-api';
import type { TransistorEpisode } from '../src/types/transistor';

// Ensure content directory exists
async function ensureContentDirectory(language: string) {
  const dir = join(process.cwd(), 'src', 'content', `${language}-episodes`);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  return dir;
}

// Save episode to content collection
async function saveEpisode(episode: TransistorEpisode, language: string) {
  const dir = await ensureContentDirectory(language);
  const filePath = join(dir, `${episode.attributes.slug}.json`);
  await writeFile(filePath, JSON.stringify(episode, null, 2));
}

// Sync episodes for a show
async function syncShow(showId: string) {
  console.log(`Syncing show ${showId}...`);
  const language = getLanguageFromShowId(showId);

  try {
    const episodes = await transistorApi.getAllEpisodes(showId);

    // Save each episode
    for (const episode of episodes) {
      await saveEpisode(episode, language);
      console.log(`Saved episode: ${episode.attributes.title}`);
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
if (require.main === module) {
  syncAllShows();
}
