import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  root: 'src/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },

  server: {
    port: 3000,
    strictPort: true,
    open: false,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true
  },
});