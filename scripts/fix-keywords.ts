import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface EpisodeContent {
  attributes: {
    keywords: string | string[];
    [key: string]: any;
  };
  [key: string]: any;
}

// Language directories to process
const langDirs = ['en-episodes', 'de-episodes', 'es-episodes', 'nl-episodes'];

// Process each language directory
langDirs.forEach((langDir) => {
  const dirPath = join('src/content', langDir);

  try {
    // Read all JSON files in the directory
    const files = readdirSync(dirPath).filter((file) => file.endsWith('.json'));

    files.forEach((file) => {
      const filePath = join(dirPath, file);

      try {
        // Read and parse the JSON file
        const content = JSON.parse(readFileSync(filePath, 'utf-8')) as EpisodeContent;

        // Convert keywords string to array
        if (content.attributes && typeof content.attributes.keywords === 'string') {
          // If empty string, convert to empty array
          if (content.attributes.keywords === '') {
            content.attributes.keywords = [];
          } else {
            // Split comma-separated string into array and trim whitespace
            content.attributes.keywords = content.attributes.keywords
              .split(',')
              .map((keyword: string) => keyword.trim());
          }

          // Write the updated content back to the file
          writeFileSync(filePath, JSON.stringify(content, null, 2));
          console.log(`Updated keywords in ${filePath}`);
        }
      } catch (err) {
        console.error(`Error processing file ${filePath}:`, err);
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${dirPath}:`, err);
  }
});

console.log('Finished updating keywords fields');
