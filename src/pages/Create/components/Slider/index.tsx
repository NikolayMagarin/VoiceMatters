import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './Slider.module.css';
import { Navigation, Pagination } from 'swiper/modules';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import cn from 'classnames';
import { config } from '../../../../config';

type Item = { image: string; name: string };

function Slider() {
  const [items, setItems] = useLocalStorage<Item[]>(
    config.localStorage.petitionCreateImages,
    []
  );
  const swiperRef = useRef<SwiperRef>();

  const handleImageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    const newItems: Item[] = [];

    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      if (!(file.type === 'image/png' || file.type === 'image/jpeg')) {
        continue;
      }

      newItems.push({
        image: URL.createObjectURL(file),
        name: file.name,
      });
    }

    setItems(items.concat(newItems));
  };

  useEffect(() => {
    items.length &&
      isBlobUrlValid(items[0].image).then((isValid) => {
        isValid || setItems([]);
      });
  }, [items, setItems]);

  return (
    <Swiper
      ref={swiperRef}
      navigation={true}
      pagination={{ clickable: true }}
      slidesPerView={items.length ? 1.1 : 1}
      spaceBetween={20}
      initialSlide={0}
      modules={[Navigation, Pagination]}
    >
      {items.map((item, i) => (
        <SwiperSlide key={i} className={styles['slide-wrapper']}>
          <img className={styles['slide-image']} src={item.image} alt='' />
          <input
            className={styles['slide-name']}
            defaultValue={item.name}
            onChange={(e) => {
              items[i].name = e.target.value;
              setItems(items);
            }}
          />
          <Link
            className={cn(styles['image-action-btn'], styles['expand-btn'])}
            to={item.image}
            target='_blank'
            rel='noopener noreferrer'
          >
            <img src='/assets/images/expand-icon.svg' alt='expand' />
          </Link>
          <button
            className={cn(styles['image-action-btn'], styles['remove-btn'])}
            onClick={() => {
              const removed = items.splice(i, 1)[0];
              URL.revokeObjectURL(removed.image);
              setItems(items);
            }}
          >
            <img src='/assets/images/remove-icon.svg' alt='remove' />
          </button>
        </SwiperSlide>
      ))}
      <SwiperSlide key={items.length} className={styles['slide-wrapper']}>
        <div className={styles['slide-image']}>
          <div className={styles['input-wrapper']}>
            <input
              onChange={handleImageInputChange}
              className={styles.input}
              title=''
              type='file'
              accept='image/png, image/jpeg'
              multiple
            ></input>
            Перетащите изображение <br />
            или нажмите, чтобы выбрать
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}

async function isBlobUrlValid(url: string) {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();

    return xhr.status === 200 && xhr.response.length > 0;
  } catch (error) {
    return false;
  }
}

export default Slider;
