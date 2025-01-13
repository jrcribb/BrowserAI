import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' 
    ? '/sauravpanda/BrowserAI/'
    : '/',
  plugins: [react()],
  build: {
    commonjsOptions: {
      include: [/@browserai\/browserai/, /node_modules/]
    },
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  optimizeDeps: {
    include: ['@browserai/browserai']
  },
  server: {
    middlewareMode: false,
    fs: {
      strict: true
    }
  }
})
