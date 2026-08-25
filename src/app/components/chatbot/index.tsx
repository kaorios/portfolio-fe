'use client';
import { useRef } from 'react';
import { Container } from './container';
import { Header } from './header';
import styles from './index.module.css';
import type { Message, Steps } from './type';

interface Props {
  initMessages: Message[];
  steps: Steps;
  isActive: boolean;
  onClose?: () => void;
}

const Chatbot = ({ initMessages, steps, isActive, onClose }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!isActive) {
    return null;
  }

  return (
    <div className={styles.chatbot}>
      <div className={styles.header}>
        <Header handleClose={onClose} />
      </div>
      <div className={styles.container} ref={containerRef}>
        <Container
          initMessages={initMessages}
          steps={steps}
          containerRef={containerRef}
        />
      </div>
    </div>
  );
};

export { Chatbot };
