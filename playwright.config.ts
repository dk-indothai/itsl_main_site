import { defineConfig } from '@playwright/test';
import process from 'node:process';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  workers: 2,
  timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:4325', trace: 'retain-on-failure' },
  webServer: {
    command: 'node scripts/preview-for-tests.mjs',
    url: 'http://127.0.0.1:4325',
    reuseExistingServer: !process.env.CI,
  },
});
