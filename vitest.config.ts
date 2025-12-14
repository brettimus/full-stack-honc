import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],

  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['worker/**', 'node_modules/**'],
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/worker': path.resolve(__dirname, './worker/api/index.ts'),
      '@/worker/*': path.resolve(__dirname, './worker/*'),
    },
  },
});
