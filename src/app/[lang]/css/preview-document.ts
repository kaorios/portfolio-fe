import type { Locale } from '@/app/[lang]/dictionaries';
import type { CssPattern } from '@/content/css-showcase/pattern';

/** The height a preview starts at when its pattern does not declare one. */
export const DEFAULT_PREVIEW_HEIGHT = 240;

/**
 * As tall as a preview is ever allowed to grow. A pattern sized against the
 * viewport — `min-height: 100vh` and the like — measures taller than the frame
 * it is in, so every height we apply produces a taller measurement and the
 * frame would climb the page forever. The ceiling ends that, and the limit on
 * how many times the parent resizes ends it quickly.
 */
export const MAX_PREVIEW_HEIGHT = 1200;

/** Names the one message the preview frame is allowed to send its parent. */
export const PREVIEW_HEIGHT_MESSAGE = 'css-showcase:preview-height';

/** Asks the frame to measure itself again, and to report even an unchanged height. */
export const PREVIEW_MEASURE_REQUEST = 'css-showcase:measure';

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
 *
 * The parent can also ask for a measurement. This document can finish loading
 * before the parent has its listener attached, and a pattern that never moves
 * again produces no second observation, so without that request the one report
 * would be lost and the frame would stay at its starting height.
 */
const MEASURE = `
  let reported = 0;
  const report = () => {
    const height = document.body.scrollHeight;
    if (height === reported) return;
    reported = height;
    parent.postMessage({ type: ${JSON.stringify(PREVIEW_HEIGHT_MESSAGE)}, height }, '*');
  };
  addEventListener('message', (event) => {
    if (event.data !== ${JSON.stringify(PREVIEW_MEASURE_REQUEST)}) return;
    reported = 0;
    report();
  });
  new ResizeObserver(report).observe(document.body);
  addEventListener('load', report);
`;

/**
 * The whole preview as one document. It is built from the very strings the
 * page prints as the source, which is what keeps the two from drifting apart.
 *
 * The frame is allowed to run scripts, so the only reason nothing but the
 * measurement runs in it is that registration rejects a pattern carrying a
 * script or an inline handler.
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
