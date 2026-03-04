import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'ecall',
  publicDir: '../public',
  base: '/e-call/',
  build: {
    outDir: '../dist-ecall',
    emptyOutDir: true,
  },
});
