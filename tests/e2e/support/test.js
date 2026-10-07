import { test as base, expect } from '@playwright/test';
import { mockApi } from './mock-api.js';

/**
 * Playwright test with the mock API enabled for every test (except the smoke project).
 * Tests fail if the app issued API requests the mock does not know.
 */
export const test = base.extend({
  api: [
    async ({ context }, use, testInfo) => {
      if (testInfo.project.name === 'smoke') {
        await use(null);
        return;
      }
      const api = await mockApi(context);
      await use(api);
      expect(api.unhandled, 'API requests not covered by the mock').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
