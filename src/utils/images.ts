import type { ImageMetadata } from 'astro';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';

// This will be populated in Astro components
let images: Record<string, { default: ImageMetadata }> = {};

// Only run glob in Astro context
if (typeof import.meta !== 'undefined' && 'glob' in import.meta) {
  images = import.meta.glob<{ default: ImageMetadata }>(
    '../assets/images/**/*.{jpeg,jpg,png,gif,webp}',
    {
      eager: true,
    }
  );
}

/**
 * Find and process an image from various sources
 * @param src The image source (URL, path, or ImageMetadata)
 * @returns The processed image or the original source if it's a URL
 */
/**
 * Download an image from a URL and save it to the assets directory
 * @param url The URL of the image to download
 * @param targetDir The directory where to save the image (e.g., 'src/assets/images/guests')
 * @param fileName The name of the file with extension (e.g., 'profile.jpg')
 * @returns The complete path to the downloaded image (e.g., 'src/assets/images/guests/profile.jpg')
 * @throws {Error} If the URL is invalid, download fails, or directory creation fails
 */
export async function downloadImage(
  url: string,
  targetDir: string,
  fileName: string
): Promise<string> {
  if (!url || !targetDir || !fileName) {
    throw new Error('URL, target directory, and filename are required');
  }

  if (!fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    throw new Error('Invalid image file extension');
  }

  const assetsDir = path.join(process.cwd(), targetDir);
  const fullPath = path.join(assetsDir, fileName);
  const relativePath = path.join(targetDir, fileName);

  // Create directory if it doesn't exist
  if (!fs.existsSync(assetsDir)) {
    try {
      fs.mkdirSync(assetsDir, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create directory ${assetsDir}: ${error}`);
    }
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    fs.writeFileSync(fullPath, uint8Array);

    return relativePath;
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
    throw error;
  }
}

export async function findImage(src: string | ImageMetadata): Promise<string | ImageMetadata> {
  if (typeof src === 'string') {
    if (src.startsWith('http://') || src.startsWith('https://')) {
      // Return external URLs as-is
      return src;
    }

    // Try to find the image in our static imports
    const imagePath = `../assets/images/${src}`;
    const imageModule = images[imagePath];
    if (imageModule && 'default' in imageModule) {
      return imageModule.default;
    }

    console.warn(`Image not found: ${src}`);
    return src;
  }

  return src;
}
