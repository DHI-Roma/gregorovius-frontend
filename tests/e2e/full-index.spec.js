import { test, expect } from './support/test.js';
import { fullIndex } from './support/data.js';
import { SEL, chooseOption, chooseYear } from './support/selectors.js';

const entries = fullIndex.letters;
const total = entries.length;
const countText = (n) => new RegExp(`(^|\\s)(1–\\d+ von ${n}|0 von 0)$`);
const pageInfo = (page) => page.locator('.q-table__bottom-item').last();

test.beforeEach(async ({ page }) => {
  await page.goto('/letters/full-index');
  await expect(page.getByRole('button', { name: 'Brief öffnen' }).first()).toBeVisible();
});

test('lists all entries of the full letter index', async ({ page }) => {
  await expect(pageInfo(page)).toHaveText(countText(total));
});

test('searches the metadata', async ({ page }) => {
  const expected = entries.filter((e) =>
    [e.placename_sent, e.placename_received, e.incipit, e.reference, e.print_reference]
      .join(' ')
      .toLowerCase()
      .includes('königsberg'),
  ).length;
  await page.getByRole('textbox', { name: 'Metadaten durchsuchen' }).fill('Königsberg');
  await expect(pageInfo(page)).toHaveText(countText(expected));
});

test('filters by date range', async ({ page }) => {
  test.fail(true, 'Known bug: DatePickerInput listens to Vue 2 `@input` events, the filter never updates');
  const expected = entries.filter(
    (e) => e.date_index >= '1860-01-01' && e.date_index <= '1860-12-31',
  ).length;
  await page.getByRole('textbox', { name: 'von' }).fill('01.01.1860');
  await page.getByRole('textbox', { name: 'bis' }).fill('31.12.1860');
  await expect(pageInfo(page)).toHaveText(countText(expected), { timeout: 3000 });
});

test('rejects an invalid date', async ({ page }) => {
  await page.getByRole('textbox', { name: 'von' }).fill('1860-01-01');
  await page.getByRole('textbox', { name: 'von' }).blur();
  await expect(page.getByText('Bitte Datum im Format TT.MM.JJJJ eingeben')).toBeVisible();
});

test('filters by year', async ({ page }) => {
  const expected = entries.filter((e) => e.relevant_years.includes('1860')).length;
  await chooseYear(page, '1860');
  await expect(pageInfo(page)).toHaveText(countText(expected));
});

test('filters by sender', async ({ page }) => {
  const sender = fullIndex.unique_senders.find((s) => !s.startsWith('Gregorovius'));
  const expected = entries.filter((e) => e.sender_names.includes(sender)).length;
  await chooseOption(page, 'Sender', sender);
  await expect(pageInfo(page)).toHaveText(countText(expected));
});

test('filters by recipient', async ({ page }) => {
  const recipient = fullIndex.unique_recipients[0];
  const expected = entries.filter((e) => e.recipient_names.includes(recipient)).length;
  await chooseOption(page, 'Empfänger', recipient);
  await expect(pageInfo(page)).toHaveText(countText(expected));
});

test('filters by edition status and opens an edited letter', async ({ page }) => {
  const edited = entries.filter((e) => e.status === 'ED');
  await page.getByRole('combobox', { name: 'Bearbeitungsstatus' }).click();
  await page.getByRole('option', { name: 'Nur edierte Briefe' }).click();
  await expect(pageInfo(page)).toHaveText(countText(edited.length));
  await expect(page.getByRole('table').locator(SEL.statusIcon('cancel'))).toHaveCount(0);

  await page.getByRole('button', { name: 'Brief öffnen' }).first().click();
  await expect(page).toHaveURL(/\/letters\/[^/]+$/);
  await expect(page.locator(SEL.editionText)).toBeVisible();
});
