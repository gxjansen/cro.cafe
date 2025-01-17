import { getImage } from 'astro:assets';
import { Image } from '@unpic/astro';

import type { ImageMetadata } from 'astro';
import type { HTMLAttributes } from 'astro/types';

type Layout = 'fixed' | 'constrained' | 'fullWidth' | 'cover' | 'responsive' | 'contained';

export interface ImageProps extends Omit<HTMLAttributes<'img'>, 'src'> {
  src?: string | ImageMetadata | null;
  width?: string | number | null;
  height?: string | number | null;
  alt?: string | null;
  loading?: 'eager' | 'lazy' | null;
  decoding?: 'sync' | 'async' | 'auto' | null;
  style?: string;
  srcset?: string | null;
  sizes?: string | null;
  fetchpriority?: 'high' | 'low' | 'auto' | null;

  layout?: Layout;
  widths?: number[] | null;
  aspectRatio?: string | number | null;
  objectPosition?: string;

  format?: string;
}

export type ImagesOptimizer = (
  image: ImageMetadata | string,
  breakpoints: number[],
  width?: number,
  height?: number,
  format?: string
) => Promise<Array<{ src: string; width: number }>>;

const config = {
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  deviceSizes: [
    640, 750, 828, 960, 1080, 1280, 1668, 1920, 2048, 2560, 3200, 3840, 4480, 5120, 6016,
  ],
  formats: ['image/webp'],
};

const computeHeight = (width: number, aspectRatio: number) => {
  return Math.floor(width / aspectRatio);
};

const parseAspectRatio = (aspectRatio: number | string | null | undefined): number | undefined => {
  if (typeof aspectRatio === 'number') return aspectRatio;

  if (typeof aspectRatio === 'string') {
    const match = aspectRatio.match(/(\d+)\s*[/:]\s*(\d+)/);

    if (match) {
      const [, numStr, denStr] = match;
      const num = Number(numStr);
      const den = Number(denStr);

      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        return num / den;
      }
    }

    const numericValue = parseFloat(aspectRatio);
    if (!isNaN(numericValue)) {
      return numericValue;
    }
  }

  return undefined;
};

export const getSizes = (width?: number, layout?: Layout): string | undefined => {
  if (!width || !layout) {
    return undefined;
  }
  switch (layout) {
    case `constrained`:
      return `(min-width: ${width}px) ${width}px, 100vw`;
    case `fixed`:
      return `${width}px`;
    case `fullWidth`:
      return `100vw`;
    default:
      return undefined;
  }
};

const pixelate = (value?: number) => (value || value === 0 ? `${value}px` : undefined);

const getStyle = ({
  width,
  height,
  aspectRatio,
  layout,
  objectFit = 'cover',
  objectPosition = 'center',
  background,
}: {
  width?: number | undefined;
  height?: number | undefined;
  aspectRatio?: number | undefined;
  objectFit?: string | undefined;
  objectPosition?: string | undefined;
  layout?: string | undefined;
  background?: string | undefined;
}) => {
  const styleEntries: Array<[prop: string, value: string | undefined]> = [
    ['object-fit', objectFit],
    ['object-position', objectPosition],
  ];

  if (
    background?.startsWith('https:') ||
    background?.startsWith('http:') ||
    background?.startsWith('data:')
  ) {
    styleEntries.push(['background-image', `url(${background})`]);
    styleEntries.push(['background-size', 'cover']);
    styleEntries.push(['background-repeat', 'no-repeat']);
  } else {
    styleEntries.push(['background', background]);
  }

  if (layout === 'fixed') {
    styleEntries.push(['width', pixelate(width)]);
    styleEntries.push(['height', pixelate(height)]);
    styleEntries.push(['object-position', 'top left']);
  }

  if (layout === 'constrained') {
    styleEntries.push(['max-width', pixelate(width)]);
    styleEntries.push(['max-height', pixelate(height)]);
    if (aspectRatio) {
      styleEntries.push(['aspect-ratio', `${aspectRatio}`]);
    }
    styleEntries.push(['width', '100%']);
  }

  if (layout === 'fullWidth') {
    styleEntries.push(['width', '100%']);
    if (aspectRatio) {
      styleEntries.push(['aspect-ratio', `${aspectRatio}`]);
    }
    styleEntries.push(['height', pixelate(height)]);
  }

  if (layout === 'responsive') {
    styleEntries.push(['width', '100%']);
    styleEntries.push(['height', 'auto']);
    if (aspectRatio) {
      styleEntries.push(['aspect-ratio', `${aspectRatio}`]);
    }
  }

  if (layout === 'contained') {
    styleEntries.push(['max-width', '100%']);
    styleEntries.push(['max-height', '100%']);
    styleEntries.push(['object-fit', 'contain']);
    if (aspectRatio) {
      styleEntries.push(['aspect-ratio', `${aspectRatio}`]);
    }
  }

  if (layout === 'cover') {
    styleEntries.push(['max-width', '100%']);
    styleEntries.push(['max-height', '100%']);
  }

  const styles = Object.fromEntries(styleEntries.filter(([, value]) => value));

  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
};

const getBreakpoints = ({
  width,
  breakpoints,
  layout,
}: {
  width?: number | undefined;
  breakpoints?: number[] | undefined;
  layout: Layout;
}): number[] => {
  if (
    layout === 'fullWidth' ||
    layout === 'cover' ||
    layout === 'responsive' ||
    layout === 'contained'
  ) {
    return breakpoints || config.deviceSizes;
  }

  if (!width) {
    return [];
  }

  const doubleWidth = width * 2;
  if (layout === 'fixed') {
    return [width, doubleWidth];
  }

  if (layout === 'constrained') {
    return [
      width,
      doubleWidth,
      ...(breakpoints || config.deviceSizes).filter((w) => w < doubleWidth),
    ];
  }

  return [];
};

export const astroAsseetsOptimizer: ImagesOptimizer = async (
  image,
  breakpoints,
  _width,
  _height,
  format = undefined
) => {
  if (!image) {
    return [];
  }

  return Promise.all(
    breakpoints.map(async (w: number) => {
      const result = await getImage({
        src: image,
        width: w,
        inferSize: true,
        ...(format ? { format: format } : {}),
      });

      return {
        src: result?.src,
        width: result?.attributes?.width ?? w,
        height: result?.attributes?.height,
      };
    })
  );
};

export const UnpicImage = Image;

export const isUnpicCompatible = (src: string | ImageMetadata): boolean => {
  if (typeof src === 'string') {
    return src.startsWith('http') || src.startsWith('https');
  }
  return false;
};

export const unpicOptimizer: ImagesOptimizer = async (
  image,
  breakpoints,
  width,
  height,
  format
) => {
  if (!image) {
    return [];
  }

  return breakpoints.map((w: number) => ({
    src: typeof image === 'string' ? image : image.src,
    width: w,
    height: height || undefined,
  }));
};

export async function getImagesOptimized(
  image: ImageMetadata | string,
  {
    src: _,
    width,
    height,
    sizes,
    aspectRatio,
    objectPosition,
    widths,
    layout = 'constrained',
    style = '',
    format,
    ...rest
  }: ImageProps,
  transform: ImagesOptimizer = () => Promise.resolve([])
): Promise<{ src: string; attributes: HTMLAttributes<'img'> }> {
  if (typeof image !== 'string') {
    width ||= Number(image.width) || undefined;
    height ||=
      typeof width === 'number' ? computeHeight(width, image.width / image.height) : undefined;
  }

  width = (width && Number(width)) || undefined;
  height = (height && Number(height)) || undefined;

  widths ||= config.deviceSizes;
  sizes ||= getSizes(Number(width) || undefined, layout);
  aspectRatio = parseAspectRatio(aspectRatio);

  if (aspectRatio) {
    if (width) {
      if (!height) {
        height = width / aspectRatio;
      }
    } else if (height) {
      width = Number(height * aspectRatio);
    } else if (layout !== 'fullWidth') {
      console.error('When aspectRatio is set, either width or height must also be set');
      console.error('Image', image);
    }
  } else if (width && height) {
    aspectRatio = width / height;
  } else if (layout !== 'fullWidth') {
    console.error('Either aspectRatio or both width and height must be set');
    console.error('Image', image);
  }

  let breakpoints = getBreakpoints({ width: width, breakpoints: widths, layout: layout });
  breakpoints = [...new Set(breakpoints)].sort((a, b) => a - b);

  const srcset = (
    await transform(
      image,
      breakpoints,
      Number(width) || undefined,
      Number(height) || undefined,
      format
    )
  )
    .map(({ src, width }) => `${src} ${width}w`)
    .join(', ');

  return {
    src: typeof image === 'string' ? image : image.src,
    attributes: {
      width: width,
      height: height,
      srcset: srcset || undefined,
      sizes: sizes,
      style: `${getStyle({
        width: width,
        height: height,
        aspectRatio: aspectRatio,
        objectPosition: objectPosition,
        layout: layout,
      })}${style ?? ''}`,
      ...rest,
    },
  };
}
