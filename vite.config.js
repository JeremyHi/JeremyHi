import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // Output to assets/js so Jekyll serves it
    outDir: 'assets/js/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        typing: 'src/typing-effect.ts',
        accordion: 'src/accordion.ts',
        'momentum-bg': 'src/momentum-bg.ts'
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  // Dev server for testing
  server: {
    port: 3000,
    open: false
  }
})
