import type { Meta, StoryObj } from '@storybook/nextjs';

import { BackgroundStars } from './index';

const meta = {
  title: 'Components/BackgroundStars',
  component: BackgroundStars,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof BackgroundStars>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
