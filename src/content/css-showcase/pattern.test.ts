import { describe, expect, it } from 'vitest';
import { textFor } from './pattern';

describe('textFor', () => {
  it('uses the text written for the locale', () => {
    expect(textFor({ ja: 'ホバーカード', en: 'Hover Card' }, 'en')).toBe(
      'Hover Card',
    );
  });

  /*
   * Patterns are published in both locales as soon as the Japanese is written,
   * so English that has not been translated yet has to fall back rather than
   * leave a gap on the page.
   */
  it('falls back to Japanese when the English is not written yet', () => {
    expect(textFor({ ja: 'ホバーカード' }, 'en')).toBe('ホバーカード');
  });
});
