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
    image_url?: string;
    video_url?: string;
    transcript_url?: string;
    share_url: string;
    embed_html: string;
    embed_html_dark: string;
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
