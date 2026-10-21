import { defineConfig } from 'vite'
import htmlInclude from 'vite-plugin-html-include'
import ansiTextConverter from './vite-ansi-text-converter/index.ts'
// import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  // devtools: true,
  plugins: [
    // Inspect(),
    htmlInclude(),
    ansiTextConverter()
  ]
})
