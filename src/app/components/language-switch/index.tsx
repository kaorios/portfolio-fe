'use client';

import classNames from 'classnames';
import { useCallback } from 'react';
import type { Locale } from '@/app/[lang]/dictionaries';
import styles from './index.module.css';

/**
 * The label is the language's own short name, not the locale code: Japanese is
 * `ja` in the URL but reads as "JP" to a visitor.
 */
const LABELS: Record<Locale, string> = { en: 'EN', ja: 'JP' };

/** Fixed display order, so the switch never reshuffles between renders. */
const ORDER: Locale[] = ['en', 'ja'];

interface OptionProps {
  locale: Locale;
  isCurrent: boolean;
  onSelect?: (locale: Locale) => void;
}

const Option = ({ locale, isCurrent, onSelect }: OptionProps) => {
  const handleClick = useCallback(() => {
    onSelect?.(locale);
  }, [locale, onSelect]);

  return (
    <button
      type="button"
      lang={locale}
      aria-pressed={isCurrent}
      className={classNames(styles.option, { [styles.current]: isCurrent })}
      onClick={handleClick}
    >
      {LABELS[locale]}
    </button>
  );
};

interface Props {
  /** The locale currently being displayed. */
  locale: Locale;
  onSelect?: (locale: Locale) => void;
}

const LanguageSwitch = ({ locale, onSelect }: Props) => {
  return (
    <fieldset className={styles.switch} aria-label="Language">
      {ORDER.map((it) => (
        <Option
          key={it}
          locale={it}
          isCurrent={it === locale}
          onSelect={onSelect}
        />
      ))}
    </fieldset>
  );
};

export { LanguageSwitch };
