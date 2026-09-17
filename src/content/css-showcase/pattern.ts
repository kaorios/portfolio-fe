import type { Locale } from '@/locales';

/**
 * Prose in the locales it has actually been written in. Japanese is required
 * because it is the language patterns are authored in; English arrives as
 * translations land. Making English optional is what keeps a pattern from
 * being registered with the Japanese text copied into the English field just
 * to satisfy the type.
 */
export type LocalizedText = { ja: string; en?: string };

/**
 * Whether a string carries anything a reader would see. Whitespace does not:
 * it reaches the page as a blank heading or a link with no text in it, so
 * everything here treats it the same as nothing at all.
 */
export const hasText = (value: string | undefined): value is string =>
  value !== undefined && value.trim().length > 0;

/**
 * The text to show in `locale`, falling back to Japanese. A pattern is
 * published in both locales even when only the Japanese is written, so that
 * the canonical and hreflang links stay consistent for every pattern.
 */
export const textFor = (text: LocalizedText, locale: Locale): string => {
  const written = text[locale];
  return hasText(written) ? written : text.ja;
};

/**
 * The locale the text will actually be read in, which is not always the one
 * asked for: English that has not been written yet is answered with Japanese.
 * A page has to say so, or a screen reader on the English page pronounces the
 * Japanese with English rules.
 */
export const languageOf = (text: LocalizedText, locale: Locale): Locale =>
  hasText(text[locale]) ? locale : 'ja';

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
   * is no second copy to keep in step. The HTML carries no scripting: patterns
   * are CSS, and registration rejects a pattern that brings its own.
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
