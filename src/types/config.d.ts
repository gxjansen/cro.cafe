declare module 'astrowind:config' {
  export const SITE: {
    name: string;
    title: string;
    description: string;
    defaultLanguage: string;
    languages: string[];
    textDirection: 'ltr' | 'rtl';
    googleSiteVerificationId?: string;
    trailingSlash: boolean;
  };

  export const UI: {
    theme: string;
  };

  export const METADATA: {
    author: string;
    description?: string;
    social: {
      twitter: string;
    };
  };

  export const PAGINATION: {
    EPISODES_PER_PAGE: number;
  };

  export const APP_BLOG: {
    enabled: boolean;
    postsPerPage: number;
    post: {
      path: string;
      permalink: string;
      isEnabled: boolean;
      robots: string;
    };
    list: {
      isEnabled: boolean;
      robots: string;
    };
    category: {
      isEnabled: boolean;
      robots: string;
    };
    tag: {
      isEnabled: boolean;
      robots: string;
    };
    isRelatedPostsEnabled: boolean;
  };

  export const I18N: {
    defaultLanguage: string;
    languages: string[];
  };
}
