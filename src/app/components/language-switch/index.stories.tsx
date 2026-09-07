import type { Meta, StoryObj } from '@storybook/nextjs';

import { LanguageSwitch } from './index';

const meta = {
  title: 'Components/LanguageSwitch',
  component: LanguageSwitch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof LanguageSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  args: {
    locale: 'en',
  },
};

export const Japanese: Story = {
  args: {
    locale: 'ja',
  },
};
