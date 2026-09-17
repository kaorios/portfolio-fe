import { describe, expect, it } from 'vitest';
import type { CssPattern } from '@/content/css-showcase/pattern';
import {
  PREVIEW_HEIGHT_MESSAGE,
  PREVIEW_MEASURE_REQUEST,
  previewDocument,
} from './preview-document';

const pattern: CssPattern = {
  slug: 'sample-pattern',
  title: { ja: 'サンプル' },
  description: { ja: 'サンプルの説明' },
  tags: [],
  learningPoints: [{ ja: 'flex での中央揃え' }],
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

  it('declares the document in the locale it is being read in', () => {
    expect(previewDocument(pattern, 'en')).toContain('<html lang="en">');
    expect(previewDocument(pattern, 'ja')).toContain('<html lang="ja">');
  });
});

describe('the measurement it carries', () => {
  /*
   * The document can finish loading before the parent has its listener on, so
   * the frame has to answer a request for a measurement as well as volunteer
   * one.
   */
  it('answers a measurement requested by the parent', () => {
    expect(previewDocument(pattern, 'ja')).toContain(PREVIEW_MEASURE_REQUEST);
  });
});
