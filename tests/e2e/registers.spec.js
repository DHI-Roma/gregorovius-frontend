import { test, expect } from './support/test.js';
import { GND_PERSON, LETTERS, letters, persons } from './support/data.js';
import { SEL } from './support/selectors.js';

const { rich } = LETTERS;
const search = (page) => page.getByPlaceholder('Suche');
const main = (page) => page.getByRole('main');

test.describe('persons', () => {
  test('searches the register and opens a person', async ({ page }) => {
    await page.goto('/persons');
    await expect(main(page).getByRole('button').first()).toBeVisible();
    await expect(page.getByText(`1–32 von ${persons.length}`)).toBeVisible();

    await search(page).fill('Bunsen, Christian');
    const tile = main(page).getByRole('button', { name: /^Bunsen, Christian Karl Josias/ });
    await expect(tile).toHaveCount(1);
    await tile.click();

    await expect(page).toHaveURL(new RegExp(`/persons/${rich.recipient.id}$`));
    await expect(main(page)).toContainText(rich.recipient.name);
    await expect(main(page).getByRole('link', { name: /GND http:\/\/d-nb\.info\/gnd\/118668005/ })).toBeVisible();
  });

  test('search without hits shows no tiles', async ({ page }) => {
    await page.goto('/persons');
    await search(page).fill('Xylophonquartett');
    await expect(main(page).getByRole('list')).toHaveCount(0);
  });

  test('person page lists correspondence and mentions', async ({ page }) => {
    const correspondence = letters.filter((l) => l.properties.recipient.includes(rich.recipient.id));
    const mentions = letters.filter((l) =>
      (l.properties.mentioned.persons || []).some((id) => id.includes(rich.recipient.id)),
    );
    await page.goto(`/persons/${rich.recipient.id}`);

    const tables = main(page).getByRole('table');
    await expect(tables.nth(0).locator(SEL.tableRow)).toHaveCount(correspondence.length);
    await expect(main(page).getByText('Erwähnt in')).toBeVisible();
    await expect(tables.nth(1).locator(SEL.tableRow)).toHaveCount(mentions.length);

    await tables.nth(0).getByRole('cell', { name: rich.title }).click();
    await expect(page).toHaveURL(new RegExp(`/letters/${rich.id}\\?recipient=${rich.recipient.id}$`));
  });

  test('opening a letter from "Erwähnt in" keeps the entity filter', async ({ page }) => {
    await page.goto(`/persons/${rich.person.id}`);
    await main(page).getByRole('cell', { name: rich.title }).click();
    await expect(page).toHaveURL(new RegExp(`/letters/${rich.id}/filters/${rich.person.id}$`));
    await expect(page.locator(SEL.editionText)).toBeVisible();
  });

  test('person page lists references in other data sources (BEACON)', async ({ page }) => {
    test.fail(
      true,
      'Known bug: PersonSeeAlsoTable never shows entries (Vue 2 `:data` prop on q-table); production /beacon/seeAlso also returns HTTP 500',
    );
    await page.goto(`/persons/${GND_PERSON.id}`);
    await expect(main(page).getByText('Erwähnt in')).toBeVisible();
    await expect(main(page).getByText('Referenzen in anderen Datenquellen')).toBeVisible({ timeout: 3000 });
    await expect(main(page).getByRole('cell', { name: /Wikipedia/ })).toBeVisible({ timeout: 3000 });
  });

  test('multiple persons referenced at one place', async ({ page }) => {
    await page.goto('/letters/ed_v5m_lrp_dsb');
    await page.locator(SEL.entityLink).filter({ hasText: 'Erharts', visible: true }).first().click();
    await expect(page).toHaveURL(/\/persons-multiple\?ids=G001115,G001116$/);
    await expect(main(page)).toContainText('Mehrfache Indizierung von Personen');
    await expect(main(page)).toContainText('Erhardt, Sophie');
    await expect(main(page)).toContainText('Erhardt, Wolfgang');
  });
});

test.describe('places', () => {
  test('searches the register and opens a place', async ({ page }) => {
    await page.goto('/places');
    await search(page).fill('Rom');
    const tile = main(page).getByRole('button', { name: /^Rom\b/ }).first();
    await tile.click();

    await expect(page).toHaveURL(/\/places\/G000763$/);
    await expect(main(page).getByRole('link', { name: /GEO http:\/\/www\.geonames\.org\/3169070/ })).toBeVisible();
    await expect(main(page).getByText('Erwähnt in')).toBeVisible();
  });
});

test.describe('works', () => {
  test('switches register tabs and searches', async ({ page }) => {
    await page.goto('/works');
    await expect(page.getByRole('tab', { name: 'Werkregister Gregorovius' })).toHaveAttribute('aria-selected', 'true');

    await page.getByRole('tab', { name: 'Werke anderer Autoren' }).click();
    const panel = page.getByRole('tabpanel').filter({ visible: true }).last();
    await panel.getByPlaceholder('Suche').fill('Beschreibung der Stadt Rom');
    await panel.getByRole('cell', { name: new RegExp(rich.work.titleSnippet) }).click();

    await expect(page).toHaveURL(new RegExp(`/works/${rich.work.id}$`));
    await expect(main(page)).toContainText(rich.work.titleSnippet);
    await main(page).getByRole('cell', { name: rich.title }).click();
    await expect(page).toHaveURL(new RegExp(`/letters/${rich.id}/filters/${rich.work.id}$`));
  });

  test('multiple works referenced at one place', async ({ page }) => {
    await page.goto('/letters/G000003');
    await page.locator(SEL.entityLink).filter({ hasText: 'Einige Bemerkungen', visible: true }).first().click();
    await expect(page).toHaveURL(/\/works-multiple\?ids=G003831,G003832$/);
    await expect(main(page)).toContainText('Mehrfache Indizierung von Werken');
    await expect(main(page).getByRole('cell', { name: /Morgenblatt/ })).toBeVisible();
  });

  test('multiple works page shows the work titles', async ({ page }) => {
    await page.goto('/works-multiple?ids=G003831,G003832');
    await expect(main(page)).toContainText('Das Dominicanerkloster San-Marco in Florenz und seine Reactionen gegen den Realismus. I.');
    await expect(main(page)).toContainText('Das Dominicanerkloster San-Marco in Florenz und seine Reactionen gegen den Realismus. II.');
  });
});
