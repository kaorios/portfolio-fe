import { describe, expect, it } from 'vitest';
import type { CssPattern } from '@/content/css-showcase/pattern';
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

    it('closes the preview style element from inside the CSS', () => {
      const css = '.sample { color: red; }</style><script>alert(1)</script>';

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
