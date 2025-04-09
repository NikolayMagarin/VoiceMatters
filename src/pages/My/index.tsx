import Header from '../../components/Header';
import styles from './My.module.css';
import UserAvatar from './images/avatar.png';

interface UserInfo {
  name: string;
  surname: string;
  location?: string;
  stats?: Record<string, [string, string | number]>;
}

function My() {
  const userInfo: UserInfo = {
    name: 'Иван',
    surname: 'Иванович',
    location: 'Москва, Россия',
    stats: {
      stat1: ['Статистика 1', 32445],
      stat2: ['Статистика 2', 267354],
      stat3: ['Статистика 3', 23],
      stat4: ['Статистика 4', 62715],
    },
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles['user-info']}>
          <div>
            <img src={UserAvatar} alt='' className={styles['user-avatar']} />
          </div>
          <div className={styles['user-personals']}>
            <div className={styles['user-name']}>{userInfo.name}</div>
            <div className={styles['user-name']}>{userInfo.surname}</div>
            {userInfo.location && (
              <div className={styles['user-location']}>{userInfo.location}</div>
            )}
          </div>
          <div className={styles['user-stats']}>
            {userInfo.stats &&
              Object.values(userInfo.stats).map(([text, val]) => (
                <div>{`${text}: ${val}`}</div>
              ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default My;
