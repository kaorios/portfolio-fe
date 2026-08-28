import classNames from 'classnames';
import Link from 'next/link';
import { Steamboat } from '@/app/components/steamboat';
import { getDictionary } from './dictionaries';
import styles from './page.module.css';

const TITLE_CHARACTERS = "Hi! I'm  Kaori :)"
  .split('')
  .map((character, index) => ({ id: `${character}-${index}`, character }));

export default async function Home() {
  const { home } = await getDictionary();

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        {TITLE_CHARACTERS.map(({ id, character }) => (
          <span
            key={id}
            className={classNames({ [styles.space]: character === ' ' })}
          >
            {character}
          </span>
        ))}
      </h1>
      <div className={styles.hero}>
        <p className={styles.subTitle}>
          I&lsquo;m a Software Engineer, <span>Frontend (Web)</span>.
        </p>
        <div className={styles.description}>
          <p>{home.description.aim}</p>
          <p>{home.description.focus}</p>
        </div>
      </div>
      <div className={styles.steamboat}>
        <Steamboat />
      </div>
      <div className={styles.principles}>
        <div className={styles.principle}>
          <h2>{home.principles.cleanCode.heading}</h2>
          <p>{home.principles.cleanCode.body}</p>
        </div>
        <div className={styles.principle}>
          <h2>{home.principles.architecture.heading}</h2>
          <p>{home.principles.architecture.body}</p>
        </div>

        <div className={styles.principle}>
          <h2>{home.principles.philosophy.heading}</h2>
          <p>{home.principles.philosophy.body}</p>
        </div>
        <div className={styles.principle}>
          <h2>{home.principles.team.heading}</h2>
          <p>{home.principles.team.body}</p>
        </div>
      </div>
      <div className={styles.extra}>
        <h2>{home.extra.heading}</h2>
        <p>{home.extra.lead}</p>
        <div className={styles.links}>
          <Link
            href="https://koroporch.com/blog/"
            target="_blank"
            rel="noopenner"
          >
            {home.extra.links.blog}
          </Link>
          <Link href="https://suumiee.com/" target="_blank" rel="noopenner">
            {home.extra.links.suumiee}
          </Link>
        </div>
        <p>{home.extra.closing}</p>
      </div>
    </main>
  );
}
