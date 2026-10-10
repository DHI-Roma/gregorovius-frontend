import { test, expect } from './support/test.js';
import { letters } from './support/data.js';

test('landing page shows the edition and leads to the letters', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Ferdinand Gregorovius', { exact: true })).toBeVisible();
  await expect(page.getByText('Poesie und Wissenschaft')).toBeVisible();

  await page.getByRole('button', { name: 'Briefe' }).click();

  await expect(page).toHaveURL(/\/letters$/);
  await expect(page.getByRole('combobox', { name: 'Empfänger' })).toBeVisible();
  await expect(page.getByText(`von ${letters.length}`)).toBeVisible();
});

test('main navigation reaches every section', async ({ page }) => {
  await page.goto('/');
  const banner = page.getByRole('banner');

  await banner.getByRole('tab', { name: 'PERSONEN' }).click();
  await expect(page).toHaveURL(/\/persons$/);
  await banner.getByRole('tab', { name: 'ORTE' }).click();
  await expect(page).toHaveURL(/\/places$/);
  await banner.getByRole('tab', { name: 'WERKE' }).click();
  await expect(page).toHaveURL(/\/works$/);
  await banner.getByRole('tab', { name: 'Gesamtdatenbank der Korrespondenz' }).click();
  await expect(page).toHaveURL(/\/letters\/full-index$/);
  await banner.getByRole('tab', { name: 'BRIEFEDITION' }).click();
  await expect(page).toHaveURL(/\/letters$/);
});

test('skip link moves the focus to the main content', async ({ page, browserName }) => {
  await page.goto('/letters');
  await expect(page.getByRole('combobox', { name: 'Empfänger' })).toBeVisible();
  // Safari/WebKit only tabs to links with Alt+Tab (default macOS setting)
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  const skip = page.getByRole('link', { name: 'Zum Inhalt springen' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  // the next Tab lands in the page content, not in the navigation
  await page.keyboard.press('Tab');
  await expect(page.getByRole('textbox', { name: 'Volltextsuche' })).toBeFocused();
});

test('main navigation is a named landmark with real links', async ({ page }) => {
  await page.goto('/letters');
  const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });
  await expect(nav).toBeVisible();
  for (const [name, path] of [
    ['PROJEKT', '/project'],
    ['AKTUELLES', '/announcements'],
    ['TEAM', '/team'],
  ]) {
    await expect(nav.getByRole('link', { name })).toHaveAttribute('href', path);
  }
  await nav.getByRole('link', { name: 'Ferdinand Gregorovius – Startseite' }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('home link on small screens', async ({ page }) => {
  await page.setViewportSize({ width: 500, height: 800 });
  await page.goto('/letters');
  await page.getByRole('navigation').getByRole('link', { name: 'Startseite', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('image credit is a keyboard reachable button', async ({ page }) => {
  await page.goto('/');
  const credit = page.getByRole('button', { name: 'Bildnachweis' });
  await expect(credit).toHaveAttribute('aria-expanded', 'false');
  await credit.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Hintergrundbild:')).toBeVisible();
  await expect(credit).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(page.getByText('Hintergrundbild:')).toBeHidden();
  await expect(credit).toHaveAttribute('aria-expanded', 'false');
});

test('background image is hidden from assistive technology', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Briefe' })).toBeVisible();
  await expect(page.locator('.landing-page.q-img')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.getByRole('main').getByRole('img')).toHaveCount(0);
});
