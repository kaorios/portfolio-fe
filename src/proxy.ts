import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const locales = ['en', 'ja'] as const;
const defaultLocale = 'en';

/**
 * Pick a locale from the `Accept-Language` header.
 * Japanese is only chosen when it outranks English, so the default stays `en`.
 */
const getLocale = (request: NextRequest) => {
  const header = request.headers.get('accept-language');
  if (!header) return defaultLocale;

  const preferred = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith('q='))
        ?.slice(2);
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .filter(({ q }) => !Number.isNaN(q) && q > 0)
    .sort((a, b) => b.q - a.q)
    .find(({ tag }) =>
      locales.some((locale) => tag === locale || tag.startsWith(`${locale}-`)),
    );

  return preferred?.tag.startsWith('ja') ? 'ja' : defaultLocale;
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${getLocale(request)}${pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: [
    /*
     * Everything except Next.js internals and files served from `public/`.
     */
    '/((?!_next|img/|favicon.ico|manifest.json|robots.txt).*)',
  ],
};
