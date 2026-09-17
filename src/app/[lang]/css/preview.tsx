'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '@/app/[lang]/dictionaries';
import type { CssPattern } from '@/content/css-showcase/pattern';
import styles from './preview.module.css';
import {
  DEFAULT_PREVIEW_HEIGHT,
  PREVIEW_HEIGHT_MESSAGE,
  previewDocument,
} from './preview-document';

type PatternPreviewProps = {
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
 */
export const PatternPreview = ({
  pattern,
  locale,
  title,
}: PatternPreviewProps) => {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(
    pattern.preview?.height ?? DEFAULT_PREVIEW_HEIGHT,
  );
  const source = useMemo(
    () => previewDocument(pattern, locale),
    [pattern, locale],
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
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <iframe
      ref={frame}
      className={styles.preview}
      title={title}
      sandbox="allow-scripts"
      srcDoc={source}
      style={{ height }}
    />
  );
};
