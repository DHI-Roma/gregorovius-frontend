import { test, expect } from './support/test.js';
import { LETTERS, letters, sortedLetters } from './support/data.js';
import { SEL, iconButton } from './support/selectors.js';

const { rich } = LETTERS;
const editionText = (page) => page.locator(SEL.editionText);
const entityLink = (page, label) =>
  page.locator(SEL.entityLink).filter({ hasText: label, visible: true }).first();

async function openLetter(page, id) {
  await page.goto(`/letters/${id}`);
  await expect(editionText(page)).toBeVisible();
}

test.describe('letter text and metadata', () => {
  test.beforeEach(async ({ page }) => openLetter(page, rich.id));

  test('shows title, editors and the edited text', async ({ page }) => {
    const main = page.getByRole('main');
    await expect(main).toContainText('Ferdinand Gregorovius an Christian Karl Josias Freiherr von Bunsen in Cannes');
    await expect(main).toContainText('Hrsg. Angela Steinsiek');
    await expect(editionText(page)).toContainText(rich.textSnippet);
    // comment texts are hidden until a comment is opened
    await expect(page.getByText(rich.comment.textSnippet)).toBeHidden();
  });

  test('switches between abstract and text basis', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'Regest' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#abstract-de')).toContainText(rich.abstractDeSnippet);
    await expect(page.locator('#abstract-en')).toContainText('He is very grateful');

    await page.getByRole('tab', { name: 'Textgrundlage' }).click();
    await expect(page.locator('#panel-tgl')).toBeVisible();
    await expect(page.locator('#panel-tgl')).not.toBeEmpty();
  });

  test('lists the mentioned entities and opens one', async ({ page }) => {
    const tiles = page.locator(SEL.mentionTile);
    await expect(page.getByText('In diesem Brief erwähnte Entitäten')).toBeVisible();
    await expect(tiles.filter({ hasText: rich.person.name })).toHaveCount(1);
    await tiles.filter({ hasText: rich.person.name }).click();
    await expect(page).toHaveURL(new RegExp(`/persons/${rich.person.id}$`));
  });

  test('opens and closes a commentary', async ({ page }) => {
    await page.locator(SEL.commentIcon).first().click();
    const panel = page.locator(SEL.commentPanel);
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('Kommentar');
    await expect(panel).toContainText(rich.comment.textSnippet);
    await expect(page).toHaveURL(new RegExp(`/letters/${rich.id}/${rich.comment.id}$`));

    await panel.getByRole('button', { name: 'Schließen' }).click();
    await expect(panel).toBeHidden();
  });
});

test.describe('entity links in the letter text', () => {
  test.beforeEach(async ({ page }) => openLetter(page, rich.id));

  test('person', async ({ page }) => {
    await entityLink(page, rich.person.label).click();
    await expect(page).toHaveURL(new RegExp(`/persons/${rich.person.id}$`));
    await expect(page.getByRole('main')).toContainText(rich.person.name);
  });

  test('place', async ({ page }) => {
    await entityLink(page, rich.place.label).click();
    await expect(page).toHaveURL(new RegExp(`/places/${rich.place.id}$`));
    await expect(page.getByRole('main')).toContainText(rich.place.label);
  });

  test('work', async ({ page }) => {
    await entityLink(page, rich.work.label).click();
    await expect(page).toHaveURL(new RegExp(`/works/${rich.work.id}$`));
    await expect(page.getByRole('main')).toContainText(rich.work.titleSnippet);
  });

  test('cross reference to another letter inside a commentary', async ({ page }) => {
    // cross references only occur in commentaries; the panel renders them as plain links
    await page.locator(SEL.commentIcon).first().click();
    const panel = page.locator(SEL.commentPanel);
    await panel.locator('a', { hasText: rich.letterRef.label }).first().click();
    await expect(page).toHaveURL(new RegExp(`/letters/${rich.letterRef.id}$`));
    await expect(editionText(page)).toBeVisible();
  });
});

test.describe('navigation between letters', () => {
  // The buttons are labelled "chronologisch" but follow the API order of
  // store.letters, which is not sorted by date (bug in LettersDetail.vue).
  const apiIndex = letters.findIndex((l) => l.id === rich.id);
  const main = (page) => page.getByRole('main');

  async function openWithNavigation(page, id) {
    await openLetter(page, id);
    // wait until the letter list is loaded and navigation is computed
    await expect(iconButton(main(page), 'arrow_forward').or(iconButton(main(page), 'arrow_back')).first()).toBeVisible();
  }

  test('next and previous letter follow the order of the letter list', async ({ page }) => {
    await openWithNavigation(page, rich.id);
    await iconButton(main(page), 'arrow_forward').click();
    await expect(page).toHaveURL(new RegExp(`/letters/${letters[apiIndex + 1].id}$`));
    await iconButton(page.getByRole('main'), 'arrow_back').click();
    await expect(page).toHaveURL(new RegExp(`/letters/${rich.id}$`));
  });

  test('next letter is the chronologically next one', async ({ page }) => {
    test.fail(true, 'Known bug: navigation uses unsorted API order instead of date order');
    const index = sortedLetters.findIndex((l) => l.id === rich.id);
    await openWithNavigation(page, rich.id);
    await iconButton(main(page), 'arrow_forward').click();
    await expect(page).toHaveURL(new RegExp(`/letters/${sortedLetters[index + 1].id}$`), { timeout: 3000 });
  });

  test('first and last letter of the list have only one direction', async ({ page }) => {
    await openWithNavigation(page, letters[0].id);
    await expect(iconButton(page.getByRole('main'), 'arrow_back')).toHaveCount(0);
    await expect(iconButton(page.getByRole('main'), 'arrow_forward')).toHaveCount(1);

    await openWithNavigation(page, letters[letters.length - 1].id);
    await expect(iconButton(page.getByRole('main'), 'arrow_forward')).toHaveCount(0);
    await expect(iconButton(page.getByRole('main'), 'arrow_back')).toHaveCount(1);
  });
});

test.describe('facsimiles', () => {
  test('pages through the facsimile images', async ({ page }) => {
    await openLetter(page, LETTERS.facsimile.id);
    const label = page.locator(SEL.facsimileLabel);
    await expect(label).toHaveText(LETTERS.facsimile.labels[0]);
    await iconButton(page.getByRole('main'), 'navigate_next').click();
    await expect(label).toHaveText(LETTERS.facsimile.labels[1]);
    await iconButton(page.getByRole('main'), 'navigate_before').click();
    await expect(label).toHaveText(LETTERS.facsimile.labels[0]);
  });

  test('letter without facsimile renders text only', async ({ page }) => {
    await openLetter(page, LETTERS.italian.id);
    await expect(page.locator(SEL.facsimileLabel)).toHaveCount(0);
    await expect(editionText(page)).toContainText(LETTERS.italian.foreignSnippet);
  });
});

test('copies the citation', async ({ page, browserName }) => {
  if (browserName === 'chromium') {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  }
  await openLetter(page, rich.id);
  await page.getByRole('button', { name: 'kopieren' }).click();
  await expect(page.getByRole('button', { name: 'kopiert' })).toBeVisible();
  if (browserName === 'chromium') {
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain(rich.title);
    expect(copied).toContain(`/letters/${rich.id}`);
  }
});

test('TEI XML button links to the API', async ({ page, context }) => {
  await openLetter(page, rich.id);
  const popup = context.waitForEvent('page');
  await page.getByRole('button', { name: 'TEI XML' }).click();
  expect((await popup).url()).toContain(`/api/letters/${rich.id}`);
});
