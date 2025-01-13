import {
  TransistorAPI,
  withErrorHandling,
  convertTransistorEpisode,
} from '../src/utils/transistor-api';
import fs from 'fs/promises';
import path from 'path';

// Map show IDs to their respective languages
const SHOWS = {
  '5036': { lang: 'en', slug: 'cro-cafe', id: '5036' }, // English show
  '16113': { lang: 'nl', slug: 'cro-cafe-nl', id: '16113' }, // Dutch show
  '28592': { lang: 'de', slug: 'cro-cafe-deutsch', id: '28592' }, // German show
  '16111': { lang: 'es', slug: 'cro-cafe-es', id: '16111' }, // Spanish show
} as const;

// Error types for monitoring
enum SyncErrorType {
  API_ERROR = 'API_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  FILE_SYSTEM = 'FILE_SYSTEM',
  UNKNOWN = 'UNKNOWN',
}

interface SyncError {
  type: SyncErrorType;
  show?: string;
  message: string;
  timestamp: string;
  details?: unknown;
}

class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

async function logError(error: SyncError) {
  const logDir = path.join(process.cwd(), 'logs');
  const logFile = path.join(logDir, 'sync-errors.json');

  try {
    await ensureDirectoryExists(logDir);

    // Read existing logs
    let logs: SyncError[] = [];
    try {
      const content = await fs.readFile(logFile, 'utf-8');
      logs = JSON.parse(content);
    } catch {
      // File doesn't exist or is invalid, start with empty array
    }

    // Add new error and keep only last 100 errors
    logs.unshift(error);
    logs = logs.slice(0, 100);

    // Write updated logs
    await fs.writeFile(logFile, JSON.stringify(logs, null, 2), 'utf-8');

    // Log to console for immediate visibility
    console.error('Sync error:', error);
  } catch (e) {
    // If we can't write to the log file, at least log to console
    console.error('Failed to write to error log:', e);
    console.error('Original error:', error);
  }
}

async function ensureDirectoryExists(dirPath: string) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function saveEpisode(episodeData: ReturnType<typeof convertTransistorEpisode>) {
  const showId = episodeData.relationships.show.data.id;
  const show = SHOWS[showId as keyof typeof SHOWS];

  if (!show) {
    await logError({
      type: SyncErrorType.UNKNOWN,
      message: `Unknown show ID ${showId}`,
      timestamp: new Date().toISOString(),
      details: { episodeId: episodeData.id },
    });
    return;
  }

  const episodeDir = path.join(process.cwd(), 'src', 'content', `${show.lang}-episodes`);

  try {
    await ensureDirectoryExists(episodeDir);

    // Create a URL-friendly slug from the title
    const slug = episodeData.attributes.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const filePath = path.join(episodeDir, `${slug}.json`);

    // Save complete episode data as JSON
    await fs.writeFile(filePath, JSON.stringify(episodeData, null, 2), 'utf-8');
    console.log(`Saved episode: ${filePath}`);
  } catch (error) {
    await logError({
      type: SyncErrorType.FILE_SYSTEM,
      show: show.slug,
      message: 'Failed to save episode file',
      timestamp: new Date().toISOString(),
      details: { error, episodeId: episodeData.id },
    });
    throw error;
  }
}

async function syncShow(api: TransistorAPI, showConfig: (typeof SHOWS)[keyof typeof SHOWS]) {
  console.log(`\nSyncing episodes for ${showConfig.lang} show (${showConfig.slug})...`);

  let page = 1;
  let hasMorePages = true;

  while (hasMorePages) {
    try {
      const response = await withErrorHandling(() => api.getEpisodes(showConfig.id, page));
      const episodes = response.data;

      if (episodes.length === 0) {
        hasMorePages = false;
        continue;
      }

      // Process each episode
      for (const episode of episodes) {
        const convertedEpisode = convertTransistorEpisode(episode);
        await saveEpisode(convertedEpisode);
      }

      page++;

      // Respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      const errorType =
        error instanceof RateLimitError ? SyncErrorType.RATE_LIMIT : SyncErrorType.API_ERROR;
      const errorMessage = isError(error) ? error.message : 'Unknown error occurred';

      await logError({
        type: errorType,
        show: showConfig.slug,
        message: `Error syncing ${showConfig.lang} episodes page ${page}: ${errorMessage}`,
        timestamp: new Date().toISOString(),
        details: { error, page },
      });
      throw error;
    }
  }
}

async function syncEpisodes() {
  if (!process.env.TRANSISTOR_API_KEY) {
    throw new Error('TRANSISTOR_API_KEY environment variable is required');
  }

  const api = new TransistorAPI(process.env.TRANSISTOR_API_KEY);

  // Process each show
  for (const show of Object.values(SHOWS)) {
    await syncShow(api, show);
  }
}

// Run the sync
syncEpisodes()
  .then(() => {
    console.log('\nEpisode sync completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    const errorMessage = isError(error) ? error.message : 'Unknown error occurred';

    logError({
      type: SyncErrorType.UNKNOWN,
      message: `Episode sync failed: ${errorMessage}`,
      timestamp: new Date().toISOString(),
      details: error,
    }).finally(() => {
      console.error('\nEpisode sync failed:', errorMessage);
      process.exit(1);
    });
  });
