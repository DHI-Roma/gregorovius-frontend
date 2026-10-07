import { execFile } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { wrapStylesheet } from './xslt-wrapper.js';

const execFileAsync = promisify(execFile);
export const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), '..', 'fixtures', 'api');
const ENTITIES = ['letters', 'persons', 'places', 'works'];
const KWIC_WIDTH = 60;

const cache = new Map();
/** @param {'json'|'text'|'binary'} kind */
function fixture(path, kind = 'json') {
  const key = `${path}:${kind}`;
  if (!cache.has(key)) {
    const file = join(FIXTURES, path);
    if (!existsSync(file)) return undefined;
    if (kind === 'binary') cache.set(key, readFileSync(file));
    else {
      const content = readFileSync(file, 'utf8');
      cache.set(key, kind === 'json' ? JSON.parse(content) : content);
    }
  }
  return cache.get(key);
}

export const manifest = () => fixture('manifest.json');
export const letterList = () => fixture('letters.json');

function json(route, body, status = 200) {
  return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
}

function notFound(route) {
  return json(route, { message: 'Item not found' }, 404);
}

/**
 * Applies a stylesheet fragment to a TEI file like the API does (wrapper + libxslt).
 * @returns {Promise<string>} transformation result or the API's error message
 */
export async function transformFile(xmlFile, stylesheet) {
  const wrapped = wrapStylesheet(stylesheet);
  if (!wrapped) return '';
  const dir = await mkdtemp(join(tmpdir(), 'greg-xslt-'));
  try {
    const xslFile = join(dir, 'style.xsl');
    await writeFile(xslFile, wrapped);
    const { stdout } = await execFileAsync('xsltproc', ['--nonet', xslFile, xmlFile], {
      maxBuffer: 32 * 1024 * 1024,
    });
    return stdout;
  } catch (error) {
    return `Error occurred during XSLT transformation: ${error.stderr || error.message}`;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function transform(entity, id, stylesheet) {
  const xmlFile = join(FIXTURES, entity, `${id}.xml`);
  if (!existsSync(xmlFile)) return null;
  return transformFile(xmlFile, stylesheet);
}

// --- Full text search -------------------------------------------------------
// Production /search uses eXist's KWIC module. The mock approximates it on the
// recorded TEI so that search flows stay testable for arbitrary terms.

const plainText = (xml) =>
  xml
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function kwic(text, term) {
  const results = [];
  const needle = term.toLowerCase();
  const haystack = text.toLowerCase();
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    results.push({
      previous: text.slice(Math.max(0, index - KWIC_WIDTH), index).trim(),
      hi: text.slice(index, index + term.length),
      following: text.slice(index + term.length, index + term.length + KWIC_WIDTH).trim(),
    });
    index = haystack.indexOf(needle, index + term.length);
  }
  return results;
}

export function search(entity, q) {
  const term = q.replace(/^"(.*)"$/, '$1').replace(/[*?~]/g, '').trim();
  const results = [];
  if (!term) return { count: 0, results };
  for (const letter of letterList()) {
    const xml = fixture(`letters/${letter.id}.xml`, 'text');
    if (!xml) continue;
    if (entity === 'letters') {
      const body = xml.match(/<text[\s>][\s\S]*<\/text>/)?.[0] ?? '';
      const withoutNotes = body.replace(/<note[\s\S]*?<\/note>/g, ' ');
      kwic(plainText(withoutNotes), term).forEach((hit) =>
        results.push({ score: '1.0', ...hit, entity_id: letter.id }),
      );
    } else if (entity === 'comments') {
      for (const match of xml.matchAll(/<note[^>]*xml:id="([^"]+)"[^>]*>([\s\S]*?)<\/note>/g)) {
        kwic(plainText(match[2]), term).forEach((hit) =>
          results.push({ score: '1.0', ...hit, entity_id: match[1], entity_related_id: letter.id }),
        );
      }
    }
  }
  return { count: results.length, results };
}

// --- Dispatcher --------------------------------------------------------------

async function handle(route, overrides) {
  const request = route.request();
  const url = new URL(request.url());
  const path = url.pathname.replace(/^.*?\/api\//, '').replace(/\/$/, '');
  const segments = path.split('/');

  for (const [pattern, handler] of Object.entries(overrides)) {
    if (new RegExp(pattern).test(path)) return handler(route);
  }

  if (request.method() === 'POST') {
    const [entity, id] = segments;
    if (ENTITIES.includes(entity) && id && url.searchParams.get('xslt') === 'true') {
      const result = await transform(entity, id, request.postData() ?? '');
      return result === null ? notFound(route) : json(route, result);
    }
    return false;
  }

  if (path === 'version') return json(route, fixture('version.json'));
  if (path === 'facsimiles') return json(route, fixture('facsimiles.json'));
  if (path === 'full-letter-index') return json(route, fixture('full-letter-index.json'));
  if (path === 'search') {
    return json(route, search(url.searchParams.get('entity'), url.searchParams.get('q') ?? ''));
  }
  if (segments[0] === 'facsimiles' && segments.length === 4) {
    return route.fulfill({
      status: 200,
      contentType: 'image/png',
      body: fixture('facsimile-placeholder.png', 'binary'),
    });
  }
  if (segments[0] === 'beacon' && segments[1] === 'seeAlso') {
    const data = fixture(`beacon/${segments[2]}.json`);
    return data ? json(route, data) : json(route, { dnb: segments[2], entries: [] });
  }
  if (ENTITIES.includes(segments[0])) {
    if (segments.length === 1) return json(route, fixture(`${segments[0]}.json`));
    if (segments.length === 2) {
      const data = fixture(`${segments[0]}/${segments[1]}.json`);
      return data ? json(route, data) : notFound(route);
    }
  }
  return false;
}

/**
 * Serves all API requests from fixtures and blocks every other external request.
 * Unknown API requests are answered with 599 and collected in `unhandled`.
 *
 * @param {import('@playwright/test').BrowserContext} context
 * @param {{ overrides?: Record<string, (route) => Promise<void>>, delayMs?: number }} options
 */
export async function mockApi(context, { overrides = {}, delayMs = 0 } = {}) {
  const state = { unhandled: [], overrides: { ...overrides }, delayMs };

  await context.route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (route) => {
    if (/\/api\//.test(route.request().url())) return route.fallback();
    return route.abort('blockedbyclient');
  });

  await context.route(/\/api\//, async (route) => {
    if (state.delayMs) await new Promise((resolve) => setTimeout(resolve, state.delayMs));
    const handled = await handle(route, state.overrides);
    if (handled === false) {
      const request = route.request();
      state.unhandled.push(`${request.method()} ${request.url()}`);
      await route.fulfill({ status: 599, body: 'Unhandled by mock API' });
    }
  });

  return state;
}
