import { describe, expect, it } from 'vitest';
import type { CssPattern } from '@/content/css-showcase/pattern';
import {
  DEFAULT_PREVIEW_HEIGHT,
  MAX_MEASURED_PREVIEW_HEIGHT,
  PREVIEW_HEIGHT_MESSAGE,
  PREVIEW_MEASURE_MESSAGE,
  previewDocument,
  previewHeightFor,
} from './preview-document';

const pattern: CssPattern = {
  slug: 'sample-pattern',
  title: { ja: 'サンプル' },
  description: { ja: 'サンプルの説明' },
  tags: [],
  html: '<div class="sample">sample</div>',
  css: '.sample { display: flex; }',
  explanations: [{ heading: { ja: '仕組み' }, body: { ja: '本文' } }],
};

describe('previewDocument', () => {
  /*
   * The point of building the preview out of the pattern's own strings is that
   * the source on the page and the thing being rendered cannot disagree.
   */
  it('renders the very HTML and CSS the page shows as the source', () => {
    const document = previewDocument(pattern, 'ja');

    expect(document).toContain(pattern.html);
    expect(document).toContain(pattern.css);
  });

  it('carries the height measurement the frame reports back', () => {
    expect(previewDocument(pattern, 'ja')).toContain(PREVIEW_HEIGHT_MESSAGE);
  });

  /*
   * The frame can finish loading before the page hydrates, and the height it
   * announced then reached nobody. Answering a request is what lets the parent
   * pick the measurement up whenever it starts listening.
   */
  it('answers a request for the height', () => {
    expect(previewDocument(pattern, 'ja')).toContain(PREVIEW_MEASURE_MESSAGE);
  });

  it('declares the document in the locale it is being read in', () => {
    expect(previewDocument(pattern, 'en')).toContain('<html lang="en">');
    expect(previewDocument(pattern, 'ja')).toContain('<html lang="ja">');
  });
});

describe('previewHeightFor', () => {
  it('takes the measured height, rounded up to a whole pixel', () => {
    expect(previewHeightFor(210.2, DEFAULT_PREVIEW_HEIGHT)).toBe(211);
  });

  /*
   * A pattern sized to the frame's own viewport grows every time the frame
   * grows to fit it. The ceiling is what settles that: the next report clamps
   * to the same height, and nothing changes after it.
   */
  it('stops a measurement that feeds itself at the ceiling', () => {
    const first = previewHeightFor(4000, DEFAULT_PREVIEW_HEIGHT);
    const next = previewHeightFor(first + 32, DEFAULT_PREVIEW_HEIGHT);

    expect(first).toBe(MAX_MEASURED_PREVIEW_HEIGHT);
    expect(next).toBe(first);
  });

  it('never pulls a preview below the height its pattern declared', () => {
    const declared = MAX_MEASURED_PREVIEW_HEIGHT + 400;

    expect(previewHeightFor(declared, declared)).toBe(declared);
  });

  it('still shrinks to fit a pattern smaller than it started', () => {
    expect(previewHeightFor(120, DEFAULT_PREVIEW_HEIGHT)).toBe(120);
  });
});
