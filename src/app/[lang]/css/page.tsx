import type { Metadata } from 'next';
import Link from 'next/link';
import { alternatesFor } from '../alternates';
import { getDictionary, getLocale } from '../dictionaries';
import { Localized } from './localized';
import styles from './page.module.css';
import { registry } from './registry';

export async function generateMetadata(): Promise<Metadata> {
  const { cssShowcase } = await getDictionary();

  return {
    title: cssShowcase.heading,
    description: cssShowcase.lead,
    alternates: await alternatesFor('/css'),
  };
}

/**
 * The listing, kept to links and copy. The cards and the layout belong to the
 * listing issue; what this has to get right today is that an empty registry
 * renders an empty state rather than an empty page.
 */
export default async function CssShowcase() {
  const locale = await getLocale();
  const { cssShowcase } = await getDictionary();
  const patterns = registry.all();

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{cssShowcase.heading}</h1>
      <p className={styles.lead}>{cssShowcase.lead}</p>
      {patterns.length === 0 ? (
        <p className={styles.empty}>{cssShowcase.empty}</p>
      ) : (
        <ul className={styles.list}>
          {patterns.map((pattern) => (
            <li key={pattern.slug} className={styles.item}>
              <Link href={`/${locale}/css/${pattern.slug}`}>
                <Localized text={pattern.title} locale={locale} />
              </Link>
              <p>
                <Localized text={pattern.description} locale={locale} />
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
