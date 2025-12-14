import path from 'node:path';
import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, type Plugin } from 'vite';
import arraybuffer from 'vite-plugin-arraybuffer';
import svgr from 'vite-plugin-svgr';

/**
 * SQL Loader Plugin
 *
 * Transforms .sql files into ES modules that export the SQL as a template string.
 * This is useful for:
 * - Loading Drizzle migration files for Durable Objects (DO migrations run in-app)
 * - Importing raw SQL queries that need to be executed at runtime
 * - Keeping SQL files separate from TypeScript for better syntax highlighting
 *
 * Usage:
 *   import migration from './migrations/0001_create_table.sql';
 *   await db.exec(migration);
 */
const sqlLoader = (): Plugin => ({
  name: 'sql-loader',
  transform(code, id) {
    if (id.endsWith('.sql')) {
      // Escape backticks and template literal syntax to safely embed in a template string
      const escapedCode = code
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\${/g, '\\${');
      return `export default \`${escapedCode}\`;`;
    }
  },
});

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 4284,
  },
  plugins: [
    // TanStack Router - generates type-safe routes from file-based routing
    // Must be before react() to transform route files first
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),

    // React with SWC for fast compilation
    react(),

    // Tailwind CSS v4 with Vite-native integration
    tailwindcss(),

    /**
     * SVGR - Import SVGs as React components
     *
     * Allows importing .svg files as React components with full prop support.
     * Useful for icons that need dynamic styling (color, size) via props.
     *
     * Usage:
     *   import { ReactComponent as Logo } from './logo.svg';
     *   // or with default export:
     *   import Logo from './logo.svg?react';
     *   <Logo className="w-6 h-6 text-blue-500" />
     */
    svgr(),

    /**
     * ArrayBuffer Plugin - Import binary files as ArrayBuffer
     *
     * Enables importing binary files (WASM, fonts, etc.) as ArrayBuffer.
     * Useful for:
     * - Loading WASM modules that need ArrayBuffer input
     * - Embedding binary assets directly in the bundle
     * - Working with binary data in Cloudflare Workers
     *
     * Usage:
     *   import wasmBuffer from './module.wasm?arraybuffer';
     *   const module = await WebAssembly.instantiate(wasmBuffer);
     */
    arraybuffer(),

    /**
     * SQL Loader - Import .sql files as ES modules
     *
     * See sqlLoader() definition above for details.
     */
    sqlLoader(),

    // Cloudflare Workers/Pages integration
    cloudflare(),
  ],
  resolve: {
    alias: [
      // More specific patterns first
      {
        find: '@/worker/schemas',
        replacement: path.resolve(__dirname, './worker/schemas'),
      },
      {
        find: '@/worker',
        replacement: path.resolve(__dirname, './worker/api/index.ts'),
      },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
});
