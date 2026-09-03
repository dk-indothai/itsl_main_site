import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  workers: 2,
  timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:4325', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run build && node scripts/preview-for-tests.mjs',
    env: { PUBLIC_STRAPI_URL: 'http://strapi.test' },
    url: 'http://127.0.0.1:4325',
    reuseExistingServer: false,
  },
});
