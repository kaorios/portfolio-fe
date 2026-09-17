'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { Locale } from '@/app/[lang]/dictionaries';
import { LanguageSwitch } from './index';
import { localePath } from './path';

interface Props {
  /** The locale the page was rendered in, from the `[lang]` segment. */
  locale: Locale;
}

/**
 * `LanguageSwitch` wired to the router: the control itself stays presentational
 * so it can be exercised in isolation, and this is the one that navigates.
 * Selecting a language re-opens the page already on screen under the other
 * locale segment, rather than sending the visitor back to the home page.
 */
const LocaleSwitcher = ({ locale }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = useCallback(
    (next: Locale) => {
      if (next === locale) return;

      /*
       * `scroll: false`: it is the same page in another language, so the
       * position the visitor was reading at is still the one they want.
       */
      router.push(localePath(pathname, locale, next), { scroll: false });
    },
    [locale, pathname, router],
  );

  return <LanguageSwitch locale={locale} onSelect={handleSelect} />;
};

export { LocaleSwitcher };
