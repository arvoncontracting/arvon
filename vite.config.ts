import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/arvon/',
  plugins: [react()],
  build: {
    target: 'es2020',
    cssMinify: true,
  },
  ssr: {
    noExternal: ['gsap'],
  },
});
