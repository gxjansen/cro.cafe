import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  test: {
    reporters: 'default',
    silent: true,
    testTimeout: 10000,
    outputFile: {
      mode: 'replace',
    },
    exclude: ['**/node_modules/**', '**/dist/**', '**/backup/**'],
  },
});
