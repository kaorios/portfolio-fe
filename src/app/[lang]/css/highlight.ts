/**
 * Syntax highlighting for the two languages the showcase prints: the HTML and
 * the CSS of a pattern.
 *
 * It is a tokenizer, not a parser, and deliberately a small one. A pattern is a
 * few dozen lines of markup and rules, so the job is colouring them rather than
 * validating them: anything malformed is coloured as best it can be and nothing
 * here throws, because the source is content rather than code we control.
 *
 * Highlighting on the server keeps the source readable without shipping a
 * highlighter to the browser, so the code on the page is coloured even where
 * JavaScript never runs.
 *
 * One known limit: a nested CSS rule is coloured as though its selector were a
 * declaration. Its braces still balance, so the rest of the sheet is unaffected.
 */

export type CodeLanguage = 'html' | 'css';

export type TokenType =
  | 'plain'
  | 'comment'
  | 'punctuation'
  /** An element name, `div` in `<div class="card">`. */
  | 'tag'
  /** An attribute name, `class` in `<div class="card">`. */
  | 'attribute'
  /** An attribute value, quoted or not. */
  | 'string'
  | 'selector'
  /** An at-rule and its prelude, `@media (min-width: 600px)`. */
  | 'at-rule'
  | 'property'
  | 'value';

export type Token = { type: TokenType; text: string };

/** Collects tokens, dropping empty ones so the scanners can push freely. */
const collector = () => {
  const tokens: Token[] = [];

  const push = (type: TokenType, text: string) => {
    if (text) tokens.push({ type, text });
  };

  /**
   * Pushes `text` without its surrounding whitespace, which belongs to no token
   * and so stays plain. The indentation in front of a property would otherwise
   * carry the property's own colour into anything that styles whitespace.
   */
  const pushTrimmed = (type: TokenType, text: string) => {
    const core = text.trim();
    if (!core) {
      push('plain', text);
      return;
    }

    const start = text.indexOf(core);
    push('plain', text.slice(0, start));
    push(type, core);
    push('plain', text.slice(start + core.length));
  };

  return { tokens, push, pushTrimmed };
};

/**
 * The index just past the `>` that closes the tag opening at `start`, or the
 * end of the source for a tag nothing closes. Quotes are tracked because an
 * attribute value is allowed to hold a `>`.
 */
const tagEnd = (code: string, start: number) => {
  let quote: string | undefined;

  for (let i = start + 1; i < code.length; i += 1) {
    const char = code[i];

    if (quote) {
      if (char === quote) quote = undefined;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '>') return i + 1;
  }

  return code.length;
};

/*
 * The pieces a tag is made of, in the order they have to be tried: whitespace,
 * a quoted value, the `=` between a name and its value, the tag's own closing,
 * and finally a bare run that is either an attribute name or an unquoted value.
 */
const TAG_PIECE = /\s+|"[^"]*"|'[^']*'|=|\/?>|[^\s=/>]+/y;

const pushTag = (
  push: (type: TokenType, text: string) => void,
  tag: string,
) => {
  const open = tag.startsWith('</') ? '</' : '<';
  push('punctuation', open);

  const name = /^[^\s/>]*/.exec(tag.slice(open.length))?.[0] ?? '';
  push('tag', name);

  let i = open.length + name.length;
  /* What follows an `=` is a value even when the author left the quotes off. */
  let afterEquals = false;

  while (i < tag.length) {
    TAG_PIECE.lastIndex = i;
    const piece = TAG_PIECE.exec(tag)?.[0];
    if (!piece) {
      push('plain', tag.slice(i));
      return;
    }

    if (/^\s/.test(piece)) {
      push('plain', piece);
    } else if (piece === '=') {
      push('punctuation', piece);
      afterEquals = true;
      i += piece.length;
      continue;
    } else if (piece === '>' || piece === '/>') {
      push('punctuation', piece);
    } else if (afterEquals || piece.startsWith('"') || piece.startsWith("'")) {
      push('string', piece);
    } else {
      push('attribute', piece);
    }

    afterEquals = false;
    i += piece.length;
  }
};

const htmlTokens = (code: string): Token[] => {
  const { tokens, push } = collector();
  let i = 0;

  while (i < code.length) {
    if (code.startsWith('<!--', i)) {
      const end = code.indexOf('-->', i + 4);
      const stop = end === -1 ? code.length : end + 3;
      push('comment', code.slice(i, stop));
      i = stop;
      continue;
    }

    if (code[i] === '<' && /[a-zA-Z/!?]/.test(code[i + 1] ?? '')) {
      const stop = tagEnd(code, i);
      pushTag(push, code.slice(i, stop));
      i = stop;
      continue;
    }

    /* Text runs to the next `<`; a lone one in prose is text like any other. */
    const next = code.indexOf('<', i + 1);
    const stop = next === -1 ? code.length : next;
    push('plain', code.slice(i, stop));
    i = stop;
  }

  return tokens;
};

/** Either a list of declarations, or the selectors in front of one. */
type CssContext = 'selector' | 'declarations';

/** The at-rules whose block holds declarations rather than more rules. */
const AT_RULE_OF_DECLARATIONS =
  /^@(font-face|page|property|counter-style|viewport)\b/;

const contextInside = (prelude: string): CssContext => {
  const at = prelude.trimStart();
  if (!at.startsWith('@')) return 'declarations';
  return AT_RULE_OF_DECLARATIONS.test(at) ? 'declarations' : 'selector';
};

/**
 * Where the current run of text ends. The search starts one past `from` because
 * the caller has already dealt with a boundary sitting there, and starting late
 * is what guarantees the scanner moves forward.
 */
const nextBoundary = (
  code: string,
  from: number,
  context: CssContext,
  inValue: boolean,
) => {
  for (let i = from + 1; i < code.length; i += 1) {
    const char = code[i];

    if (char === '{' || char === '}' || char === ';') return i;
    if (char === '/' && code[i + 1] === '*') return i;
    /* A `:` opens a value in a declaration, but joins `a:hover` in a selector. */
    if (char === ':' && context === 'declarations' && !inValue) return i;
  }

  return code.length;
};

const cssTokens = (code: string): Token[] => {
  const { tokens, push, pushTrimmed } = collector();
  const enclosing: CssContext[] = [];
  let context: CssContext = 'selector';
  /* The selector or at-rule the next `{` belongs to, built up as it is read. */
  let prelude = '';
  let inValue = false;
  let i = 0;

  while (i < code.length) {
    if (code.startsWith('/*', i)) {
      const end = code.indexOf('*/', i + 2);
      const stop = end === -1 ? code.length : end + 2;
      push('comment', code.slice(i, stop));
      i = stop;
      continue;
    }

    const char = code[i];

    if (char === '{') {
      push('punctuation', char);
      enclosing.push(context);
      context = contextInside(prelude);
      prelude = '';
      inValue = false;
      i += 1;
      continue;
    }

    if (char === '}') {
      push('punctuation', char);
      context = enclosing.pop() ?? 'selector';
      prelude = '';
      inValue = false;
      i += 1;
      continue;
    }

    if (char === ';') {
      push('punctuation', char);
      prelude = '';
      inValue = false;
      i += 1;
      continue;
    }

    if (char === ':' && context === 'declarations' && !inValue) {
      push('punctuation', char);
      inValue = true;
      i += 1;
      continue;
    }

    const stop = nextBoundary(code, i, context, inValue);
    const text = code.slice(i, stop);

    if (context === 'declarations') {
      pushTrimmed(inValue ? 'value' : 'property', text);
    } else {
      prelude += text;
      pushTrimmed(
        prelude.trimStart().startsWith('@') ? 'at-rule' : 'selector',
        text,
      );
    }

    i = stop;
  }

  return tokens;
};

/** The source split into the runs a code block gives a colour to. */
export const highlight = (code: string, language: CodeLanguage): Token[] =>
  language === 'html' ? htmlTokens(code) : cssTokens(code);
