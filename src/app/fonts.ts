import { Rubik, Wendy_One } from 'next/font/google';

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
  display: 'swap',
});

const wendy_one = Wendy_One({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-wendy-one',
  display: 'swap',
});

/**
 * The classes that define `--font-rubik` and `--font-wendy-one`, which
 * `globals.css` reads through `--font-family` and `--font-family-h`. The app
 * puts them on `<html>`; Storybook mounts the same classes so stories render
 * in the fonts the site actually uses.
 */
export const fontVariables = `${rubik.variable} ${wendy_one.variable}`;
