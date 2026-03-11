import type { Meta, StoryObj } from '@storybook/nextjs';

import { GlobalNavLink } from './index';

const meta = {
  title: 'Components/GlobalNavLink',
  component: GlobalNavLink,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof GlobalNavLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: '#',
    children: 'link',
  },
};
