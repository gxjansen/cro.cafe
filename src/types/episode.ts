export interface Episode {
  data: {
    id: string;
    type: string;
    attributes: {
      title: string;
      summary: string | null;
      description: string;
      clean_description?: string;
      published_at: string;
      media_url: string;
      duration: number;
      duration_in_mmss: string;
      formatted_published_at: string;
      local_image_url: string;
      slug: string;
      transcript_url: string | null;
      audio_url: string;
      video_url: string | null;
      embed_html: string | null;
      share_url: string;
      featured: boolean;
      guests: Array<{
        id: string;
        name: string;
        role: string;
        bio: string;
        image_url: string;
        social_links: Array<{
          platform: string;
          url: string;
        }>;
        language: string;
        type: 'guest';
      }>;
      language: string;
      type: 'episode';
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
}
