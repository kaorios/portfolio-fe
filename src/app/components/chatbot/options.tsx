import { useCallback } from 'react';
import { Button } from './button';
import styles from './options.module.css';
import { OptionsStep } from './type';

interface Props {
  options: OptionsStep['options'];
  selectOption: (value: number) => void;
}

const Options = ({ options, selectOption }: Props) => {
  const handleClick = useCallback(
    (value: number) => {
      selectOption(value);
    },
    [selectOption],
  );

  return (
    <div className={styles.options}>
      {options.map((o, index) => (
        <Button
          label={o.label}
          onClick={() => handleClick(o.value)}
          key={index}
        />
      ))}
    </div>
  );
};

export { Options };
