import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';

const ALLOWLIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'a11y', 'allowlist.json');
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const UPDATE = process.env.E2E_A11Y_UPDATE === '1';

// Which follow-up spec is expected to fix a rule (used when the baseline is (re)written).
const RULE_OWNERS = {
  'color-contrast': ['-', 'Abgenommenes Farbschema, wird nicht geändert (dauerhafte Ausnahme)'],
  'link-name': ['004', 'Links ohne zugänglichen Namen (Logos, Icons)'],
  'button-name': ['004', 'Schaltflächen ohne zugänglichen Namen (Icon-Buttons)'],
  'image-alt': ['004', 'Bilder ohne Alternativtext'],
  'role-img-alt': ['004', 'Icons mit role=img ohne Namen'],
  'svg-img-alt': ['004', 'SVG ohne Alternativtext'],
  'aria-command-name': ['004', 'Bedienelemente ohne Namen'],
  'aria-input-field-name': ['004', 'Eingabefelder ohne Namen'],
  label: ['004', 'Formularfelder ohne Label'],
  'select-name': ['004', 'Auswahlfelder ohne Label'],
  'html-has-lang': ['005', 'Grundsprache fehlt'],
  'meta-viewport': ['005', 'Zoom gesperrt'],
  'document-title': ['005', 'Seitentitel'],
  'page-has-heading-one': ['005', 'Keine Hauptüberschrift'],
  'heading-order': ['005', 'Überschriftenhierarchie'],
  'landmark-one-main': ['005', 'Kein Hauptbereich'],
  region: ['005', 'Inhalt außerhalb von Landmarks'],
  bypass: ['002', 'Kein Skip-Link'],
  'aria-required-children': ['002', 'Listen/Kacheln mit klickbaren Elementen ohne listitem-Struktur'],
  'nested-interactive': ['009', 'Verschachtelte Bedienelemente'],
  'target-size': ['009', 'Zielgröße unter 24 px'],
  'scrollable-region-focusable': ['009', 'Scrollbereich nicht per Tastatur erreichbar'],
};

function readAllowlist() {
  try {
    return JSON.parse(readFileSync(ALLOWLIST, 'utf8'));
  } catch {
    return {};
  }
}

function summarize(violation) {
  const targets = violation.nodes.slice(0, 3).map((node) => node.target.join(' ')).join(' | ');
  return `${violation.id} (${violation.nodes.length}×, ${violation.impact}): ${violation.help} → ${targets}`;
}

/**
 * Runs axe on the current page and compares the result with the allowlist:
 * new rules or more affected nodes than allowed fail; fewer nodes are reported
 * as annotation so the allowlist can be tightened.
 * With E2E_A11Y_UPDATE=1 the allowlist entry for this page is rewritten (run with --workers=1).
 */
export async function expectNoNewA11yViolations(page, pageKey, testInfo) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const actual = Object.fromEntries(results.violations.map((v) => [v.id, v]));

  if (UPDATE) {
    const allowlist = readAllowlist();
    allowlist[pageKey] = Object.fromEntries(
      Object.entries(actual)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([id, violation]) => {
          const [spec, reason] = RULE_OWNERS[id] ?? ['009', `Zu prüfen: ${violation.help}`];
          return [id, { maxNodes: violation.nodes.length, spec, reason }];
        }),
    );
    const sorted = Object.fromEntries(Object.entries(allowlist).sort(([a], [b]) => a.localeCompare(b)));
    writeFileSync(ALLOWLIST, `${JSON.stringify(sorted, null, 2)}\n`);
    return;
  }

  const allowed = readAllowlist()[pageKey] ?? {};
  const regressions = Object.values(actual)
    .filter((violation) => violation.nodes.length > (allowed[violation.id]?.maxNodes ?? 0))
    .map(summarize);

  for (const [id, entry] of Object.entries(allowed)) {
    const count = actual[id]?.nodes.length ?? 0;
    if (count < entry.maxNodes) {
      testInfo.annotations.push({
        type: 'a11y-improved',
        description: `${pageKey}: ${id} ${entry.maxNodes} → ${count}, allowlist can be lowered`,
      });
    }
  }

  expect(regressions, `New accessibility violations on "${pageKey}"`).toEqual([]);
}
