import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import cn from 'classnames';
import styles from './Header.module.css';

function Header({
  navigated,
}: {
  navigated?: 'news' | 'create' | 'petitions' | 'users';
}) {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles['nav-area']}>
        <Link to='/' className={cn(styles['logo-wrapper'], styles.link)}>
          <img
            src='/assets/images/logo60.png'
            className={styles.logo}
            alt=''
          ></img>
          VoiceMatters
        </Link>
        <nav className={styles['nav-links']}>
          <div
            className={cn(
              styles['link-wrapper'],
              navigated === 'news' && styles.navigated
            )}
          >
            <Link to='/' className={styles.link}>
              Главная
            </Link>
            <div className={styles.underline}></div>
          </div>
          <div
            className={cn(
              styles['link-wrapper'],
              navigated === 'create' && styles.navigated
            )}
          >
            <Link to='/create' className={styles.link}>
              Создать петицию
            </Link>
            <div className={styles.underline}></div>
          </div>
          <div
            className={cn(
              styles['link-wrapper'],
              navigated === 'petitions' && styles.navigated
            )}
          >
            <Link to='/petitions' className={styles.link}>
              Петиции
            </Link>
            <div className={styles.underline}></div>
          </div>
          <div
            className={cn(
              styles['link-wrapper'],
              navigated === 'users' && styles.navigated
            )}
          >
            <Link to='/users' className={styles.link}>
              Пользователи
            </Link>
            <div className={styles.underline}></div>
          </div>
        </nav>
      </div>

      {!isAuthenticated && (
        <Link to='/login' className={cn(styles.link, styles['account-area'])}>
          Войти
          <img src='/assets/images/user-icon.svg' alt='' />
        </Link>
      )}

      {isAuthenticated && !!user && (
        <Link
          to={`/user/${user.id}`}
          className={cn(styles.link, styles['account-area'])}
        >
          <>
            {`${user.firstName} ${user.lastName}`}
            <img src={user.profileImgUrl} alt='' />
          </>
        </Link>
      )}
    </header>
  );
}

export default Header;
