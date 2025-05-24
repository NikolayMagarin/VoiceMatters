import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import styles from './NotFound.module.css';

interface Props {
  text?: string;
  hint?: boolean;
}

function NotFound({
  text = 'Упс, такой страницы не существует',
  hint = true,
}: Props) {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.status}>404</div>
        <div className={styles.text}>{text}</div>
        {hint && (
          <div className={styles.hint}>
            Проверьте, нет ли опечаток в адресе страницы
          </div>
        )}
        <Link to={'/'} className={styles.link}>
          На главную
        </Link>
      </main>
    </>
  );
}

export default NotFound;
