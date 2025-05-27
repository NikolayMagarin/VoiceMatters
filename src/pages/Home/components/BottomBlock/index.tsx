import { Link } from 'react-router-dom';
import styles from './BottomBlock.module.css';

function BottomBlock() {
  return (
    <>
      <div className={styles.name}>Сделаем мир лучше вместе!</div>
      <div className={styles.wrapper}>
        <div className={styles['left-part']}>
          <div>Создавайте петиции на актуальные проблемы</div>
          <div>Подписывайте понравившиеся петиции</div>
          <div>Отмечайте успехи ваших петиций</div>
          <div>Побеждайте каждый день</div>
        </div>
        <div className={styles['right-part']}>
          <Link to='/create' className={styles.btn}>
            Создать петицию
          </Link>
        </div>
      </div>
    </>
  );
}

export default BottomBlock;
