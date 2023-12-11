import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    commonjs({
      filter(id) {
        if (id.includes('node_modules/redux-storage/build-es')) {
          return true;
        }
      },
    }),
  ],
  resolve: {
    alias: {
      src: '/src',
      components: '/src/components',
      pages: '/src/pages',
      api: '/src/api',
      utils: '/src/utils',
      routes: '/src/routes',
      assets: '/src/assets',
      constants: '/src/constants',
      context: '/src/context',
      'redux-store': '/src/redux-store',
    },
  },
});
