import { test, expect } from './support/test.js';
import { GND_PERSON, LETTERS, persons } from './support/data.js';
import { SEL, commentPanel } from './support/selectors.js';

const { rich } = LETTERS;

/** Delays the transformation of the letter text (LettersText.xslt) to expose ordering issues. */
async function delayLetterText(context, ms) {
  await context.route(/\/api\/letters\/[^/?]+\?xslt=true/, async (route) => {
    if ((route.request().postData() || '').includes('g-edition-text')) {
      await new Promise((resolve) => setTimeout(resolve, ms));
    }
    await route.fallback();
  });
}

test('letter with commentary opens the commentary', async ({ page }) => {
  await page.goto(`/letters/${rich.id}/${rich.comment.id}`);
  const panel = commentPanel(page);
  await expect(panel).toBeVisible();
  await expect(panel).toContainText(rich.comment.textSnippet);
  await expect(panel.getByText('Kommentar', { exact: true })).toBeFocused();
});

test('commentary deep link works when the letter text loads late', async ({ page, context }) => {
  await delayLetterText(context, 1500);
  await page.goto(`/letters/${rich.id}/${rich.comment.id}`);
  await expect(commentPanel(page)).toBeVisible({ timeout: 5000 });
});

test('full text hit in a commentary opens the letter with that commentary', async ({ page, context }) => {
  await delayLetterText(context, 1500);
  await page.goto('/letters');
  await page.getByRole('textbox', { name: 'Volltextsuche' }).fill('Finnur');
  // the same biographical commentary on Bunsen occurs in three letters
  await expect(page.locator(SEL.kwicResult)).toHaveCount(3);
  const hit = page.getByRole('link', { name: rich.title });
  await expect(hit).toHaveAttribute('href', `/letters/${rich.id}/${rich.comment.id}`);
  await hit.click();
  await expect(page).toHaveURL(new RegExp(`/letters/${rich.id}/${rich.comment.id}$`));
  await expect(commentPanel(page)).toContainText('Finnur', { timeout: 5000 });
});

test('letter with entity filter', async ({ page }) => {
  await page.goto(`/letters/${rich.id}/filters/${rich.person.id}`);
  await expect(page.locator(SEL.editionText)).toContainText(rich.textSnippet);
});

test('letter filters from the URL are applied to the index', async ({ page }) => {
  await page.goto(`/letters?recipient=${rich.recipient.id}`);
  await expect(page.getByRole('combobox', { name: 'Empfänger' })).toBeVisible();
  await expect(page.locator('main').locator(SEL.tableRow).filter({ hasText: 'Bunsen' }).first()).toBeVisible();
});

test('GND link redirects to the person', async ({ page }) => {
  await page.goto(`/gnd/${GND_PERSON.gnd}`);
  await expect(page).toHaveURL(new RegExp(`/persons/${GND_PERSON.id}$`));
  const person = persons.find((p) => p.id === GND_PERSON.id);
  await expect(page.getByRole('main')).toContainText(person.properties.name.fullName);
});

test('unknown GND shows the person register', async ({ page }) => {
  await page.goto('/gnd/0000000000');
  await expect(page).toHaveURL(/\/gnd\/0000000000$/);
  await expect(page.getByRole('textbox', { name: 'Personen durchsuchen' })).toBeVisible();
});
