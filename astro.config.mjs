import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  env: {
    schema: {
      PUBLIC_STRAPI_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
    // Sharp is a native Node module; keep it outside Vite's module transform.
    ssr: { external: ['sharp'] },
  },
  // Production site/canonical configuration is deliberately deferred.
});
