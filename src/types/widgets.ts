import type { HTMLAttributes } from 'astro/types';
import type { ImageMetadata } from 'astro';

export interface WidgetProps {
  id?: string;
  isDark?: boolean;
  classes?: Record<string, string>;
  bg?: string;
}

export interface ItemGridClasses {
  container?: string;
  panel?: string;
  icon?: string;
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

export interface CallToAction extends HTMLAttributes<'a'> {
  text?: string;
  href?: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link' | 'outline';
}

export interface Hero extends WidgetProps {
  title?: string | null;
  subtitle?: string | null;
  tagline?: string | null;
  content?: string | null;
  actions?: Array<CallToAction> | string | null;
  image?: string | ImageMetadata | null;
  callToAction?: CallToAction;
}

type HTMLInputType =
  | 'text'
  | 'email'
  | 'tel'
  | 'url'
  | 'password'
  | 'number'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week'
  | 'color'
  | 'search'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'submit'
  | 'reset'
  | 'button'
  | 'image'
  | 'hidden';

export interface Form {
  inputs?: Array<{
    type?: HTMLInputType;
    name: string;
    label?: string;
    autocomplete?: string;
    placeholder?: string;
  }>;
  textarea?: {
    name?: string;
    label?: string;
    placeholder?: string;
    rows?: number;
  };
  disclaimer?: {
    label: string;
  };
  button?: string;
  description?: string;
}

export interface ItemGrid {
  items?: Array<ItemProps>;
  columns?: 2 | 3 | 4;
  defaultIcon?: string;
  classes?: ItemGridClasses;
}

export interface Content extends WidgetProps {
  title?: string;
  subtitle?: string;
  tagline?: string;
  content?: string;
  items?: Array<ItemProps>;
  image?: string | ImageMetadata;
  isReversed?: boolean;
  isAfterContent?: boolean;
  callToAction?: CallToAction;
  columns?: number;
}

export interface Features extends WidgetProps {
  title?: string;
  subtitle?: string;
  tagline?: string;
  items?: Array<ItemProps>;
  columns?: number;
}

export interface Stats extends WidgetProps {
  title?: string;
  subtitle?: string;
  tagline?: string;
  stats?: Array<{
    amount: number;
    title: string;
    icon?: string;
  }>;
}

export interface Testimonials extends WidgetProps {
  title?: string;
  subtitle?: string;
  tagline?: string;
  testimonials?: Array<{
    title?: string;
    testimonial?: string;
    name?: string;
    job?: string;
    image?: string | ImageMetadata;
  }>;
}

export interface Brands extends WidgetProps {
  title?: string;
  subtitle?: string;
  tagline?: string;
  icons?: string[];
  images?: Array<{
    src: string;
    alt?: string;
  }>;
}

export interface FAQs extends WidgetProps {
  title?: string;
  subtitle?: string;
  tagline?: string;
  items?: Array<ItemProps>;
  columns?: number;
}

export interface Steps extends WidgetProps {
  title?: string;
  subtitle?: string;
  tagline?: string;
  items?: Array<ItemProps>;
  image?: string | ImageMetadata;
  isReversed?: boolean;
}

export interface Footer extends WidgetProps {
  socialLinks?: Array<{
    ariaLabel: string;
    href: string;
    text?: string;
    icon?: string;
  }>;
  footNote?: string;
  links?: Array<{
    title?: string;
    links: Array<{
      text?: string;
      href?: string;
    }>;
  }>;
  secondaryLinks?: Array<{
    text?: string;
    href?: string;
  }>;
}

export interface Header extends WidgetProps {
  links?: Array<{
    text?: string;
    href?: string;
    links?: Array<{
      text: string;
      href: string;
    }>;
  }>;
  actions?: Array<{
    text?: string;
    href?: string;
    type?: string;
  }>;
  isSticky?: boolean;
  showToggleTheme?: boolean;
  showRssFeed?: boolean;
  position?: string;
}
