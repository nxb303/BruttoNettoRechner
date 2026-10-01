import { defineConfig } from '@playwright/test';

const PORT = 4180;

export default defineConfig({
  testDir: 'test/e2e',
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Das vorinstallierte Chromium passt zur gepinnten Playwright-Version; kein `playwright install` nötig.
    browserName: 'chromium',
  },
  webServer: {
    command: 'npm run build && node scripts/serve.mjs',
    url: `http://localhost:${PORT}/`,
    env: { PORT: String(PORT) },
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
