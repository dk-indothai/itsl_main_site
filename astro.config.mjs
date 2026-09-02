import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
    // Sharp is a native Node module; keep it outside Vite's module transform.
    ssr: { external: ['sharp'] },
  },
  // Production site/canonical configuration is deliberately deferred.
});
