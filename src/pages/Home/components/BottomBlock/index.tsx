import { Link } from 'react-router-dom';
import { useAuth } from '../../../../lib/auth';
import styles from './BottomBlock.module.css';

function BottomBlock() {
  const { isAuthenticated } = useAuth();
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
          <Link
            to={isAuthenticated ? '/create' : '/login'}
            className={styles.btn}
          >
            Создать петицию
          </Link>
        </div>
      </div>
    </>
  );
}

export default BottomBlock;
