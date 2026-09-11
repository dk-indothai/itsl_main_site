import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { productionOrigin } from './src/data/site.ts';

export default defineConfig({
  output: 'static',
  site: productionOrigin,
  // Keep authored links slash-terminated, but let the custom 404 handle either
  // form. Astro's dev/preview servers otherwise replace 404.astro with their
  // own trailing-slash mismatch page before the Home redirect can run.
  trailingSlash: 'ignore',
  env: {
    schema: {
      PUBLIC_STRAPI_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      SITE_INDEXING: envField.boolean({
        context: 'server',
        access: 'secret',
        default: true,
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
    // Sharp is a native Node module; keep it outside Vite's module transform.
    ssr: { external: ['sharp'] },
  },
});
