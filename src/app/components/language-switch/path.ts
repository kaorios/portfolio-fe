import type { Locale } from '@/app/[lang]/dictionaries';

/**
 * The path to the page currently on screen, in another locale.
 *
 * `current` is passed in rather than detected from the path, because the only
 * reliable source for it is the `[lang]` segment the page was rendered from.
 * A path that has somehow lost its prefix is prefixed rather than rewritten,
 * so the switch always lands on a real page.
 */
export const localePath = (pathname: string, current: Locale, next: Locale) => {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === current) segments.shift();

  return `/${[next, ...segments].join('/')}`;
};
