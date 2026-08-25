import type { Steps } from '@/app/components/chatbot/type';

export const steps: Steps = {
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
    ],
  },
  '4': {
    type: 'text',
    id: '4',
    message: 'Hello! Thanks for coming my portfolio :)',
    trigger: '5',
  },
  '5': {
    type: 'text',
    id: '5',
    message:
      'I am building Kaori Bot. You can follow my GitHub account if you want :)',
    trigger: '6',
  },
  '6': {
    type: 'text',
    id: '6',
    message: 'https://github.com/kaorios',
    trigger: 'end',
  },
};
