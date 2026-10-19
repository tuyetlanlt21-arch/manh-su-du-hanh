import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/manh-su-du-hanh/',
  server: {
    watch: {
      ignored: (path) => /(^|[\\/])\.chrome-[^\\/]*/.test(path),
    },
  },
})
