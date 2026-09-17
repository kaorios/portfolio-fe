import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { textFor } from '@/content/css-showcase/pattern';
import { alternatesFor } from '../../alternates';
import { getDictionary, getLocale } from '../../dictionaries';
import { PatternPreview } from '../preview';
import { registry } from '../registry';
import styles from './page.module.css';

/** A slug with no pattern behind it is a 404, not a page rendered on demand. */
export const dynamicParams = false;

export function generateStaticParams() {
  return registry.all().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/css/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const pattern = registry.get(slug);
  if (!pattern) notFound();

  const locale = await getLocale();

  return {
    title: textFor(pattern.title, locale),
    description: textFor(pattern.description, locale),
    alternates: await alternatesFor(`/css/${slug}`),
  };
}

/**
 * The template every pattern is rendered through. It reads whatever the
 * registry hands it, so a new pattern is a new module under
 * `src/content/css-showcase/` and nothing else.
 */
export default async function CssPatternPage({
  params,
}: PageProps<'/[lang]/css/[slug]'>) {
  const { slug } = await params;
  const pattern = registry.get(slug);
  if (!pattern) notFound();

  const locale = await getLocale();
  const { cssShowcase } = await getDictionary();
  const { sections } = cssShowcase;
  const title = textFor(pattern.title, locale);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>
        {textFor(pattern.description, locale)}
      </p>

      <section className={styles.section}>
        <h2>{sections.preview}</h2>
        <PatternPreview pattern={pattern} locale={locale} title={title} />
      </section>

      <section className={styles.section}>
        <h2>{sections.learn}</h2>
        <ul className={styles.learningPoints}>
          {pattern.learningPoints.map((point) => (
            <li key={point.ja}>{textFor(point, locale)}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>{sections.html}</h2>
        <pre className={styles.code}>
          <code>{pattern.html}</code>
        </pre>
      </section>

      <section className={styles.section}>
        <h2>{sections.css}</h2>
        <pre className={styles.code}>
          <code>{pattern.css}</code>
        </pre>
      </section>

      <section className={styles.section}>
        <h2>{sections.howItWorks}</h2>
        {pattern.explanations.map((explanation) => (
          <div key={explanation.heading.ja} className={styles.explanation}>
            <h3>{textFor(explanation.heading, locale)}</h3>
            <p>{textFor(explanation.body, locale)}</p>
          </div>
        ))}
      </section>

      {pattern.tags.length > 0 ? (
        <section className={styles.section}>
          <h2>{sections.tags}</h2>
          <ul className={styles.tags}>
            {pattern.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <Link href={`/${locale}/css`}>{cssShowcase.backToList}</Link>
    </main>
  );
}
