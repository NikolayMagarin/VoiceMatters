import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import styles from './Header.module.css';

import LogoIcon from './images/logo60.png';
import SearchIcon from './images/search-icon.svg';

function Header({ navigated }: { navigated?: 'news' | 'browse' | 'create' }) {
  const [suggestions, setSuggestions] = useState<Array<string>>([]);
  const { user, isAuthenticated } = useAuth();

  /**
   * TODO: делать запросы на подсказки при вводе
   *
   * А при нажатии на Enter будет переход на другую страницу, которая
   * и будет осуществлять поиск и отображение
   */

  const onSearchSubmit = (value: string) => {
    alert(value);
    setSuggestions([]);
  };

  const onSeacrhChange = (value: string) => {
    // вообще тут нужен дебаунс потом когда запросы делать буду (или тхротл?)
    setSuggestions(suggestions.concat(value));
  };

  return (
    <header className={styles.header}>
      <div className={styles['nav-area']}>
        <div className={styles['logo-wrapper']}>
          <img src={LogoIcon} className={styles.logo} alt=''></img>
          VoiceMatters
        </div>
        <nav className={styles['nav-links']}>
          <div
            className={`${styles['link-wrapper']} ${
              navigated === 'news' ? styles.navigated : ''
            }`}
          >
            <Link to='/' className={styles.link}>
              Главная
            </Link>
            <div className={styles.underline}></div>
          </div>
          <div
            className={`${styles['link-wrapper']} ${
              navigated === 'create' ? styles.navigated : ''
            }`}
          >
            <Link to='/create' className={styles.link}>
              Создать петицию
            </Link>
            <div className={styles.underline}></div>
          </div>
          <div
            className={`${styles['link-wrapper']} ${
              navigated === 'browse' ? styles.navigated : ''
            }`}
          >
            <Link to='/browse' className={styles.link}>
              Посмотреть петиции
            </Link>
            <div className={styles.underline}></div>
          </div>
        </nav>
      </div>
      <div className={styles['search-area']}>
        <img src={SearchIcon} alt='' className={styles['search-icon']} />
        <input
          className={styles.input}
          type='search'
          name='search'
          autoComplete={'off'}
          onKeyDown={(event) => {
            event.code === 'Enter' && onSearchSubmit(event.currentTarget.value);
          }}
          onChange={(event) => onSeacrhChange(event.currentTarget.value)}
          onSubmit={(event) => {
            onSearchSubmit(event.currentTarget.value);
          }}
        />
      </div>

      {!isAuthenticated && (
        <>
          <Link
            to='/login'
            className={`${styles.link} ${styles['account-area']}`}
          >
            Войти
            <img src='/assets/images/user-icon.svg' alt='' />
          </Link>
        </>
      )}

      {isAuthenticated && (
        <>
          <Link to='/my' className={`${styles.link} ${styles['account-area']}`}>
            <>
              {`${user.firstName} ${user.lastName}`}
              <img src={user.profileImgUrl} alt='' />
            </>
          </Link>
        </>
      )}
    </header>
  );
}

export default Header;
