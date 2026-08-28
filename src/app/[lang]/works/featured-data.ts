export type Project = {
  id: string;
  name: string;
  description: string;
  tech: string[];
  date: string;
  images: string[];
  url?: string;
  github?: string;
};

const suumiee: Project = {
  id: 'suumiee',
  name: 'suumiee',
  url: 'https://suumiee.com/',
  description:
    'The suumiee is a product sharing knowledge with team members and sharing the Project progress with a customer. I am working on it with some members.',
  tech: [
    'TypeScript',
    'React',
    'Next.js',
    'Jest',
    'Storybook',
    'Playwright',
    'UI/UX Design',
    'Direction',
  ],
  date: '2023.02 - current',
  images: ['suumiee1.jpg', 'suumiee2.jpg', 'suumiee3.jpg'],
};

const portfolio: Project = {
  id: 'portfolio-v2',
  name: 'My Portfolio (This is.)',
  url: 'https://kaorios.com/',
  github: 'https://github.com/suige/portfolio-fe',
  description:
    'This is my portfolio version 2. I migrated it from Vue.js (version 1) to Next.js because I mainly use React instead of Vue.js these days. The portfolio includes my favorites and my challenges. One of my challenges is a chatbot that I am creating from scratch. Try it if you want :)',
  tech: ['TypeScript', 'React', 'Next.js', 'CSS', 'UI/UX Design'],
  date: '2023.08 - current',
  images: ['portfolio-v2-1.jpg', 'portfolio-v2-2.jpg'],
};

export const featuredProjects: Project[] = [suumiee, portfolio];
