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

test('editorial guidelines are a link announcing the new tab', async ({ page }) => {
  await page.goto('/');
  const link = page.getByRole('link', { name: 'EDITIONSRICHTLINIEN (öffnet in neuem Tab)' });
  await expect(link).toHaveAttribute('href', 'http://gregorovius-edition.dhi-roma.it/richtlinien/');
  await expect(link).toHaveAttribute('target', '_blank');
});

test('external links in page content announce the new tab', async ({ page }) => {
  await page.goto('/announcements');
  const external = page.getByRole('main').locator('a[target="_blank"]').first();
  await expect(external).toBeVisible();
  const name = await external.evaluate((a) => a.textContent.trim());
  await expect(page.getByRole('link', { name: `${name} (öffnet in neuem Tab)` }).first()).toBeVisible();
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

test('footer logo links name their targets', async ({ page }) => {
  await page.goto('/impressum');
  const footer = page.getByRole('contentinfo');
  const logos = [
    ['Deutsches Historisches Institut in Rom', 'http://dhi-roma.it'],
    ['Deutsche Forschungsgemeinschaft', 'https://www.dfg.de/'],
    ['Gerda Henkel Stiftung', 'https://www.gerda-henkel-stiftung.de/'],
    ['Berlin-Brandenburgische Akademie der Wissenschaften', 'http://www.bbaw.de'],
    ['Lizenz CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/deed.de'],
  ];
  for (const [name, href] of logos) {
    await expect(footer.getByRole('link', { name, exact: true })).toHaveAttribute('href', href);
  }
});

test('team portraits are decorative, the project drawing has a text alternative', async ({ page }) => {
  await page.goto('/team');
  await expect(main(page)).toContainText('Dr. Angela Steinsiek');
  const portraits = main(page).locator('img');
  await expect(portraits.first()).toBeVisible();
  for (const portrait of await portraits.all()) {
    await expect(portrait).toHaveAttribute('alt', '');
  }

  await page.goto('/project');
  await expect(
    main(page).getByRole('img', {
      name: 'Bleistiftzeichnung von F. Gregorovius: Rom aus dem Garten der Colonna',
    }),
  ).toBeVisible();
});
