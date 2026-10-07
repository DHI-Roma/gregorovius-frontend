import { describe, expect, it } from 'vitest';
import { sortLetterByDate } from 'src/services/sort-service';

const letter = (date) => ({ properties: { date } });

describe('sortLetterByDate', () => {
  it('orders letters chronologically', () => {
    const letters = [letter('1860-01-05'), letter('1854-01-08'), letter('1884-11-30')];
    expect(letters.sort(sortLetterByDate).map((l) => l.properties.date)).toEqual([
      '1854-01-08',
      '1860-01-05',
      '1884-11-30',
    ]);
  });

  it('keeps letters with the same date equal', () => {
    expect(sortLetterByDate(letter('1860-01-05'), letter('1860-01-05'))).toBe(0);
  });
});
