import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { arvonHtml } from './build/htmlPlugin';

export default defineConfig({
  base: '/arvon/',
  plugins: [react(), arvonHtml()],
  build: {
    target: 'es2020',
    cssMinify: true,
  },
});
