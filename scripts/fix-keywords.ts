import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// Language directories to process
const LANGUAGES = ['en', 'de', 'nl', 'es'];

async function fixKeywordsInEpisodes() {
  let totalFixed = 0;

  for (const lang of LANGUAGES) {
    const dir = join(process.cwd(), 'src', 'content', `${lang}-episodes`);

    try {
      console.log(`Processing ${lang.toUpperCase()} episodes...`);
      const files = await readdir(dir);

      let langFixed = 0;

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const filePath = join(dir, file);
        const content = await readFile(filePath, 'utf-8');
        const episode = JSON.parse(content);

        // Check if keywords is a string
        if (typeof episode.attributes.keywords === 'string') {
          // Convert to array
          if (!episode.attributes.keywords) {
            // Empty string becomes empty array
            episode.attributes.keywords = [];
            langFixed++;
          } else {
            // Non-empty string becomes array of trimmed keywords
            episode.attributes.keywords = episode.attributes.keywords
              .split(',')
              .map((keyword: string) => keyword.trim())
              .filter((keyword: string) => keyword.length > 0);
            langFixed++;
          }

          // Write the updated file
          await writeFile(filePath, JSON.stringify(episode, null, 2));
        }
      }

      console.log(`Fixed ${langFixed} episodes in ${lang.toUpperCase()}`);
      totalFixed += langFixed;
    } catch (error) {
      console.error(`Error processing ${lang} episodes:`, error);
    }
  }

  console.log(`\nTotal episodes fixed: ${totalFixed}`);
}

// Run the script
fixKeywordsInEpisodes().catch(console.error);
