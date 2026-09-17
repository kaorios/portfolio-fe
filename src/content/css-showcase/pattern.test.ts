import { describe, expect, it } from 'vitest';
import { languageOf, textFor } from './pattern';

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

describe('languageOf', () => {
  it('reports the locale when the text was written for it', () => {
    expect(languageOf({ ja: 'ホバーカード', en: 'Hover Card' }, 'en')).toBe(
      'en',
    );
  });

  /*
   * The page marks fallback text with this, so a screen reader on the English
   * page announces the Japanese with Japanese pronunciation rules.
   */
  it('reports Japanese when the English falls back to it', () => {
    expect(languageOf({ ja: 'ホバーカード' }, 'en')).toBe('ja');
  });
});
