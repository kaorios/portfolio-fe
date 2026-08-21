'use client';

import Cookies from 'js-cookie';
import { memo, useEffect, useState } from 'react';
import { DISABLED_ANIMATION_COOKIE_NAME } from './const';
import styles from './index.module.css';
import Logo from './logo';

const FirstLoading = memo(() => {
  const [reduceAnimation, setReduceAnimation] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mediaQuery = window?.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceAnimation(!mediaQuery || mediaQuery.matches);
    setTimeout(() => {
      setIsLoading(false);
    }, 5500);

    if (Cookies.get(DISABLED_ANIMATION_COOKIE_NAME) !== 'true') {
      Cookies.set(DISABLED_ANIMATION_COOKIE_NAME, 'true', { expires: 3 });
    }
  }, []);

  if (reduceAnimation) {
    return <></>;
  }

  if (!isLoading) {
    return <></>;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.border}>
        <p>Welcome to my website</p>
      </div>
      <div className={styles.rabbit}>
        <Logo />
      </div>
      <div className={styles.wall1}></div>
      <div className={styles.wall2}></div>
      <div className={styles.wall3}></div>
    </div>
  );
});

FirstLoading.displayName = 'FirstLoading';

export { FirstLoading };
