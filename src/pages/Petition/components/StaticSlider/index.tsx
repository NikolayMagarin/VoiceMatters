import { plural } from '../../../../utils/plural';
import styles from './StaticSlider.module.css';

const SIGN_GOALS = [
  0, 100, 500, 1_000, 5_000, 10_000, 50_000, 100_000, 200_000, 300_000, 400_000,
  500_000, 1_000_000, 5_000_000, 10_000_000, 50_000_000, 100_000_000,
];

interface Props {
  value: number;
  valuePerDay: number;
}

function Slider({ value, valuePerDay }: Props) {
  const goal =
    SIGN_GOALS.find((goal) => goal > value) ||
    SIGN_GOALS[SIGN_GOALS.length - 1];

  return (
    <div className={styles.wrapper}>
      <div className={styles.slider}>
        <div
          className={styles.progress}
          style={{ width: `${Math.max((value / goal) * 100, 5)}%` }}
        ></div>
      </div>
      <div className={styles['labels-wrapper']}>
        <div className={styles['current-label']}>
          <div className={styles.value}>{value}</div>
          <div className={styles.label}>
            {plural(value, 'Подпись', 'Подписи', 'Подписей')}
          </div>
        </div>
        <div className={styles['goal-label']}>
          <div className={styles.value}>{goal}</div>
          <div className={styles.label}>Следующая цель</div>
        </div>
      </div>
      <div className={styles['today']}>
        {`${valuePerDay} ${plural(
          valuePerDay,
          'подпись',
          'подписи',
          'подписей'
        )} `}
        сегодня
      </div>
    </div>
  );
}

export default Slider;
