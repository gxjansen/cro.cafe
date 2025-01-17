export interface Guest {
  id: string;
  data: {
    name: string;
    image_url: string;
    bio?: string;
    social_links?: Array<{
      platform: string;
      url: string;
    }>;
  };
}
