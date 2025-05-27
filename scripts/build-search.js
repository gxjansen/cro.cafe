#!/usr/bin/env node

/**
 * Build script to integrate PageFind search with Astro
 * This script runs after the Astro build to generate the search index
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

const DIST_DIR = 'dist';
const PAGEFIND_DIR = path.join(DIST_DIR, 'pagefind');

console.log('🔍 Building PageFind search index...');

try {
  // Ensure dist directory exists
  if (!existsSync(DIST_DIR)) {
    console.error('❌ Dist directory not found. Please run `npm run build` first.');
    process.exit(1);
  }

  // Create pagefind directory if it doesn't exist
  if (!existsSync(PAGEFIND_DIR)) {
    mkdirSync(PAGEFIND_DIR, { recursive: true });
  }

  // Run PageFind to index the built site
  console.log('📝 Indexing content...');

  const pagefindCommand = `npx pagefind --site ${DIST_DIR} --output-path ${PAGEFIND_DIR}`;

  execSync(pagefindCommand, {
    stdio: 'inherit',
    cwd: process.cwd(),
  });

  console.log('✅ PageFind search index built successfully!');
  console.log(`📁 Search files generated in: ${PAGEFIND_DIR}`);
} catch (error) {
  console.error('❌ Error building PageFind search index:', error.message);
  process.exit(1);
}
