import { describe, expect, it } from 'vitest';
import { type CodeLanguage, highlight, type TokenType } from './highlight';

/** The whole source back, so a test can prove nothing was dropped or doubled. */
const rebuilt = (code: string, language: CodeLanguage) =>
  highlight(code, language)
    .map(({ text }) => text)
    .join('');

/**
 * The text a given kind of token claimed, in the order it was claimed. The
 * whitespace between tokens is plain and is left out here, so a test can say
 * what was highlighted without restating the spacing around it.
 */
const of = (code: string, language: CodeLanguage, type: TokenType) =>
  highlight(code, language)
    .filter((token) => token.type === type && token.text.trim())
    .map(({ text }) => text);

describe('highlight', () => {
  describe('HTML', () => {
    it('separates the tag, its attributes and their values', () => {
      const code = '<a class="card" href="#">Read</a>';

      expect(of(code, 'html', 'tag')).toEqual(['a', 'a']);
      expect(of(code, 'html', 'attribute')).toEqual(['class', 'href']);
      expect(of(code, 'html', 'string')).toEqual(['"card"', '"#"']);
      expect(of(code, 'html', 'plain')).toEqual(['Read']);
    });

    it('reads a value the author left unquoted', () => {
      expect(of('<div class=card>', 'html', 'string')).toEqual(['card']);
    });

    it('keeps a `>` inside an attribute value out of the tag boundary', () => {
      const code = '<span data-arrow="a > b">x</span>';

      expect(of(code, 'html', 'string')).toEqual(['"a > b"']);
      expect(of(code, 'html', 'plain')).toEqual(['x']);
    });

    it('takes a comment whole', () => {
      const code = '<!-- <div> is not a tag here --><p>hi</p>';

      expect(of(code, 'html', 'comment')).toEqual([
        '<!-- <div> is not a tag here -->',
      ]);
      expect(of(code, 'html', 'tag')).toEqual(['p', 'p']);
    });

    it('leaves a `<` that opens no tag as text', () => {
      const code = '<p>a < b</p>';

      expect(of(code, 'html', 'tag')).toEqual(['p', 'p']);
      expect(of(code, 'html', 'plain').join('')).toBe('a < b');
    });

    it('marks a self-closing tag without inventing an attribute', () => {
      const code = '<img src="x.png" alt="" />';

      expect(of(code, 'html', 'attribute')).toEqual(['src', 'alt']);
      expect(of(code, 'html', 'punctuation')).toEqual(['<', '=', '=', '/>']);
    });
  });

  describe('CSS', () => {
    it('separates the selector from its declarations', () => {
      const code = '.card:hover { color: red; }';

      expect(of(code, 'css', 'selector')).toEqual(['.card:hover']);
      expect(of(code, 'css', 'property')).toEqual(['color']);
      expect(of(code, 'css', 'value')).toEqual(['red']);
    });

    it('reads the rules inside an at-rule as rules', () => {
      const code = '@media (min-width: 600px) { .card { gap: 8px; } }';

      expect(of(code, 'css', 'at-rule')).toEqual(['@media (min-width: 600px)']);
      expect(of(code, 'css', 'selector')).toEqual(['.card']);
      expect(of(code, 'css', 'property')).toEqual(['gap']);
      expect(of(code, 'css', 'value')).toEqual(['8px']);
    });

    it('reads the declarations inside @font-face as declarations', () => {
      const code = '@font-face { font-family: "Rubik"; }';

      expect(of(code, 'css', 'at-rule')).toEqual(['@font-face']);
      expect(of(code, 'css', 'property')).toEqual(['font-family']);
      expect(of(code, 'css', 'value')).toEqual(['"Rubik"']);
    });

    it('keeps a `:` inside a value out of the property', () => {
      const code = '.a { background: url(https://example.com/x.png); }';

      expect(of(code, 'css', 'property')).toEqual(['background']);
      expect(of(code, 'css', 'value')).toEqual([
        'url(https://example.com/x.png)',
      ]);
    });

    it('keeps a `;` and a `}` inside a quoted value out of the structure', () => {
      const code = '.label { content: ";}"; color: red; }';

      expect(of(code, 'css', 'property')).toEqual(['content', 'color']);
      expect(of(code, 'css', 'value')).toEqual(['";}"', 'red']);
      expect(of(code, 'css', 'selector')).toEqual(['.label']);
    });

    it('reads an escaped quote as part of its string', () => {
      const code = String.raw`.a { content: "she said \"hi\""; color: red; }`;

      expect(of(code, 'css', 'property')).toEqual(['content', 'color']);
      expect(of(code, 'css', 'value')).toEqual([
        String.raw`"she said \"hi\""`,
        'red',
      ]);
    });

    it('takes a comment whole, braces and all', () => {
      const code = '/* .old { display: none; } */ .a { color: red; }';

      expect(of(code, 'css', 'comment')).toEqual([
        '/* .old { display: none; } */',
      ]);
      expect(of(code, 'css', 'selector')).toEqual(['.a']);
    });

    it('leaves the indentation in front of a property plain', () => {
      const tokens = highlight('.a {\n  color: red;\n}', 'css');

      expect(tokens).toContainEqual({ type: 'plain', text: '\n  ' });
      expect(tokens).toContainEqual({ type: 'property', text: 'color' });
    });
  });

  /*
   * A pattern's source is content, so the highlighter takes whatever is
   * written: what it must never do is lose a character, add one, or spin.
   */
  describe('whatever it is given', () => {
    it.each([
      ['an empty string', ''],
      ['whitespace alone', '\n  \n'],
      ['an unclosed tag', '<div class="card"'],
      ['an unclosed comment', '<!-- still going'],
      ['a stray closing tag', '</div>'],
      ['a lone angle bracket', '<'],
    ])('rebuilds the HTML exactly: %s', (_, code) => {
      expect(rebuilt(code, 'html')).toBe(code);
    });

    it.each([
      ['an empty string', ''],
      ['whitespace alone', '\n  \n'],
      ['an unclosed block', '.a { color: red;'],
      ['an unclosed comment', '/* still going'],
      ['a stray closing brace', '}}}'],
      ['a declaration with no value', '.a { color: }'],
      ['a lone colon', ':'],
      ['an unclosed string', '.a { content: "never ends'],
      ['a rule hiding inside a string', '.a { content: ";}"; }'],
    ])('rebuilds the CSS exactly: %s', (_, code) => {
      expect(rebuilt(code, 'css')).toBe(code);
    });

    it('rebuilds a whole pattern exactly', () => {
      const css = [
        '/* the card itself */',
        '.card {',
        '  display: grid;',
        '  transition: transform 200ms ease;',
        '}',
        '',
        '@media (prefers-reduced-motion: reduce) {',
        '  .card { transition: none; }',
        '}',
      ].join('\n');

      expect(rebuilt(css, 'css')).toBe(css);
    });
  });
});
