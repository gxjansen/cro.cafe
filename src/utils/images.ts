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
  guest: {
    card: {
      width: 80,
      height: 80,
    },
    detail: {
      width: 200,
      height: 200,
    },
  },
} as const;

/**
 * Get optimized guest image URL with fallback
 */
export async function getGuestImage(
  imageUrl: string | undefined,
  size: keyof typeof IMAGE_SIZES.guest
) {
  if (!imageUrl) {
    throw new Error('Image URL is required');
  }

  const { width, height } = IMAGE_SIZES.guest[size];
  const optimizedImage = await getImage({
    src: imageUrl,
    width,
    height,
    format: 'webp',
  });

  return {
    ...optimizedImage,
    width,
    height,
  };
}

/**
 * Get optimized host image URL
 */
export async function getHostImage(
  imageUrl: string | undefined,
  size: keyof typeof IMAGE_SIZES.guest // Reuse guest image sizes
) {
  if (!imageUrl) {
    throw new Error('Image URL is required');
  }

  // For host images, we need to handle paths that start with /src/assets/images/hosts/
  // These paths work locally but not on Netlify
  let processedImageUrl = imageUrl;
  
  // If the path starts with /src/assets/images/hosts/, we need to handle it differently
  if (imageUrl.startsWith('/src/assets/images/hosts/')) {
    // For local development, use the original path
    // For production (Netlify), we'll need to copy these files to the public directory
    // during the build process
    
    // For now, let's use a hardcoded path to the public directory
    const filename = imageUrl.split('/').pop();
    processedImageUrl = `/images/hosts/${filename}`;
    
    // Log the path for debugging
    console.log(`Host image path: ${imageUrl} -> ${processedImageUrl}`);
  }

  try {
    const { width, height } = IMAGE_SIZES.guest[size];
    const optimizedImage = await getImage({
      src: processedImageUrl,
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
    console.error(`Error optimizing host image: ${processedImageUrl}`, error);
    
    // Fallback to using the original URL without optimization
    return {
      src: processedImageUrl,
      width: IMAGE_SIZES.guest[size].width,
      height: IMAGE_SIZES.guest[size].height,
    };
  }
}

/**
 * Get optimized episode image URL with fallback
 */
export async function getEpisodeImage(
  imageUrl: string | undefined,
  size: keyof typeof IMAGE_SIZES.episode
) {
  // Directly use the provided image URL without fallback
  if (!imageUrl) {
    throw new Error('Image URL is required');
  }

  const { width, height } = IMAGE_SIZES.episode[size];
  const optimizedImage = await getImage({
    src: imageUrl,
    width,
    height,
    format: 'webp',
  });

  return {
    ...optimizedImage,
    width,
    height,
  };
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
