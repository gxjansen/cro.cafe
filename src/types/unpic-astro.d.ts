declare module '@unpic/astro' {
  import type { AstroComponentFactory } from 'astro/dist/runtime/server';

  export interface UnpicImageProps {
    src: string;
    width?: number;
    height?: number;
    alt?: string;
    loading?: 'eager' | 'lazy';
    decoding?: 'async' | 'auto' | 'sync';
    class?: string;
    style?: string;
    background?: string;
    layout?: 'constrained' | 'fixed' | 'fullWidth';
    aspectRatio?: number;
    breakpoints?: number[];
    sizes?: string;
  }

  export const UnpicImage: AstroComponentFactory<UnpicImageProps>;
}
