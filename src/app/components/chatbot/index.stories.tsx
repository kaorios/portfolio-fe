import type { Meta, StoryObj } from '@storybook/nextjs';

import { Chatbot } from './index';

const meta = {
  title: 'Components/Chatbot',
  component: Chatbot,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Chatbot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isActive: true,
    initMessages: [
      {
        type: 'text',
        id: '1',
        message: 'Hello! This is Kaori :)',
        trigger: '2',
      },
    ],
    steps: {
      '1': {
        type: 'text',
        id: '1',
        message: 'Hello! This is Kaori :)',
        trigger: '2',
      },
      '2': {
        type: 'text',
        id: '2',
        message: 'What can I help you?',
        trigger: '3',
      },

      '3': {
        type: 'options',
        id: '3',
        options: [
          {
            id: 'o-1',
            value: 1,
            label: 'Just Saying Hello!',
            trigger: '4',
          },
          {
            id: 'o-2',
            value: 2,
            label: 'We would like to hire you!',
            trigger: '5',
          },
          {
            id: 'o-3',
            value: 3,
            label: 'Who are you...?',
            trigger: '6',
          },
        ],
      },

      '4': {
        type: 'text',
        id: '4',
        message: 'Hello! Thanks for coming my portfolio :)',
        trigger: '3',
      },

      '5': {
        type: 'text',
        id: '5',
        message:
          'I am glad to hear that! I would like to contact you. Can I have your e-mail?',
        trigger: 'xxx',
      },

      '6': {
        type: 'text',
        id: '6',
        message:
          'I am a Software Engineer, mainly Frontend web. What kind of information do you want about me?',
        trigger: 'yyy',
      },
    },
  },
};
