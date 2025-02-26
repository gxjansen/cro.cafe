/**
 * Script to copy host images from src/assets/images/hosts to public/images/hosts
 * This ensures that host images are available in the public directory for Netlify
 */

import fs from 'fs';
import path from 'path';

// Define source and destination directories
const sourceDir = path.join(process.cwd(), 'src/assets/images/hosts');
const destDir = path.join(process.cwd(), 'public/images/hosts');

console.log(`Source directory: ${sourceDir}`);
console.log(`Destination directory: ${destDir}`);

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  console.log(`Creating directory: ${destDir}`);
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy all files from source to destination
try {
  const files = fs.readdirSync(sourceDir);
  console.log(`Found ${files.length} host images to copy: ${files.join(', ')}`);

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);

    // Only copy files, not directories
    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${file} from ${sourcePath} to ${destPath}`);
    }
  }

  console.log('Host images copied successfully!');
} catch (error) {
  console.error('Error copying host images:', error);
  process.exit(1);
}