import styles from './ThemeBlock.module.css';

type ThemeBlockType = {
  name: string;
  text: string;
  image: string;
  reverse?: boolean;
};

function ThemeBlock({ name, text, image, reverse }: ThemeBlockType) {
  return (
    <div className={styles.wrapper + (reverse ? ` ${styles.reverse}` : '')}>
      <div className={styles['left-part']}>
        <div className={styles.name}>{name}</div>
        <div className={styles.text}>{text}</div>
      </div>
      <div className={styles['right-part']}>
        <img className={styles.image} src={image} alt={name} />
      </div>
    </div>
  );
}

export default ThemeBlock;
