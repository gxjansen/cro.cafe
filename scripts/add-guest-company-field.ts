import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface GuestCSV {
  Name: string;
  Slug: string;
  'Company name': string;
}

interface GuestJSON {
  id: string;
  name: string;
  role?: string;
  bio?: string;
  image_url?: string;
  company?: string; // New field
  social_links?: Array<{
    platform: string;
    url: string;
  }>;
  language: string;
  type: 'guest';
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
      
      // Check if file exists
      try {
        await fs.access(csvPath);
      } catch (error) {
        console.warn(`CSV file not found: ${csvPath}`);
        continue;
      }
      
      const guests = await readCSV(csvPath);
      console.log(`Read ${guests.length} guests from ${csvPath}`);

      // Create a map of slug to company name
      const companyMap = new Map<string, string>();
      for (const guest of guests) {
        if (guest['Company name']) {
          companyMap.set(guest.Slug, guest['Company name']);
          console.log(`Found company for ${guest.Name}: ${guest['Company name']}`);
        }
      }

      console.log(`Found ${companyMap.size} guests with company information`);

      // Update JSON files
      const guestsDir = path.join('src', 'content', `${lang}-guests`);
      
      // Check if directory exists
      try {
        await fs.access(guestsDir);
      } catch (error) {
        console.warn(`Guest directory not found: ${guestsDir}`);
        continue;
      }
      
      const files = await fs.readdir(guestsDir);
      let updatedCount = 0;

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const filePath = path.join(guestsDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const guestData = JSON.parse(content) as GuestJSON;
        const slug = file.replace('.json', '');

        // Get company name from map
        const companyName = companyMap.get(slug);
        if (companyName) {
          guestData.company = companyName;

          // Write updated guest data
          await fs.writeFile(filePath, JSON.stringify(guestData, null, 2) + '\n', 'utf-8');
          console.log(`Updated company for ${guestData.name} (${lang}): ${companyName}`);
          updatedCount++;
        }
      }

      console.log(`Updated ${updatedCount} guests for language: ${lang}`);
    } catch (error) {
      console.error(`Error processing ${lang} guests:`, error);
    }
  }
}

// Run the update
updateGuestFiles().catch(console.error);