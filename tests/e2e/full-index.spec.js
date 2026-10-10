import { test, expect } from './support/test.js';
import { fullIndex } from './support/data.js';
import { SEL, chooseOption, chooseYear } from './support/selectors.js';

const entries = fullIndex.letters;
const total = entries.length;
const countText = (n) => new RegExp(`(^|\\s)(1–\\d+ von ${n}|0 von 0)$`);
const pageInfo = (page) => page.locator('.q-table__bottom-item').last();

test.beforeEach(async ({ page }) => {
  await page.goto('/letters/full-index');
  await expect(page.getByRole('link', { name: 'Brief öffnen' }).first()).toBeVisible();
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
  const expected = entries.filter(
    (e) => e.date_index >= '1860-01-01' && e.date_index <= '1860-12-31',
  ).length;
  await page.getByRole('textbox', { name: 'von' }).fill('01.01.1860');
  await page.getByRole('textbox', { name: 'bis' }).fill('31.12.1860');
  await expect(pageInfo(page)).toHaveText(countText(expected));
});

test('filters by date picked in the calendar', async ({ page }) => {
  const expected = entries.filter((e) => e.date_index >= '1860-01-15' && /^1/.test(e.date_index)).length;
  const input = page.getByRole('textbox', { name: 'von' });
  await input.fill('01.01.1860');
  await page.locator('label', { has: input }).locator('i.q-icon', { hasText: /^event$/ }).click();
  await page.locator('.q-date').getByRole('button', { name: '15', exact: true }).click();
  await expect(input).toHaveValue('15.01.1860');
  await expect(pageInfo(page)).toHaveText(countText(expected));
});

test('incomplete dates do not filter', async ({ page }) => {
  await page.getByRole('textbox', { name: 'von' }).fill('01.01.186');
  await expect(pageInfo(page)).toHaveText(countText(entries.length));
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

  const open = page.getByRole('link', { name: 'Brief öffnen' }).first();
  const href = await open.getAttribute('href');
  expect(href).toMatch(/^\/letters\/[^/]+$/);
  await open.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await expect(page.locator(SEL.editionText)).toBeVisible();
});

test('person details button names the person and exposes its state', async ({ page }) => {
  const button = page.getByRole('button', { name: /^Weitere Angaben zu / }).first();
  await expect(button).toHaveAttribute('aria-haspopup', 'menu');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
});
