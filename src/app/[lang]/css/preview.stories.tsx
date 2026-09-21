import type { Meta, StoryObj } from '@storybook/nextjs';
import { hoverCard } from '@/content/css-showcase/hover-card';
import type { CssPattern } from '@/content/css-showcase/pattern';
import { ShowcasePreview } from './preview';

const meta = {
  title: 'CSS Showcase/ShowcasePreview',
  component: ShowcasePreview,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    locale: 'ja',
  },
} satisfies Meta<typeof ShowcasePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Only the fields a preview reads, so a story can stay to the point. */
const pattern = (fields: Partial<CssPattern>): CssPattern => ({
  slug: 'story',
  title: { ja: 'ストーリー' },
  description: { ja: '' },
  tags: [],
  html: '',
  css: '',
  explanations: [],
  ...fields,
});

/** A published pattern, at the height it declares. */
export const Default: Story = {
  args: {
    pattern: hoverCard,
    title: 'ホバーカード',
  },
};

/**
 * A pattern that answers to the width it is given. The frame is its own
 * viewport, so the columns below change with the size of the preview rather
 * than the size of the window — drag the Storybook panel to watch it.
 */
export const RespondsToWidth: Story = {
  args: {
    title: 'Responds to width',
    pattern: pattern({
      preview: { height: 260 },
      html: `<ul class="tiles">
  <li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li>
</ul>
<p class="width-note">1 column under 480px, 2 under 720px, 3 above.</p>`,
      css: `.tiles {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
  list-style: none;
  margin: 0;
  padding: 0;
}

.tiles li {
  display: grid;
  place-items: center;
  padding: 24px;
  border-radius: 12px;
  background: #ffe3ec;
  color: #7a1136;
  font-weight: 700;
}

.width-note {
  margin-top: 12px;
  font-size: 13px;
}

@media (min-width: 480px) {
  .tiles { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 720px) {
  .tiles { grid-template-columns: repeat(3, 1fr); }
}`,
    }),
  },
};

/**
 * A pattern with no declared height, taller than the 240px a preview starts at.
 * It should settle on its own height as soon as the frame measures itself.
 */
export const GrowsToFit: Story = {
  args: {
    title: 'Grows to fit',
    pattern: pattern({
      html: `<div class="long">
  ${Array.from({ length: 14 }, (_, index) => `<p>段落 ${index + 1}：プレビューの高さは、中身を測ってから決まります。</p>`).join('\n  ')}
</div>`,
      css: `.long p {
  margin: 0 0 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: #f1efec;
  font-size: 14px;
}`,
    }),
  },
};

/**
 * A pattern that would repaint the whole portfolio if anything leaked: it
 * claims `body`, every element, and the heading font. Inside the frame it wins;
 * outside it, this page should look exactly as it did.
 */
export const StylesStayInside: Story = {
  args: {
    title: 'Styles stay inside',
    pattern: pattern({
      preview: { height: 200 },
      html: `<h1>Inside the frame</h1>
<p>The page around this preview should be untouched.</p>`,
      css: `body {
  background: repeating-linear-gradient(45deg, #ffd9e4 0 12px, #ffe9f0 12px 24px);
}

* {
  color: #a3123f !important;
  font-family: "Comic Sans MS", cursive !important;
}

h1 {
  font-size: 28px;
  text-transform: uppercase;
}`,
    }),
  },
};
