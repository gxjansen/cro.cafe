declare module '@unpic/astro' {
  import type { AstroIntegration } from 'astro';

  export interface UnpicConfig {
    src: string;
    width?: number;
    height?: number;
    alt?: string;
    loading?: 'eager' | 'lazy';
    decoding?: 'async' | 'auto' | 'sync';
    class?: string;
    style?: string;
  }

  export default function unpicIntegration(config?: UnpicConfig): AstroIntegration;
}
