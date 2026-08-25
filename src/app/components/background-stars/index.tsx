import { memo } from 'react';
import styles from './index.module.css';

const STARS = Array.from({ length: 10 }, (_, index) => `star-${index}`);

const BackgroundStars = memo(() => {
  return (
    <div className={styles.bgStars}>
      {STARS.map((id) => (
        <div className={styles.star} key={id}>
          ★
        </div>
      ))}
    </div>
  );
});

BackgroundStars.displayName = 'BackgroundStars';

export { BackgroundStars };
