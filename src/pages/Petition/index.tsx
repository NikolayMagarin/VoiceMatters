import { RawDraftContentState } from 'draft-js';
import { useCallback, useMemo } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { useQuery } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import { api, apiPath } from '../../lib/api';
import { GetPetitionResponse } from '../../lib/api/types';
import { expand } from '../../utils/draft-js-compact';
import styles from './Petition.module.css';
import ImageSlider from './components/ImageSlider';
import SignsStaticSlider from './components/StaticSlider';
import { imageUrl } from '../../utils/imageUrl';
import { useAuth } from '../../lib/auth';
import Footer from '../../components/Footer';
import cs from 'classnames';
import UsersSigned from './components/UsersSigned';

const TOOLBAR_OPTIONS = {
  options: [],
  link: {
    showOpenOptionOnHover: false,
  },
};

function Petition() {
  const petitionId = useParams<'id'>().id!;

  const { isAuthenticated, user } = useAuth();

  const { data: petition, refetch } = useQuery(
    ['petition', petitionId],
    () => {
      return api.get<GetPetitionResponse>(apiPath.getPetition(petitionId));
    },
    {
      select: (response) => response.data,
    }
  );
  const payload =
    (useMemo(
      () => petition && expand(JSON.parse(petition?.textPayload)),
      [petition]
    ) as RawDraftContentState) || undefined;

  const images = useMemo(
    () =>
      petition?.images
        .sort((a, b) => a.order - b.order)
        .map((item) => ({
          image: imageUrl(item.uuid),
          name: item.caption,
        })) || [],
    [petition]
  ) as Array<any>;

  const navigate = useNavigate();

  const handleSign = useCallback(() => {
    if (isAuthenticated) {
      api.post(apiPath.signPetition(petitionId)).then(() => {
        refetch();
      });
    } else {
      navigate('/login');
    }
  }, [petitionId, isAuthenticated, navigate, refetch]);

  return (
    <>
      <Header />
      <main className={styles.main}>
        {!!petition && (
          <>
            <div className={styles.top}>
              <div className={styles['top-left']}>
                {images.length ? (
                  <ImageSlider items={images} />
                ) : (
                  <div className={styles['img-placeholder']}>
                    <img
                      src='/assets/images/image-placeholder.png'
                      alt='VoiceMatters.ru'
                    />
                  </div>
                )}
              </div>
              <div className={styles['top-right']}>
                <div className={styles.title}>{petition.title}</div>
                <SignsStaticSlider
                  value={petition.signQuantity}
                  valuePerDay={petition.signQuantityPerDay}
                />
                {petition.creator.id === user.id ? (
                  <Link
                    to={`/edit/${petitionId}`}
                    className={cs(styles['sign-btn'], styles['edit-btn'])}
                  >
                    Редактировать
                  </Link>
                ) : (
                  <button
                    className={styles['sign-btn']}
                    disabled={petition.signedByCurrentUser}
                    onClick={
                      petition.signedByCurrentUser ? undefined : handleSign
                    }
                  >
                    {petition.signedByCurrentUser
                      ? 'Вы подписали'
                      : 'Подписать'}
                  </button>
                )}
              </div>
            </div>
            <div className={styles['petition-data']}>
              <Link
                to={`/user/${user.id}`}
                className={styles['creator-wrapper']}
              >
                <img src={imageUrl(petition.creator.imageUuid)} alt='' />
                {`${petition.creator.firstName} ${petition.creator.lastName}`}
              </Link>
              <Editor
                readOnly
                contentState={payload}
                toolbar={TOOLBAR_OPTIONS}
                toolbarHidden
                editorStyle={{ textIndent: '24px' }}
              ></Editor>
              {!!petition.tags.length && (
                <div className={styles['tags-container']}>
                  {petition.tags.map((tag, i) => (
                    <div key={i} className={styles.tag}>
                      {tag.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles['users-wrapper']}>
              <UsersSigned
                petitionId={petitionId}
                signQuantity={petition.signQuantity}
              />
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Petition;
