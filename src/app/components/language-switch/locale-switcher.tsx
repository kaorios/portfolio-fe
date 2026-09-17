'use client';

import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { Locale } from '@/app/[lang]/dictionaries';
import { LOCALE_COOKIE_NAME } from './const';
import { LanguageSwitch } from './index';

/** A year: long enough that the choice outlives a browser restart. */
const COOKIE_EXPIRY_DAYS = 365;

/**
 * The same page under another locale. Every route lives below `/[lang]`, so the
 * first segment is the one to swap and the rest is carried over untouched.
 */
const swapLocale = (pathname: string, locale: Locale) => {
  const rest = pathname.split('/').slice(2).join('/');
  return rest ? `/${locale}/${rest}` : `/${locale}`;
};

interface Props {
  /** The locale currently being displayed, from the URL segment. */
  locale: Locale;
}

/**
 * Wires the switch to the router. Picking a language is an explicit choice, so
 * it is also written to a cookie that `src/proxy.ts` prefers over the
 * `Accept-Language` negotiation on later visits to an unprefixed URL.
 */
const LocaleSwitcher = ({ locale }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSelect = useCallback(
    (selected: Locale) => {
      if (selected === locale) return;

      Cookies.set(LOCALE_COOKIE_NAME, selected, {
        expires: COOKIE_EXPIRY_DAYS,
        path: '/',
        sameSite: 'lax',
      });

      router.push(swapLocale(pathname, selected));
    },
    [locale, pathname, router],
  );

  return <LanguageSwitch locale={locale} onSelect={handleSelect} />;
};

export { LocaleSwitcher };
