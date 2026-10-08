import { test, expect } from './support/test.js';
import { LETTERS, sortedLetters } from './support/data.js';
import { SEL, commentPanel, commentTrigger, iconButton } from './support/selectors.js';

const { rich } = LETTERS;
const editionText = (page) => page.locator(SEL.editionText);
const entityLink = (page, label) =>
  editionText(page).getByRole('link', { name: label, exact: true }).first();

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
    await expect(page.getByText('In diesem Brief erwähnte Entitäten')).toBeVisible();
    const tile = page.getByRole('main').getByRole('link', { name: new RegExp(`^${rich.person.name}`) });
    await expect(tile).toHaveCount(1);
    await expect(tile).toHaveAttribute('href', `/persons/${rich.person.id}`);
    await tile.click();
    await expect(page).toHaveURL(new RegExp(`/persons/${rich.person.id}$`));
  });

  test('opens and closes a commentary', async ({ page }) => {
    const trigger = commentTrigger(page, rich.comment.lemma);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await trigger.click();
    const panel = commentPanel(page);
    await expect(panel).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toContainText('Kommentar');
    await expect(panel).toContainText(rich.comment.textSnippet);
    await expect(page).toHaveURL(new RegExp(`/letters/${rich.id}/${rich.comment.id}$`));

    await panel.getByRole('button', { name: 'Schließen' }).click();
    await expect(panel).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('opens a commentary with the keyboard', async ({ page }) => {
    const trigger = commentTrigger(page, rich.comment.lemma);
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(commentPanel(page)).toContainText(rich.comment.textSnippet);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page).toHaveURL(new RegExp(`/letters/${rich.id}/${rich.comment.id}$`));
  });

  test('keyboard users move into the commentary and back', async ({ page, browserName }) => {
    // WebKit only tabs to links with Alt (macOS default)
    const tabToLink = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
    const trigger = commentTrigger(page, rich.comment.lemma);
    await trigger.focus();
    await page.keyboard.press('Enter');
    const panel = commentPanel(page);
    await expect(panel.getByText('Kommentar', { exact: true })).toBeFocused();

    await page.keyboard.press(tabToLink);
    await expect(panel.getByRole('link', { name: rich.letterRef.label }).first()).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('closing the commentary returns the focus to its trigger', async ({ page }) => {
    const trigger = commentTrigger(page, rich.comment.lemma);
    await trigger.click();
    await commentPanel(page).getByRole('button', { name: 'Schließen' }).click();
    await expect(trigger).toBeFocused();
  });

  test('opening another commentary moves the focus again', async ({ page }) => {
    await commentTrigger(page, rich.comment.lemma).click();
    const panel = commentPanel(page);
    await expect(panel).toContainText(rich.comment.textSnippet);
    await commentTrigger(page, 'welcher zugleich längst die römische Toga abgelegt hat,').click();
    await expect(panel).not.toContainText(rich.comment.textSnippet);
    await expect(panel.getByText('Kommentar', { exact: true })).toBeFocused();
    await expect(page).toHaveURL(new RegExp(`/letters/${rich.id}/nbfk_kw5_4wb$`));
  });

  test('clicking the commented passage still opens the commentary', async ({ page }) => {
    await editionText(page).getByText('welcher zugleich längst die römische Toga').click();
    await expect(page).toHaveURL(new RegExp(`/letters/${rich.id}/nbfk_kw5_4wb$`));
    await expect(commentPanel(page)).toBeVisible();
  });

  test('long lemmas are shortened in the trigger name', async ({ page }) => {
    // the passage of this commentary is longer than 60 characters
    await expect(
      editionText(page).getByRole('button', { name: /^Kommentar zu „was Ew\. Excellenz mir in Bezug.{20,40}…“ öffnen$/ }),
    ).toHaveCount(1);
  });
});

test.describe('entity links in the letter text', () => {
  test.beforeEach(async ({ page }) => openLetter(page, rich.id));

  test('person', async ({ page }) => {
    await entityLink(page, rich.person.label).click();
    await expect(page).toHaveURL(new RegExp(`/persons/${rich.person.id}$`));
    await expect(page.getByRole('main')).toContainText(rich.person.name);
  });

  test('entity link inside a commented passage does not open the commentary', async ({ page }) => {
    // "Mommsen" lies inside a commented passage
    await entityLink(page, rich.person.label).click();
    await expect(page).toHaveURL(new RegExp(`/persons/${rich.person.id}$`));
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`/letters/${rich.id}$`));
    await expect(editionText(page)).toBeVisible();
    await expect(commentPanel(page)).toBeHidden();
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

  test('entity links are keyboard accessible', async ({ page }) => {
    const link = entityLink(page, rich.person.label);
    await expect(link).toHaveAttribute('href', `/persons/${rich.person.id}`);
    await link.focus();
    await expect(link).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`/persons/${rich.person.id}$`));
  });

  test('modified click opens the entity in a new tab', async ({ page, context }) => {
    // "Staat" (Preußischer Staat, G000541) is not inside a commented passage,
    // so the click does not also open a commentary
    const popup = context.waitForEvent('page');
    await entityLink(page, 'Staat').click({ modifiers: ['ControlOrMeta'] });
    const tab = await popup;
    await expect(tab).toHaveURL(/\/persons\/G000541$/);
    await expect(page).toHaveURL(new RegExp(`/letters/${rich.id}$`));
  });

  test('right click shows the browser menu, not a custom one', async ({ page }) => {
    await entityLink(page, 'Staat').click({ button: 'right' });
    await expect(page.getByText('In neuem Tab öffnen')).toHaveCount(0);
  });

  test('middle click opens exactly one new tab', async ({ page, context, browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit in Playwright does not open tabs on middle click');
    const popup = context.waitForEvent('page');
    await entityLink(page, 'Staat').click({ button: 'middle' });
    await expect(await popup).toHaveURL(/\/persons\/G000541$/);
    await page.waitForTimeout(500);
    expect(context.pages()).toHaveLength(2);
    await expect(page).toHaveURL(new RegExp(`/letters/${rich.id}$`));
  });

  test('cross reference to another letter inside a commentary', async ({ page }) => {
    // cross references only occur in commentaries; the panel renders them as plain links
    await commentTrigger(page, rich.comment.lemma).click();
    const panel = commentPanel(page);
    // links inside the commentary are routed without a full page reload
    await page.evaluate(() => (window.__noReload = true));
    await panel.getByRole('link', { name: rich.letterRef.label }).first().click();
    await expect(page).toHaveURL(new RegExp(`/letters/${rich.letterRef.id}$`));
    await expect(editionText(page)).toBeVisible();
    expect(await page.evaluate(() => window.__noReload)).toBe(true);
  });
});

test.describe('margin notes', () => {
  const noteName = 'Anmerkung am linken Rand, von Hand des Empfängers';

  test('a margin note opens in a popover with the keyboard', async ({ page }) => {
    await openLetter(page, LETTERS.marginNote.id);
    const note = editionText(page).getByRole('button', { name: noteName, exact: true });
    await expect(note).toHaveAttribute('aria-expanded', 'false');
    await note.focus();
    await page.keyboard.press('Enter');
    const popover = page.getByRole('dialog', { name: noteName });
    await expect(popover).toBeVisible();
    await expect(popover).toContainText('=');
    await expect(note).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');
    await expect(popover).toBeHidden();
    await expect(note).toBeFocused();
  });

  test('a margin note opens on click and closes on a click outside', async ({ page }) => {
    await openLetter(page, LETTERS.marginNote.id);
    await editionText(page).getByRole('button', { name: noteName, exact: true }).click();
    const popover = page.getByRole('dialog', { name: noteName });
    await expect(popover).toBeVisible();
    await page.getByRole('main').click({ position: { x: 5, y: 5 } });
    await expect(popover).toBeHidden();
  });

  test('a margin note still shows its preview on hover', async ({ page }) => {
    await openLetter(page, LETTERS.marginNote.id);
    await editionText(page).getByRole('button', { name: noteName, exact: true }).hover();
    await expect(page.getByRole('tooltip')).toContainText('Anmerkung am linken Rand');
  });

  test('marks in the margin have a descriptive name', async ({ page }) => {
    await openLetter(page, rich.id);
    await expect(
      editionText(page).getByRole('button', { name: 'Anstreichung am linken Rand, von Hand des Empfängers', exact: true }),
    ).toHaveCount(5);
  });
});

test.describe('hover previews', () => {
  async function moveOnto(page, locator) {
    const box = await locator.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 5 });
  }

  test('the commentary preview stays open while the pointer is on it', async ({ page }) => {
    await openLetter(page, rich.id);
    await editionText(page).getByText('welcher zugleich längst die römische Toga').hover();
    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await moveOnto(page, tooltip);
    await page.waitForTimeout(600);
    await expect(tooltip).toBeVisible();

    await page.mouse.move(0, 0);
    await expect(tooltip).toBeHidden();
  });

  test('Escape closes a preview without moving the focus', async ({ page }) => {
    await openLetter(page, rich.id);
    const tab = page.getByRole('tab', { name: 'Textgrundlage' });
    await tab.focus();
    await editionText(page).getByText('welcher zugleich längst die römische Toga').hover();
    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(tooltip).toBeHidden();
    await expect(tab).toBeFocused();
  });

  test('the margin note preview stays open while the pointer is on it', async ({ page }) => {
    await openLetter(page, LETTERS.marginNote.id);
    await editionText(page).getByRole('button', { name: 'Anmerkung am linken Rand, von Hand des Empfängers', exact: true }).hover();
    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await moveOnto(page, tooltip);
    await page.waitForTimeout(600);
    await expect(tooltip).toContainText('Anmerkung am linken Rand');
  });

  test('the text basis hint stays open while the pointer is on it', async ({ page }) => {
    // only letters with several witnesses mark the text basis
    await openLetter(page, LETTERS.italian.id);
    await page.getByRole('tab', { name: 'Textgrundlage' }).click();
    // the print edition is the text basis of this letter
    await page.locator('#panel-tgl b', { hasText: 'Friedrich Althaus' }).hover();
    const tooltip = page.getByRole('tooltip', { name: /Textgrundlage/ });
    await expect(tooltip).toBeVisible();
    await moveOnto(page, tooltip);
    await page.waitForTimeout(600);
    await expect(tooltip).toBeVisible();
  });
});

test.describe('navigation between letters', () => {
  const index = sortedLetters.findIndex((l) => l.id === rich.id);
  const main = (page) => page.getByRole('main');

  async function openWithNavigation(page, id) {
    await openLetter(page, id);
    // wait until the letter list is loaded and navigation is computed
    await expect(iconButton(main(page), 'arrow_forward').or(iconButton(main(page), 'arrow_back')).first()).toBeVisible();
  }

  test('next and previous letter follow the chronological order', async ({ page }) => {
    await openWithNavigation(page, rich.id);
    await iconButton(main(page), 'arrow_forward').click();
    await expect(page).toHaveURL(new RegExp(`/letters/${sortedLetters[index + 1].id}$`));
    await iconButton(main(page), 'arrow_back').click();
    await expect(page).toHaveURL(new RegExp(`/letters/${rich.id}$`));
    await iconButton(main(page), 'arrow_back').click();
    await expect(page).toHaveURL(new RegExp(`/letters/${sortedLetters[index - 1].id}$`));
  });

  test('first and last letter have only one direction', async ({ page }) => {
    await openWithNavigation(page, sortedLetters[0].id);
    await expect(iconButton(page.getByRole('main'), 'arrow_back')).toHaveCount(0);
    await expect(iconButton(page.getByRole('main'), 'arrow_forward')).toHaveCount(1);

    await openWithNavigation(page, sortedLetters[sortedLetters.length - 1].id);
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

test('TEI XML link opens the API in a new tab', async ({ page }) => {
  await openLetter(page, rich.id);
  const link = page.getByRole('link', { name: /TEI XML.*\(öffnet in neuem Tab\)/ });
  await expect(link).toHaveAttribute('href', `https://gregorovius-edition.dhi-roma.it/api/letters/${rich.id}`);
  await expect(link).toHaveAttribute('target', '_blank');
});
