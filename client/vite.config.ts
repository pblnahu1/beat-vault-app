import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    host: '0.0.0.0', // sigue funcionando para local
    allowedHosts: ['.onrender.com'], // permite todos los subdominios de render
    // o más específico:
    // allowedHosts: ['fluxshop-app-1.onrender.com'],
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
