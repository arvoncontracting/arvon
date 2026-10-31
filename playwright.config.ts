import { defineConfig, devices } from '@playwright/test';

const port = process.env.PREVIEW_PORT ?? '4173';

export default defineConfig({
  testDir: 'tests',
  timeout: 90_000,
  fullyParallel: true,
  workers: 4,
  reporter: [['list']],
  outputDir: 'test-results',
  use: { baseURL: process.env.SITE_URL ?? `http://localhost:${port}/arvon/` },
  webServer: process.env.SITE_URL
    ? undefined
    : { command: 'npm run preview', url: `http://localhost:${port}/arvon/`, reuseExistingServer: true },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
