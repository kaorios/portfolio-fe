'use client';

import Cookies from 'js-cookie';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import type { Locale } from '@/app/[lang]/dictionaries';
import { LOCALE_COOKIE } from '@/cookies';
import { LanguageSwitch } from './index';
import { localeHref } from './path';

interface Props {
  /** The locale the page was rendered in, from the `[lang]` segment. */
  locale: Locale;
}

/**
 * `LanguageSwitch` wired to the router: the control itself stays presentational
 * so it can be exercised in isolation, and this is the one that navigates.
 * Selecting a language re-opens the page already on screen under the other
 * locale segment, rather than sending the visitor back to the home page, and
 * records the choice so it survives the visit: `src/proxy.ts` prefers the
 * cookie over the `Accept-Language` negotiation on later unprefixed URLs.
 */
const LocaleSwitcher = ({ locale }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelect = useCallback(
    (next: Locale) => {
      /*
       * Written before the navigation is considered, because picking the
       * locale already on screen is still a pick: a visitor who chose Japanese
       * once and later follows an explicit `/en` link clicks EN to say they
       * want English now, and skipping the write would leave the stale `ja`
       * to pull them back on their next unprefixed visit.
       *
       * Only a click gets here. Arriving at `/ja` because the browser asked
       * for it is not a choice, so it still cannot overwrite one.
       */
      Cookies.set(LOCALE_COOKIE.name, next, LOCALE_COOKIE.options);

      if (next === locale) return;

      /*
       * `scroll: false`: it is the same page in another language, so the
       * position the visitor was reading at is still the one they want.
       */
      router.push(localeHref(pathname, searchParams.toString(), locale, next), {
        scroll: false,
      });
    },
    [locale, pathname, router, searchParams],
  );

  return <LanguageSwitch locale={locale} onSelect={handleSelect} />;
};

export { LocaleSwitcher };
