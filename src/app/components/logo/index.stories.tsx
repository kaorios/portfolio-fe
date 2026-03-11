import type { Meta, StoryObj } from '@storybook/nextjs';

import { Logo } from './index';

const meta = {
  title: 'Components/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
