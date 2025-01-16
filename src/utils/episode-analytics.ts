import { getCollection, type CollectionEntry } from 'astro:content';
import type { TransistorEpisode } from '../types/transistor';

// Define valid episode collection names
type EpisodeCollection = 'de-episodes' | 'en-episodes' | 'es-episodes' | 'nl-episodes';

// Episode data type from content collection
type EpisodeData = {
  type: 'episode';
  id: string;
  attributes: {
    title: string;
    summary?: string | null;
    description: string;
    published_at: string;
    media_url: string;
    duration: number;
    duration_in_mmss: string;
    formatted_published_at: string;
    formatted_description?: string;
    clean_description?: string | null;
    image_url?: string | null;
    share_url: string;
    slug: string;
  };
  relationships: {
    show: {
      data: {
        id: string;
        type: string;
      };
    };
  };
};

interface EpisodeAnalytics {
  id: string;
  showId: string;
  downloads: number;
  lastUpdated: string;
}

import { readFileSync } from 'fs';
import { join } from 'path';

// Initialize analytics data
let analyticsData: EpisodeAnalytics[] = [];

// Load analytics data if it exists
try {
  const dataPath = join(process.cwd(), 'src/data/episode-analytics.json');
  const fileContent = readFileSync(dataPath, 'utf-8');
  analyticsData = JSON.parse(fileContent);
} catch (error) {
  console.warn(
    'No episode analytics data found. Run scripts/sync-episode-analytics.ts to generate it.'
  );
}

/**
 * Get popular episodes for a specific language
 */
export async function getPopularEpisodes(
  lang: string,
  limit = 3
): Promise<CollectionEntry<EpisodeCollection>[]> {
  // Get all episodes for this language
  const allEpisodes = await getCollection(`${lang}-episodes` as EpisodeCollection);

  // Get analytics data for these episodes
  console.log('Analytics data:', analyticsData.slice(0, 3)); // Show first 3 entries
  console.log(
    'All episodes:',
    allEpisodes.slice(0, 3).map((ep) => ({ id: ep.data.id, title: ep.data.attributes.title }))
  ); // Show first 3 entries

  const episodesWithAnalytics = allEpisodes
    .map((episode) => {
      const analytics = analyticsData.find(
        (a) => String(a.id) === String((episode.data as EpisodeData).id)
      );

      console.log('Comparing:', {
        episodeId: (episode.data as EpisodeData).id,
        analyticsFound: !!analytics,
        downloads: analytics?.downloads,
      });

      return {
        episode,
        downloads: analytics?.downloads || 0,
      };
    })
    // Sort by downloads (most popular first)
    .sort((a, b) => b.downloads - a.downloads)
    // Take the requested number of episodes
    .slice(0, limit)
    // Return just the episode data
    .map(({ episode }) => episode);

  return episodesWithAnalytics;
}

/**
 * Get total downloads for an episode
 */
export function getEpisodeDownloads(transistorId: string): number {
  const analytics = analyticsData.find((a) => a.id === transistorId);
  return analytics?.downloads || 0;
}

/**
 * Format download count for display
 */
export function formatDownloads(downloads: number): string {
  if (downloads >= 1000000) {
    return `${(downloads / 1000000).toFixed(1)}M`;
  }
  if (downloads >= 1000) {
    return `${(downloads / 1000).toFixed(1)}K`;
  }
  return downloads.toString();
}
