import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'ecall',
  plugins: [react()],
  base: '/e-call/',
  build: {
    outDir: '../dist-ecall',
    emptyOutDir: true,
  },
});