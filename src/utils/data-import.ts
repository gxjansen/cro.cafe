import { parse } from 'csv-parse/sync';
import fs from 'fs';
import type { Episode, Person, Platform, Quote } from '../types';
import { generateSlug, validateSlug } from './permalinks';

const CSV_OPTIONS = {
  columns: true,
  skip_empty_lines: true,
  trim: true,
  delimiter: ',',
  relax_quotes: true,
  relax_column_count: true,
  bom: true,
};

// Define interfaces for CSV data
interface EpisodeCSV {
  Title: string;
  Description: string;
  Date: string;
  Duration: string;
  'Audio URL': string;
  'Transcript URL': string;
  Guests: string;
  Platforms: string;
  Quotes: string;
}

interface PersonCSV {
  Name: string;
  Role: string;
  Bio: string;
  'Image URL': string;
  'Social Links': string;
}

interface PlatformCSV {
  Name: string;
  Description: string;
  URL: string;
  'Icon URL': string;
}

interface QuoteCSV {
  Text: string;
  'Episode Title': string;
  'Timestamp (s)': string;
  'Guest Name': string;
}

// Type guards
function isPersonArray(data: unknown): data is Person[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item): item is Person =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        'name' in item &&
        'role' in item &&
        'bio' in item &&
        'image_url' in item &&
        'social_links' in item &&
        'language' in item &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.role === 'string' &&
        typeof item.bio === 'string' &&
        typeof item.image_url === 'string' &&
        Array.isArray(item.social_links) &&
        typeof item.language === 'string'
    )
  );
}

function isPlatformArray(data: unknown): data is Platform[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item): item is Platform =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        'name' in item &&
        'description' in item &&
        'url' in item &&
        'icon_url' in item &&
        'language' in item &&
        'type' in item &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.description === 'string' &&
        typeof item.url === 'string' &&
        typeof item.icon_url === 'string' &&
        typeof item.language === 'string' &&
        typeof item.type === 'string'
    )
  );
}

function isQuoteArray(data: unknown): data is Quote[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item): item is Quote =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        'text' in item &&
        'timestamp' in item &&
        'episode' in item &&
        'author' in item &&
        'language' in item &&
        'type' in item &&
        typeof item.id === 'string' &&
        typeof item.text === 'string' &&
        typeof item.timestamp === 'number' &&
        typeof item.language === 'string' &&
        typeof item.type === 'string' &&
        typeof item.episode === 'object' &&
        typeof item.author === 'object'
    )
  );
}

/**
 * Generate a unique slug for a given title and type
 * @param title The title to generate a slug from
 * @param type The content type (e.g., 'episodes', 'guests', 'quotes')
 * @param language The language code
 * @returns A unique slug
 */
function generateUniqueSlug(title: string, type: string, language: string): string {
  const slug = generateSlug(title);
  let counter = 1;
  let currentSlug = slug;

  // Keep trying until we find a unique slug
  while (!validateSlug(currentSlug, type, language)) {
    currentSlug = `${slug}-${counter}`;
    counter++;
  }

  return currentSlug;
}

export function importEpisodes(filePath: string): Episode[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log('Raw content from episodes CSV:', content);
    const episodes = parse(content, CSV_OPTIONS) as EpisodeCSV[];

    return episodes.map((episode) => {
      const title = episode.Title;
      if (!title) {
        throw new Error('Episode title is required');
      }

      const slug = generateUniqueSlug(title, 'episodes', 'en');

      // Parse and validate guests
      let guests: Person[] = [];
      try {
        const parsedGuests = JSON.parse(episode.Guests || '[]');
        if (!isPersonArray(parsedGuests)) {
          throw new Error(`Invalid JSON format for Guests in episode: ${title}`);
        }
        guests = parsedGuests;
      } catch (error) {
        console.error(`Error parsing guests for episode ${title}:`, error);
        guests = [];
      }

      // Parse and validate platforms
      let platforms: Platform[] = [];
      try {
        const parsedPlatforms = JSON.parse(episode.Platforms || '[]');
        if (!isPlatformArray(parsedPlatforms)) {
          throw new Error(`Invalid JSON format for Platforms in episode: ${title}`);
        }
        platforms = parsedPlatforms;
      } catch (error) {
        console.error(`Error parsing platforms for episode ${title}:`, error);
        platforms = [];
      }

      // Parse and validate quotes
      let quotes: Quote[] = [];
      try {
        const parsedQuotes = JSON.parse(episode.Quotes || '[]');
        if (!isQuoteArray(parsedQuotes)) {
          throw new Error(`Invalid JSON format for Quotes in episode: ${title}`);
        }
        quotes = parsedQuotes;
      } catch (error) {
        console.error(`Error parsing quotes for episode ${title}:`, error);
        quotes = [];
      }

      return {
        id: slug,
        title: title,
        description: episode.Description || '',
        date: new Date(episode.Date || new Date().toISOString()),
        duration: Number(episode.Duration || '0') * 60, // Convert minutes to seconds
        audio_url: episode['Audio URL'] || '',
        transcript_url: episode['Transcript URL'] || '',
        guests,
        platforms,
        quotes,
        language: 'en',
        type: 'podcast',
      };
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function importPeople(filePath: string): Person[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const people = parse(content, CSV_OPTIONS) as PersonCSV[];

    return people.map((person) => {
      if (!person.Name) {
        throw new Error('Person name is required');
      }

      const name = person.Name;
      const slug = generateUniqueSlug(name, 'guests', 'en');

      let socialLinks = [];
      try {
        socialLinks = JSON.parse(person['Social Links'] || '[]');
        if (!Array.isArray(socialLinks)) {
          throw new Error('Social links must be an array');
        }
      } catch (error) {
        console.error(`Error parsing social links for ${person.Name}:`, error);
        socialLinks = [];
      }

      return {
        id: slug,
        name: person.Name,
        role: person.Role || 'Guest',
        bio: person.Bio || '',
        image_url: person['Image URL'] || '',
        social_links: socialLinks,
        language: 'en',
        type: 'guest',
      };
    });
  } catch (error) {
    console.error(`Error reading CSV file at ${filePath}:`, error);
    throw error;
  }
}

export function importPlatforms(filePath: string): Platform[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const platforms = parse(content, CSV_OPTIONS) as PlatformCSV[];

    return platforms.map((platform) => {
      if (!platform.Name) {
        throw new Error('Platform name is required');
      }

      const name = platform.Name;
      const slug = generateUniqueSlug(name, 'platforms', 'en');

      return {
        id: slug,
        name: platform.Name,
        description: platform.Description || '',
        url: platform.URL || '',
        icon_url: platform['Icon URL'] || '',
        language: 'en',
        type: 'platform',
      };
    });
  } catch (error) {
    console.error(`Error reading CSV file at ${filePath}:`, error);
    throw error;
  }
}

export function importQuotes(filePath: string): Quote[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const quotes = parse(content, CSV_OPTIONS) as QuoteCSV[];

    const people = importPeople('project/current-site-data/English/CRO.CAFE - People.csv');
    const episodes = importEpisodes('project/current-site-data/English/CRO.CAFE - Episodes.csv');

    return quotes.map((quote) => {
      if (!quote.Text) {
        throw new Error('Quote text is required');
      }
      if (!quote['Episode Title']) {
        throw new Error('Episode title is required');
      }
      if (!quote['Guest Name']) {
        throw new Error('Guest name is required');
      }

      const episodeTitle = quote['Episode Title'];
      const guestName = quote['Guest Name'];
      const quoteText = quote.Text;

      const slug = generateUniqueSlug(`${episodeTitle}-${quoteText}`, 'quotes', 'en');

      const author = people.find((person) => person.name === guestName);
      if (!author) {
        throw new Error(`Author not found for quote: ${quoteText}`);
      }

      const episode = episodes.find((ep) => ep.title === episodeTitle);
      if (!episode) {
        throw new Error(`Episode not found for quote: ${quoteText}`);
      }

      const timestamp = Number(quote['Timestamp (s)'] || '0');
      if (isNaN(timestamp)) {
        console.warn(`Invalid timestamp for quote: ${quoteText}, defaulting to 0`);
      }

      return {
        id: slug,
        text: quoteText,
        timestamp: isNaN(timestamp) ? 0 : timestamp,
        episode,
        author,
        language: 'en',
        type: 'quote',
      };
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
