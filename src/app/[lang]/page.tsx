import classNames from 'classnames';
import Link from 'next/link';
import { Steamboat } from '@/app/components/steamboat';
import styles from './page.module.css';

const TITLE_CHARACTERS = "Hi! I'm  Kaori :)"
  .split('')
  .map((character, index) => ({ id: `${character}-${index}`, character }));

export default function Home() {
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
          <p>
            My aim is to deliver efficient technological products to those in
            need of them, and then they receive good experience with the
            products and life will be better :)
          </p>
          <p>
            These days, I focus on designing and architecting frontend code
            (also UI component libraries), building web applications using
            TypeScript, React, and Next.js(CSR, SSR) including unit tests, and
            building pleasant and effective teams.
          </p>
        </div>
      </div>
      <div className={styles.steamboat}>
        <Steamboat />
      </div>
      <div className={styles.principles}>
        <div className={styles.principle}>
          <h2>Clean Code for Frontend</h2>
          <p>
            Frontend engineers always white humble parts and business parts. To
            test what the company wants to do, write strong and easy-to-change
            code at heart. Bonus: the code would be easy to change even for
            those with little front-end knowledge.
          </p>
        </div>
        <div className={styles.principle}>
          <h2>Architecture...?</h2>
          <p>
            I am learning the architectures. It will change depending on the
            size and division of the service, so I always want to come up with
            an architecture that I think is the best right now for each service.
          </p>
        </div>

        <div className={styles.principle}>
          <h2>Philosophy</h2>
          <p>
            Release is always &quot;exciting&quot; for me. I continue to try to
            reduce the worry when releasing as much as possible. I want to
            strengthen our cooperation with automated testing and QA teams.
          </p>
        </div>
        <div className={styles.principle}>
          <h2>Love Teams</h2>
          <p>
            One of the important things when working is a Team for me. I believe
            that{' '}
            <span className={styles.bold}>
              a good team can deliver a good product
            </span>
            . What is a good team?, It depends on the teammates. For me, polite
            vibes, keep learning and improving, and work-life balance. I just
            want to hear, &quot;what is a good team for you?&quot;.
          </p>
        </div>
      </div>
      <div className={styles.extra}>
        <h2>Extra</h2>
        <p>I am writing a tech blog and working a private project:</p>
        <div className={styles.links}>
          <Link
            href="https://koroporch.com/blog/"
            target="_blank"
            rel="noopenner"
          >
            Tech Blog (Japanese only)
          </Link>
          <Link href="https://suumiee.com/" target="_blank" rel="noopenner">
            Suumiee (Private Project)
          </Link>
        </div>
        <p>
          In my free time, I relax in a lovely cafe with sweeeeets or play
          games.
        </p>
      </div>
    </main>
  );
}
