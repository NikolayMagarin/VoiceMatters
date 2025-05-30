import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles['logo-wrapper']}>
        <img
          className={styles.logo}
          src='/assets/images/logo60.png'
          alt=''
        ></img>
        VoiceMatters
      </div>
      <div className={styles.column}>
        <div className={styles.name}>Документация</div>
        <Link to='/wiki'>Пользователю</Link>
        <Link to='/docs'>Разработчику</Link>
      </div>
      <div className={styles.column}>
        <div className={styles.name}>О нас</div>
        <Link to='/company'>О компании</Link>
        <Link to='mailto:DenEKBen1@yandex.ru'>Обратная связь</Link>
      </div>
      <div className={styles.column}>
        <div className={styles.name}>Помощь</div>
        <Link to='/faq'>FAQ</Link>
        <Link to='mailto:DenEKBen1@yandex.ru'>Сообщить об ошибке</Link>
      </div>
    </footer>
  );
}

export default Footer;
