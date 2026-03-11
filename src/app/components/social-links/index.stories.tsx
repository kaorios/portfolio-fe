import type { Meta, StoryObj } from '@storybook/nextjs';

import { SocialLinks } from './index';

const meta = {
  title: 'Components/SocialLinks',
  component: SocialLinks,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof SocialLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
