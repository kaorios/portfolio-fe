'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './copy-button.module.css';

/** The wording of the control and of what happens when it is pressed. */
export type CopyLabels = {
  copy: string;
  copied: string;
  failed: string;
};

type CopyButtonProps = {
  /** The text the button puts on the clipboard. */
  text: string;
  labels: CopyLabels;
};

type Outcome = 'idle' | 'copied' | 'failed';

/** How long an outcome stays on screen before the control goes quiet again. */
const FEEDBACK_MS = 2400;

/**
 * Copies a block of source, and says whether it worked. It reports a failure as
 * plainly as a success: the clipboard is missing outside a secure context and
 * can be refused by permission, and a control that claims a copy it never made
 * leaves a visitor pasting whatever they had copied before.
 */
export const CopyButton = ({ text, labels }: CopyButtonProps) => {
  const [outcome, setOutcome] = useState<Outcome>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const report = (next: Outcome) => {
    clearTimeout(timer.current);
    setOutcome(next);
    timer.current = setTimeout(() => setOutcome('idle'), FEEDBACK_MS);
  };

  const copy = async () => {
    try {
      /* Reading `clipboard` throws where the API is absent; both are failures. */
      await navigator.clipboard.writeText(text);
      report('copied');
    } catch {
      report('failed');
    }
  };

  const message = { idle: '', copied: labels.copied, failed: labels.failed };

  return (
    <span className={styles.copy}>
      {/*
       * The button keeps its own label so the control a visitor reached by
       * keyboard does not rename itself under them. The outcome is announced
       * from a live region beside it, which is there from the first render so
       * that a screen reader is already watching it when the text arrives.
       */}
      <span className={styles.feedback} data-outcome={outcome} role="status">
        {message[outcome]}
      </span>
      <button type="button" className={styles.button} onClick={copy}>
        {labels.copy}
      </button>
    </span>
  );
};
