import { test, expect } from './support/test.js';
import { expectNoNewA11yViolations } from './support/a11y.js';
import { LETTERS } from './support/data.js';
import { commentPanel, commentTrigger } from './support/selectors.js';

const { rich } = LETTERS;

// One page state per entry: [key, url, readiness check]
const PAGES = [
  ['home', '/', (page) => page.getByRole('button', { name: 'Briefe' })],
  ['letters-index', '/letters', (page) => page.getByText(/von \d+$/).first()],
  ['letter-detail', `/letters/${rich.id}`, (page) => page.getByText('In diesem Brief erwähnte Entitäten')],
  ['persons', '/persons', (page) => page.getByRole('main').getByRole('link').first()],
  ['person-detail', `/persons/${rich.recipient.id}`, (page) => page.getByText('Korrespondenzen')],
  ['places', '/places', (page) => page.getByRole('main').getByRole('link').first()],
  ['place-detail', '/places/G000763', (page) => page.getByText('Erwähnt in')],
  ['works', '/works', (page) => page.getByRole('cell').first()],
  ['work-detail', `/works/${rich.work.id}`, (page) => page.getByText('Erwähnt in')],
  ['full-index', '/letters/full-index', (page) => page.getByRole('link', { name: 'Brief öffnen' }).first()],
  ['project', '/project', (page) => page.getByText('Das Projekt', { exact: true })],
  ['team', '/team', (page) => page.getByText('Das Team', { exact: true })],
  ['announcements', '/announcements', (page) => page.getByText('Publikationen zur ferneren Lektüre')],
  ['impressum', '/impressum', (page) => page.getByText('Deutsches Historisches Institut in Rom').first()],
  ['privacy', '/privacy', (page) => page.getByRole('main')],
  ['not-found', '/gibt-es-nicht', (page) => page.getByText('Ressource leider nicht gefunden')],
];

// axe results differ slightly between engines; the baseline is maintained for Chromium.
test.beforeEach(({ browserName }) => {
  test.skip(browserName !== 'chromium', 'a11y baseline is recorded with Chromium');
});

for (const [key, url, ready] of PAGES) {
  test(`a11y: ${key}`, async ({ page }, testInfo) => {
    await page.goto(url);
    await expect(ready(page)).toBeVisible();
    await expectNoNewA11yViolations(page, key, testInfo);
  });
}

test('a11y: letter-detail with open commentary', async ({ page }, testInfo) => {
  await page.goto(`/letters/${rich.id}`);
  await commentTrigger(page, rich.comment.lemma).click();
  await expect(commentPanel(page)).toBeVisible();
  await expectNoNewA11yViolations(page, 'letter-detail-commentary', testInfo);
});
