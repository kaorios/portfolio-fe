import type { Locale } from '@/app/[lang]/dictionaries';

/**
 * Prose in the locales it has actually been written in. Japanese is required
 * because it is the language patterns are authored in; English arrives as
 * translations land. Making English optional is what keeps a pattern from
 * being registered with the Japanese text copied into the English field just
 * to satisfy the type.
 */
export type LocalizedText = { ja: string; en?: string };

/**
 * The text to show in `locale`, falling back to Japanese. A pattern is
 * published in both locales even when only the Japanese is written, so that
 * the canonical and hreflang links stay consistent for every pattern.
 */
export const textFor = (text: LocalizedText, locale: Locale) =>
  text[locale] ?? text.ja;

/** One step of the "How it works" walkthrough on the detail page. */
export type PatternExplanation = {
  heading: LocalizedText;
  body: LocalizedText;
};

export type CssPattern = {
  /** The URL segment, and the key the registry looks the pattern up by. */
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  /** The CSS features the pattern demonstrates, shown as tags on the page. */
  tags: string[];
  /** The "What you will learn" list. */
  learningPoints: LocalizedText[];
  /**
   * The pattern itself. These two strings are both rendered in the preview and
   * shown as the source, so what a visitor reads is always what they see; there
   * is no second copy to keep in step.
   */
  html: string;
  css: string;
  explanations: PatternExplanation[];
  preview?: {
    /**
     * The preview's height in pixels before the frame measures itself. The
     * measurement needs JavaScript, so this is also the final height wherever
     * scripts do not run — declare it for anything taller than a small demo.
     */
    height?: number;
  };
};

/**
 * Registers the shape of a pattern at its definition site, so a missing field
 * is reported in the pattern's own module rather than in the registry.
 */
export const definePattern = (pattern: CssPattern) => pattern;

/**
 * The locale the text will actually be read in, which is not always the one
 * asked for: English that has not been written yet is answered with Japanese.
 * A page has to say so, or a screen reader on the English page pronounces the
 * Japanese with English rules.
 */
export const languageOf = (text: LocalizedText, locale: Locale): Locale =>
  text[locale] === undefined ? 'ja' : locale;
