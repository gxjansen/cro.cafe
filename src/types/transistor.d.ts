export interface TransistorEpisode {
  id: string;
  type: 'episode';
  attributes: {
    title: string;
    summary: string;
    description: string;
    status: string;
    published_at: string;
    media_url: string;
    duration: number;
    duration_in_mmss: string;
    formatted_published_at: string;
    formatted_description: string;
    formatted_summary?: string;
    clean_description?: string;
    image_url?: string;
    video_url?: string;
    transcript_url?: string;
    share_url: string;
    embed_html: string;
    embed_html_dark: string;
    slug: string;
    guests?: Array<{ name: string; slug: string }>;
  };
  relationships: {
    show: {
      data: {
        id: string;
        type: string;
      };
    };
  };
}

export interface TransistorShow {
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
    copyright: string;
    keywords: string;
    categories: string[];
  };
}

export interface TransistorPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export interface TransistorResponse {
  data: TransistorEpisode[];
  meta: TransistorPagination;
}

export interface DownloadData {
  date: string;
  downloads: number;
}

export interface EpisodeAnalytics {
  id: string;
  type: 'episode_analytics';
  attributes: {
    downloads: DownloadData[];
    start_date: string;
    end_date: string;
  };
  relationships: {
    episode: {
      data: {
        id: string;
        type: 'episode';
      };
    };
  };
}

export interface EpisodesAnalytics {
  id: string;
  type: 'episodes_analytics';
  attributes: {
    episodes: Array<{
      id: string;
      title: string;
      published_at: string;
      downloads: DownloadData[];
    }>;
    start_date: string;
    end_date: string;
  };
  relationships: {
    show: {
      data: {
        id: string;
        type: 'show';
      };
    };
  };
}

export interface ShowAnalytics {
  id: string;
  type: 'show_analytics';
  attributes: {
    downloads: DownloadData[];
    start_date: string;
    end_date: string;
  };
  relationships: {
    show: {
      data: {
        id: string;
        type: 'show';
      };
    };
  };
}
