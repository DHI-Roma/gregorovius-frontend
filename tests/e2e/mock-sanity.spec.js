import { test as base } from '@playwright/test';
import { test, expect } from './support/test.js';
import { mockApi } from './support/mock-api.js';
import { LETTERS } from './support/data.js';

test('letter text is rendered through the XSLT pipeline', async ({ page }) => {
  await page.goto(`/letters/${LETTERS.rich.id}`);
  await expect(page.locator('.g-edition-text')).toContainText(LETTERS.rich.textSnippet);
});

base('unknown API requests are reported', async ({ context, page }) => {
  const api = await mockApi(context);
  await page.goto('/');
  await page.evaluate(() => fetch('/api/does-not-exist').catch(() => {}));
  await expect.poll(() => api.unhandled.length).toBeGreaterThan(0);
  expect(api.unhandled.join()).toContain('/api/does-not-exist');
});
