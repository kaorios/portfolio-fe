/**
 * Every cookie the site sets, with the attributes it is written with.
 *
 * A cookie is a contract between the two ends that touch it, and neither end
 * owns it: `preferredLocale` is written by a client component and read by
 * `src/proxy.ts`, `disabledLoadingAnimation` by a client component and read by
 * the `[lang]` layout. Keeping each definition next to one of its ends left
 * the other reaching into a component folder for it, so they live here
 * instead, where both ends are equally far away.
 */

/**
 * Remembers the locale the visitor picked with the language switch, so
 * `src/proxy.ts` can send later unprefixed URLs there instead of to the locale
 * negotiated from `Accept-Language`.
 */
export const LOCALE_COOKIE = {
  name: 'preferredLocale',
  options: {
    /** A year: long enough that the choice outlives a browser restart. */
    expires: 365,
    path: '/',
    sameSite: 'lax',
  },
} as const;

/** Marks the intro animation as already seen, so it plays once every few days. */
export const DISABLED_ANIMATION_COOKIE = {
  name: 'disabledLoadingAnimation',
  options: { expires: 3 },
} as const;
