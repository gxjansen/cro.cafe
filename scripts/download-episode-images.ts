import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { config } from 'dotenv';
import fetch from 'node-fetch';
import sharp from 'sharp';
import type { TransistorEpisode } from '../src/types/transistor';

// Image dimensions copied from src/utils/images.ts
const IMAGE_SIZES = {
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

// Content directories for each language
const CONTENT_DIRS = {
  en: 'src/content/en-episodes',
  nl: 'src/content/nl-episodes',
  de: 'src/content/de-episodes',
  es: 'src/content/es-episodes',
} as const;

// Extend TransistorEpisode attributes to include local image
interface LocalEpisode extends TransistorEpisode {
  attributes: TransistorEpisode['attributes'] & {
    local_image_url?: string;
    transistor_image_url?: string;
  };
}

// Load environment variables
config();

// Ensure images directory exists
function ensureImagesDirectory(language: string) {
  const dir = join(process.cwd(), 'public', 'images', 'episodes', language);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return dir;
}

// Download and optimize image
async function downloadAndOptimizeImage(url: string, outputPath: string) {
  try {
    console.log(`Downloading image from ${url}...`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

    const buffer = await response.buffer();

    // Process image with sharp
    await sharp(buffer)
      .resize(IMAGE_SIZES.episode.detail.width, IMAGE_SIZES.episode.detail.height, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    console.log(`Saved optimized image to ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Error processing image from ${url}:`, error);
    return false;
  }
}

// Process episode images for a language
async function processLanguageEpisodes(language: string) {
  const contentDir = join(process.cwd(), CONTENT_DIRS[language as keyof typeof CONTENT_DIRS]);
  const imagesDir = ensureImagesDirectory(language);

  try {
    const files = await readdir(contentDir);

    for (const file of files) {
      try {
        if (!file.endsWith('.json')) continue;

        const filePath = join(contentDir, file);
        const content = await readFile(filePath, 'utf-8');
        const episode: LocalEpisode = JSON.parse(content);

        const imageUrl = episode.attributes.image_url;
        if (!imageUrl) {
          console.log(`No image URL for episode: ${episode.attributes.title}`);
          continue;
        }

        const imageFileName = `${episode.attributes.slug}.webp`;
        const imagePath = join(imagesDir, imageFileName);
        const localImagePath = `/images/episodes/${language}/${imageFileName}`;

        // Check if we need to download/update the image
        const needsDownload =
          !episode.attributes.local_image_url || // Missing local image
          episode.attributes.local_image_url !== localImagePath || // Path mismatch
          !existsSync(imagePath); // File doesn't exist

        // Check if Transistor image has changed
        const imageChanged = episode.attributes.transistor_image_url !== imageUrl;

        if (needsDownload || imageChanged) {
          // Download and optimize image
          const success = await downloadAndOptimizeImage(imageUrl, imagePath);

          if (success) {
            // Update paths and store Transistor URL for future change detection
            episode.attributes.local_image_url = localImagePath;
            episode.attributes.transistor_image_url = imageUrl;
            await writeFile(filePath, JSON.stringify(episode, null, 2));
            console.log(`Updated episode JSON with local image path: ${localImagePath}`);
          }
        }
      } catch (error) {
        console.error(`Error processing episode ${file}:`, error);
      }
    }
  } catch (error) {
    console.error(`Error processing ${language} episodes:`, error);
  }
}

// Main function
async function downloadAllEpisodeImages() {
  const languages = Object.keys(CONTENT_DIRS) as (keyof typeof CONTENT_DIRS)[];

  try {
    for (const language of languages) {
      console.log(`\nProcessing ${language.toUpperCase()} episodes...`);
      await processLanguageEpisodes(language);
    }
    console.log('\nImage download and optimization completed!');
  } catch (error) {
    console.error('Process failed:', error);
    process.exit(1);
  }
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  downloadAllEpisodeImages();
}
