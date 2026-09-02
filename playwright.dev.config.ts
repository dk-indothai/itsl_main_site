import { defineConfig } from '@playwright/test';
import previewConfig from './playwright.config';

// Exercise the same asset/layout checks against Astro's on-demand image service.
// A passing static build does not prove that development image requests work.
export default defineConfig({
  ...previewConfig,
  outputDir: 'test-results/dev',
  grep: /homepage has no overflow or missing assets/,
  use: { ...previewConfig.use, baseURL: 'http://127.0.0.1:4327' },
  webServer: {
    command: 'node scripts/dev-for-tests.mjs',
    url: 'http://127.0.0.1:4327',
    reuseExistingServer: false,
  },
});
