import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const locales = ['en', 'ja'] as const;
const defaultLocale = 'en';

type LanguageRange = { tag: string; q: number };

const parseRanges = (header: string): LanguageRange[] =>
  header.split(',').map((part) => {
    const [tag, ...params] = part.trim().split(';');
    const q = params
      .map((p) => p.trim())
      .find((p) => p.startsWith('q='))
      ?.slice(2);
    const quality = q === undefined ? 1 : Number(q);
    return { tag: tag.toLowerCase(), q: Number.isNaN(quality) ? 0 : quality };
  });

/**
 * Quality the client assigned to one of our locales. An explicit range (`ja`,
 * `ja-JP`) always wins over `*`, so `en;q=0, *;q=1` really does rule out
 * English rather than falling through to the wildcard.
 */
const qualityOf = (locale: string, ranges: LanguageRange[]) => {
  const explicit = ranges.filter(
    ({ tag }) => tag === locale || tag.startsWith(`${locale}-`),
  );
  if (explicit.length > 0) return Math.max(...explicit.map(({ q }) => q));

  return ranges.find(({ tag }) => tag === '*')?.q ?? 0;
};

/**
 * Pick a locale from the `Accept-Language` header. Ties keep the order of
 * `locales`, so English wins unless the client actually prefers Japanese.
 */
const getLocale = (request: NextRequest) => {
  const header = request.headers.get('accept-language');
  if (!header) return defaultLocale;

  const ranges = parseRanges(header);
  const [preferred] = locales
    .map((locale) => ({ locale, q: qualityOf(locale, ranges) }))
    .filter(({ q }) => q > 0)
    .sort((a, b) => b.q - a.q);

  return preferred?.locale ?? defaultLocale;
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${getLocale(request)}${pathname}`;

  /*
   * 307, not 308: the destination is negotiated from `Accept-Language`, so it
   * must not be cached as permanent. `Vary` keeps shared caches from serving
   * one visitor's locale to everyone else.
   */
  const response = NextResponse.redirect(url, 307);
  response.headers.set('Vary', 'Accept-Language');
  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except Next.js internals and files served from `public/`.
     */
    '/((?!_next|img/|favicon.ico|manifest.json|robots.txt).*)',
  ],
};
