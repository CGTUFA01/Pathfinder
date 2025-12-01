import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import flowbiteReact from 'flowbite-react/plugin/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), flowbiteReact()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
  resolve: {
    alias: {
      '/src': path.resolve(__dirname, './src'),
    },
  },
})

