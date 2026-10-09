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

/** The commentary panel next to the letter text */
export function commentPanel(page) {
  return page.getByRole('region', { name: 'Kommentar' });
}

export const SEL = {
  editionText: '.g-edition-text',
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

/** Whether `request` loads `url` in a tab other than `page`. */
function isNewTabRequest(page, url, request) {
  if (!request.isNavigationRequest() || !url.test(request.url())) return false;
  try {
    return request.frame().page() !== page;
  } catch {
    return true; // no frame yet: the request belongs to a tab that is just being created
  }
}

/**
 * Resolves once `url` is opened in a new tab from `page`. Start waiting before the click.
 * Chromium requests the document of a tab opened by a modified or middle click before Playwright
 * attaches to the tab; Playwright then may never report the tab, or report it with an empty URL.
 * WebKit does not report that request. So wait for whichever comes first: the document request
 * from another tab or a new page that reaches `url`.
 */
export function newTab(page, url) {
  const context = page.context();
  const request = context.waitForEvent('request', (req) => isNewTabRequest(page, url, req));
  const loaded = context.waitForEvent('page').then((tab) => tab.waitForURL(url));
  return Promise.race([request, loaded]);
}

/**
 * Collects the requests that load `url` in tabs other than `page` (Chromium only, see newTab).
 * Counts opened tabs without relying on Playwright noticing them.
 */
export function newTabRequests(page, url) {
  const requests = [];
  page.context().on('request', (req) => {
    if (isNewTabRequest(page, url, req)) requests.push(req);
  });
  return requests;
}
