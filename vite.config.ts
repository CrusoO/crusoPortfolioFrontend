import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Enable code splitting for better performance
    rollupOptions: {
      output: {
        // Split chunks for better caching
        manualChunks: {
          // Vendor chunk for third-party libraries
          vendor: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
          // UI components chunk
          ui: ['lucide-vue-next', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          // Animation libraries
          animations: ['gsap'],
          // Email service
          email: ['@emailjs/browser']
        }
      }
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: false,
    // Minify for production
    minify: 'esbuild',
    // Optimize CSS
    cssMinify: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'lucide-vue-next'],
    exclude: ['@vitejs/plugin-vue']
  },
  // Performance optimizations
  server: {
    fs: {
      // Optimize file serving
      strict: true
    }
  }
})
