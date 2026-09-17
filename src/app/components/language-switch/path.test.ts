import { describe, expect, it } from 'vitest';
import { localePath } from './path';

describe('localePath', () => {
  it('swaps the locale segment of the current page', () => {
    expect(localePath('/en/works', 'en', 'ja')).toBe('/ja/works');
    expect(localePath('/ja/works', 'ja', 'en')).toBe('/en/works');
  });

  it('keeps the locale root free of a trailing slash', () => {
    expect(localePath('/en', 'en', 'ja')).toBe('/ja');
  });

  it('keeps every segment below the locale', () => {
    expect(localePath('/en/works/deep/page', 'en', 'ja')).toBe(
      '/ja/works/deep/page',
    );
  });

  it('prefixes a path that carries no locale yet', () => {
    expect(localePath('/works', 'en', 'ja')).toBe('/ja/works');
    expect(localePath('/', 'en', 'ja')).toBe('/ja');
  });

  it('does not mistake a lookalike prefix for the locale', () => {
    expect(localePath('/entries', 'en', 'ja')).toBe('/ja/entries');
  });

  it('is a no-op path when the locale is unchanged', () => {
    expect(localePath('/en/works', 'en', 'en')).toBe('/en/works');
  });
});
