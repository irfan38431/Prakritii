import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {},
    modules: false,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "bootstrap/scss/bootstrap.scss";`,
      },
    },
  },
});
