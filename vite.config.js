import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ellipses: resolve(__dirname, 'ellipses.html'),
        rectangles: resolve(__dirname, 'rectangles.html'),
        waves: resolve(__dirname, 'waves.html'),
        celestial: resolve(__dirname, 'celestial.html'),
        lissajous: resolve(__dirname, 'lissajous.html'),
        cube3d: resolve(__dirname, 'cube3d.html'),
      }
    }
  }
});
