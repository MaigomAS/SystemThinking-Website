import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'registro',
  publicDir: '../public',
  base: '/registro/',
  build: {
    outDir: '../dist-registro',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'registro/index.html'),
        privacy: resolve(__dirname, 'registro/privacy/index.html'),
        community: resolve(__dirname, 'registro/community/index.html'),
      },
    },
  },
});
