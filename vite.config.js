import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: '/src',
      components: '/src/components',
      pages: '/src/pages',
      api: '/src/api',
      utils: '/src/utils',
      routes: '/src/routes',
      assets: '/src/assets',
      'redux-store': '/src/redux-store',
    },
  },
});