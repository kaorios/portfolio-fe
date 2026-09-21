import type { Meta, StoryObj } from '@storybook/nextjs';
import { hoverCard } from '@/content/css-showcase/hover-card';
import { CodeBlock } from './code-block';

const meta = {
  title: 'CSS Showcase/CodeBlock',
  component: CodeBlock,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    labels: { copy: 'Copy', copied: 'Copied', failed: 'Could not copy' },
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The markup of a published pattern, the length the page usually shows. */
export const Html: Story = {
  args: {
    code: hoverCard.html,
    language: 'html',
  },
};

/** The stylesheet of the same pattern: selectors, an at-rule and a comment. */
export const Css: Story = {
  args: {
    code: hoverCard.css,
    language: 'css',
  },
};

/*
 * Everything below is here to be looked at rather than to be published: source
 * long enough, wide enough or odd enough to show how the block holds up.
 */

/**
 * A single declaration far wider than the page. The block should scroll
 * sideways on its own — the page must not, and the copy control must stay put.
 */
export const OneVeryLongLine: Story = {
  args: {
    language: 'css',
    code: `.banner { background-image: linear-gradient(115deg, #f8366e 0%, #f85f8a 8%, #f2739b 16%, #e589ab 24%, #d69ebb 32%, #c4b2cb 40%, #afc6db 48%, #97d9ea 56%, #7cebf8 64%, #5df7ff 72%, #3bfdfb 80%, #14fff0 88%, #00ffe0 96%, #00f5cc 100%), radial-gradient(circle at 20% 20%, rgb(255 255 255 / 60%) 0%, rgb(255 255 255 / 0%) 60%); }`,
  },
};

/**
 * A word with nowhere to break in it, next to an ordinary one. Nothing here
 * should push the block wider than its container.
 */
export const UnbreakableToken: Story = {
  args: {
    language: 'html',
    code: `<p class="note" data-analytics-id="showcase-detail-copy-control-primary-action-with-an-unreasonably-long-identifier">
  Supercalifragilisticexpialidocious_and_then_some_more_characters_that_never_break
</p>`,
  },
};

/**
 * Longer than a screenful. The block should stop growing and scroll inside
 * itself, so the explanation underneath stays within reach.
 */
export const ManyLines: Story = {
  args: {
    language: 'css',
    code: [
      '/* A sheet long enough to outgrow the block. */',
      ':root {',
      '  --gap: 8px;',
      '  --radius: 16px;',
      '  --surface: #fffdfa;',
      '  --ink: #221f29;',
      '}',
      '',
      ...Array.from(
        { length: 24 },
        (_, index) =>
          `.stack-${index + 1} {\n  display: grid;\n  gap: calc(var(--gap) * ${index + 1});\n  padding: ${index + 1}px;\n  background: var(--surface);\n  color: var(--ink);\n}\n`,
      ),
      '@media (min-width: 720px) {',
      '  .stack-1 {',
      '    grid-template-columns: repeat(2, minmax(0, 1fr));',
      '  }',
      '}',
    ].join('\n'),
  },
};

/** Source the highlighter has to take as written rather than as intended. */
export const MalformedSource: Story = {
  args: {
    language: 'html',
    code: `<!-- a comment nobody closed
<div class="card" data-arrow="a > b" hidden
  <span class=unquoted>5 < 6 &amp; 7 > 6</span>
</div>`,
  },
};

/** Nothing to show. The bar and its control still have to make sense. */
export const Empty: Story = {
  args: {
    language: 'css',
    code: '',
  },
};
