import { Link } from 'react-router-dom';
import styles from './BottomBlock.module.css';

function BottomBlock() {
  return (
    <>
      <div className={styles.name}>Помогите сохранить природу сейчас!</div>
      <div className={styles.wrapper}>
        <div className={styles['left-part']}>
          Помогите помогите помогите помогите
          <br />
          Помогите помогите помогите
          <br />
          Помогите помогите
          <br />
          Помогите
          <br />
          help
        </div>
        <div className={styles['right-part']}>
          <Link to='/register' className={styles.btn}>
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </>
  );
}

export default BottomBlock;
