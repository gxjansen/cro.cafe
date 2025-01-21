import type { ItemProps } from './widgets';

export interface PricingItem extends ItemProps {
  price?: string;
  period?: string;
  items?: Array<{
    description: string;
    icon?: string;
  }>;
  callToAction?: {
    text: string;
    href: string;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'link' | 'outline';
  };
  hasRibbon?: boolean;
  ribbonTitle?: string;
}
