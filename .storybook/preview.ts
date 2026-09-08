import type { Preview } from '@storybook/nextjs';
import { fontVariables } from '../src/app/fonts';
import '../src/app/globals.css';

/*
 * The app defines the font custom properties on `<html>` in its root layout,
 * which Storybook never renders. Put them on the preview's own root so that
 * `globals.css` — which styles `body` and is read by every component — resolves
 * `--font-family` and `--font-family-h` the same way the site does. Without
 * this the whole stack is invalid and stories fall back to the browser default.
 */
if (typeof document !== 'undefined') {
  document.documentElement.classList.add(...fontVariables.split(' '));
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
