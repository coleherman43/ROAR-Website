import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ROAR-Website/',
  build: {
    outDir: 'dist'
  }
})