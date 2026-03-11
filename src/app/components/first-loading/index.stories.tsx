import type { Meta, StoryObj } from '@storybook/nextjs';

import { FirstLoading } from './index';

const meta = {
  title: 'Components/FirstLoading',
  component: FirstLoading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof FirstLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
