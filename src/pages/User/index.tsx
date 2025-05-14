import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import { api, apiPath } from '../../lib/api';
import { GetUserResponse } from '../../lib/api/types';
import { imageUrl } from '../../utils/imageUrl';
import SearchPetitions from './components/SearchPetitions';
import styles from './User.module.css';

function User() {
  const userId = useParams<'id'>().id!;

  const { data: user } = useQuery(
    ['tagSuggestions', userId],
    ({ queryKey: [_, id] }) => api.get<GetUserResponse>(apiPath.getUser(id)),
    {
      select: ({ data }) => data,
    }
  );

  const personals = useMemo(
    () =>
      user &&
      // prettier-ignore -
      Object.entries({
        'Полное имя': `${user.firstName} ${user.lastName}`,
        Email: user.email,
        Телефон: user.phone || '-',
        'Дата рождения': user.birthDate
          ? new Date(user.birthDate).toLocaleDateString('ru')
          : '-',
        Пол: user.sex ? (user.sex === 'Female' ? 'Женский' : 'Мужской') : '-',
        [user.sex === 'Female' ? 'Зарегистрирована' : 'Зарегистрирован']:
          new Date(user.createdDate).toLocaleDateString('ru'),
      }),
    [user]
  );

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles['block-title']}>Профиль пользователя</div>
        {user && (
          <>
            <div className={styles['info']}>
              <div className={styles['left-block']}>
                <div className={styles['avatar-wrapper']}>
                  <img
                    src={
                      user.imageUuid
                        ? imageUrl(user.imageUuid)
                        : '/assets/images/avatar.png'
                    }
                    alt=''
                    className={styles['avatar']}
                  />
                  <div className={styles['name']}>
                    {user.firstName} {user.lastName}
                  </div>
                </div>
              </div>
              <div className={styles['personals-container']}>
                {personals?.map(([key, value]) => (
                  <div className={styles['personal-property']}>
                    <span className={styles['personal-property-name']}>
                      {key}
                    </span>{' '}
                    <span className={styles['personal-property-value']}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles['statistics']}>
              <div className={styles['statistic']}>
                Создано петиций: <b>{user.petitionsCreated}</b>
              </div>
              <div className={styles['statistic']}>
                Подписано петиций: <b>{user.petitionsSigned}</b>
              </div>
            </div>
            {user.petitionsCreated > 0 && (
              <div style={{ marginTop: '50px' }}>
                <div className={styles['block-title']}>
                  Петиции пользователя
                </div>
                <SearchPetitions creatorId={user.id} />
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default User;
