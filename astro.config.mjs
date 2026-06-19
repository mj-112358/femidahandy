import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/three/')) return 'three';
            if (id.includes('/motion/') || id.includes('/framer-motion/')) return 'motion';
            if (id.includes('/d3-') || id.includes('/topojson-') || id.includes('/world-atlas/')) return 'geo';
          },
        },
      },
    },
  },
});
