/**
 * Remembers the locale the visitor picked with the language switch. `src/proxy.ts`
 * reads it to send unprefixed URLs to that locale instead of the one negotiated
 * from `Accept-Language`, so the choice survives the next visit.
 */
export const LOCALE_COOKIE_NAME = 'preferredLocale';
