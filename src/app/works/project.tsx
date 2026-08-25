import type { Project as ProjectType } from './data';
import styles from './project.module.css';
import { Slider } from './slider';

const Project = ({ project }: { project: ProjectType }) => {
  return (
    <section className={styles.work}>
      <div className={styles.content}>
        <h2 className={styles.title}>{project.name}</h2>
        <p className={styles.tech}>
          {project.tech.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </p>
        <p className={styles.description}>{project.description}</p>
        <time className={styles.date}>{project.date}</time>
        {project.url ? (
          <div className={styles.buttonWrapper}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noopenner"
              className={styles.button}
            >
              VIEW LIVE SITE
            </a>
          </div>
        ) : null}
        {project.github ? (
          <div className={styles.buttonWrapper}>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noopenner"
              className={styles.button}
            >
              VIEW REPOSITORY
            </a>
          </div>
        ) : null}
      </div>
      <Slider projectId={project.id} images={project.images} />
    </section>
  );
};

export { Project };
