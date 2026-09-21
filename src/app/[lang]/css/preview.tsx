'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type CssPattern, languageOf } from '@/content/css-showcase/pattern';
import type { Locale } from '@/locales';
import styles from './preview.module.css';
import {
  DEFAULT_PREVIEW_HEIGHT,
  MAX_PREVIEW_HEIGHT,
  PREVIEW_HEIGHT_MESSAGE,
  PREVIEW_MEASURE_REQUEST,
  previewDocument,
} from './preview-document';

/**
 * How many times a measurement may resize the frame. Fonts and images settle
 * in a couple of rounds; a pattern measured against the viewport never settles
 * at all, and this is what stops it climbing rather than letting it run to the
 * ceiling one reflow at a time.
 */
const MAX_ADJUSTMENTS = 4;

type PatternPreviewProps = {
  pattern: CssPattern;
  locale: Locale;
  /** Names the frame for anyone reading the page with a screen reader. */
  title: string;
};

/**
 * Renders a pattern in a frame of its own. `sandbox` without
 * `allow-same-origin` puts the document on an opaque origin, so a pattern's
 * CSS cannot reach the page around it. `allow-scripts` is what lets the frame
 * measure itself; registration rejects a pattern carrying a script or an
 * inline handler, so the measurement is the only thing that runs in there.
 */
export const PatternPreview = ({
  pattern,
  locale,
  title,
}: PatternPreviewProps) => {
  const frame = useRef<HTMLIFrameElement>(null);
  /*
   * Held to the ceiling a measured height is held to. This is what a visitor
   * is served before anything is measured, and all they ever get where scripts
   * do not run, so an oversized declaration would otherwise stand.
   */
  const declared = Math.min(
    pattern.preview?.height ?? DEFAULT_PREVIEW_HEIGHT,
    MAX_PREVIEW_HEIGHT,
  );
  const [height, setHeight] = useState(declared);
  const applied = useRef(declared);
  const adjustments = useRef(0);
  const source = useMemo(
    () => previewDocument(pattern, locale),
    [pattern, locale],
  );

  /** Covers a frame that finished loading before the listener went on. */
  const requestMeasurement = useCallback(() => {
    frame.current?.contentWindow?.postMessage(PREVIEW_MEASURE_REQUEST, '*');
  }, []);

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

      const next = Math.min(Math.ceil(height), MAX_PREVIEW_HEIGHT);
      if (next === applied.current) return;
      if (adjustments.current >= MAX_ADJUSTMENTS) return;

      applied.current = next;
      adjustments.current += 1;
      setHeight(next);
    };

    window.addEventListener('message', onMessage);
    requestMeasurement();

    return () => window.removeEventListener('message', onMessage);
  }, [requestMeasurement]);

  return (
    <iframe
      ref={frame}
      className={styles.preview}
      title={title}
      /* The frame's accessible name is its `title`, which falls back to the
         Japanese like any other prose but, being an attribute, cannot be
         wrapped the way `<Localized>` wraps the rest. */
      lang={languageOf(pattern.title, locale)}
      sandbox="allow-scripts"
      srcDoc={source}
      style={{ height }}
      onLoad={requestMeasurement}
    />
  );
};
