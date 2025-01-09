import { exec } from 'child_process';
import type { ExecException } from 'child_process';
import {
  importEpisodes,
  importPeople,
  importPlatforms,
  importQuotes,
} from '../src/utils/data-import.ts';

import * as fs from 'fs';

interface LanguageConfig {
  code: string;
  dirName: string;
  fileNames: {
    people: string;
    episodes: string;
    platforms: string;
    quotes: string;
  };
}

const LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    dirName: 'English',
    fileNames: {
      people: 'CRO.CAFE - People.csv',
      episodes: 'CRO.CAFE - Episodes.csv',
      platforms: 'CRO.CAFE - Platforms.csv',
      quotes: 'CRO.CAFE - Quotes.csv',
    },
  },
  {
    code: 'nl',
    dirName: 'Dutch',
    fileNames: {
      people: 'CRO.CAFE Nederlands - Gasten.csv',
      episodes: 'CRO.CAFE Nederlands - Afleveringen (1).csv',
      platforms: 'CRO.CAFE Nederlands - Platforms.csv',
      quotes: 'CRO.CAFE Nederlands - Quotes.csv',
    },
  },
  {
    code: 'de',
    dirName: 'German',
    fileNames: {
      people: 'CRO.CAFE Deutsch - People.csv',
      episodes: 'CRO.CAFE Deutsch - Episodes.csv',
      platforms: 'CRO.CAFE Deutsch - Platforms.csv',
      quotes: 'CRO.CAFE Deutsch - Quotes.csv',
    },
  },
  {
    code: 'es',
    dirName: 'Spanish',
    fileNames: {
      people: 'CRO.CAFE Español - People.csv',
      episodes: 'CRO.CAFE Español - Episodes.csv',
      platforms: 'CRO.CAFE Español - Platforms.csv',
      quotes: 'CRO.CAFE Español - Quotes.csv',
    },
  },
];

async function cleanAndImportContent(targetLanguage?: string) {
  const cleanScript = './scripts/clean-csv.ts';
  await new Promise<void>((resolve, reject) => {
    exec(`npx tsx ${cleanScript}`, (error: ExecException | null) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

  const languagesToProcess = targetLanguage
    ? LANGUAGES.filter((lang) => lang.code === targetLanguage)
    : LANGUAGES;

  if (targetLanguage && languagesToProcess.length === 0) {
    console.error(
      `Error: Invalid language code "${targetLanguage}". Valid codes are: ${LANGUAGES.map((l) => l.code).join(', ')}`
    );
    return;
  }

  // Then import the cleaned files
  for (const lang of languagesToProcess) {
    try {
      console.log(`Processing ${lang.dirName}...`);

      // Import people first as they're referenced by episodes and quotes
      const peoplePath = `project/current-site-data/${lang.dirName}/cleaned/${lang.fileNames.people}`;
      if (!fs.existsSync(peoplePath)) {
        console.warn(`Warning: People file not found at ${peoplePath}`);
        continue;
      }
      await importPeople(peoplePath, lang.code);
      console.log(`✓ Imported people from ${peoplePath}`);

      const platformsPath = `project/current-site-data/${lang.dirName}/cleaned/${lang.fileNames.platforms}`;
      if (!fs.existsSync(platformsPath)) {
        console.warn(`Warning: Platforms file not found at ${platformsPath}`);
        continue;
      }
      await importPlatforms(platformsPath, lang.code);
      console.log(`✓ Imported platforms from ${platformsPath}`);

      const episodesPath = `project/current-site-data/${lang.dirName}/cleaned/${lang.fileNames.episodes}`;
      if (!fs.existsSync(episodesPath)) {
        console.warn(`Warning: Episodes file not found at ${episodesPath}`);
        continue;
      }
      await importEpisodes(episodesPath, lang.code);
      console.log(`✓ Imported episodes from ${episodesPath}`);

      const quotesPath = `project/current-site-data/${lang.dirName}/cleaned/${lang.fileNames.quotes}`;
      if (!fs.existsSync(quotesPath)) {
        console.warn(`Warning: Quotes file not found at ${quotesPath}`);
        continue;
      }
      await importQuotes(quotesPath, lang.code);
      console.log(`✓ Imported quotes from ${quotesPath}`);

      console.log(`✓ ${lang.dirName}: All content imported successfully`);
    } catch (error) {
      console.error(`Error importing ${lang.dirName} content:`, error);
    }
  }
}

// Get language from command line argument
const targetLanguage = process.argv[2];

if (targetLanguage) {
  console.log(`Importing content for language: ${targetLanguage}`);
} else {
  console.log('No language specified, importing content for all languages');
}

// Run the clean and import process
cleanAndImportContent(targetLanguage).catch(console.error);
