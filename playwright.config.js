import { defineConfig, devices } from '@playwright/test';

const CI = !!process.env.CI;
const SMOKE = process.env.E2E_SMOKE === '1';
const PORT = Number(process.env.E2E_PORT || 4173);

const shared = {
  trace: 'retain-on-failure',
  screenshot: 'only-on-failure',
  reducedMotion: 'reduce',
  locale: 'de-DE',
};

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  workers: CI ? 4 : undefined,
  reporter: CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  expect: { timeout: 10_000 },
  use: { ...shared, baseURL: `http://localhost:${PORT}` },
  projects: SMOKE
    ? [
        {
          name: 'smoke',
          testMatch: /smoke\/.*\.spec\.js/,
          use: {
            ...devices['Desktop Chrome'],
            ...shared,
            baseURL: process.env.E2E_SMOKE_URL || 'http://gregorovius.local',
          },
        },
      ]
    : [
        {
          name: 'chromium',
          testIgnore: /smoke\//,
          use: { ...devices['Desktop Chrome'], ...shared },
        },
        {
          name: 'webkit',
          testIgnore: /smoke\//,
          use: { ...devices['Desktop Safari'], ...shared },
        },
      ],
  webServer: SMOKE
    ? undefined
    : {
        command: 'npm run build && node tests/e2e/support/serve.mjs',
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !CI,
        timeout: 300_000,
        env: { E2E_PORT: String(PORT) },
      },
});
