# Guest Company Field Implementation Plan

## Current State
- Guest information was imported from CSV files like `cline_docs/current-site-data/English/CRO.CAFE - People.csv`
- The company information was not included during this import process
- Guest data is stored in language-specific collections (e.g., `en-guests`, `de-guests`, etc.)
- The CSV files contain a "Company name" column with company information for most guests

## Requirements
- Add a "company" field to all guest entries across all languages
- Ensure the schema is updated to include this field
- Update any components that display guest information to show the company field

## Implementation Approach

After investigating the codebase, we've determined that Option 2 (Supplemental Update Script) is the best approach:
- It's less risky than modifying and re-running the entire import process
- It's more efficient and less error-prone than manual updates
- It can be run as needed without affecting other data
- We can use the existing `update-guest-social-links.ts` script as a template

## Detailed Implementation Steps

### 1. Update Guest Schema
Update the guest schema in `src/content/config.ts` to include a "company" field:

```typescript
// Guest collection schema
const guestCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    role: z.string().optional(),
    bio: z.string().optional(),
    image_url: z.string(),
    company: z.string().optional(), // Add this line
    social_links: z
      .array(
        z.object({
          platform: z.string(),
          url: z.string(),
        })
      )
      .optional(),
    language: z.string(),
    type: z.literal('guest'),
  }),
});
```

### 2. Create Update Script
Create a new script at `scripts/add-guest-company-field.ts` based on the `update-guest-social-links.ts` script:

```typescript
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
      if (!fs.existsSync(csvPath)) {
        console.warn(`CSV file not found: ${csvPath}`);
        continue;
      }
      
      const guests = await readCSV(csvPath);

      // Create a map of slug to company name
      const companyMap = new Map<string, string>();
      for (const guest of guests) {
        if (guest['Company name']) {
          companyMap.set(guest.Slug, guest['Company name']);
        }
      }

      // Update JSON files
      const guestsDir = path.join('src', 'content', `${lang}-guests`);
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
```

### 3. Update Guest Card Component
Update the `GuestCard.astro` component to display the company field:

```diff
<div class="flex-grow">
  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">{role}</p>
+ {company && (
+   <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{company}</p>
+ )}
  {showBio && bio && (
    <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">{bio}</p>
  )}
</div>
```

### 4. Update Guest Detail Page
Update the guest detail page to show the company information:

```diff
<div class="guest-profile">
  <h1 class="text-3xl font-bold">{name}</h1>
  <p class="text-xl text-gray-600 dark:text-gray-400">{role}</p>
+ {company && (
+   <p class="text-lg text-gray-600 dark:text-gray-400 mt-1">{company}</p>
+ )}
  {bio && (
    <div class="mt-4 prose dark:prose-invert">
      <p>{bio}</p>
    </div>
  )}
</div>
```

### 5. Execution Plan
1. Switch to Code mode
2. Update the guest schema in `src/content/config.ts`
3. Create the `add-guest-company-field.ts` script
4. Run the script to update all guest entries
5. Update the `GuestCard.astro` component
6. Update the guest detail page
7. Test the changes in the UI

## Potential Challenges and Solutions
- **Name matching between CSV and JSON files**: The script uses slugs for matching, which should be reliable
- **Missing company information**: The script only updates guests with company information in the CSV
- **Varying formats across languages**: The script handles each language separately, so format differences should be manageable

## Fallback Plan
If the automated approach encounters issues, we can fall back to a semi-automated approach:
1. Generate a spreadsheet of all guests and their current data
2. Add company information manually to this spreadsheet
3. Use a script to update the JSON files based on the spreadsheet