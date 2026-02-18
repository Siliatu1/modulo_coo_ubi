import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl() // Habilita HTTPS para desarrollo
  ],
  server: {
    https: true,
    host: true, // Permite acceso desde otros dispositivos en la red
    port: 5173,
    open: true
  }
})
