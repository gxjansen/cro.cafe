import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';
import type { Episode, Person, Platform, Quote } from '../types';
import { generateSlug } from './permalinks';
import { downloadImage } from './images';

const CSV_OPTIONS = {
  columns: true,
  skip_empty_lines: true,
  trim: true,
  delimiter: ',',
  relax_quotes: true,
  relax_column_count: true,
  bom: true,
};

// Define interfaces for CSV data with language-specific column names
interface BaseCSV {
  [key: string]: string;
}

interface EpisodeCSV extends BaseCSV {
  Title?: string;
  Título?: string; // Spanish
  Titel?: string; // German/Dutch
  Description?: string;
  Descripción?: string; // Spanish
  Beschreibung?: string; // German
  Beschrijving?: string; // Dutch
  Date?: string;
  Fecha?: string; // Spanish
  Datum?: string; // German/Dutch
  Duration?: string;
  Duración?: string; // Spanish
  Dauer?: string; // German
  Duur?: string; // Dutch
  'Audio URL'?: string;
  'Transcript URL'?: string;
  'YouTube URL'?: string;
  'Youtube URL'?: string;
  'Main Image'?: string;
  'Main image'?: string;
  Image?: string;
  'Show Notes'?: string;
  'Show notes'?: string;
  Notes?: string;
}

interface PersonCSV extends BaseCSV {
  Name?: string;
  Nombre?: string; // Spanish
  Role?: string;
  Rol?: string; // Spanish
  Rolle?: string; // German
  Bio?: string;
  Biografía?: string; // Spanish
  Biografie?: string; // German/Dutch
  'Image URL'?: string;
  'URL de imagen'?: string; // Spanish
  'Bild URL'?: string; // German
  'Afbeelding URL'?: string; // Dutch
  'Social Links'?: string;
  'Enlaces sociales'?: string; // Spanish
  'Soziale Links'?: string; // German
  'Sociale links'?: string; // Dutch
  Picture?: string; // Alternative image field
}

interface PlatformCSV extends BaseCSV {
  Name?: string;
  Nombre?: string; // Spanish
  Description?: string;
  Descripción?: string; // Spanish
  Beschreibung?: string; // German
  Beschrijving?: string; // Dutch
  URL?: string;
  'Icon URL'?: string;
  'URL del icono'?: string; // Spanish
  'Bild Icon URL'?: string; // German
  'Icoon URL'?: string; // Dutch
}

interface QuoteCSV extends BaseCSV {
  Text?: string;
  Texto?: string; // Spanish
  'Episode Title'?: string;
  'Título del episodio'?: string; // Spanish
  Episodentitel?: string; // German
  'Aflevering titel'?: string; // Dutch
  'Timestamp (s)'?: string;
  'Guest Name'?: string;
  'Nombre del invitado'?: string; // Spanish
  Gastname?: string; // German
  Gastnaam?: string; // Dutch
}

// Helper function to get value from multilingual fields
function getFieldValue(data: BaseCSV, fields: string[]): string {
  for (const field of fields) {
    if (data[field]) {
      return data[field];
    }
  }
  return '';
}

// Helper function to write content files
function writeContentFile(
  data: Episode | Person | Platform | Quote,
  type: string,
  language: string
) {
  const contentDir = `src/content/${language}/${type}`;
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
  fs.writeFileSync(`${contentDir}/${data.id}.json`, JSON.stringify(data, null, 2));
}

function generateUniqueSlug(title: string, _type: string, _language: string): string {
  return generateSlug(title);
}

// Helper function to parse duration from RSS feed (always in seconds)
function parseDuration(duration: string): number {
  if (!duration?.trim()) return 0;

  // Convert duration string to number
  const seconds = Number(duration.trim());
  if (!isNaN(seconds)) {
    return Math.floor(seconds);
  }

  try {
    // If direct conversion fails, try parsing time format (HH:MM:SS)
    const parts = duration.split(':').map((part) => {
      const num = Number(part?.trim() || '0');
      return isNaN(num) ? 0 : num;
    });

    if (parts.length === 3) {
      return Math.floor((parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0));
    }
    if (parts.length === 2) {
      return Math.floor((parts[0] || 0) * 60 + (parts[1] || 0));
    }
  } catch (error) {
    console.error(`Error parsing duration "${duration}":`, error);
  }

  return 0;
}

export async function importEpisodes(filePath: string, language: string): Promise<Episode[]> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const episodes = parse(content, CSV_OPTIONS) as EpisodeCSV[];

    return Promise.all(
      episodes.map(async (episode) => {
        const title = getFieldValue(episode, ['Title', 'Título', 'Titel', 'Name & SERP Title']);
        if (!title) {
          throw new Error('Episode title is required');
        }

        const slug = generateUniqueSlug(title, 'episodes', language);

        // Process guests into Person objects
        const guestNames = getFieldValue(episode, [
          'Guests',
          'Invitados',
          'Gäste',
          'Gasten',
          'All guests (incl main guest)',
        ])
          .split(/[,;]/)
          .map((name) => name.trim())
          .filter(Boolean);

        const guests: Person[] = guestNames.map((name) => ({
          id: generateUniqueSlug(name, 'guests', language),
          name,
          role: 'Guest',
          bio: '',
          image_url: '',
          social_links: [],
          language,
          type: 'guest',
        }));

        // Get the remote image URL
        const remoteImageUrl = getFieldValue(episode, ['Main Image', 'Main image', 'Image']) || '';

        // Download and store the image locally if a URL is provided
        let localImagePath = '';
        if (remoteImageUrl) {
          try {
            const episodesImageDir = path.join('src', 'assets', 'images', 'episodes');
            const fileName = `${slug}${path.extname(new URL(remoteImageUrl).pathname)}`;
            localImagePath = await downloadImage(remoteImageUrl, episodesImageDir, fileName);
            // Convert to relative path from project root
            localImagePath = localImagePath.replace(/^.*?src\//, 'src/');
          } catch (error) {
            console.error(`Error downloading image for episode ${title}:`, error);
            // Keep the remote URL if download fails
            localImagePath = remoteImageUrl;
          }
        }

        const episodeData = {
          id: slug,
          title,
          description:
            getFieldValue(episode, [
              'Description',
              'Descripción',
              'Beschreibung',
              'Beschrijving',
              'Intro & SERP Meta Description',
            ]) || '',
          date: new Date(
            getFieldValue(episode, ['Date', 'Fecha', 'Datum', 'Publication date']) ||
              new Date().toISOString()
          ),
          duration: parseDuration(
            getFieldValue(episode, ['Duration', 'Duración', 'Dauer', 'Duur', 'duration']) || '0'
          ),
          audio_url: episode['directmp3link'] || episode['Audio URL'] || '',
          transcript_url: episode['Transcript'] || '',
          show_notes: episode['Shownotes/ extra info'] || '',
          guests,
          youtube_url: getFieldValue(episode, ['YouTube URL', 'Youtube URL', 'Youtube Embed code'])
            ? `https://youtu.be/${getFieldValue(episode, ['YouTube URL', 'Youtube URL', 'Youtube Embed code'])}`
            : '',
          main_image: localImagePath,
          language,
          type: 'podcast',
        };

        console.log(`Episode: ${title}, YouTube URL: ${getFieldValue(episode, ['YouTube URL'])}`);

        // Write episode content file
        writeContentFile(episodeData, 'episodes', language);
        return episodeData;
      })
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function importPeople(filePath: string, language: string): Promise<Person[]> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const people = parse(content, CSV_OPTIONS) as PersonCSV[];

    return Promise.all(
      people.map(async (person) => {
        const name = getFieldValue(person, ['Name', 'Nombre']);
        if (!name) {
          throw new Error('Person name is required');
        }

        const slug = generateUniqueSlug(name, 'guests', language);

        let socialLinks: string[] = [];
        try {
          const socialLinksData = getFieldValue(person, [
            'Social Links',
            'Enlaces sociales',
            'Soziale Links',
            'Sociale links',
          ]);
          socialLinks = JSON.parse(socialLinksData || '[]');
          if (!Array.isArray(socialLinks)) {
            throw new Error('Social links must be an array');
          }
        } catch (error) {
          console.error(`Error parsing social links for ${name}:`, error);
          socialLinks = [];
        }

        // Get the remote image URL
        const remoteImageUrl =
          person['Image URL'] ||
          person.Picture ||
          person['URL de imagen'] ||
          person['Bild URL'] ||
          person['Afbeelding URL'] ||
          '';

        // Download and store the image locally if a URL is provided
        let localImagePath = '';
        if (remoteImageUrl) {
          try {
            const guestsImageDir = path.join('src', 'assets', 'images', 'guests');
            const fileName = `${slug}${path.extname(new URL(remoteImageUrl).pathname)}`;
            localImagePath = await downloadImage(remoteImageUrl, guestsImageDir, fileName);
            // Convert to relative path from project root
            localImagePath = localImagePath.replace(/^.*?src\//, 'src/');
          } catch (error) {
            console.error(`Error downloading image for ${name}:`, error);
            // Keep the remote URL if download fails
            localImagePath = remoteImageUrl;
          }
        }

        const personData = {
          id: slug,
          name,
          role: getFieldValue(person, ['Role', 'Rol', 'Rolle', 'Function/Title']) || 'Guest',
          bio: getFieldValue(person, ['Bio', 'Biografía', 'Biografie']) || '',
          image_url: localImagePath,
          social_links: socialLinks,
          language,
          type: 'guest',
        };

        // Write person content file
        writeContentFile(personData, 'guests', language);
        return personData;
      })
    );
  } catch (error) {
    console.error(`Error reading CSV file at ${filePath}:`, error);
    throw error;
  }
}

export async function importPlatforms(filePath: string, language: string): Promise<Platform[]> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const platforms = parse(content, CSV_OPTIONS) as PlatformCSV[];

    return platforms.map((platform) => {
      const name = getFieldValue(platform, ['Name', 'Nombre']);
      if (!name) {
        throw new Error('Platform name is required');
      }

      const slug = generateUniqueSlug(name, 'platforms', language);

      const platformData = {
        id: slug,
        name,
        description:
          getFieldValue(platform, ['Description', 'Descripción', 'Beschreibung', 'Beschrijving']) ||
          '',
        url: platform.URL || '',
        icon_url: getFieldValue(platform, ['Icon URL', 'URL del icono', 'Icoon URL']) || '',
        language,
        type: 'platform',
      };

      // Write platform content file
      writeContentFile(platformData, 'platforms', language);
      return platformData;
    });
  } catch (error) {
    console.error(`Error reading CSV file at ${filePath}:`, error);
    throw error;
  }
}

export async function importQuotes(filePath: string, language: string): Promise<Quote[]> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const quotes = parse(content, CSV_OPTIONS) as QuoteCSV[];

    // Import people and episodes from the same language
    const languageDir =
      language === 'en'
        ? 'English'
        : language === 'es'
          ? 'Spanish'
          : language === 'de'
            ? 'German'
            : 'Dutch';

    // Get the correct filename based on language
    const peopleFileName =
      language === 'en'
        ? 'CRO.CAFE - People.csv'
        : language === 'es'
          ? 'CRO.CAFE Español - People.csv'
          : language === 'de'
            ? 'CRO.CAFE Deutsch - People.csv'
            : 'CRO.CAFE Nederlands - Gasten.csv';

    const people = await importPeople(
      `project/current-site-data/${languageDir}/cleaned/${peopleFileName}`,
      language
    );
    // Get the correct episodes filename based on language
    const episodesFileName =
      language === 'en'
        ? 'CRO.CAFE - Episodes.csv'
        : language === 'es'
          ? 'CRO.CAFE Español - Episodes.csv'
          : language === 'de'
            ? 'CRO.CAFE Deutsch - Episodes.csv'
            : 'CRO.CAFE Nederlands - Afleveringen (1).csv';

    const episodes = await importEpisodes(
      `project/current-site-data/${languageDir}/cleaned/${episodesFileName}`,
      language
    );

    return quotes
      .map((quote) => {
        const text = getFieldValue(quote, ['Text', 'Texto']);
        if (!text) {
          console.warn('Skipping quote with empty text');
          return null;
        }

        const episodeTitle = getFieldValue(quote, [
          'Episode Title',
          'Título del episodio',
          'Episodentitel',
          'Aflevering titel',
        ]);
        if (!episodeTitle) {
          throw new Error('Episode title is required');
        }

        const guestName = getFieldValue(quote, [
          'Guest Name',
          'Nombre del invitado',
          'Gastname',
          'Gastnaam',
        ]);
        if (!guestName) {
          throw new Error('Guest name is required');
        }

        const slug = generateUniqueSlug(`${episodeTitle}-${text}`, 'quotes', language);

        const author = people.find((person) => person.name === guestName);
        if (!author) {
          throw new Error(`Author not found for quote: ${text}`);
        }

        const episode = episodes.find((ep: Episode) => ep.title === episodeTitle) || {
          id: generateUniqueSlug(episodeTitle, 'episodes', language),
          title: episodeTitle,
        };

        const timestamp = Number(quote['Timestamp (s)'] || '0');
        if (isNaN(timestamp)) {
          console.warn(`Invalid timestamp for quote: ${text}, defaulting to 0`);
        }

        const quoteData = {
          id: slug,
          text,
          timestamp: isNaN(timestamp) ? 0 : timestamp,
          episode,
          author,
          language,
          type: 'quote',
        };

        // Write quote content file
        writeContentFile(quoteData, 'quotes', language);
        return quoteData;
      })
      .filter((quote): quote is Quote => quote !== null);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
