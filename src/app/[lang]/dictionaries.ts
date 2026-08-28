import { notFound } from 'next/navigation';
import { lang } from 'next/root-params';
import type en from './dictionaries/en.json';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((m) => m.default),
  ja: () => import('./dictionaries/ja.json').then((m) => m.default),
} satisfies Record<string, () => Promise<typeof en>>;

export type Locale = keyof typeof dictionaries;

export const locales = Object.keys(dictionaries) as Locale[];

export const defaultLocale: Locale = 'en';

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getLocale = async () => {
  const locale = await lang();
  if (!locale || !hasLocale(locale)) notFound();
  return locale;
};

export const getDictionary = async () => dictionaries[await getLocale()]();
