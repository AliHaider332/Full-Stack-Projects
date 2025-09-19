import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://full-stack-projects-red.vercel.app', // replace with your backend deployed URL
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
