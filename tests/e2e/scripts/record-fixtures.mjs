#!/usr/bin/env node
/**
 * Records a reduced, referentially consistent snapshot of the Gregorovius API
 * into tests/e2e/fixtures/api/. Only GET requests are issued.
 *
 * Usage:
 *   node tests/e2e/scripts/record-fixtures.mjs            # record
 *   node tests/e2e/scripts/record-fixtures.mjs --dry-run  # selection + size report only
 *   E2E_RECORD_API=http://localhost:8069 node ...         # record from another API
 *
 * Search and BEACON responses are not recorded: the mock API computes search
 * results from the recorded TEI files and serves a static BEACON fixture.
 */
import { mkdir, writeFile, rm, readdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const API = process.env.E2E_RECORD_API || 'https://gregorovius-edition.dhi-roma.it/api';
const DRY_RUN = process.argv.includes('--dry-run');
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'fixtures', 'api');
const MAX_LETTERS = 50;
const REGISTER_PADDING = 30;
const FULL_INDEX_SIZE = 100;
const MAX_BYTES = 5 * 1024 * 1024;

// Representative letters (see spec 001, research R4)
const CANDIDATES = {
  'comment+margin+multi+unclear+refs': 'ed_yns_ct5_4wb',
  'italian-passages': 'G000014',
  'italian-correspondent': 'ed_mnf_xjj_zrb',
};

async function get(path, accept = 'application/json') {
  const response = await fetch(`${API}/${path}`, { headers: { Accept: accept } });
  if (!response.ok) throw new Error(`GET ${path} -> ${response.status}`);
  return accept === 'application/json' ? response.json() : response.text();
}

function sortByDate(a, b) {
  return (a.properties.date || '9999').localeCompare(b.properties.date || '9999');
}

function keysFromXml(xml) {
  const keys = new Set();
  for (const match of xml.matchAll(/\s(?:key|sameAs|corresp)="([^"]+)"/g)) {
    match[1].split(/\s+/).forEach((key) => keys.add(key.replace(/^#/, '')));
  }
  return keys;
}

function letterRefsFromXml(xml) {
  return [...xml.matchAll(/<ref[^>]*\starget="([^"h#][^"]*)"/g)].map((m) => m[1]);
}

function letterEntityIds(letter) {
  const p = letter.properties;
  const ids = [...(p.sender || []), ...(p.recipient || []), p.place?.sent, p.place?.received];
  Object.values(p.mentioned || {}).forEach((list) => list.forEach((id) => ids.push(...id.split(' '))));
  return ids.filter(Boolean);
}

function hasAbstract(json, lang) {
  let abstracts = json?.teiHeader?.profileDesc?.abstract?.p;
  if (!abstracts) return false;
  abstracts = Array.isArray(abstracts) ? abstracts : [abstracts];
  return abstracts.some((a) => a['@xml:lang'] === lang && a['#text']);
}

// Minimal grey PNG used as facsimile placeholder (keeps fixtures small)
function placeholderPng(width = 120, height = 160) {
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc = (buf) => {
    let c = 0xffffffff;
    for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type), data]);
    const sum = Buffer.alloc(4);
    sum.writeUInt32BE(crc(body));
    return Buffer.concat([len, body, sum]);
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bit depth
  header[9] = 0; // greyscale
  const row = Buffer.concat([Buffer.from([0]), Buffer.alloc(width, 0xd0)]);
  const raw = Buffer.concat(Array.from({ length: height }, () => row));
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

async function dirSize(dir) {
  let total = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    total += entry.isDirectory() ? await dirSize(path) : (await stat(path)).size;
  }
  return total;
}

async function main() {
  console.log(`Recording from ${API}${DRY_RUN ? ' (dry run)' : ''}`);
  const [version, letters, persons, places, works, facsimiles, fullIndex] = await Promise.all([
    get('version/'),
    get('letters'),
    get('persons'),
    get('places'),
    get('works'),
    get('facsimiles/'),
    get('full-letter-index/'),
  ]);

  // --- Letter selection -----------------------------------------------------
  const sorted = [...letters].sort(sortByDate);
  const byId = new Map(letters.map((l) => [l.id, l]));
  const selected = new Map(); // id -> reason
  const add = (id, reason) => {
    if (id && byId.has(id) && !selected.has(id)) selected.set(id, reason);
  };

  Object.entries(CANDIDATES).forEach(([reason, id]) => add(id, reason));
  const facsimileLetter = Object.keys(facsimiles).find(
    (id) => byId.has(id) && Object.keys(facsimiles[id]).length >= 2,
  );
  add(facsimileLetter, 'facsimile');
  add(sorted[0].id, 'first-chronological');
  add(sorted[sorted.length - 1].id, 'last-chronological');

  for (const id of [...selected.keys()]) {
    const index = sorted.findIndex((l) => l.id === id);
    add(sorted[index - 1]?.id, `neighbour-of-${id}`);
    add(sorted[index + 1]?.id, `neighbour-of-${id}`);
  }

  // Two recipients with >= 3 letters (filters, correspondence table)
  const bunsen = byId.get(CANDIDATES['comment+margin+multi+unclear+refs']).properties.recipient[0];
  const recipientCounts = new Map();
  letters.forEach((l) => (l.properties.recipient || []).forEach((r) => {
    recipientCounts.set(r, (recipientCounts.get(r) || 0) + 1);
  }));
  const otherRecipient = [...recipientCounts.entries()]
    .filter(([id, count]) => id !== bunsen && count >= 3 && count <= 40)
    .sort((a, b) => b[1] - a[1])[0][0];
  for (const recipient of [bunsen, otherRecipient]) {
    sorted
      .filter((l) => l.properties.recipient?.includes(recipient))
      .slice(0, 4)
      .forEach((l) => add(l.id, `recipient-${recipient}`));
  }

  // Letters with abstracts / without facsimile are checked after detail download (every edited letter has an abstract)
  const details = new Map();
  const xmls = new Map();
  const loadLetter = async (id) => {
    if (details.has(id)) return;
    details.set(id, await get(`letters/${id}`));
    xmls.set(id, await get(`letters/${id}`, 'application/xml'));
  };
  for (const id of selected.keys()) await loadLetter(id);

  const needs = {
    'abstract-de+en': (id) => hasAbstract(details.get(id), 'de') && hasAbstract(details.get(id), 'en'),
    'no-facsimile': (id) => !facsimiles[id],
  };
  for (const [criterion, test] of Object.entries(needs)) {
    if ([...selected.keys()].some(test)) continue;
    for (const letter of sorted) {
      if (selected.has(letter.id)) continue;
      await loadLetter(letter.id);
      if (test(letter.id)) {
        add(letter.id, criterion);
        break;
      }
    }
  }

  // Referenced letters (cross references) as long as there is room
  for (const id of [...selected.keys()]) {
    for (const target of letterRefsFromXml(xmls.get(id))) {
      if (selected.size >= MAX_LETTERS) break;
      if (byId.has(target)) {
        add(target, `referenced-by-${id}`);
        await loadLetter(target);
      }
    }
  }
  for (const id of selected.keys()) await loadLetter(id);

  // --- Registers --------------------------------------------------------------
  const referenced = new Set();
  for (const id of selected.keys()) {
    letterEntityIds(byId.get(id)).forEach((e) => referenced.add(e));
    keysFromXml(xmls.get(id)).forEach((e) => referenced.add(e));
  }
  const reduce = (list) => {
    const kept = list.filter((e) => referenced.has(e.id));
    list.slice(0, REGISTER_PADDING).forEach((e) => {
      if (!kept.includes(e)) kept.push(e);
    });
    return kept;
  };
  const keptPersons = reduce(persons);
  const keptPlaces = reduce(places);
  const keptWorks = reduce(works);

  // --- Full letter index ------------------------------------------------------
  const fliEdited = fullIndex.letters.filter((e) => selected.has(e.xml_id));
  const fliOthers = fullIndex.letters
    .filter((e) => !selected.has(e.xml_id))
    .slice(0, FULL_INDEX_SIZE - fliEdited.length);
  const fliLetters = [...fliEdited, ...fliOthers];
  const present = (field) => new Set(fliLetters.flatMap(field));
  const senderNames = present((e) => e.sender_names || []);
  const recipientNames = present((e) => e.recipient_names || []);
  const placesSent = present((e) => [e.placename_sent]);
  const placesReceived = present((e) => [e.placename_received]);
  const years = present((e) => e.relevant_years || []);
  const holdings = present((e) => e.relevant_holding_locations || []);
  const keepIn = (set) => (value) => set.has(value);
  const reducedFullIndex = {
    ...fullIndex,
    letters: fliLetters,
    unique_senders: fullIndex.unique_senders.filter(keepIn(senderNames)),
    unique_recipients: fullIndex.unique_recipients.filter(keepIn(recipientNames)),
    unique_sender_places: fullIndex.unique_sender_places.filter(keepIn(placesSent)),
    unique_recipient_places: fullIndex.unique_recipient_places.filter(keepIn(placesReceived)),
    unique_years: fullIndex.unique_years.filter(keepIn(years)),
    aufbewahrungsorte_short: fullIndex.aufbewahrungsorte_short.filter(keepIn(holdings)),
  };

  // --- Validation -------------------------------------------------------------
  const registerIds = new Set([...keptPersons, ...keptPlaces, ...keptWorks].map((e) => e.id));
  const missing = [...referenced].filter((id) => !registerIds.has(id));
  const danglingLetterRefs = [...selected.keys()].flatMap((id) =>
    letterRefsFromXml(xmls.get(id)).filter((t) => !selected.has(t)),
  );

  console.log(`Letters: ${selected.size}`);
  [...selected.entries()].forEach(([id, reason]) => console.log(`  ${id}  ${reason}`));
  console.log(`Persons ${keptPersons.length}, places ${keptPlaces.length}, works ${keptWorks.length}`);
  console.log(`Full index entries: ${fliLetters.length}`);
  if (missing.length) {
    console.log(`Referenced ids not present in any register (unresolvable in production too): ${missing.length}`);
  }
  if (DRY_RUN) return;

  // --- Write ------------------------------------------------------------------
  await rm(OUT, { recursive: true, force: true });
  for (const sub of ['letters', 'persons', 'places', 'works', 'beacon']) {
    await mkdir(join(OUT, sub), { recursive: true });
  }
  const json = (path, data) => writeFile(join(OUT, path), `${JSON.stringify(data, null, 1)}\n`);

  const selectedLetters = letters.filter((l) => selected.has(l.id));
  await json('version.json', version);
  await json('letters.json', selectedLetters);
  await json('persons.json', keptPersons);
  await json('places.json', keptPlaces);
  await json('works.json', keptWorks);
  await json(
    'facsimiles.json',
    Object.fromEntries(Object.entries(facsimiles).filter(([id]) => selected.has(id))),
  );
  await json('full-letter-index.json', reducedFullIndex);
  await writeFile(join(OUT, 'facsimile-placeholder.png'), placeholderPng());

  for (const id of selected.keys()) {
    await json(`letters/${id}.json`, details.get(id));
    await writeFile(join(OUT, `letters/${id}.xml`), xmls.get(id));
  }

  // Detail pages: every person/place of the selected letters, works as TEI for the WorkTitle XSLT
  const detailPersons = keptPersons.filter((p) => referenced.has(p.id));
  for (const person of detailPersons) {
    await json(`persons/${person.id}.json`, await get(`persons/${person.id}`));
  }
  for (const place of keptPlaces.filter((p) => referenced.has(p.id))) {
    await json(`places/${place.id}.json`, await get(`places/${place.id}`));
  }
  for (const work of keptWorks.filter((w) => referenced.has(w.id))) {
    await writeFile(join(OUT, `works/${work.id}.xml`), await get(`works/${work.id}`, 'application/xml'));
  }

  // BEACON: production endpoint currently fails (HTTP 500), so a static sample is used
  const gndPerson = detailPersons.find((p) => p.properties.gnd && p.properties.type !== 'org');
  const gnd = gndPerson?.properties.gnd.split('/').pop();
  if (gndPerson) {
    await json(`beacon/${gnd}.json`, {
      dnb: gnd,
      entries: [
        {
          short: 'Wikipedia',
          long: 'Artikel in der deutschsprachigen Wikipedia',
          url: `https://de.wikipedia.org/wiki/Spezial:GND-Suche/${gnd}`,
        },
      ],
    });
  }

  await json('manifest.json', {
    recordedAt: new Date().toISOString(),
    source: API,
    letters: Object.fromEntries(selected),
    facsimileLetter,
    gndPerson: gndPerson ? { id: gndPerson.id, gnd } : null,
    danglingLetterRefs: [...new Set(danglingLetterRefs)],
    unresolvableEntityIds: missing,
    notes: [
      'Search results are computed by the mock API from the recorded TEI (production /search returned 500 at recording time).',
      'BEACON fixture is a static sample (production /beacon/seeAlso returned 500 at recording time).',
      'Facsimile images are replaced by a placeholder PNG.',
    ],
  });

  const size = await dirSize(OUT);
  console.log(`Fixture size: ${(size / 1024).toFixed(0)} KiB`);
  if (size > MAX_BYTES) {
    throw new Error(`Fixtures exceed ${MAX_BYTES} bytes`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
