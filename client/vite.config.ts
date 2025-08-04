import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  // server: {
  //   port: 5173,
  //   strictPort: true,
  //   host: "0.0.0.0",
  //   origin: "http://localhost:5173"
  // },
  server: {
    allowedHosts: ['https://fluxshop-app.onrender.com'],
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
