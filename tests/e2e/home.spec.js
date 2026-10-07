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
