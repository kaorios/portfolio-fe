import type { Metadata } from 'next';
import { getLocale } from '../dictionaries';
import { projects } from './data';
import { featuredProjects } from './featured-data';
import styles from './page.module.css';
import { Project } from './project';
export const metadata: Metadata = {
  title: 'Works',
};

export default async function Works() {
  const locale = await getLocale();

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Private Projects</h1>
      <div className={styles.workList}>
        {featuredProjects.map((project) => (
          <div className={styles.featuredWork} key={project.id}>
            <Project project={project} locale={locale} />
          </div>
        ))}
      </div>
      <div className={styles.workList}>
        {projects.map((project) => (
          <Project project={project} locale={locale} key={project.id} />
        ))}
      </div>
    </main>
  );
}
