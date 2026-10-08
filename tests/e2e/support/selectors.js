import { expect } from '@playwright/test';

// Fallback selectors for elements that currently have no accessible role or name.
// Each entry names the spec expected to make it reachable by role/name; replace
// the fallback with getByRole/getByLabel once that spec is implemented.

/** Button that only shows a Material icon, e.g. iconButton(page, 'arrow_back') */
export function iconButton(scope, iconName) {
  // TODO(spec-004): accessible names for icon buttons
  const page = typeof scope.page === 'function' ? scope.page() : scope;
  return scope.locator('button').filter({ has: page.locator('i.q-icon', { hasText: new RegExp(`^${iconName}$`) }) });
}

/** Button that opens the commentary on a passage, by its lemma */
export function commentTrigger(scope, lemma) {
  return scope.getByRole('button', { name: `Kommentar zu „${lemma}“ öffnen`, exact: true });
}

export const SEL = {
  editionText: '.g-edition-text',
  commentPanel: '.g-edition-comment-container', // TODO(spec-003): named comment region
  kwicResult: '.g-searchresult',
  facsimileLabel: '.facsimile-label',
  tableRow: 'tbody tr',
  statusIcon: (name) => `i.q-icon:text-is("${name}")`, // TODO(spec-006): status as text
};

/** Selects an option in a Quasar q-select by typing into it (filterable selects). */
export async function chooseOption(page, label, optionText) {
  const combobox = page.getByRole('combobox', { name: label });
  await combobox.click();
  await combobox.fill(optionText);
  await page.getByRole('option', { name: optionText }).first().click();
  await page.keyboard.press('Escape');
}

/** Selects a year in the SelectYears component (options contain a nested toggle, see spec 009). */
export async function chooseYear(page, year) {
  const combobox = page.getByRole('combobox', { name: 'Jahre' });
  await combobox.click();
  const option = page.getByRole('option', { name: year });
  await expect(async () => {
    if ((await option.getAttribute('aria-selected')) !== 'true') {
      await option.getByText(year, { exact: true }).click();
    }
    await expect(option).toHaveAttribute('aria-selected', 'true', { timeout: 1000 });
  }).toPass();
  await page.keyboard.press('Escape');
}
