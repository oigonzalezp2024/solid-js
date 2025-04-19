import { defineConfig } from 'vite';

export default defineConfig({
  root: './public', // La raíz es tu carpeta de archivos estáticos
  build: {
    outDir: '../dist', // Carpeta donde se generará el proyecto
  },
});