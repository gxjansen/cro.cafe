import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import { pipeline } from 'stream/promises';

/**
 * Downloads an image from a given URL and saves it to the specified directory.
 * @param imageUrl The URL of the image to download.
 * @param destinationDir The directory where the image should be saved.
 * @param fileName The name to save the image as (optional, defaults to the original file name).
 * @returns The path to the downloaded image.
 */
export async function downloadImage(
  imageUrl: string,
  destinationDir: string,
  fileName?: string
): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('No response body received');
    }

    const parsedUrl = new URL(imageUrl);
    const defaultFileName = path.basename(parsedUrl.pathname);
    const finalFileName = fileName || defaultFileName;
    const finalPath = path.join(destinationDir, finalFileName);

    // Ensure the destination directory exists
    fs.mkdirSync(destinationDir, { recursive: true });

    // Create a write stream
    const fileStream = fs.createWriteStream(finalPath);

    // Use pipeline to handle the streaming
    await pipeline(response.body, fileStream);

    return finalPath;
  } catch (error) {
    console.error(`Error downloading image from ${imageUrl}:`, error);
    throw error;
  }
}
