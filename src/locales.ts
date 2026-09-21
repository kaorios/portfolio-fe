/**
 * The locales the site publishes.
 *
 * These live outside `src/app` so that content can describe itself in them
 * without depending on the routing layer that renders it: pages read content,
 * content does not read pages, and both read this.
 */
export const locales = ['en', 'ja'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const hasLocale = (locale: string): locale is Locale =>
  (locales as readonly string[]).includes(locale);
