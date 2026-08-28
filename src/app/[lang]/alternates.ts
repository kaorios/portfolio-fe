import type { Metadata } from 'next';
import { defaultLocale, getLocale, locales } from './dictionaries';

/**
 * Canonical and hreflang links for one page, in every locale it is published
 * in. `path` is the route below the locale segment, so the home page passes
 * nothing and `/en/works` passes `/works`.
 */
export const alternatesFor = async (
  path = '',
): Promise<Metadata['alternates']> => {
  const locale = await getLocale();

  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(locales.map((it) => [it, `/${it}${path}`])),
      'x-default': `/${defaultLocale}${path}`,
    },
  };
};
