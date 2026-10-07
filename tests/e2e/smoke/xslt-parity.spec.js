// Guards the mock API against drift: the mock wraps stylesheets and runs xsltproc
// (tests/e2e/support/xslt-wrapper.js); the result must equal the real API's output.
import { readFileSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test, expect } from '../support/test.js';
import { transformFile } from '../support/mock-api.js';
import { LETTERS } from '../support/data.js';

const STYLESHEETS = ['LettersText', 'LettersMsDesc'];
const normalize = (html) => html.replace(/^\s*<\?xml[^>]*\?>/, '').replace(/\s+/g, ' ').trim();

for (const name of STYLESHEETS) {
  test(`mock XSLT output equals the API for ${name}`, async ({ request }, testInfo) => {
    const api = `${testInfo.project.use.baseURL}/api`;
    const reachable = await request
      .get(`${api}/version/`, { timeout: 5000 })
      .then((r) => r.ok())
      .catch(() => false);
    test.skip(!reachable, `API not reachable at ${api}`);

    const stylesheet = readFileSync(new URL(`../../../src/assets/xslt/${name}.xslt`, import.meta.url), 'utf8');
    const id = LETTERS.rich.id;
    const xml = await (await request.get(`${api}/letters/${id}`, { headers: { Accept: 'application/xml' } })).text();
    const apiResult = await (await request.post(`${api}/letters/${id}?xslt=true`, { data: stylesheet })).json();

    const dir = await mkdtemp(join(tmpdir(), 'greg-parity-'));
    try {
      const xmlFile = join(dir, `${id}.xml`);
      await writeFile(xmlFile, xml);
      expect(normalize(await transformFile(xmlFile, stylesheet))).toBe(normalize(apiResult));
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
}
