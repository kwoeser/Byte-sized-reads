import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],

  // https://vite.dev/config/server-options#server-proxy
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5174",  
        changeOrigin: true,
        // removes /api
        rewrite: (path) => path.replace(/^\/api/, ""), 
      },
    },
  },
});

