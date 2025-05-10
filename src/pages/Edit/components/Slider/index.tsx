import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './Slider.module.css';
import { Navigation, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import cs from 'classnames';
import { useCallback } from 'react';

export type ImageItem = { image: string; name: string; id?: string };
interface Props {
  items: ImageItem[];
  onItemsChange: (items: ImageItem[]) => void;
  disabled?: boolean;
}

function Slider({ items, onItemsChange, disabled }: Props) {
  const handleImageInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;

      const newItems: ImageItem[] = [];

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

      onItemsChange(items.concat(newItems));
    },
    [items, onItemsChange]
  );

  return (
    <Swiper
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
              onItemsChange([...items]);
            }}
            disabled={!!disabled}
          />
          <Link
            className={cs(styles['image-action-btn'], styles['expand-btn'])}
            to={item.image}
            target='_blank'
            rel='noopener noreferrer'
          >
            <img src='/assets/images/expand-icon.svg' alt='expand' />
          </Link>
          {!disabled && (
            <button
              className={cs(styles['image-action-btn'], styles['remove-btn'])}
              onClick={() => {
                const removed = items.splice(i, 1)[0];
                URL.revokeObjectURL(removed.image);
                onItemsChange([...items]);
              }}
            >
              <img src='/assets/images/remove-icon.svg' alt='remove' />
            </button>
          )}
        </SwiperSlide>
      ))}
      {!disabled && (
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
                disabled={!!disabled}
              ></input>
              Перетащите изображение <br />
              или нажмите, чтобы выбрать
            </div>
          </div>
        </SwiperSlide>
      )}
    </Swiper>
  );
}

export default Slider;
