import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    define: {
      // Safely stringify the API key. If undefined, default to empty string to prevent build/runtime syntax errors.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      // Polyfill process.env for legacy library support
      'process.env': {}, 
    },
  };
});