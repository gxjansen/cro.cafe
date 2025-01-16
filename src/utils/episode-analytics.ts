import { transistorApi, SHOW_IDS } from './transistor-api';
import type { EpisodesAnalytics, DownloadData } from '../types/transistor';

interface EpisodeStats {
  id: string;
  title: string;
  published_at: string;
  total_downloads: number;
  downloads_per_day: DownloadData[];
}

/**
 * Get episode analytics for a specific language
 */
export async function getLanguageEpisodeAnalytics(
  language: keyof typeof SHOW_IDS,
  days: number = 30
): Promise<EpisodeStats[]> {
  try {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Format dates as dd-mm-yyyy
    const formatDate = (date: Date) => {
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    };

    // Get analytics from Transistor
    const response = await transistorApi.getAllEpisodeAnalytics(
      SHOW_IDS[language],
      formatDate(startDate),
      formatDate(endDate)
    );

    const analytics = response as { data: EpisodesAnalytics };

    // Process analytics data
    return analytics.data.attributes.episodes.map((episode) => ({
      id: episode.id,
      title: episode.title,
      published_at: episode.published_at,
      total_downloads: episode.downloads.reduce((sum, day) => sum + day.downloads, 0),
      downloads_per_day: episode.downloads,
    }));
  } catch (error) {
    console.error(`Error fetching episode analytics for ${language}:`, error);
    return [];
  }
}

/**
 * Get popular episodes for a specific language
 */
export async function getPopularEpisodes(
  language: keyof typeof SHOW_IDS,
  limit: number = 5
): Promise<EpisodeStats[]> {
  const stats = await getLanguageEpisodeAnalytics(language);

  // Sort by total downloads and take top N
  return stats.sort((a, b) => b.total_downloads - a.total_downloads).slice(0, limit);
}

/**
 * Get trending episodes (highest downloads in last 7 days)
 */
export async function getTrendingEpisodes(
  language: keyof typeof SHOW_IDS,
  limit: number = 5
): Promise<EpisodeStats[]> {
  const stats = await getLanguageEpisodeAnalytics(language, 7);

  // Sort by total downloads in last 7 days and take top N
  return stats.sort((a, b) => b.total_downloads - a.total_downloads).slice(0, limit);
}
