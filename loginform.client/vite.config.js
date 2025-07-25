import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// XLS/XLSX file import support (static asset handling)
const assetFileExtensions = ['xls', 'xlsx'];

let https = false;
if (process.env.NODE_ENV !== 'production') {
  try {
    const { httpsOptions } = await import('./https-config.js');
    https = httpsOptions;
  } catch (e) {
    console.warn('HTTPS config failed:', e.message);
  }
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    https,
    proxy: {
      '/api': {
        target: 'https://localhost:7136',
        changeOrigin: true,
        secure: false
      }
    },
    port: 64033
  },
  assetsInclude: assetFileExtensions.map(ext => `**/*.${ext}`)
});
