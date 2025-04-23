import { useMemo } from 'react';
import { GetPetitionResponse } from '../../../../lib/api/types';
import { imageUrl } from '../../../../utils/imageUrl';
import styles from './Petition.module.css';
import { Link } from 'react-router-dom';
import { RawDraftContentState } from 'draft-js';
import { plural } from '../../../../utils/plural';

interface Props {
  petition: GetPetitionResponse;
}

function Petition({ petition }: Props) {
  const imageSrc = useMemo(() => {
    if (petition.images.length) {
      return imageUrl(
        petition.images.sort((a, b) => a.order - b.order)[0].uuid
      );
    } else {
      return '/assets/images/image-placeholder.png';
    }
  }, [petition.images]);

  const textPayload = useMemo(
    () =>
      petition.textPayload
        ? (
            JSON.parse(petition.textPayload) as RawDraftContentState
          ).blocks.reduce((text, block) => text + '\n' + block.text, '')
        : undefined,
    [petition.textPayload]
  );

  return (
    <Link className={styles.petition} to={'/petition/' + petition.id}>
      <img
        className={styles.image}
        src={imageSrc}
        alt=''
        style={!petition.images.length ? { objectFit: 'contain' } : {}}
      />
      <div className={styles['petition-data']}>
        <div className={styles.title}>{petition.title}</div>
        <div className={styles.text}>{textPayload}</div>
        <div className={styles['metadata']}>
          <div className={styles['signs']}>
            {petition.signQuantity}{' '}
            {plural(petition.signQuantity, 'подпись', 'подписи', 'подписей')}
          </div>
          <div className={styles['date']}>
            Опубликовано{' '}
            {new Date(petition.createdDate).toLocaleDateString('ru')}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Petition;
