import styles from './SloganBlock.module.css';
import SloganImage from './images/slogan-image.png';
import UserIcon from './images/Right-user.svg';
import BloomIcon from './images/Bloom.svg';
import HoldIcon from './images/Hold.svg';

type SloganData = {
  users: number;
  petitions: number;
  money: number;
};

function SloganBlock({ data }: { data: SloganData }) {
  return (
    <div className={styles['slogan-block']}>
      <div className={styles['left-part']}>
        <div className={styles['slogan-main-text']}>
          Вместе к чистой <br />и зеленой планете
        </div>
        <div className={styles.statistics}>
          <div className={styles['statistic-line']}>
            <img src={UserIcon} alt='' />
            {data.users} пользователей присоединилось к сервису
          </div>
          <div className={styles['statistic-line']}>
            <img src={BloomIcon} alt='' />
            {data.petitions} петиций изменили мир
          </div>
          <div className={styles['statistic-line']}>
            <img src={HoldIcon} alt='' />
            {data.money} рублей перечислено для светлого будущего
          </div>
        </div>
      </div>
      <div className={styles['right-part']}>
        <img
          src={SloganImage}
          alt='Вид на красивую горную местность'
          className={styles.image}
        />
      </div>
    </div>
  );
}

export default SloganBlock;
