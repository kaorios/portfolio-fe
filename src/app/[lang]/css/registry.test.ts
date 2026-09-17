import { describe, expect, it } from 'vitest';
import type { CssPattern } from '@/content/css-showcase/pattern';
import { MAX_PREVIEW_HEIGHT } from './preview-document';
import { createRegistry } from './registry';

/** A pattern that passes every rule, so a test can break one at a time. */
const pattern = (overrides: Partial<CssPattern> = {}): CssPattern => ({
  slug: 'sample-pattern',
  title: { ja: 'サンプル' },
  description: { ja: 'サンプルの説明' },
  tags: ['flexbox'],
  learningPoints: [{ ja: 'flex での中央揃え' }],
  html: '<div class="sample">sample</div>',
  css: '.sample { display: flex; }',
  explanations: [{ heading: { ja: '仕組み' }, body: { ja: '本文' } }],
  ...overrides,
});

describe('createRegistry', () => {
  describe('lookup', () => {
    it('returns a registered pattern by its slug', () => {
      const registry = createRegistry([pattern({ slug: 'hover-card' })]);

      expect(registry.get('hover-card')?.slug).toBe('hover-card');
    });

    it('returns nothing for a slug no pattern claims', () => {
      const registry = createRegistry([pattern({ slug: 'hover-card' })]);

      expect(registry.get('sticky-header')).toBeUndefined();
    });

    it('lists patterns in the order they were registered', () => {
      const registry = createRegistry([
        pattern({ slug: 'hover-card' }),
        pattern({ slug: 'sticky-header' }),
      ]);

      expect(registry.all().map(({ slug }) => slug)).toEqual([
        'hover-card',
        'sticky-header',
      ]);
    });
  });

  describe('accepts', () => {
    /* `on` has to begin the attribute, or every `data-once` would be rejected. */
    it('an attribute that merely starts with the letters "on"', () => {
      const html = '<div data-once="true" one-off="yes">v</div>';

      expect(() => createRegistry([pattern({ html })])).not.toThrow();
    });

    it('a preview height right at the ceiling', () => {
      const preview = { height: MAX_PREVIEW_HEIGHT };

      expect(() => createRegistry([pattern({ preview })])).not.toThrow();
    });
  });

  describe('an empty registry', () => {
    it('is built without complaint', () => {
      expect(() => createRegistry([])).not.toThrow();
    });

    it('lists nothing and finds nothing', () => {
      const registry = createRegistry([]);

      expect(registry.all()).toEqual([]);
      expect(registry.get('hover-card')).toBeUndefined();
    });
  });

  describe('rejects a registration that', () => {
    it('reuses a slug, naming both patterns', () => {
      const build = () =>
        createRegistry([
          pattern({ slug: 'hover-card', title: { ja: 'ホバーカード' } }),
          pattern({ slug: 'hover-card', title: { ja: 'カードのホバー' } }),
        ]);

      expect(build).toThrow(/registered twice/);
      expect(build).toThrow(/ホバーカード/);
      expect(build).toThrow(/カードのホバー/);
    });

    it.each([
      ['an uppercase letter', 'Hover-Card'],
      ['a space', 'hover card'],
      ['a slash', 'css/hover-card'],
      ['doubled hyphens', 'hover--card'],
      ['nothing at all', ''],
    ])('uses a slug with %s', (_, slug) => {
      expect(() => createRegistry([pattern({ slug })])).toThrow(
        /cannot be used as a slug/,
      );
    });

    it('leaves out the Japanese title', () => {
      expect(() => createRegistry([pattern({ title: { ja: ' ' } })])).toThrow(
        /no Japanese title/,
      );
    });

    it('leaves out the HTML', () => {
      expect(() => createRegistry([pattern({ html: '  ' })])).toThrow(
        /no HTML/,
      );
    });

    it('leaves out the CSS', () => {
      expect(() => createRegistry([pattern({ css: '' })])).toThrow(/no CSS/);
    });

    it.each([
      ['lowercase', '.sample { color: red; }</style><script>alert(1)</script>'],
      ['uppercase', '.sample { color: red; }</STYLE><script>alert(1)</script>'],
      [
        'mixed case',
        '.sample { color: red; }</Style><script>alert(1)</script>',
      ],
    ])('closes the preview style element in %s', (_, css) => {
      expect(() => createRegistry([pattern({ css })])).toThrow(
        /break out of the preview/,
      );
    });

    it('lists no learning points', () => {
      expect(() => createRegistry([pattern({ learningPoints: [] })])).toThrow(
        /no learning points/,
      );
    });

    it('lists no explanations', () => {
      expect(() => createRegistry([pattern({ explanations: [] })])).toThrow(
        /no explanations/,
      );
    });

    /*
     * A non-empty array is not the same as written prose: blanks pass the
     * length check and reach the page as an empty bullet or heading.
     */
    it('has a learning point with nothing written in it', () => {
      const learningPoints = [{ ja: 'flex での中央揃え' }, { ja: '  ' }];

      expect(() => createRegistry([pattern({ learningPoints })])).toThrow(
        /learning point 2/,
      );
    });

    it('has an explanation with a blank heading', () => {
      const explanations = [{ heading: { ja: '' }, body: { ja: '本文' } }];

      expect(() => createRegistry([pattern({ explanations })])).toThrow(
        /heading for explanation 1/,
      );
    });

    it('has an explanation with a blank body', () => {
      const explanations = [{ heading: { ja: '仕組み' }, body: { ja: ' ' } }];

      expect(() => createRegistry([pattern({ explanations })])).toThrow(
        /body for explanation 1/,
      );
    });

    it('leaves out the Japanese description', () => {
      expect(() =>
        createRegistry([pattern({ description: { ja: '' } })]),
      ).toThrow(/no Japanese description/);
    });

    /*
     * A blank translation is worse than a missing one: it passes as written
     * and so hides the Japanese that would otherwise have stood in for it.
     */
    it('has an English translation with nothing written in it', () => {
      const title = { ja: 'ホバーカード', en: '  ' };

      expect(() => createRegistry([pattern({ title })])).toThrow(
        /English title with nothing written in it/,
      );
    });

    it.each([
      ['a script element', '<div><script>alert(1)</script></div>'],
      ['an uppercase script element', '<div><SCRIPT>alert(1)</SCRIPT></div>'],
    ])('carries %s in its HTML', (_, html) => {
      expect(() => createRegistry([pattern({ html })])).toThrow(
        /has a script in its HTML/,
      );
    });

    it('carries an inline event handler in its HTML', () => {
      const html = '<button onclick="alert(1)">go</button>';

      expect(() => createRegistry([pattern({ html })])).toThrow(
        /inline event handler/,
      );
    });

    it('declares a preview height past the ceiling', () => {
      const preview = { height: MAX_PREVIEW_HEIGHT + 1 };

      expect(() => createRegistry([pattern({ preview })])).toThrow(
        /past the .*px a preview is allowed to grow to/,
      );
    });

    it('lists a blank tag', () => {
      expect(() => createRegistry([pattern({ tags: ['grid', ' '] })])).toThrow(
        /tag that is blank/,
      );
    });

    it('repeats a tag', () => {
      const tags = ['flexbox', 'grid', 'flexbox'];

      expect(() => createRegistry([pattern({ tags })])).toThrow(
        /lists the tag "flexbox" twice/,
      );
    });

    it.each([0, -120, Number.NaN])(
      'declares a preview height of %s',
      (height) => {
        expect(() =>
          createRegistry([pattern({ preview: { height } })]),
        ).toThrow(/preview height/);
      },
    );
  });
});
