#!/usr/bin/env node
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import fs from 'fs';
import path from 'path';

const CSV_OPTIONS = {
  columns: true,
  skip_empty_lines: true,
  trim: true,
  delimiter: ',',
  relax_quotes: true,
  relax_column_count: true,
  bom: true,
  escape: '"', // Handle escaped quotes
  quote: '"', // Define quote character
  ltrim: true, // Trim left whitespace
  rtrim: true, // Trim right whitespace
  comment: '#', // Skip comment lines
};

// Type definitions for CSV data
interface BaseCSV {
  [key: string]: string | undefined;
}

interface EpisodeCSV extends BaseCSV {
  Guests?: string;
  Invitados?: string;
  Gäste?: string;
  Gasten?: string;
  Date?: string;
  Fecha?: string;
  Datum?: string;
  Duration?: string;
  Duración?: string;
  Dauer?: string;
  Duur?: string;
  'YouTube URL'?: string;
  'Youtube URL'?: string;
  'Main Image'?: string;
  'Main image'?: string;
  Image?: string;
  'Show Notes'?: string;
  'Show notes'?: string;
  Notes?: string;
}

interface BrandCSV extends BaseCSV {
  Name?: string;
  Nombre?: string;
  Description?: string;
  Descripción?: string;
  Beschreibung?: string;
  Beschrijving?: string;
  URL?: string;
  'Logo URL'?: string;
}

interface LanguageConfig {
  code: string;
  dirName: string;
  fileNames: {
    people: string;
    episodes: string;
    platforms: string;
    quotes: string;
    brands: string;
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
      brands: 'CRO.CAFE - Brand listeners.csv',
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
      brands: 'CRO.CAFE Nederlands - Brand listeners.csv',
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
      brands: 'CRO.CAFE Deutsch - Brand listeners.csv',
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
      brands: 'CRO.CAFE Español - Brand listeners.csv',
    },
  },
];

// Helper function to clean guest data
function cleanGuestData(guestField: string | undefined): string {
  if (!guestField?.trim()) return '';

  // If it's already JSON, validate and return as-is
  if (guestField.trim().startsWith('[')) {
    try {
      JSON.parse(guestField); // Validate JSON
      return guestField; // Return original if valid
    } catch {
      // If invalid JSON, fall through to comma-separated handling
    }
  }

  // Clean and standardize separators for comma/semicolon separated values
  return guestField
    .split(/[,;]/)
    .map((slug) => slug.trim())
    .filter(Boolean)
    .join(',');
}

// Helper function to clean and validate dates
function cleanDate(dateField: string | undefined): string {
  if (!dateField?.trim()) return new Date().toISOString();

  const date = new Date(dateField);
  return !isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();
}

// Helper function to clean duration (convert to seconds)
function cleanDuration(durationField: string | undefined): string {
  if (!durationField?.trim()) return '0';

  const duration = parseInt(durationField, 10);
  return !isNaN(duration) ? (duration * 60).toString() : '0';
}

async function cleanCSVFiles() {
  for (const lang of LANGUAGES) {
    const baseDir = path.join('project', 'current-site-data', lang.dirName);
    const cleanDir = path.join(baseDir, 'cleaned');

    // Create cleaned directory if it doesn't exist
    if (!fs.existsSync(cleanDir)) {
      fs.mkdirSync(cleanDir, { recursive: true });
    }

    // Clean episodes CSV
    const episodesPath = path.join(baseDir, lang.fileNames.episodes);
    if (fs.existsSync(episodesPath)) {
      const content = fs.readFileSync(episodesPath, 'utf-8');
      const episodes = parse(content, CSV_OPTIONS) as EpisodeCSV[];

      const cleanedEpisodes = episodes.map((episode) => ({
        ...episode,
        Guests: cleanGuestData(
          episode.Guests || episode.Invitados || episode.Gäste || episode.Gasten
        ),
        Date: cleanDate(episode.Date || episode.Fecha || episode.Datum),
        Duration: cleanDuration(
          episode.Duration || episode.Duración || episode.Dauer || episode.Duur
        ),
        'YouTube URL': episode['YouTube URL'] || episode['Youtube URL'] || '',
        'Main Image': episode['Main Image'] || episode['Main image'] || episode['Image'] || '',
        'Show Notes': episode['Show Notes'] || episode['Show notes'] || episode['Notes'] || '',
      }));

      if (cleanedEpisodes.length > 0) {
        const cleanedContent = stringify(cleanedEpisodes, {
          header: true,
          columns: Object.keys(cleanedEpisodes[0] as Record<string, unknown>),
        });

        fs.writeFileSync(path.join(cleanDir, lang.fileNames.episodes), cleanedContent);
      }
    }

    // Clean and copy other CSV files
    (['people', 'platforms', 'quotes', 'brands'] as const).forEach((fileType) => {
      const filePath = path.join(baseDir, lang.fileNames[fileType]);
      if (fs.existsSync(filePath)) {
        // For brands, parse and clean the data
        if (fileType === 'brands') {
          const content = fs.readFileSync(filePath, 'utf-8');
          const brands = parse(content, CSV_OPTIONS) as BrandCSV[];
          if (brands.length > 0) {
            const cleanedContent = stringify(brands, {
              header: true,
              columns: Object.keys(brands[0] as Record<string, unknown>),
            });
            fs.writeFileSync(path.join(cleanDir, lang.fileNames[fileType]), cleanedContent);
          }
        } else {
          // For other files, just copy them
          fs.copyFileSync(filePath, path.join(cleanDir, lang.fileNames[fileType]));
        }
      }
    });
  }

  console.log('CSV files cleaned successfully');
}

// Run the cleaning script
cleanCSVFiles().catch(console.error);
