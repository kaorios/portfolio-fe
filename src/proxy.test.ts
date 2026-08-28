import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { proxy } from './proxy';

const ORIGIN = 'https://kaorios.com';

const request = (path: string, acceptLanguage?: string) =>
  new NextRequest(new URL(path, ORIGIN), {
    headers: acceptLanguage ? { 'accept-language': acceptLanguage } : {},
  });

const redirect = (path: string, acceptLanguage?: string) => {
  const response = proxy(request(path, acceptLanguage));
  if (!response) {
    throw new Error(`expected ${path} to redirect, but the proxy passed it on`);
  }

  const location = response.headers.get('location');
  return {
    status: response.status,
    location,
    pathname: location ? new URL(location, ORIGIN).pathname : null,
    vary: response.headers.get('vary'),
  };
};

describe('proxy', () => {
  describe('locale negotiation', () => {
    it.each([
      ['ja', 'ja'],
      ['ja-JP', 'ja'],
      ['en-US,en;q=0.9', 'en'],
      ['ja,en-US;q=0.8', 'ja'],
      ['en-US,en;q=0.9,ja;q=0.7', 'en'],
      ['en;q=0.4,ja;q=0.5', 'ja'],
      ['ja,en', 'ja'],
      ['en,ja', 'en'],
      ['ja;q=0.8,en;q=0.8', 'ja'],
    ])('picks %s -> /%s', (acceptLanguage, expected) => {
      expect(redirect('/', acceptLanguage).pathname).toBe(`/${expected}`);
    });

    it('falls back to English when no Accept-Language is sent', () => {
      expect(redirect('/').pathname).toBe('/en');
    });

    it('falls back to English for unsupported languages', () => {
      expect(redirect('/', 'fr-FR,fr;q=0.9').pathname).toBe('/en');
    });

    it('breaks an equal-quality tie by the order in the header', () => {
      expect(redirect('/', 'ja;q=0.5,en;q=0.5').pathname).toBe('/ja');
      expect(redirect('/', 'en;q=0.5,ja;q=0.5').pathname).toBe('/en');
    });

    it('honours a wildcard when the exact language is rejected', () => {
      expect(redirect('/', 'en;q=0,*;q=1').pathname).toBe('/ja');
    });

    it('treats a bare wildcard as no preference', () => {
      expect(redirect('/', '*').pathname).toBe('/en');
    });
  });

  describe('redirect response', () => {
    it('is temporary, because the destination is negotiated per request', () => {
      expect(redirect('/', 'ja').status).toBe(307);
    });

    it('varies on Accept-Language so shared caches stay correct', () => {
      expect(redirect('/', 'ja').vary).toBe('Accept-Language');
    });

    it('keeps the rest of the path', () => {
      expect(redirect('/works', 'ja').pathname).toBe('/ja/works');
    });

    it('does not append a trailing slash to the locale root', () => {
      expect(redirect('/', 'ja').pathname).toBe('/ja');
    });
  });

  describe('paths that already carry a locale', () => {
    it.each(['/en', '/ja', '/en/works', '/ja/works'])(
      'passes %s straight through',
      (path) => {
        expect(proxy(request(path, 'ja'))).toBeUndefined();
      },
    );

    it('does not treat a lookalike prefix as a locale', () => {
      expect(redirect('/entries', 'en').pathname).toBe('/en/entries');
    });
  });
});
