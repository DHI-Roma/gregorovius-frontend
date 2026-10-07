import { test, expect } from './support/test.js';
import { LETTERS, letters, sortedLetters } from './support/data.js';
import { SEL, chooseOption, chooseYear } from './support/selectors.js';

const rows = (page) => page.locator('main').locator(SEL.tableRow);
const firstLetter = sortedLetters[0];

test.beforeEach(async ({ page }) => {
  await page.goto('/letters');
  await expect(page.getByText(`von ${letters.length}`)).toBeVisible();
});

test('lists letters chronologically with pagination', async ({ page }) => {
  await expect(page.getByText(`1–20 von ${letters.length}`)).toBeVisible();
  await expect(rows(page)).toHaveCount(20);

  await page.getByRole('button', { name: 'Nächste Seite' }).click();
  await expect(page.getByText(`21–40 von ${letters.length}`)).toBeVisible();
});

test('opens a letter from the list', async ({ page }) => {
  await rows(page).first().click();
  await expect(page).toHaveURL(new RegExp(`/letters/${firstLetter.id}`));
  await expect(page.locator(SEL.editionText)).toBeVisible();
});

test('the date of each letter is a link labelled with the letter title', async ({ page }) => {
  const link = rows(page).first().getByRole('link', { name: firstLetter.properties.title });
  await expect(link).toHaveAttribute('href', `/letters/${firstLetter.id}`);
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(`/letters/${firstLetter.id}$`));
});

test('modified click on a letter opens it in a new tab only', async ({ page, context }) => {
  const popup = context.waitForEvent('page');
  await rows(page).first().getByRole('link').click({ modifiers: ['ControlOrMeta'] });
  await expect(await popup).toHaveURL(new RegExp(`/letters/${firstLetter.id}$`));
  await expect(page).toHaveURL(/\/letters$/);
});

test('middle click on a letter opens exactly one new tab', async ({ page, context, browserName }) => {
  test.skip(browserName === 'webkit', 'WebKit in Playwright does not open tabs on middle click');
  const popup = context.waitForEvent('page');
  await rows(page).first().getByRole('link').click({ button: 'middle' });
  await expect(await popup).toHaveURL(new RegExp(`/letters/${firstLetter.id}$`));
  await page.waitForTimeout(500);
  expect(context.pages()).toHaveLength(2);
  await expect(page).toHaveURL(/\/letters$/);
});

test('full text search shows keyword in context and filters the list', async ({ page }) => {
  await page.getByRole('textbox', { name: 'Volltextsuche' }).fill('Bleimännchen');

  await expect(page.locator(SEL.kwicResult)).toHaveCount(1);
  await expect(page.locator(SEL.kwicResult)).toContainText('Bleimännchen');
  await expect(page.getByText('1–1 von 1')).toBeVisible();

  await rows(page).first().click();
  await expect(page).toHaveURL(new RegExp(`/letters/${LETTERS.rich.id}`));
});

test('phrase search shows a hint', async ({ page }) => {
  const input = page.getByRole('textbox', { name: 'Volltextsuche' });
  await input.fill('"fatalistische Gewalt');
  await expect(page.getByText('Ungerade Anzahl an Anführungszeichen')).toBeVisible();
  await input.fill('"fatalistische Gewalt"');
  await expect(page.getByText('Phrasensuche aktiviert')).toBeVisible();
  await expect(page.locator(SEL.kwicResult).first()).toContainText('fatalistische Gewalt');
});

test('search without hits shows an empty table', async ({ page }) => {
  await page.getByRole('textbox', { name: 'Volltextsuche' }).fill('Xylophonquartett');
  await expect(rows(page).filter({ hasText: /\d{4}/ })).toHaveCount(0);
});

test('filters by recipient and keeps the filter in the URL', async ({ page }) => {
  const recipientLetters = letters.filter((l) =>
    l.properties.recipient.includes(LETTERS.rich.recipient.id),
  );
  await chooseOption(page, 'Empfänger', 'Bunsen, Christian');

  await expect(page.getByText(`1–${recipientLetters.length} von ${recipientLetters.length}`)).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`recipient=${LETTERS.rich.recipient.id}`));

  await expect(rows(page).first().getByRole('link')).toHaveAttribute(
    'href',
    new RegExp(`recipient=${LETTERS.rich.recipient.id}`),
  );
  await rows(page).first().click();
  await expect(page).toHaveURL(new RegExp(`recipient=${LETTERS.rich.recipient.id}`));
});

test('filters by place sent', async ({ page }) => {
  const count = letters.filter((l) => l.properties.place.sent === 'G000763').length;
  await chooseOption(page, 'Schreibort', 'Rom');
  await expect(page.getByText(new RegExp(`von ${count}$`))).toBeVisible();
});

test('filters by place received', async ({ page }) => {
  const count = letters.filter((l) => l.properties.place.received === 'G000716').length;
  await chooseOption(page, 'Empfangsort', 'London');
  await expect(page.getByText(`1–${count} von ${count}`)).toBeVisible();
});

test('filters by year', async ({ page }) => {
  const count = letters.filter((l) => l.properties.date?.startsWith('1860')).length;
  await chooseYear(page, '1860');
  await expect(page.getByText(`1–${count} von ${count}`)).toBeVisible();
});
