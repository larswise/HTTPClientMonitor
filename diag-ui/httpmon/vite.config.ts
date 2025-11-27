import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: '/diag/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  // configure debug port
  server: {
    port: 5175,
    open: true
  }
})
