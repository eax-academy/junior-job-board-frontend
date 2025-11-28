import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
        allowedHosts: [
            "junior-job-board-frontend-production.up.railway.app"
        ],
        host: true,
        port: 5173
    }
})
