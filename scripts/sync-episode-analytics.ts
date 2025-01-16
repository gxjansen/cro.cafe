import { TransistorAPI, SHOW_IDS } from '../src/utils/transistor-api.ts';
import type { EpisodesAnalytics } from '../src/types/transistor';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables
config();
// Verify API key is loaded
if (!process.env.TRANSISTOR_API_KEY) {
  throw new Error('TRANSISTOR_API_KEY environment variable is not set');
}

interface EpisodeAnalytics {
  id: string;
  showId: string;
  downloads: number;
  lastUpdated: string;
}

async function syncEpisodeAnalytics() {
  // We've already verified the API key exists above
  const transistorApi = new TransistorAPI(process.env.TRANSISTOR_API_KEY!);
  const analytics: EpisodeAnalytics[] = [];

  // Get analytics from 2019 to present
  const end = new Date();
  const start = new Date('2019-01-01');

  // Format dates as dd-mm-yyyy
  const startDate = start
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, '-');

  const endDate = end
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, '-');

  console.log(`Fetching all-time analytics (${startDate} to ${endDate})`);

  for (const [lang, showId] of Object.entries(SHOW_IDS)) {
    console.log(`Processing ${lang} show (${showId})...`);

    try {
      const response = (await transistorApi.getAllEpisodeAnalytics(showId, startDate, endDate)) as {
        data: EpisodesAnalytics;
      };

      // Process the analytics data
      const showAnalytics = response.data.attributes.episodes.map((episode) => ({
        id: episode.id,
        showId,
        downloads: episode.downloads.reduce((total, day) => total + day.downloads, 0),
        lastUpdated: new Date().toISOString(),
      }));

      analytics.push(...showAnalytics);
    } catch (error) {
      console.error(`Error fetching analytics for show ${showId}:`, error);
    }
  }

  // Sort by downloads (most popular first)
  analytics.sort((a, b) => b.downloads - a.downloads);

  // Ensure data directory exists
  const dataDir = join(process.cwd(), 'src/data');
  const outputPath = join(dataDir, 'episode-analytics.json');

  try {
    await writeFile(outputPath, JSON.stringify(analytics, null, 2));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // Directory doesn't exist, create it
      await mkdir(dataDir, { recursive: true });
      await writeFile(outputPath, JSON.stringify(analytics, null, 2));
    } else {
      throw error;
    }
  }

  console.log(`Analytics saved to ${outputPath}`);
  console.log(`Total episodes processed: ${analytics.length}`);
}

// Run the sync
syncEpisodeAnalytics().catch(console.error);
