import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const missingPlatforms = ['amazon-music', 'castbox', 'castro', 'podcast-addict'];

// Simple SVG template for a placeholder icon
const generateSvg = (text: string) => `
<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" fill="#4F46E5"/>
  <text x="24" y="24" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle">
    ${text}
  </text>
</svg>
`;

async function generatePlaceholderIcon(platformId: string) {
  try {
    const iconPath = path.join(
      __dirname,
      '..',
      'src',
      'assets',
      'images',
      'platforms',
      `${platformId}.svg`
    );

    // Generate initials from platform name
    const initials = platformId
      .split('-')
      .map((word) => word.charAt(0).toUpperCase())
      .join('');

    await fs.writeFile(iconPath, generateSvg(initials));
    console.log(`✓ Generated placeholder icon for ${platformId}`);
  } catch (error) {
    console.error(`✗ Error generating placeholder icon for ${platformId}:`, error);
  }
}

async function generateAllPlaceholders() {
  console.log('Generating placeholder icons...');

  for (const platform of missingPlatforms) {
    await generatePlaceholderIcon(platform);
  }

  console.log('Finished generating placeholder icons');
}

generateAllPlaceholders().catch(console.error);
