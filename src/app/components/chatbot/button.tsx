import { useCallback } from 'react';
import styles from './button.module.css';

interface Props {
  label: string;
  onClick: () => void;
}
const Button = ({ label, onClick }: Props) => {
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <button type="button" className={styles.button} onClick={handleClick}>
      {label}
    </button>
  );
};

export { Button };
