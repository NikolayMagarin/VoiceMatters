import styles from './SloganBlock.module.css';
import { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import { config } from '../../../../config';
import { GetStatsResponse, StatsMessage } from '../../../../lib/api/types';
import { useQuery } from 'react-query';
import { api } from '../../../../lib/api';
import NumberFlow from '@number-flow/react';
import SloganRotator from './components/SloganRotator';
import { apiPath } from '../../../../lib/api/apiPath';

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
      staleTime: 0,
      onSuccess({ data }) {
        setStats({
          users: data.userQuantity,
          signs: data.signsQuantity,
          petitions: data.petitionQuantity,
        });
      },
    }
  );

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(config.wssUrl)
      .configureLogging(signalR.LogLevel.None)
      .withAutomaticReconnect()
      .build();

    connection.on('ReceiveMessage', (message) => {
      try {
        const statsMessage: StatsMessage = JSON.parse(message);

        setStats((stats) => {
          const newStats = { ...stats };
          if (statsMessage.Method === 'PetitionCreated') {
            newStats.petitions++;
          } else if (statsMessage.Method === 'PetitionSigned') {
            newStats.signs++;
          } else if (statsMessage.Method === 'UserRegistered') {
            newStats.users++;
          } else if (statsMessage.Method === 'PetitionDeleted') {
            newStats.petitions--;
            newStats.signs -= statsMessage.Quantity;
          }
          return newStats;
        });
      } catch (err) {
        console.error(err);
      }
    });

    const startConnection = async () => {
      try {
        await connection.start();
      } catch (err) {
        console.error('SignalR Connection Error: ', err);
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    return () => {
      connection.stop();
    };
  }, []);
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
