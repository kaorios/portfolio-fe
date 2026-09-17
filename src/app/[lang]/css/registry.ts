import { patterns as published } from '@/content/css-showcase';
import type { CssPattern, LocalizedText } from '@/content/css-showcase/pattern';

/** Slugs become URL segments, so they are held to what reads well as one. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isBlank = (value: string) => value.trim().length === 0;

/**
 * Every message names the pattern and what to change, because these are read
 * in a failing build by whoever just added a pattern.
 */
const reject = (message: string): never => {
  throw new Error(`css-showcase: ${message}`);
};

/**
 * Prose is only as present as its Japanese. A page renders the Japanese
 * wherever the English is missing, so a blank Japanese string reaches a
 * visitor as an empty heading or a bullet with nothing in it.
 */
const requireProse = (slug: string, label: string, text: LocalizedText) => {
  if (isBlank(text.ja)) {
    reject(
      `"${slug}" has no Japanese ${label}. Japanese is the language patterns are written in; English is the optional one.`,
    );
  }
};

const validate = (
  pattern: CssPattern,
  registered: ReadonlyMap<string, CssPattern>,
) => {
  const { slug } = pattern;

  if (!SLUG.test(slug)) {
    reject(
      `"${slug}" cannot be used as a slug. A slug becomes a URL segment, so it takes lowercase letters, digits and single hyphens between them, as in "hover-card".`,
    );
  }

  const clash = registered.get(slug);
  if (clash) {
    reject(
      `the slug "${slug}" is registered twice, by "${clash.title.ja}" and by "${pattern.title.ja}". Both would answer on the same URL, so rename one of them in src/content/css-showcase/.`,
    );
  }

  requireProse(slug, 'title', pattern.title);
  requireProse(slug, 'description', pattern.description);

  if (isBlank(pattern.html)) {
    reject(
      `"${slug}" has no HTML. The same string is rendered in the preview and shown as the source, so an empty one leaves a visitor with neither.`,
    );
  }

  if (isBlank(pattern.css)) {
    reject(
      `"${slug}" has no CSS, so there is nothing for the pattern to teach.`,
    );
  }

  /*
   * The CSS is inlined into a <style> element in the preview document. A
   * closing tag inside it would end that element early and spill the rest of
   * the pattern onto the preview as markup. Tag names are case-insensitive, so
   * "</STYLE>" ends the element every bit as much as "</style>" does.
   */
  if (pattern.css.toLowerCase().includes('</style')) {
    reject(
      `"${slug}" has "</style" inside its CSS, which would break out of the preview's style element. Escape it, or move that rule out of the pattern.`,
    );
  }

  if (pattern.learningPoints.length === 0) {
    reject(
      `"${slug}" lists no learning points, so the detail page has nothing to put under "What you will learn".`,
    );
  }

  pattern.learningPoints.forEach((point, index) => {
    requireProse(slug, `text for learning point ${index + 1}`, point);
  });

  if (pattern.explanations.length === 0) {
    reject(
      `"${slug}" has no explanations, so the detail page has nothing to put under "How it works".`,
    );
  }

  pattern.explanations.forEach((explanation, index) => {
    requireProse(
      slug,
      `heading for explanation ${index + 1}`,
      explanation.heading,
    );
    requireProse(slug, `body for explanation ${index + 1}`, explanation.body);
  });

  const blankTag = pattern.tags.find(isBlank);
  if (blankTag !== undefined) {
    reject(`"${slug}" lists a tag that is blank.`);
  }

  const duplicateTag = pattern.tags.find(
    (tag, index) => pattern.tags.indexOf(tag) !== index,
  );
  if (duplicateTag !== undefined) {
    reject(`"${slug}" lists the tag "${duplicateTag}" twice.`);
  }

  const { height } = pattern.preview ?? {};
  if (height !== undefined && (!Number.isFinite(height) || height <= 0)) {
    reject(
      `"${slug}" declares a preview height of ${height}. It is the pixel height the preview starts at, so it has to be a positive number.`,
    );
  }
};

export type CssPatternRegistry = {
  all: () => readonly CssPattern[];
  get: (slug: string) => CssPattern | undefined;
};

/**
 * Checks the patterns and indexes them by slug. Called with the published
 * patterns below, and with hand-built ones from the tests.
 */
export const createRegistry = (
  patterns: readonly CssPattern[],
): CssPatternRegistry => {
  const bySlug = new Map<string, CssPattern>();

  for (const pattern of patterns) {
    validate(pattern, bySlug);
    bySlug.set(pattern.slug, pattern);
  }

  const all = [...bySlug.values()];

  return {
    all: () => all,
    get: (slug) => bySlug.get(slug),
  };
};

/**
 * The published patterns. Built while the module loads, so a registration that
 * breaks one of the rules above fails the build instead of reaching a visitor.
 */
export const registry = createRegistry(published);
