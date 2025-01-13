import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

export function findImage(src: string | ImageMetadata) {
  if (typeof src === 'string') {
    return src;
  }
  return src;
}

/**
 * Default image dimensions for different contexts
 */
export const IMAGE_SIZES = {
  episode: {
    card: {
      width: 800,
      height: 450,
    },
    detail: {
      width: 1200,
      height: 675,
    },
  },
} as const;

/**
 * Get optimized episode image URL with fallback
 */
export async function getEpisodeImage(
  imageUrl: string | undefined,
  size: keyof typeof IMAGE_SIZES.episode
) {
  // If no image URL provided, use default image
  const sourceUrl = imageUrl || '/images/default.png';

  try {
    const { width, height } = IMAGE_SIZES.episode[size];

    // If it's an external URL (like from Transistor), use it directly
    if (sourceUrl.startsWith('http')) {
      return {
        src: sourceUrl,
        width,
        height,
      };
    }

    // For local images, use Astro's image optimization
    const optimizedImage = await getImage({
      src: sourceUrl,
      width,
      height,
      format: 'webp',
    });

    return {
      ...optimizedImage,
      width,
      height,
    };
  } catch (error) {
    console.error(`Error optimizing image ${sourceUrl}:`, error);
    // Return default image on error
    return {
      src: '/images/default.png',
      width: IMAGE_SIZES.episode[size].width,
      height: IMAGE_SIZES.episode[size].height,
    };
  }
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(baseUrl: string, widths: number[]) {
  return widths
    .map((width) => {
      const height = Math.round((width / 16) * 9); // Maintain 16:9 aspect ratio
      return `${baseUrl}?w=${width}&h=${height} ${width}w`;
    })
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints: { width: number; size: string }[]) {
  return breakpoints.map(({ width, size }) => `(min-width: ${width}px) ${size}`).join(', ');
}
