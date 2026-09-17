import type { Locale } from '@/app/[lang]/dictionaries';
import type { CssPattern } from '@/content/css-showcase/pattern';

/** The height a preview starts at when its pattern does not declare one. */
export const DEFAULT_PREVIEW_HEIGHT = 240;

/** Names the one message the preview frame is allowed to send its parent. */
export const PREVIEW_HEIGHT_MESSAGE = 'css-showcase:preview-height';

/**
 * The preview runs in its own document, so it inherits nothing from the site.
 * `color-scheme` is all it takes from us: it gives the demo a surface that
 * follows the visitor's light or dark preference, and lets any form control in
 * a pattern render in the matching theme.
 */
const RESET = `
  :root { color-scheme: light dark; }
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 16px;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  }
`;

/*
 * Reports the rendered height so the parent can size the frame around the
 * pattern. `postMessage` goes to `*` because the frame is sandboxed without
 * `allow-same-origin` and so cannot learn the parent's origin; the message
 * carries a number and nothing else. Unchanged heights are dropped, otherwise
 * resizing the frame would feed the observer that asked for the resize.
 */
const MEASURE = `
  let reported = 0;
  const report = () => {
    const height = document.body.scrollHeight;
    if (height === reported) return;
    reported = height;
    parent.postMessage({ type: ${JSON.stringify(PREVIEW_HEIGHT_MESSAGE)}, height }, '*');
  };
  new ResizeObserver(report).observe(document.body);
  addEventListener('load', report);
`;

/**
 * The whole preview as one document. It is built from the very strings the
 * page prints as the source, which is what keeps the two from drifting apart.
 */
export const previewDocument = (pattern: CssPattern, locale: Locale) =>
  [
    '<!doctype html>',
    `<html lang="${locale}">`,
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<style>${RESET}</style>`,
    `<style>${pattern.css}</style>`,
    '</head>',
    '<body>',
    pattern.html,
    `<script>${MEASURE}</script>`,
    '</body>',
    '</html>',
  ].join('\n');
