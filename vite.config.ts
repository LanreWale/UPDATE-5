// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    strictPort: true,           // fail if port taken
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,               // if you use WebSockets later
      }
    },
    hmr: {
      overlay: true           // show errors on screen
    }
  },

  resolve: {
    alias: {
      '@': '/src'
    }
  }
})