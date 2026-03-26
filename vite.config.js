import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          router: ['react-router-dom'],
          i18n: ['i18next', 'react-i18next'],
          animations: ['framer-motion'],
          icons: ['lucide-react'],
        }
      }
    }
  }
})
