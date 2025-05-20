import styles from './SloganBlock.module.css';
import { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { config } from '../../../../config';
import { GetStatsResponse, StatsMessage } from '../../../../lib/api/types';
import { useQuery } from 'react-query';
import { api, apiPath } from '../../../../lib/api';
import NumberFlow from '@number-flow/react';
import SloganRotator from './components/SloganRotator';

const NUMBERFLOW_PROPS = {
  format: {
    notation: 'compact',
  },
  locales: 'ru',
  trend: 0,
};

interface Stats {
  users: number;
  petitions: number;
  signs: number;
}

function SloganBlock() {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    signs: 0,
    petitions: 0,
  });

  useQuery(
    ['initialStats'],
    () => api.get<GetStatsResponse>(apiPath.getStats),
    {
      onSuccess({ data }) {
        setStats({
          users: data.userQuantity,
          signs: data.signsQuantity,
          petitions: data.petitionQuantity,
        });
      },
    }
  );

  const { sendMessage } = useWebSocket(config.wssUrl, {
    disableJson: true,
    shouldReconnect: () => true,
    onOpen() {
      sendMessage('{"protocol":"json", "version":1}\u001e');
    },
    onMessage({ data }: { data: string }) {
      try {
        const message = JSON.parse(data.slice(0, -1));
        if (typeof message !== 'object' || typeof message.target !== 'string') {
          return;
        }

        const statsMessage: StatsMessage = JSON.parse(message.target);

        setStats((stats) => {
          if (statsMessage.Method === 'PetitionCreated') {
            stats.petitions++;
          } else if (statsMessage.Method === 'PetitionSigned') {
            stats.signs++;
          } else if (statsMessage.Method === 'UserRegistered') {
            stats.users++;
          } else if (statsMessage.Method === 'PetitionDeleted') {
            stats.petitions--;
            stats.signs -= statsMessage.Quantity;
          }
          return { ...stats };
        });
      } catch {}
    },
  });

  return (
    <div className={styles['slogan-block']}>
      <div className={styles['left-part']}>
        <div className={styles['slogan-main-text']}>
          <SloganRotator time={10_000} />
        </div>
        <div className={styles.statistics}>
          <div className={styles['statistic-line']}>
            <img src='/assets/images/user-checked.svg' alt='' />
            <span className={styles['statistic-value']}>
              <NumberFlow value={stats.users} {...NUMBERFLOW_PROPS} />
            </span>{' '}
            активистов, экспертов и неравнодушных
          </div>
          <div className={styles['statistic-line']}>
            <img src='/assets/images/paper.svg' alt='' />
            <span className={styles['statistic-value']}>
              <NumberFlow value={stats.petitions} {...NUMBERFLOW_PROPS} />
            </span>{' '}
            инициатив, которые работают
          </div>
          <div className={styles['statistic-line']}>
            <img src='/assets/images/pencil.svg' alt='' />
            <span className={styles['statistic-value']}>
              <NumberFlow value={stats.signs} {...NUMBERFLOW_PROPS} />
            </span>{' '}
            подписей для светлого будущего
          </div>
        </div>
      </div>
      <div className={styles['right-part']}>
        <img src='/assets/images/paper.svg' alt='' className={styles.image} />
      </div>
    </div>
  );
}

export default SloganBlock;
