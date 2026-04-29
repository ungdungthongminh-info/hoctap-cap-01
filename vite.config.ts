import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const isWebBuild = process.env.VITE_WEB === 'true';
const appVersion = process.env.npm_package_version || process.env.VITE_APP_VERSION || '0.1.0';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  base: isWebBuild ? '/' : './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@student': path.resolve(__dirname, './src/modules/student'),
      '@parent': path.resolve(__dirname, './src/modules/parent'),
      '@content': path.resolve(__dirname, './src/modules/content'),
    },
  },
  build: {
    outDir: 'dist',
  },
});
