import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './Slider.module.css';
import { Navigation, Pagination } from 'swiper/modules';
import cs from 'classnames';
import { useCallback } from 'react';

type Item = { image: string; name: string };

interface Props {
  items: Item[];
}

function Slider({ items }: Props) {
  const openImage = useCallback((imageUrl: string) => {
    return async () => {
      const imgWindow = window.open('', '_blank');
      if (imgWindow) {
        imgWindow.document.write(`
        <html><head></head><body><img src=${imageUrl} alt=""></body></html>`);
      }
    };
  }, []);

  return (
    <Swiper
      navigation={true}
      pagination={{ clickable: true }}
      slidesPerView={1}
      spaceBetween={20}
      initialSlide={0}
      modules={[Navigation, Pagination]}
    >
      {items.map((item, i) => {
        return (
          <SwiperSlide key={i} className={styles['slide-wrapper']}>
            <img
              className={styles['slide-image']}
              src={item.image}
              alt={item.name}
            />
            {item.name.length > 0 && (
              <div className={styles['slide-name']}>{item.name}</div>
            )}
            <button
              className={cs(styles['image-action-btn'], styles['expand-btn'])}
              onClick={openImage(item.image)}
            >
              <img src='/assets/images/expand-icon.svg' alt='expand' />
            </button>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}

export default Slider;
