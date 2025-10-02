import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  // Auto-detect deployment environment
  let base = '/'
  
  if (process.env.GITHUB_ACTIONS) {
    // Building on GitHub Actions for GitHub Pages
    base = '/ROAR-Website/'
  } else if (process.env.NETLIFY) {
    // Building on Netlify
    base = '/'
  } else if (command === 'serve') {
    // Local development
    base = '/'
  }
  
  console.log(`Building with base path: ${base}`)
  
  return {
    plugins: [react()],
    base: base,
    build: {
      outDir: 'dist'
    }
  }
})