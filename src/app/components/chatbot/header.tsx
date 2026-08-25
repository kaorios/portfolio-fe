import Image from 'next/image';
import { CrossIcon } from '../icons';
import styles from './header.module.css';

interface Props {
  handleClose?: () => void;
}
const Header = ({ handleClose }: Props) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <Image
          src="/img/icon-kaorios.png"
          width={38}
          height={38}
          alt=""
          className={styles.icon}
        />
        <div>Kaori Bot</div>
      </div>
      {handleClose ? (
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close chat"
        >
          <CrossIcon />
        </button>
      ) : null}
    </div>
  );
};

export { Header };
