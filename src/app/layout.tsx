import { FirstLoading } from '@/app/components/first-loading';
import { DISABLED_ANIMATION_COOKIE_NAME } from '@/app/components/first-loading/const';
import './globals.css';
import styles from './layout.module.css';
import type { Metadata } from 'next';
import { Rubik, Wendy_One } from 'next/font/google';
import { BackgroundStars } from '@/app/components/background-stars';
import Link from 'next/link';
import { Logo } from '@/app/components/logo';
import { GlobalNavLink } from '@/app/components/global-nav-link';
import { cookies } from 'next/headers';
import { SocialLinks } from './components/social-links';
import { Chat } from './layout/chat';

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

export const metadata: Metadata = {
  title: {
    default: "Kaori's Portfolio",
    template: "%s | Kaori's Portfolio",
  },
  description: 'I am Kaori, Software engineer.',
  openGraph: {
    images: '/img/ogp.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const disabledLoadingAnimation = cookieStore.get(
    DISABLED_ANIMATION_COOKIE_NAME
  )?.value;

  return (
    <html lang="en" className={`${rubik.variable} ${wendy_one.variable}`}>
      <body className={styles.body}>
        {disabledLoadingAnimation === 'true' ? <></> : <FirstLoading />}
        <header className={styles.header}>
          <Link href="/">
            <Logo />
          </Link>
          <nav className={styles.globalNav}>
            <ul>
              <li>
                <GlobalNavLink href="/works" title="works">
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
        <Chat />
        <BackgroundStars />
      </body>
    </html>
  );
}
