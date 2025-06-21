import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      '9e9d-2406-7488-5d34-ad69-5c3d-e7e3-5007.ngrok-free.app',
      'c18f-2406-7400-54-2340-a0d9-5e34-e7e3-5807.ngrok-free.app',
      // You can add more hosts here if needed, e.g., 'localhost', '127.0.0.1'
    ],
  },
})