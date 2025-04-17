import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load environment variables based on current mode (.env, .env.development, etc.)
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5001', // ⬅️ use env here
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});
