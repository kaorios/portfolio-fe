'use client';

import classNames from 'classnames';
import {
  type AnchorHTMLAttributes,
  type PropsWithChildren,
  useCallback,
  useState,
} from 'react';
import styles from './index.module.css';

type GlobalNavLinkProps = PropsWithChildren<
  AnchorHTMLAttributes<HTMLAnchorElement>
>;

const GlobalNavLink = ({ children, ...props }: GlobalNavLinkProps) => {
  const [isHover, setIsHover] = useState(false);
  const [isClick, setIsClick] = useState(false);

  const handleMouseover = useCallback(() => {
    setIsHover(true);
  }, []);
  const handleMouseleave = useCallback(() => {
    setIsHover(false);
  }, []);

  const handleClick = useCallback(() => {
    setIsHover(false);
    setIsClick(true);
    setTimeout(() => {
      setIsClick(false);
    }, 1000);
  }, []);

  return (
    <a
      {...props}
      onMouseOver={handleMouseover}
      onMouseLeave={handleMouseleave}
      onClick={handleClick}
    >
      <div
        className={classNames(styles.link, {
          [styles.hover]: isHover,
          [styles.click]: isClick,
        })}
      >
        {children}
      </div>
    </a>
  );
};

export { GlobalNavLink };
