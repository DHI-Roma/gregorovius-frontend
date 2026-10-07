// Smoke tests against a running stack (default: local Docker setup at http://gregorovius.local).
// Run with: npm run test:e2e:smoke   (E2E_SMOKE_URL=... to target another instance)
import { test, expect } from '../support/test.js';
import { LETTERS } from '../support/data.js';

const { rich } = LETTERS;

test.beforeAll(async ({ request }, testInfo) => {
  const baseURL = testInfo.project.use.baseURL;
  const reachable = await request
    .get(`${baseURL}/api/version/`, { timeout: 5000 })
    .then((response) => response.ok())
    .catch(() => false);
  test.skip(!reachable, `Stack not reachable at ${baseURL} (start it with "docker compose up -d")`);
});

test('landing page and letter index', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Briefe' }).click();
  await expect(page.getByText(/von \d+$/).first()).toBeVisible();
});

test('letter detail renders the transformed text', async ({ page }) => {
  await page.goto(`/letters/${rich.id}`);
  await expect(page.locator('.g-edition-text')).toContainText(rich.textSnippet);
});

test('person detail', async ({ page }) => {
  await page.goto(`/persons/${rich.recipient.id}`);
  await expect(page.getByRole('main')).toContainText(rich.recipient.name);
});

test('full text search', async ({ page }) => {
  await page.goto('/letters');
  await page.getByRole('textbox', { name: 'Volltextsuche' }).fill('Bleimännchen');
  await expect(page.locator('.g-searchresult').first()).toContainText('Bleimännchen');
});
