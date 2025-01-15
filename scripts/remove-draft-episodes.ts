import { readdir, readFile, unlink } from 'fs/promises';
import { join } from 'path';

const LANGUAGES = ['de', 'en', 'es', 'nl'];

async function removeDraftEpisodes() {
  let totalRemoved = 0;

  for (const lang of LANGUAGES) {
    const dir = join(process.cwd(), 'src', 'content', `${lang}-episodes`);
    console.log(`\nProcessing ${lang.toUpperCase()} episodes...`);

    try {
      const files = await readdir(dir);

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const filePath = join(dir, file);
        const content = await readFile(filePath, 'utf-8');
        const episode = JSON.parse(content);

        if (episode.attributes.status === 'draft') {
          await unlink(filePath);
          console.log(`Removed draft episode: ${episode.attributes.title}`);
          totalRemoved++;
        }
      }
    } catch (error) {
      console.error(`Error processing ${lang} episodes:`, error);
    }
  }

  console.log(`\nComplete! Removed ${totalRemoved} draft episodes.`);
}

// Run the script
removeDraftEpisodes().catch(console.error);
