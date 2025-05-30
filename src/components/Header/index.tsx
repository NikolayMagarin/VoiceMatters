import { useState } from 'react';
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
  const [isMenuOpen, setMenuOpen] = useState(false);

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

        <button
          className={styles.burger}
          onClick={() => setMenuOpen(!isMenuOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={cn(styles['nav-links'], {
            [styles['nav-open']]: isMenuOpen,
          })}
        >
          {['news', 'create', 'petitions', 'users'].map((page) => (
            <div
              key={page}
              className={cn(
                styles['link-wrapper'],
                navigated === page && styles.navigated
              )}
            >
              <Link
                to={
                  page === 'news'
                    ? '/'
                    : page === 'create'
                    ? '/create'
                    : `/${page}`
                }
                className={styles.link}
                onClick={() => setMenuOpen(false)}
              >
                {
                  {
                    news: 'Главная',
                    create: 'Создать петицию',
                    petitions: 'Петиции',
                    users: 'Пользователи',
                  }[page]
                }
              </Link>
              <div className={styles.underline}></div>
            </div>
          ))}
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
