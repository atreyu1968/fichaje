import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno basadas en el modo
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: `http://localhost:${env.PORT || 3000}`,
          changeOrigin: true
        }
      }
    },
    optimizeDeps: {
      exclude: ['lucide-react']
    }
  };
});