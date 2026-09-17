import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { LOCALE_COOKIE_NAME } from './app/components/language-switch/const';

const locales = ['en', 'ja'] as const;
const defaultLocale = 'en';

type Locale = (typeof locales)[number];

const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** `order` is the position in the header, which breaks equal-quality ties. */
type LanguageRange = { tag: string; q: number; order: number };

const parseRanges = (header: string): LanguageRange[] =>
  header.split(',').map((part, order) => {
    const [tag, ...params] = part.trim().split(';');
    const q = params
      .map((p) => p.trim())
      .find((p) => p.startsWith('q='))
      ?.slice(2);
    const quality = q === undefined ? 1 : Number(q);
    return {
      tag: tag.toLowerCase(),
      q: Number.isNaN(quality) ? 0 : quality,
      order,
    };
  });

/**
 * The range the client used for one of our locales. An explicit range (`ja`,
 * `ja-JP`) always wins over `*`, so `en;q=0, *;q=1` really does rule out
 * English rather than falling through to the wildcard.
 */
const rangeFor = (locale: string, ranges: LanguageRange[]) => {
  const explicit = ranges.filter(
    ({ tag }) => tag === locale || tag.startsWith(`${locale}-`),
  );
  const candidates =
    explicit.length > 0 ? explicit : ranges.filter(({ tag }) => tag === '*');

  return candidates.reduce<LanguageRange | undefined>(
    (best, range) =>
      !best ||
      range.q > best.q ||
      (range.q === best.q && range.order < best.order)
        ? range
        : best,
    undefined,
  );
};

/**
 * Pick a locale from the `Accept-Language` header. Equal quality is settled by
 * the order the client listed the languages in, so `ja, en` means Japanese.
 */
const getLocale = (request: NextRequest) => {
  const header = request.headers.get('accept-language');
  if (!header) return defaultLocale;

  const ranges = parseRanges(header);
  const [preferred] = locales
    .map((locale) => ({ locale, range: rangeFor(locale, ranges) }))
    .filter(
      (candidate): candidate is { locale: Locale; range: LanguageRange } =>
        candidate.range !== undefined && candidate.range.q > 0,
    )
    .sort((a, b) => b.range.q - a.range.q || a.range.order - b.range.order);

  return preferred?.locale ?? defaultLocale;
};

/**
 * The locale the visitor picked with the language switch, if we still publish
 * it. A value we do not recognise — a locale we dropped, or a hand-edited
 * cookie — is ignored so the negotiation below stays in charge.
 */
const getChosenLocale = (request: NextRequest) => {
  const chosen = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  return chosen !== undefined && isLocale(chosen) ? chosen : undefined;
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) return;

  /*
   * An explicit choice outranks the browser's own preference: someone with a
   * Japanese browser who switched to English meant it, and gets English back.
   */
  const locale = getChosenLocale(request) ?? getLocale(request);

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  /*
   * 307, not 308: the destination is negotiated per request, so it must not be
   * cached as permanent. `Vary` keeps shared caches from serving one visitor's
   * locale to everyone else, and has to name every input the destination is
   * derived from — the cookie as well as the header.
   */
  const response = NextResponse.redirect(url, 307);
  response.headers.set('Vary', 'Accept-Language, Cookie');
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
