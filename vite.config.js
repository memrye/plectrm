import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/renderer',                  
  server: {
    port: 3000,
    strictPort: true,
    open: false
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true
  },
});