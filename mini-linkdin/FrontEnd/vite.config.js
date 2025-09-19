import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
const server = import.meta.env.VITE_SERVER;
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: server, // replace with your backend deployed URL
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
