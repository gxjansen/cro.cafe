import type { Metadata } from './astro';

export type Language = 'en' | 'nl' | 'de' | 'es';

export interface PageProps {
  metadata: Metadata;
  availableLanguages: readonly Language[];
  currentLang: Language;
}

export type { Metadata };

export type {
  WidgetProps,
  ItemProps,
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
} from './widgets';
