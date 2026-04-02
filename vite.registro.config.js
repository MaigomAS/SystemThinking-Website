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
  },
});
