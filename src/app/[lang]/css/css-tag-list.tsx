import styles from './css-tag-list.module.css';

type CssTagListProps = {
  /** The CSS features on show in a pattern. */
  tags: readonly string[];
};

/**
 * The CSS a pattern leans on, as labels. They are not links: there is nothing
 * yet on the other side of one, and a link that goes nowhere is worse than a
 * label that never claimed to go anywhere.
 */
export const CssTagList = ({ tags }: CssTagListProps) => {
  if (tags.length === 0) return null;

  return (
    <ul className={styles.tags}>
      {tags.map((tag) => (
        <li key={tag} className={styles.tag}>
          {tag}
        </li>
      ))}
    </ul>
  );
};
