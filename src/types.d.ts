export type Language = 'en' | 'nl' | 'de' | 'es' | 'international';

export interface Item {
  title: string;
  description?: string;
  icon?: string;
  callToAction?: CallToAction;
  classes?: {
    title?: string;
    description?: string;
    icon?: string;
    panel?: string;
    actionClass?: string;
    container?: string;
  };
}

export interface Episode {
  id: string;
  collection: string;
  data: {
    id: string;
    type: 'episode';
    attributes: {
      title: string;
      summary: string | null;
      description: string;
      status?: 'published' | 'draft' | 'scheduled';
      published_at: string;
      media_url: string;
      duration: number;
      duration_in_mmss: string;
      formatted_published_at: string;
      formatted_description?: string | null;
      clean_description?: string | null;
      image_url?: string | null;
      video_url?: string | null;
      transcript_url?: string | null;
      share_url: string;
      embed_html: string;
      embed_html_dark: string;
      slug: string;
      number?: number | null;
      season?: number | null;
      explicit?: boolean | null;
      keywords?: string[] | null;
      alternate_url?: string | null;
      author?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
      formatted_summary?: string | null;
      audio_processing?: boolean | null;
      email_notifications?: Record<string, unknown> | null;
      keywords_raw?: string;
      local_image_url?: string;
      featured?: boolean;
    };
    relationships: {
      show: {
        data: {
          id: string;
          type: string;
        };
      };
      guests?: Array<{
        id: string;
        type: 'guest';
      }>;
    };
  };
}

export interface Person {
  id: string;
  type: 'guest';
  name: string;
  role: string;
  bio: string;
  image_url: string;
  social_links: Array<{
    platform: string;
    url: string;
  }>;
  language: Language;
}

export interface Guest extends Person {
  data: Omit<Person, 'language'>;
  collection: string;
}

export interface Quote {
  id: string;
  type: 'quotes';
  text: string;
  author: string;
  episode?: string;
  timestamp?: string;
  data: {
    id: string;
    type: 'quotes';
    text: string;
    author: string;
    episode?: string;
    timestamp?: string;
  };
  collection: string;
}

export interface Platform {
  id: string;
  type: 'platforms';
  name: string;
  description: string;
  url?: string;
  logo?: string;
  data: Omit<Platform, 'data' | 'collection'>;
  collection: string;
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  iconUrl: string;
  language: Language;
  type: string;
  canonicalUrl?: string;
}

export interface MetaData {
  title: string;
  description: string;
  image?: string | ImageMetadata;
  canonicalUrl?: string;
  type?: 'article' | 'website' | 'page' | 'episode' | 'guest' | string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  alternateLanguages?: Record<string, string>;
  ogSubtitle?: string;
  ogImageType?: string;
  ogImageUrl?: string;
  episode?: {
    local_image_url?: string;
  };
}

export interface PageProps {
  metadata?: MetaData;
  currentLang: Language;
  availableLanguages: readonly Language[];
  children?: any;
}

export interface MetadataProps extends MetaData {
  tags?: string[];
  author?: string;
  modifiedTime?: string;
  publishedTime?: string;
  type?: string;
  canonicalUrl?: string;
  image?: string;
  ogSubtitle?: string;
  ogImageType?: string;
}

export interface CallToAction {
  text?: string;
  href?: string;
  icon?: string;
  target?: string;
  rel?: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'link';
  class?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children?: any;
}

export interface ButtonProps extends CallToAction {
  children?: any;
}

export interface Form {
  inputs: Array<{
    type?: string;
    name: string;
    label?: string;
    autocomplete?: string;
    placeholder?: string;
  }>;
  textarea?: {
    label?: string;
    placeholder?: string;
  };
  disclaimer?: string;
  button?: CallToAction;
  description?: string;
}

export interface FormProps extends Form {}

export interface Headline {
  title?: string;
  subtitle?: string;
  tagline?: string;
  classes?: {
    container?: string;
    title?: string;
    subtitle?: string;
    tagline?: string;
  };
}

export interface HeadlineProps extends Headline {}

export interface ItemGrid {
  items: Item[];
  title?: string;
  description?: string;
  defaultIcon?: string;
  classes?: {
    container?: string;
    title?: string;
    description?: string;
    items?: Record<string, string>;
  };
}

export interface ItemGridProps extends ItemGrid {}

export interface FooterProps {
  links: Array<{
    title: string;
    links: Array<{
      text: string;
      href: string;
      icon?: string;
    }>;
  }>;
  secondaryLinks: Array<{
    text: string;
    href: string;
  }>;
  socialLinks: Array<{
    ariaLabel: string;
    icon: string;
    href: string;
  }>;
  footNote?: string;
  theme?: string;
  currentLang: Language;
  currentPath?: string;
}

export interface HeaderProps {
  isSticky?: boolean;
  showToggleTheme?: boolean;
  currentLang: Language;
  links: Array<{
    text: string;
    href?: string;
    links?: Array<{
      text: string;
      href: string;
    }>;
  }>;
  actions: Array<CallToAction>;
}

export interface OpenGraphImageProps {
  title: string;
  subtitle?: string;
  type: 'episode' | 'guest' | 'quote';
  imageUrl?: string;
  logoUrl?: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  description: string;
  body?: string;
  image?: string | undefined;
  publishDate: Date;
  category?:
    | {
        slug: string;
        title: string;
      }
    | undefined;
  tags?:
    | Array<{
        slug: string;
        title: string;
      }>
    | undefined;
  author?: string | undefined;
  draft?: boolean | undefined;
  excerpt?: string | undefined;
  readingTime?: string | undefined;
  permalink?: string | undefined;
  Content?: any;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  publishDate: Date;
  excerpt?: string;
  image?: string;
  category?: string;
  tags?: string[];
  draft?: boolean;
}

export interface Widget {
  id?: string | undefined;
  isDark?: boolean | undefined;
  bg?: string | undefined;
  classes?:
    | {
        container?: string | undefined;
        headline?: Record<string, string> | undefined;
        items?: Record<string, string> | undefined;
      }
    | undefined;
}

export interface Features extends Widget {
  title?: string;
  subtitle?: string;
  highlight?: string;
  tagline?: string;
  items: Array<Item>;
  columns?: number;
  defaultIcon?: string;
  isBeforeContent?: boolean;
  isAfterContent?: boolean;
  image?: string;
}

export interface Hero extends Widget {
  title: string;
  subtitle?: string;
  tagline?: string;
  callToAction?: CallToAction;
  image?:
    | string
    | {
        src: string;
        alt: string;
      };
  content?: string;
  actions?: string;
}

export interface Stats extends Widget {
  title?: string;
  subtitle?: string;
  tagline?: string;
  stats: Array<{
    amount: number;
    title: string;
    icon?: string;
  }>;
}

export interface Steps extends Widget {
  title?: string;
  subtitle?: string;
  items: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  image?: {
    src: string;
    alt: string;
  };
  isReversed?: boolean;
  callToAction?: CallToAction;
  tagline?: string;
}

export interface Contact extends Widget {
  title?: string;
  subtitle?: string;
  highlight?: string;
  inputs?: Array<{
    type?: string;
    name: string;
    label?: string;
    autocomplete?: string;
    placeholder?: string;
  }>;
  textarea?: {
    label?: string;
    placeholder?: string;
  };
  disclaimer?: string;
  button?: CallToAction;
  description?: string;
  tagline?: string;
}

export interface Faqs extends Widget {
  title?: string;
  subtitle?: string;
  highlight?: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
  columns?: number;
  tagline?: string;
}

export interface Pricing extends Widget {
  title?: string;
  subtitle?: string;
  prices: Array<{
    title: string;
    subtitle?: string;
    price: string;
    period?: string;
    items: Array<{
      description: string;
      icon?: string;
    }>;
    callToAction?: CallToAction;
    hasRibbon?: boolean;
    ribbonTitle?: string;
  }>;
  tagline?: string;
}

export interface Testimonials extends Widget {
  title?: string;
  subtitle?: string;
  testimonials: Array<{
    title?: string;
    testimonial: string;
    name: string;
    job: string;
    image?: string;
  }>;
  callToAction?: CallToAction;
  tagline?: string;
}

export interface Brands extends Widget {
  title?: string;
  subtitle?: string;
  tagline?: string;
  icons?: string[];
  images?: Array<{
    src: string;
    alt: string;
  }>;
}

export interface Content extends Widget {
  title?: string;
  subtitle?: string;
  highlight?: string;
  content?: string;
  items?: Array<Item>;
  image?: string | { src: string; alt: string };
  isReversed?: boolean;
  isAfterContent?: boolean;
  callToAction?: CallToAction;
  tagline?: string;
}

export interface SchemaOrgObject {
  '@type': string;
  '@id'?: string;
  name?: string;
  description?: string | null;
  url?: string;
  image?:
    | string
    | {
        '@type': 'ImageObject';
        url: string;
        width?: number;
        height?: number;
      };
  datePublished?: string;
  dateModified?: string;
  author?: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  publisher?: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | Record<string, unknown>
    | Array<unknown>;
}
