import type { Meta, StoryObj } from '@storybook/nextjs';
import { hoverCard } from '@/content/css-showcase/hover-card';
import { CssTagList } from './css-tag-list';

const meta = {
  title: 'CSS Showcase/CssTagList',
  component: CssTagList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CssTagList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The tags of a published pattern. */
export const Default: Story = {
  args: {
    tags: hoverCard.tags,
  },
};

/**
 * More tags than fit on one line, including a function long enough to test what
 * happens to a label that cannot be broken between words.
 */
export const Wrapping: Story = {
  args: {
    tags: [
      'display: grid',
      'grid-template-columns',
      'minmax()',
      'clamp()',
      'container-type',
      '@container',
      ':focus-visible',
      ':has()',
      'scroll-snap-type',
      'prefers-reduced-motion',
      'color-mix(in oklch, currentColor 20%, transparent)',
      'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
    ],
  },
};

/** A pattern that lists none. The section around it renders nothing at all. */
export const NoTags: Story = {
  args: {
    tags: [],
  },
};
