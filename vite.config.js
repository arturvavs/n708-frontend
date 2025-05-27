import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://192.168.5.87:5000',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'http://192.168.5.87:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})