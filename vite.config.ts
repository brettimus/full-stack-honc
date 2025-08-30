import { cloudflare } from '@cloudflare/vite-plugin';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 4284,
  },
  plugins: [
    // Needs to be before react()
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    cloudflare(),
  ],
});
