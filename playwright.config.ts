import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests', fullyParallel: true, workers: 1, retries: 0,
  timeout: 20000, expect: { timeout: 5000, toHaveScreenshot: { maxDiffPixels: 0 } },
  reporter: [['list'], ['html', { open: 'never', outputFolder: process.env.REPORT_DIR || 'playwright-report' }], ['json', { outputFile: process.env.JSON_REPORT || 'test-results/results.json' }]],
  snapshotPathTemplate: '{testDir}/../baselines/{projectName}/{arg}{ext}',
  use: { baseURL: 'http://127.0.0.1:4173', locale: 'en-US', timezoneId: 'UTC',
    browserName: 'chromium', headless: true, trace: 'retain-on-failure', screenshot: 'only-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {},
  },
  webServer: { command: 'node app/server.mjs', url: 'http://127.0.0.1:4173', reuseExistingServer: false },
  projects: [
    { name: 'e2e', testMatch: 'e2e.spec.ts', use: { viewport: { width: 1280, height: 800 } } },
    { name: 'visual', testMatch: 'visual.spec.ts', use: { viewport: { width: 1280, height: 800 }, colorScheme: 'light', deviceScaleFactor: 1 } },
    { name: 'ai-assisted', testMatch: 'ai-assisted.spec.ts' },
    { name: 'mobile-android', testMatch: 'mobile.spec.ts', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-ios-profile', testMatch: 'mobile.spec.ts', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
    { name: 'performance', testMatch: 'performance.spec.ts', workers: 1, fullyParallel: false },
    { name: 'api', testMatch: 'api.spec.ts' },
  ],
});
