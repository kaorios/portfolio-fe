import classNames from 'classnames';
import { useEffect } from 'react';
import styles from './bubble.module.css';
import type { TextStep } from './type';

interface Props {
  message: TextStep;
  setMessage: (trigger: string) => void;
}

const Bubble = ({ message, setMessage }: Props) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: advance to the next step once per bubble. setMessage changes identity whenever a message is added, so depending on it would re-run this effect and append duplicated messages.
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
