import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface GuestCSV {
  Name: string;
  Slug: string;
  'LinkedIn URL': string;
}

interface GuestJSON {
  id: string;
  name: string;
  role?: string;
  bio?: string;
  image_url?: string;
  social_links?: Array<{
    platform: string;
    url: string;
  }>;
}

const LANGUAGES = ['en', 'nl', 'de', 'es'];
const CSV_PATHS = {
  en: 'cline_docs/current-site-data/English/CRO.CAFE - People.csv',
  nl: 'cline_docs/current-site-data/Dutch/CRO.CAFE Nederlands - Gasten.csv',
  de: 'cline_docs/current-site-data/German/CRO.CAFE Deutsch - People.csv',
  es: 'cline_docs/current-site-data/Spanish/CRO.CAFE Español - People.csv',
};

async function readCSV(filePath: string): Promise<GuestCSV[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
    });
  } catch (error) {
    console.error(`Error reading CSV file ${filePath}:`, error);
    return [];
  }
}

async function updateGuestFiles() {
  for (const lang of LANGUAGES) {
    try {
      // Read CSV data
      const csvPath = CSV_PATHS[lang as keyof typeof CSV_PATHS];
      const guests = await readCSV(csvPath);

      // Create a map of slug to LinkedIn URL
      const guestMap = new Map<string, string>();
      for (const guest of guests) {
        if (guest['LinkedIn URL']) {
          guestMap.set(guest.Slug, guest['LinkedIn URL']);
        }
      }

      // Update JSON files
      const guestsDir = path.join('src', 'content', `${lang}-guests`);
      const files = await fs.readdir(guestsDir);

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const filePath = path.join(guestsDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const guestData = JSON.parse(content) as GuestJSON;
        const slug = file.replace('.json', '');

        // Get LinkedIn URL from map
        const linkedInUrl = guestMap.get(slug);
        if (linkedInUrl) {
          guestData.social_links = [
            {
              platform: 'linkedin',
              url: linkedInUrl,
            },
          ];

          // Write updated guest data
          await fs.writeFile(filePath, JSON.stringify(guestData, null, 2) + '\n', 'utf-8');
          console.log(`Updated social links for ${guestData.name} (${lang})`);
        }
      }
    } catch (error) {
      console.error(`Error processing ${lang} guests:`, error);
    }
  }
}

// Run the update
updateGuestFiles().catch(console.error);
