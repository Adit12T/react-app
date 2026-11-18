/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://adit12t.github.io/react-app/ when deployed to GitHub Pages.
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/react-app/' : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: false,
  },
})
