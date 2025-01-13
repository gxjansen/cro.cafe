declare module '@transistorapi/client' {
  import type { TransistorEpisode, TransistorResponse } from './transistor';

  interface TransistorClientConfig {
    apiKey: string;
  }

  interface PaginationOptions {
    page: number;
    pageSize: number;
  }

  interface ListEpisodesOptions {
    showId: string;
    pagination?: PaginationOptions;
    status?: 'published' | 'draft' | 'scheduled';
  }

  interface ShowResponse {
    data: {
      id: string;
      type: 'show';
      attributes: {
        title: string;
        description: string;
        author: string;
        website: string;
        language: string;
        created_at: string;
        updated_at: string;
        image_url: string;
        private: boolean;
      };
    };
  }

  interface EpisodeResponse {
    data: TransistorEpisode;
  }

  export class TransistorClient {
    constructor(config: TransistorClientConfig);

    episodes: {
      list(options: ListEpisodesOptions): Promise<TransistorResponse>;
      retrieve(episodeId: string): Promise<EpisodeResponse>;
    };

    shows: {
      retrieve(showId: string): Promise<ShowResponse>;
    };
  }
}
