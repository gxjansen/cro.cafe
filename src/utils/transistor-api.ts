import type { TransistorEpisode, TransistorResponse, TransistorShow } from '../types/transistor';

// Rate limiting helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class TransistorAPI {
  private baseUrl = 'https://api.transistor.fm/v1';
  private apiKey: string;
  private rateLimitDelay = 6000; // 6 seconds between requests (10 requests/minute)

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get all episodes for a show with rate limiting
   */
  async getAllEpisodes(showId: string): Promise<TransistorEpisode[]> {
    let page = 1;
    let hasMore = true;
    const episodes: TransistorEpisode[] = [];

    while (hasMore) {
      try {
        const response = await this.fetch<TransistorResponse>(
          `/episodes?show_id=${showId}&page=${page}&pagination[per]=25&status=published`
        );

        episodes.push(...response.data);

        // Check if there are more pages
        hasMore = response.meta.currentPage < response.meta.totalPages;
        page++;

        // Rate limiting
        await delay(this.rateLimitDelay);
      } catch (error) {
        console.error(`Error fetching episodes for show ${showId}:`, error);
        throw error;
      }
    }

    return episodes;
  }

  /**
   * Get a single episode by ID
   */
  async getEpisode(episodeId: string): Promise<TransistorEpisode> {
    try {
      const response = await this.fetch<{ data: TransistorEpisode }>(`/episodes/${episodeId}`);
      await delay(this.rateLimitDelay);
      return response.data;
    } catch (error) {
      console.error(`Error fetching episode ${episodeId}:`, error);
      throw error;
    }
  }

  /**
   * Get show details
   */
  async getShow(showId: string): Promise<TransistorShow> {
    try {
      const response = await this.fetch<{ data: TransistorShow }>(`/shows/${showId}`);
      await delay(this.rateLimitDelay);
      return response.data;
    } catch (error) {
      console.error(`Error fetching show ${showId}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const transistorApi = new TransistorAPI(process.env.TRANSISTOR_API_KEY || '');

// Show IDs for each language
export const SHOW_IDS = {
  en: '5036',
  nl: '16113',
  de: '28592',
  es: '16111',
} as const;

// Get language from show ID
export function getLanguageFromShowId(showId: string): keyof typeof SHOW_IDS {
  const entry = Object.entries(SHOW_IDS).find(([_, id]) => id === showId);
  if (!entry) throw new Error(`Unknown show ID: ${showId}`);
  return entry[0] as keyof typeof SHOW_IDS;
}
