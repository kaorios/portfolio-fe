import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { textFor } from '@/content/css-showcase/pattern';
import { alternatesFor } from '../../alternates';
import { getDictionary, getLocale } from '../../dictionaries';
import { CodeBlock } from '../code-block';
import { CssTagList } from '../css-tag-list';
import { ShowcasePreview } from '../preview';
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
 *
 * The order is the reading order: what the pattern is, what it looks like, the
 * two pieces of source behind it, why they are written that way, and the CSS it
 * rests on.
 */
export default async function CssPatternPage({
  params,
}: PageProps<'/[lang]/css/[slug]'>) {
  const { slug } = await params;
  const pattern = registry.get(slug);
  if (!pattern) notFound();

  const locale = await getLocale();
  const { cssShowcase } = await getDictionary();
  const { sections, code } = cssShowcase;
  const title = textFor(pattern.title, locale);

  return (
    <main className={styles.main}>
      <header className={styles.intro}>
        <h1 className={styles.title}>{title}</h1>
        <p>{textFor(pattern.description, locale)}</p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.heading}>{sections.preview}</h2>
        <ShowcasePreview pattern={pattern} locale={locale} title={title} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>{sections.html}</h2>
        <CodeBlock code={pattern.html} language="html" labels={code} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>{sections.css}</h2>
        <CodeBlock code={pattern.css} language="css" labels={code} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>{sections.howItWorks}</h2>
        <div className={styles.explanations}>
          {pattern.explanations.map((explanation) => (
            <div key={explanation.heading.ja} className={styles.explanation}>
              <h3>{textFor(explanation.heading, locale)}</h3>
              <p>{textFor(explanation.body, locale)}</p>
            </div>
          ))}
        </div>
      </section>

      {pattern.tags.length > 0 ? (
        <section className={styles.section}>
          <h2 className={styles.heading}>{sections.tags}</h2>
          <CssTagList tags={pattern.tags} />
        </section>
      ) : null}

      <Link href={`/${locale}/css`}>{cssShowcase.backToList}</Link>
    </main>
  );
}
