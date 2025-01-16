import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const LANGUAGE_DIRS = [
  'src/content/en-episodes',
  'src/content/nl-episodes',
  'src/content/de-episodes',
  'src/content/es-episodes',
];

interface Guest {
  name: string;
  slug: string;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

function cleanGuestName(name: string): string {
  // Remove any text after certain stop words
  const stopWords = ['from', 'at', 'about', 'is', 'and', 'we', 'with', 'of', 'runs', 'founder'];
  for (const word of stopWords) {
    const regex = new RegExp(`\\s+${word}\\s+.*$`, 'i');
    name = name.replace(regex, '');
  }

  // Remove parenthetical descriptions
  name = name.replace(/\s*\([^)]*\)/g, '');

  // Remove anything after a comma
  name = name.replace(/\s*,.*$/, '');

  // Remove any leading/trailing non-word characters
  name = name.replace(/^[^a-zA-ZÀ-ÿ]+/, '').replace(/[^a-zA-ZÀ-ÿ]+$/, '');

  // Ensure proper capitalization while preserving special characters
  name = name
    .split(/\s+/)
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ''))
    .filter(Boolean)
    .join(' ');

  return name.trim();
}

export function extractGuests(description: string): { guests: Guest[]; cleanDescription: string } {
  const guests: Guest[] = [];
  let cleanDescription = description;

  if (!description) {
    return { guests, cleanDescription };
  }

  try {
    // First try to extract content between GUESTS comments
    const guestsMatch = description.match(
      /<!--\s*GUESTS\s+START\s*-->([\s\S]*?)<!--\s*GUESTS\s+END\s*-->/i
    );
    const guestsContent = guestsMatch?.[1]?.trim() || description;

    // Normalize line endings
    const normalizedContent = guestsContent.replace(/\r\n/g, '\n');

    // Split by pipe for multiple guests
    const guestSections = normalizedContent.split('|').map((section) => section.trim());

    for (const section of guestSections) {
      // Match guest information in various formats
      const guestMatch = section.match(
        /Guest(?:\s*\d+)?:\s*([^\n]+)\s*\n\s*URL:\s*(https:\/\/[^\s\n]+)/i
      );

      if (guestMatch?.[1] && guestMatch?.[2]) {
        const name = cleanGuestName(guestMatch[1]);
        const url = guestMatch[2].trim();

        if (!name || !url) {
          console.log('Skipping guest due to missing name or URL:', { name, url });
          continue;
        }

        console.log('Found guest:', { name, url });

        // Extract slug from URL
        const slugMatch = url.match(/\/(?:guest|gast|invitados)\/([^/?#\n]+)/);
        if (slugMatch?.[1]) {
          const slug = slugMatch[1];
          if (slug && !guests.some((g) => g.slug === slug)) {
            guests.push({ name, slug });
            console.log('Added guest:', { name, slug });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error extracting guests:', error);
  }

  return { guests, cleanDescription };
}

function processEpisodeFile(filePath: string): void {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const episode = JSON.parse(content);

    console.log('\nProcessing:', filePath);

    // Extract guests from description since that's where the guest info is stored
    const description = episode.attributes?.description || '';
    const { guests, cleanDescription } = extractGuests(description);

    if (guests.length > 0) {
      console.log(`Found ${guests.length} guests:`, guests);
    }

    // Update episode with guest information
    if (episode.attributes) {
      episode.attributes.guests = guests;
      episode.attributes.clean_description = cleanDescription;

      // Write the updated episode back to file
      writeFileSync(filePath, JSON.stringify(episode, null, 2));
      console.log(`Processed ${filePath}: Found ${guests.length} guests`);
    } else {
      console.error(`No attributes found in episode file: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Process all episode files in all language directories
for (const dir of LANGUAGE_DIRS) {
  try {
    const episodeFiles = readdirSync(dir).filter((file) => file.endsWith('.json'));
    console.log(`\nFound ${episodeFiles.length} episode files to process in ${dir}`);

    for (const file of episodeFiles) {
      processEpisodeFile(join(dir, file));
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error);
  }
}

console.log('\nGuest extraction complete!');
