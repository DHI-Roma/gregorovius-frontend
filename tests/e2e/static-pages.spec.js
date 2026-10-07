import { test, expect } from './support/test.js';

const main = (page) => page.getByRole('main');

test('project page with both tabs', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'PROJEKT' }).click();
  await expect(page).toHaveURL(/\/project$/);
  await expect(main(page)).toContainText('Das Projekt');
  await expect(main(page)).toContainText('Die Briefe des Historikers und Schriftstellers');

  await page.getByRole('tab', { name: 'Eingesetzte Technologien' }).click();
  await expect(main(page).getByRole('link', { name: 'ediarum' })).toBeVisible();
});

test('team page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'TEAM' }).click();
  await expect(page).toHaveURL(/\/team$/);
  await expect(main(page)).toContainText('Das Team');
  await expect(main(page)).toContainText('Dr. Angela Steinsiek');
  await expect(main(page)).toContainText('Ehemalige Mitarbeitende');
});

test('announcements page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'AKTUELLES' }).click();
  await expect(page).toHaveURL(/\/announcements$/);
  await expect(main(page)).toContainText('Aktuelles');
  await expect(main(page)).toContainText('Publikationen zur ferneren Lektüre');
});

test('imprint and privacy notice from the footer', async ({ page }) => {
  await page.goto('/');
  const footer = page.getByRole('contentinfo');
  await footer.getByRole('link', { name: 'Impressum' }).click();
  await expect(page).toHaveURL(/\/impressum$/);
  await expect(main(page)).toContainText('Deutsches Historisches Institut in Rom');

  await footer.getByRole('link', { name: 'Datenschutz' }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(main(page)).toContainText('Datenschutz');
});

test('editorial guidelines open in a new window', async ({ page, context }) => {
  await page.goto('/');
  // the guidelines are an external site; the mock blocks the request, only the target is checked
  const request = context.waitForEvent('request', (r) => r.url().includes('/richtlinien'));
  const popup = context.waitForEvent('page');
  await page.getByRole('button', { name: 'EDITIONSRICHTLINIEN' }).click();
  await popup;
  expect((await request).url()).toBe('http://gregorovius-edition.dhi-roma.it/richtlinien/');
});

test('unknown URL shows the 404 notice', async ({ page }) => {
  await page.goto('/gibt-es-nicht');
  await expect(page.getByText('Ressource leider nicht gefunden')).toBeVisible();
  await expect(page.getByText('(404)')).toBeVisible();
});

test('footer shows the app version', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('contentinfo').getByRole('status')).toHaveText(/^v\d+\.\d+\.\d+$/);
});
