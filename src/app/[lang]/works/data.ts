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

const vanquestion: Project = {
  id: 'vanquestion',
  name: 'vanQuestion',
  github: 'https://github.com/suige/React-vanQuestion',
  description:
    "Since I came to Vancouver, there are a lot of things I don't know about life for example where to buy food, how to get a bus and more. Every time there was a problem, people helped me. This is a communication website dedicated  to people living in Vancouver. Users can post questions and answers easily. This is my first React project.",
  tech: ['React', 'JavaScrip', 'styled-components'],
  date: '2019.05 - suspend (for now)',
  images: [
    'vanquestion1.jpg',
    'vanquestion2.jpg',
    'vanquestion3.jpg',
    'vanquestion4.jpg',
  ],
};

const portfolio: Project = {
  id: 'portfolio',
  name: 'My Portfolio Version 1',
  github: 'https://github.com/kaorios/portfolio-fe/releases/tag/v1.0.0',
  description:
    'This is one of my portfolios that focus on CSS animation. Especially, loading animation is implemented by the only CSS. The website is inspired by a black and white animation of the 1920s. Now it is closed and replaced by Version 2.',
  tech: ['Vue.js', 'JavaScript', 'scss', 'CSS Animation'],
  date: '2019.05',
  images: ['portfolio1.jpg', 'portfolio3.jpg'],
};

const cavancle: Project = {
  id: 'cavancle',
  name: 'CAVANCLE',
  url: '',
  description:
    'This is a cafe searching website for Japanese living in Vancouver. My roll in this project is to implement the website using Vue.js. We discuss the UI design on InVision and adobe XD. I enjoy creating interactive parts such as searching form.',
  tech: ['Vue.js', 'JavaScript'],
  date: '2017.07 - suspend (for now)',
  images: ['cavancle1.jpg'],
};

const friendsBlog: Project = {
  id: 'my-friends-blog',
  name: "My Friend's Blog",
  url: 'https://www.changami.com/',
  description:
    'This is a blog created by WordPress based on Sage. My friend likes old-school TV games, so the theme is used 8 bit font and characters.',
  tech: ['WordPress', 'UI/UX Design'],
  date: '2016.12',
  images: ['blog1.jpg', 'blog2.jpg', 'blog3.jpg'],
};

export const projects: Project[] = [
  vanquestion,
  portfolio,
  cavancle,
  friendsBlog,
];
