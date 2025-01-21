import type { Metadata } from './astro';
import type { ImageMetadata } from 'astro';
import type { CallToAction } from './widgets';

export type Language = 'en' | 'nl' | 'de' | 'es';

export interface BlogPost {
  id: string;
  slug: string;
  permalink: string;
  publishDate: Date;
  title: string;
  description: string;
  body: string;
  image?: string | ImageMetadata;
  category?: {
    slug: string;
    title: string;
  };
  tags?: Array<{
    slug: string;
    title: string;
  }>;
  author?: string;
  draft: boolean;
  excerpt?: string;
  readingTime?: number;
  Content?: any;
}

export type Post = BlogPost;

export type { Metadata };

export interface ItemGridClasses {
  container?: string;
  title?: string;
  description?: string;
  action?: string;
  actionClass?: string;
  items?: Record<string, string>;
}

export interface ItemProps {
  title?: string;
  description?: string;
  icon?: string;
  classes?: ItemGridClasses;
  callToAction?: CallToAction;
}

export type {
  WidgetProps,
  CallToAction,
  Content,
  Features,
  Stats,
  Testimonials,
  Brands,
  FAQs,
  Steps,
  Footer,
  Header,
  ItemGrid,
  Form,
} from './widgets';
