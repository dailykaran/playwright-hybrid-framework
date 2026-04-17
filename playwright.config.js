const { defineConfig, devices } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

module.exports = defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'reports/playwright' }],
    ['json', { outputFile: 'reports/playwright/results.json' }],
    ['junit', { outputFile: 'reports/playwright/junit.xml' }],
    ['list']
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], }
    },
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
    */
  ],
  webServer: process.env.WEB_SERVER
    ? {
        command: process.env.WEB_SERVER,
        url: baseURL,
        reuseExistingServer: !process.env.CI
      }
    : undefined,
  timeout: 60000,
  expect: {
    timeout: 10000
  }
});
