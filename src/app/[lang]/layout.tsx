import { FirstLoading } from '@/app/components/first-loading';
import { DISABLED_ANIMATION_COOKIE_NAME } from '@/app/components/first-loading/const';
import '../globals.css';
import type { Metadata } from 'next';
import { Rubik, Wendy_One } from 'next/font/google';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { BackgroundStars } from '@/app/components/background-stars';
import { GlobalNavLink } from '@/app/components/global-nav-link';
import { Logo } from '@/app/components/logo';
import { SocialLinks } from '@/app/components/social-links';
import { getDictionary, getLocale, locales } from './dictionaries';
import styles from './layout.module.css';

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
  display: 'swap',
});

const wendy_one = Wendy_One({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-wendy-one',
  display: 'swap',
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** Resolves the relative URLs in `alternates` and `openGraph` to absolute ones. */
const SITE_URL = 'https://kaorios.com';

/** Open Graph wants the underscored form, not the URL segment. */
const OG_LOCALES = { en: 'en_US', ja: 'ja_JP' } as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Kaori's Portfolio",
      template: "%s | Kaori's Portfolio",
    },
    description: dict.meta.description,
    openGraph: {
      images: '/img/ogp.png',
      locale: OG_LOCALES[locale],
      alternateLocale: locales
        .filter((it) => it !== locale)
        .map((it) => OG_LOCALES[it]),
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<'/[lang]'>) {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const disabledLoadingAnimation = cookieStore.get(
    DISABLED_ANIMATION_COOKIE_NAME,
  )?.value;

  return (
    <html lang={locale} className={`${rubik.variable} ${wendy_one.variable}`}>
      <body className={styles.body}>
        {disabledLoadingAnimation === 'true' ? null : <FirstLoading />}
        <header className={styles.header}>
          <Link href={`/${locale}`}>
            <Logo />
          </Link>
          <nav className={styles.globalNav}>
            <ul>
              <li>
                <GlobalNavLink href={`/${locale}/works`} title="works">
                  works
                </GlobalNavLink>
              </li>
            </ul>
            <SocialLinks />
          </nav>
        </header>
        <div className={styles.container}>{children}</div>
        <footer className={styles.footer}>
          <nav className={styles.footerNav}>
            <ul>
              <li>
                <Link
                  href="https://www.linkedin.com/in/kaorios/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  href="https://koroporch.com/blog/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Blog (Japanese Only)
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/kaorios/portfolio-fe/issues/44"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Roadmap
                </Link>
              </li>
            </ul>
          </nav>
          <div className={styles.copyright}>&copy; Kaori</div>
        </footer>
        <BackgroundStars />
      </body>
    </html>
  );
}
