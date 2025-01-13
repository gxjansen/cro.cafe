import { z } from 'zod';

// Rate limiting configuration
const RATE_LIMIT = {
  MAX_REQUESTS: 10,
  TIME_WINDOW: 60000, // 60 seconds (1 minute) in milliseconds
};

// Episode schema for type safety
export const TransistorEpisodeSchema = z.object({
  id: z.string(),
  type: z.literal('episode'),
  attributes: z.object({
    alternate_url: z.string().nullable(),
    audio_processing: z.boolean(),
    author: z.string().nullable(),
    created_at: z.string(),
    description: z.string().nullable(),
    duration: z.number().nullable(),
    duration_in_mmss: z.string(),
    email_notifications: z.boolean().nullable(),
    embed_html: z.string(),
    embed_html_dark: z.string(),
    explicit: z.boolean(),
    formatted_description: z.string(),
    formatted_published_at: z.string().nullable(),
    formatted_summary: z.string(),
    image_url: z.string().nullable(),
    keywords: z.string().nullable(),
    media_url: z.string(),
    number: z.number().nullable(),
    published_at: z.string().nullable(),
    season: z.number().nullable(),
    share_url: z.string(),
    slug: z.string().nullable(),
    status: z.string(),
    summary: z.string().nullable(),
    title: z.string(),
    transcript_url: z.string().nullable(),
    transcripts: z.array(z.string()),
    type: z.string(),
    updated_at: z.string(),
    video_url: z.string().nullable(),
  }),
  relationships: z.object({
    show: z.object({
      data: z.object({
        id: z.string(),
        type: z.literal('show'),
      }),
    }),
  }),
});

export type TransistorEpisode = z.infer<typeof TransistorEpisodeSchema>;

class RateLimiter {
  private requests: number[] = [];

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter((timestamp) => now - timestamp < RATE_LIMIT.TIME_WINDOW);
    return this.requests.length < RATE_LIMIT.MAX_REQUESTS;
  }

  addRequest() {
    this.requests.push(Date.now());
  }

  async waitForAvailability(): Promise<void> {
    while (!this.canMakeRequest()) {
      const now = Date.now();
      const oldestRequest = this.requests[0];
      if (!oldestRequest) return; // Should never happen due to canMakeRequest check

      const waitTime = RATE_LIMIT.TIME_WINDOW - (now - oldestRequest);
      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }
}

export class TransistorAPI {
  private apiKey: string;
  private baseUrl = 'https://api.transistor.fm/v1';
  private rateLimiter = new RateLimiter();

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    await this.rateLimiter.waitForAvailability();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    this.rateLimiter.addRequest();

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getShows() {
    return this.makeRequest('/shows');
  }

  async getEpisodes(showId: string, page = 1, perPage = 10) {
    return this.makeRequest<{ data: TransistorEpisode[] }>(
      `/episodes?show_id=${showId}&pagination[page]=${page}&pagination[per]=${perPage}`
    );
  }

  async getEpisode(episodeId: string) {
    return this.makeRequest<{ data: TransistorEpisode }>(`/episodes/${episodeId}`);
  }

  // Add more methods as needed for analytics, etc.
}

// Error handling wrapper for API calls
export async function withErrorHandling<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Rate limit exceeded') {
        console.error('Rate limit exceeded, retrying after cooldown...');
        await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT.TIME_WINDOW));
        return withErrorHandling(operation);
      }
      console.error('API Error:', error.message);
    }
    throw error;
  }
}

// Helper to convert Transistor episode to our site's format
export function convertTransistorEpisode(episode: TransistorEpisode) {
  // Keep all original fields from the API response
  return {
    id: episode.id,
    type: episode.type,
    attributes: {
      ...episode.attributes,
      // Split keywords into array but keep original string in keywords_raw
      keywords_raw: episode.attributes.keywords,
      keywords: episode.attributes.keywords?.split(',').map((k) => k.trim()) ?? [],
    },
    relationships: episode.relationships,
  };
}
