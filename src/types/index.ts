import type { Metadata } from './astro';
import type { CallToAction } from './widgets';

export type Language = 'en' | 'nl' | 'de' | 'es';

export interface PageProps {
  metadata: Metadata;
  availableLanguages: readonly Language[];
  currentLang: Language;
}

export type { Metadata };

export interface ItemGridClasses {
  container?: string;
  panel?: string;
  icon?: string;
  title?: string;
  description?: string;
  action?: string;
  actionClass?: string;
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
