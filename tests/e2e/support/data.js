// Facts about the recorded fixtures used across tests.
// If fixtures are re-recorded (npm run e2e:record), verify these still hold.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FIXTURES } from './mock-api.js';

const load = (path) => JSON.parse(readFileSync(join(FIXTURES, path), 'utf8'));

export const manifest = load('manifest.json');
export const letters = load('letters.json');
export const persons = load('persons.json');
export const places = load('places.json');
export const works = load('works.json');
export const fullIndex = load('full-letter-index.json');
export const facsimiles = load('facsimiles.json');

const letterById = (id) => letters.find((l) => l.id === id);
export const sortedLetters = [...letters].sort((a, b) =>
  (a.properties.date || '').localeCompare(b.properties.date || ''),
);
const title = (id) => letterById(id).properties.title;

export const LETTERS = {
  // comments, metamarks, entity links of every kind, letter cross references, facsimiles, abstracts DE+EN
  rich: {
    id: 'ed_yns_ct5_4wb',
    title: title('ed_yns_ct5_4wb'),
    textSnippet: 'Sie haben freundlich die Sendung empfangen',
    comment: { id: 'ndrj_gnh_cfc', lemma: 'Ew. Excellenz', textSnippet: 'Der Diplomat Christian Karl Josias' },
    person: { id: 'G001429', label: 'Mommsen', name: 'Mommsen, Theodor' },
    place: { id: 'G000664', label: 'Deutschland' },
    work: { id: 'G004764', label: 'Stadtbeschreibung', titleSnippet: 'Beschreibung der Stadt Rom' },
    letterRef: { id: 'ed_jyb_2h5_4wb', label: '6. April 1859' },
    recipient: { id: 'G001001', name: 'Bunsen, Christian Karl Josias Freiherr von' },
    abstractDeSnippet: 'Für Bunsens Antwortschreiben aus Cannes',
  },
  italian: { id: 'G000014', title: title('G000014'), foreignSnippet: 'sono tempi passati e sofferti' },
  facsimile: { id: 'G000001', title: title('G000001'), labels: ['1r', '1v'] },
  marginNote: { id: 'G000066', title: title('G000066') },
  first: { id: sortedLetters[0].id, title: sortedLetters[0].properties.title },
  last: {
    id: sortedLetters[sortedLetters.length - 1].id,
    title: sortedLetters[sortedLetters.length - 1].properties.title,
  },
};

export const GND_PERSON = manifest.gndPerson; // { id, gnd }
