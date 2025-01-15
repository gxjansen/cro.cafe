import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const platformsDir = path.join(__dirname, '..', 'src', 'assets', 'images', 'platforms');

async function convertIcon(iconPath: string) {
  try {
    const fileName = path.basename(iconPath);
    const fileNameWithoutExt = path.parse(fileName).name;
    const pngPath = path.join(platformsDir, `${fileNameWithoutExt}.png`);

    const inputBuffer = await fs.readFile(iconPath);
    const outputBuffer = await sharp(inputBuffer)
      .resize(48, 48, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    await fs.writeFile(pngPath, outputBuffer);
    console.log(`✓ Converted ${fileName} to PNG`);
  } catch (error) {
    console.error(`✗ Error converting ${iconPath}:`, error);
  }
}

async function convertAllIcons() {
  try {
    console.log('Starting icon conversion...');
    const files = await fs.readdir(platformsDir);
    const svgFiles = files.filter((file) => file.endsWith('.svg'));

    await Promise.all(svgFiles.map((file) => convertIcon(path.join(platformsDir, file))));
    console.log('Finished converting icons');
  } catch (error) {
    console.error('Error reading directory:', error);
  }
}

convertAllIcons().catch(console.error);
