'use client';

import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { Chatbot } from '@/app/components/chatbot';
import { ChatIcon } from '@/app/components/icons';
import { steps } from './chat-steps';
import styles from './index.module.css';

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className={styles.chat}>
      <button
        className={classNames(styles.chatButton, isOpen && styles.hidden)}
        onClick={handleClick}
      >
        <ChatIcon />
      </button>
      <Chatbot
        initMessages={[steps['1']]}
        steps={steps}
        isActive={isOpen}
        onClose={handleClose}
      />
    </div>
  );
};

export { Chat };
