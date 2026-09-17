'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '@/app/[lang]/dictionaries';
import type { CssPattern } from '@/content/css-showcase/pattern';
import styles from './preview.module.css';
import {
  DEFAULT_PREVIEW_HEIGHT,
  PREVIEW_HEIGHT_MESSAGE,
  PREVIEW_MEASURE_MESSAGE,
  previewDocument,
} from './preview-document';

type ShowcasePreviewProps = {
  pattern: CssPattern;
  locale: Locale;
  /** Names the frame for anyone reading the page with a screen reader. */
  title: string;
};

/**
 * Renders a pattern in a frame of its own. `sandbox` without
 * `allow-same-origin` puts the document on an opaque origin, so a pattern's
 * CSS cannot reach the page around it and its scripts cannot reach anything at
 * all. `allow-scripts` is there for the height measurement alone.
 *
 * The frame fills the width it is given, and a frame is its own viewport, so a
 * pattern's own media and container queries answer to the space the preview has
 * rather than to the size of the window around it.
 */
export const ShowcasePreview = ({
  pattern,
  locale,
  title,
}: ShowcasePreviewProps) => {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(
    pattern.preview?.height ?? DEFAULT_PREVIEW_HEIGHT,
  );
  const source = useMemo(
    () => previewDocument(pattern, locale),
    [pattern, locale],
  );

  const askForHeight = useCallback(
    () =>
      frame.current?.contentWindow?.postMessage(PREVIEW_MEASURE_MESSAGE, '*'),
    [],
  );

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      /*
       * The frame has an opaque origin, so `event.origin` is "null" for it and
       * for every other sandboxed frame on the page. Identity has to come from
       * the window the message was sent from.
       */
      if (event.source !== frame.current?.contentWindow) return;

      const { type, height } = event.data ?? {};
      if (type !== PREVIEW_HEIGHT_MESSAGE || typeof height !== 'number') return;

      setHeight(Math.ceil(height));
    };

    window.addEventListener('message', onMessage);
    /*
     * The frame is usually loaded by the time this runs, and the height it
     * announced on load went nowhere. Asking now is what makes the measurement
     * independent of which of the two finished first.
     */
    askForHeight();

    return () => window.removeEventListener('message', onMessage);
  }, [askForHeight]);

  return (
    <iframe
      ref={frame}
      className={styles.preview}
      title={title}
      sandbox="allow-scripts"
      srcDoc={source}
      style={{ height }}
      onLoad={askForHeight}
    />
  );
};
