import type { Locale } from '@/app/[lang]/dictionaries';
import {
  type LocalizedText,
  languageOf,
  textFor,
} from '@/content/css-showcase/pattern';

type LocalizedProps = {
  text: LocalizedText;
  locale: Locale;
};

/**
 * Pattern prose, marked with the language it is actually in. Text in the
 * locale being read needs no marking and stays bare; Japanese standing in for
 * a translation that has not been written is wrapped so it is announced as
 * Japanese on the English page.
 */
export const Localized = ({ text, locale }: LocalizedProps) => {
  const language = languageOf(text, locale);
  const value = textFor(text, locale);

  return language === locale ? value : <span lang={language}>{value}</span>;
};
