import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const base = mode === 'production' ? '/ROAR-Website/' : '/'
  
  return {
    plugins: [react()],
    base: base,
    build: {
      outDir: 'dist'
    }
  }
})