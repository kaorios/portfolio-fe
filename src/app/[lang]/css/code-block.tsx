import styles from './code-block.module.css';
import { CopyButton, type CopyLabels } from './copy-button';
import { type CodeLanguage, highlight, type TokenType } from './highlight';

/** What the bar over the code calls the language it is showing. */
const LANGUAGE_LABEL: Record<CodeLanguage, string> = {
  html: 'HTML',
  css: 'CSS',
};

/** The palette lives in the stylesheet; this is only the way in to it. */
const TOKEN_CLASS: Record<TokenType, string | undefined> = {
  plain: undefined,
  comment: styles.comment,
  punctuation: styles.punctuation,
  tag: styles.tag,
  attribute: styles.attribute,
  string: styles.string,
  selector: styles.selector,
  'at-rule': styles.atRule,
  property: styles.property,
  value: styles.value,
};

type CodeBlockProps = {
  code: string;
  language: CodeLanguage;
  labels: CopyLabels;
};

/**
 * A piece of source, highlighted, labelled with its language, and copyable on
 * its own. The highlighting is done here on the server, so the code is coloured
 * even where the page's JavaScript never runs; only the copy control is client
 * side.
 *
 * Long code scrolls inside the block rather than pushing the page sideways, and
 * the scrolling region takes focus so it can be read with a keyboard alone.
 */
export const CodeBlock = ({ code, language, labels }: CodeBlockProps) => {
  const label = LANGUAGE_LABEL[language];

  /* The offset is what makes a key: tokens are a flat run of text, and two of
   * them can hold the very same string. */
  let offset = 0;
  const tokens = highlight(code, language).map((token) => {
    const at = offset;
    offset += token.text.length;
    return { ...token, at };
  });

  return (
    <figure className={styles.block}>
      <figcaption className={styles.bar}>
        <span className={styles.language}>{label}</span>
        <CopyButton text={code} labels={labels} />
      </figcaption>
      {/*
       * A region that scrolls has to be reachable by keyboard, and the tab stop
       * belongs on the element that does the scrolling. The rule below reads
       * that tab stop as a control that does nothing; what it is, is the only
       * way to read a long pattern without a pointer.
       */}
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: the scrolling region needs a tab stop to be readable by keyboard. */}
      <section className={styles.code} tabIndex={0} aria-label={label}>
        <pre>
          <code>
            {tokens.map(({ type, text, at }) => {
              const className = TOKEN_CLASS[type];
              return className ? (
                <span key={at} className={className}>
                  {text}
                </span>
              ) : (
                text
              );
            })}
          </code>
        </pre>
      </section>
    </figure>
  );
};
