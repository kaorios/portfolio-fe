import { patterns as published } from '@/content/css-showcase';
import {
  type CssPattern,
  hasText,
  type LocalizedText,
} from '@/content/css-showcase/pattern';
import { MAX_PREVIEW_HEIGHT } from './preview-document';

/** Slugs become URL segments, so they are held to what reads well as one. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Scripting a pattern could bring with it. The preview frame runs scripts so
 * that it can report its height, and anything a pattern carried would run
 * alongside that — including a message shaped like the height it reports.
 *
 * A start tag separates attributes with whitespace *or* a solidus, so
 * `<svg/onload=…>` names a handler every bit as much as `<svg onload=…>`
 * does. An attribute is only a handler when `on` begins it, so `data-once` is
 * not one.
 */
const SCRIPT_TAG = /<script/i;
const INLINE_HANDLER = /<[a-z][^>]*[\s/]on[a-z]+\s*=/i;
const JAVASCRIPT_URL = /=\s*["']?\s*javascript:/i;

/**
 * Quoted attribute values, blanked before looking for attribute names. A URL
 * can hold anything an attribute name can — `src="/online=1"` reads as a
 * handler otherwise — and nothing inside a value is an attribute.
 */
const ATTRIBUTE_VALUES = /"[^"]*"|'[^']*'/g;

/**
 * Every message names the pattern and what to change, because these are read
 * in a failing build by whoever just added a pattern.
 */
const reject = (message: string): never => {
  throw new Error(`css-showcase: ${message}`);
};

/**
 * Prose is only as present as what is written in it. A blank Japanese string
 * reaches a visitor as an empty heading or a bullet with nothing in it, and a
 * blank English one is worse: it hides the Japanese that would have stood in
 * for it.
 */
const requireProse = (slug: string, label: string, text: LocalizedText) => {
  if (!hasText(text.ja)) {
    reject(
      `"${slug}" has no Japanese ${label}. Japanese is the language patterns are written in; English is the optional one.`,
    );
  }

  if (text.en !== undefined && !hasText(text.en)) {
    reject(
      `"${slug}" has an English ${label} with nothing written in it. Leave the English out and the page falls back to the Japanese; a blank one is published as a blank.`,
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

  if (!hasText(pattern.html)) {
    reject(
      `"${slug}" has no HTML. The same string is rendered in the preview and shown as the source, so an empty one leaves a visitor with neither.`,
    );
  }

  if (SCRIPT_TAG.test(pattern.html)) {
    reject(
      `"${slug}" has a script in its HTML. A pattern is CSS, and the preview frame is allowed to run scripts only so that it can report its height — a pattern's own script would run beside it.`,
    );
  }

  if (INLINE_HANDLER.test(pattern.html.replace(ATTRIBUTE_VALUES, '""'))) {
    reject(
      `"${slug}" has an inline event handler in its HTML. A pattern is CSS: reach for a selector such as :hover, :focus-visible or :has() instead.`,
    );
  }

  if (JAVASCRIPT_URL.test(pattern.html)) {
    reject(
      `"${slug}" has a javascript: URL in its HTML, which runs as soon as the link is followed. A pattern is CSS.`,
    );
  }

  if (!hasText(pattern.css)) {
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

  if (pattern.tags.some((tag) => !hasText(tag))) {
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

  /*
   * The declared height is what a visitor is served before anything is
   * measured, and all they ever get where scripts do not run, so it is held to
   * the same ceiling a measured height is.
   */
  if (height !== undefined && height > MAX_PREVIEW_HEIGHT) {
    reject(
      `"${slug}" declares a preview height of ${height}px, past the ${MAX_PREVIEW_HEIGHT}px a preview is allowed to grow to. Trim the demo, or let it scroll inside a shorter frame.`,
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
