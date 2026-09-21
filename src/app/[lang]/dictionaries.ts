import { notFound } from 'next/navigation';
import { lang } from 'next/root-params';
import { hasLocale, type Locale } from '@/locales';
import type en from './dictionaries/en.json';

/** `satisfies Record<Locale, …>` is what makes a published locale without a dictionary a type error. */
const dictionaries = {
  en: () => import('./dictionaries/en.json').then((m) => m.default),
  ja: () => import('./dictionaries/ja.json').then((m) => m.default),
} satisfies Record<Locale, () => Promise<typeof en>>;

export { defaultLocale, hasLocale, type Locale, locales } from '@/locales';

export const getLocale = async () => {
  const locale = await lang();
  if (!locale || !hasLocale(locale)) notFound();
  return locale;
};

export const getDictionary = async () => dictionaries[await getLocale()]();
