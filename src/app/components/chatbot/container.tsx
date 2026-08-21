import { Bubble } from './bubble';
import { Options } from './options';
import styles from './container.module.css';
import classNames from 'classnames';
import { Message, Steps, TextStep } from './type';
import { useState, useCallback, useEffect } from 'react';

interface Props {
  initMessages: Message[];
  steps: Steps;
  containerRef: any;
}

const Container = ({ initMessages, steps, containerRef }: Props) => {
  const [messages, setMessages] = useState(initMessages);
  const handleSetMessage = useCallback(
    (trigger: string) => {
      const next = steps[trigger];
      if (next) {
        setMessages([...messages, next]);
      } else {
        // TODO: End or Error
      }
    },
    [messages, steps],
  );

  const handleCurrentSelectOption = useCallback(
    (value: number) => {
      const temp = [...messages];
      const m = temp.pop();

      if (m?.type !== 'options') return;

      const selectedOption = m.options.find((o: any) => o.value === value);

      if (!selectedOption) return;

      const newTextStep: TextStep = {
        type: 'text',
        id: m.id,
        message: selectedOption.label,
        trigger: selectedOption.trigger,
        user: true,
      };

      setMessages([...temp, newTextStep]);
      setTimeout(() => {
        handleSetMessage(selectedOption.trigger);
      }, 1000);
    },
    [messages, handleSetMessage],
  );

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top:
          containerRef.current.scrollHeight - containerRef.current.clientHeight,
        behavior: 'smooth',
      });
    }
  }, [containerRef, messages.length]);

  return (
    <div className={styles.container}>
      {messages.map((m) => {
        if (m.type === 'options') {
          return (
            <div className={styles.user} key={m.id}>
              <Options
                options={m.options}
                selectOption={handleCurrentSelectOption}
              />
            </div>
          );
        }
        return (
          <div
            className={classNames(m.user ? styles.user : styles.bot)}
            key={m.id}
          >
            <Bubble message={m} setMessage={handleSetMessage} />
          </div>
        );
      })}
    </div>
  );
};

export { Container };
