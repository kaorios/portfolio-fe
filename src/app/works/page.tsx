import type { Metadata } from 'next';
import { projects } from './data';
import { featuredProjects } from './featured-data';
import styles from './page.module.css';
import { Project } from './project';
export const metadata: Metadata = {
  title: 'Works',
};

export default function Works() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Private Projects</h1>
      <div className={styles.workList}>
        {featuredProjects.map((project) => (
          <div className={styles.featuredWork} key={project.id}>
            <Project project={project} />
          </div>
        ))}
      </div>
      <div className={styles.workList}>
        {projects.map((project) => (
          <Project project={project} key={project.id} />
        ))}
      </div>
    </main>
  );
}
