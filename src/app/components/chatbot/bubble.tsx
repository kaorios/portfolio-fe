import classNames from 'classnames';
import { useEffect } from 'react';
import styles from './bubble.module.css';
import type { TextStep } from './type';

interface Props {
  message: TextStep;
  setMessage: (trigger: string) => void;
}

const Bubble = ({ message, setMessage }: Props) => {
  useEffect(() => {
    setTimeout(() => {
      setMessage(message.trigger);
    }, 1000);
  }, []);

  return (
    <div className={classNames(styles.bubble, message.user && styles.user)}>
      {message.message}
    </div>
  );
};

export { Bubble };
