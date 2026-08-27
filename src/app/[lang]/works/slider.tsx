import Image from 'next/image';
import styles from './slider.module.css';

const Slider = ({
  projectId,
  images,
}: {
  projectId: string;
  images: string[];
}) => {
  return (
    <>
      {/** TODO: Planning how to display a project detail */}
      {/* <div className={styles.sliderControl}>
        <button className={styles.sliderLeft}>
          <svg
            viewBox="0 0 18 18"
            role="img"
            aria-label="前へ"
            focusable="false"
          >
            <path
              d="m13.7 16.29a1 1 0 1 1 -1.42 1.41l-8-8a1 1 0 0 1 0-1.41l8-8a1 1 0 1 1 1.42 1.41l-7.29 7.29z"
              fillRule="evenodd"
            ></path>
          </svg>
        </button>
        <button className={styles.sliderRight}>
          <svg
            viewBox="0 0 18 18"
            role="img"
            aria-label="次へ"
            focusable="false"
          >
            <path
              d="m4.29 1.71a1 1 0 1 1 1.42-1.41l8 8a1 1 0 0 1 0 1.41l-8 8a1 1 0 1 1 -1.42-1.41l7.29-7.29z"
              fillRule="evenodd"
            ></path>
          </svg>
        </button>
      </div> */}
      <div className={styles.sliderWrapper}>
        <div
          className={styles.slider}
          // :style="slideTranslateX(index)"
        >
          {images.map((img) => (
            <div className={styles.sliderImage} key={img}>
              <Image
                src={`/img/works/${projectId}/${img}`}
                alt=""
                height={480}
                width={830}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export { Slider };
