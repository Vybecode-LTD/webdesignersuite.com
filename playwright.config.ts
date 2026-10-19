import { defineConfig, devices } from '@playwright/test';

const port = 4321;

export default defineConfig({
  testDir: 'tests/e2e',
  forbidOnly: Boolean(process.env['CI']),
  retries: 0,
  reporter: process.env['CI'] ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // The smoke tests run on the built site, as Caddy will serve it.
  webServer: {
    command: `npx astro preview --port ${port}`,
    url: `http://localhost:${port}/`,
    reuseExistingServer: !process.env['CI'],
  },
});
