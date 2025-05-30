import { AxiosResponse } from 'axios';
import { RawDraftContentState } from 'draft-js';
import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { toast, type Id as ToastId } from 'react-toastify';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { api } from '../../lib/api';
import {
  GetPetitionResponse,
  UpdatePetitionResponse,
} from '../../lib/api/types';
import { compress, expand } from '../../utils/draft-js-compact';
import { preparePetition } from './utils/preparePetition';
import { validatePetition } from './utils/validatePetition';
import Editor from './components/Editor';
import Slider, { ImageItem } from './components/Slider';
import Tags from './components/Tags';
import styles from './Edit.module.css';
import { imageUrl } from '../../utils/imageUrl';
import NewsPanel from './components/NewsPanel';
import { apiPath } from '../../lib/api/apiPath';
import { NotFoundError, ValidationError } from '../../lib/api/errors';
import NotFound from '../NotFound';
import { useAuth } from '../../lib/auth';

function Edit() {
  const petitionId = useParams<'id'>().id!;
  const [payload, setPayload] = useState<RawDraftContentState>({
    blocks: [],
    entityMap: {},
  });
  const [title, setTitle] = useState('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const toastId = useRef<ToastId>();
  const { user } = useAuth();

  const {
    data: petition,
    refetch,
    isError,
    error,
  } = useQuery(
    ['petition', petitionId],
    () => {
      return api.get<GetPetitionResponse>(apiPath.getPetition(petitionId));
    },
    {
      select: (response) => response.data,
      onSuccess: async (petition) => {},
    }
  );

  useEffect(() => {
    if (petition) {
      setTitle(petition.title);
      setTags(petition.tags.map((tag) => tag.name));
      setPayload(expand(JSON.parse(petition.textPayload)));
      Promise.all(
        petition.images
          .sort((a, b) => a.order - b.order)
          .map((image) => ({
            name: image.caption || '',
            image: imageUrl(image.uuid),
            id: image.uuid,
          }))
      ).then((imgs) => setImages(imgs));
    }
  }, [petition]);

  const onTitleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => setTitle(e.target.value),
    [setTitle]
  );

  const queryClient = useQueryClient();
  const mutation = useMutation<
    AxiosResponse<UpdatePetitionResponse>,
    any,
    FormData
  >(
    (formData) => {
      return api.put<UpdatePetitionResponse>(apiPath.updatePetiton, formData);
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(['petition', response.data.id]);

        refetch();
        toast.info('Изменения сохранены');
      },

      onSettled() {
        toast.dismiss(toastId.current);
      },
    }
  );

  const updatePetition = useCallback(async () => {
    const validation = validatePetition({
      title: title.trim(),
      payload: JSON.stringify(compress(payload)),
      images: images,
      tags: tags,
    });

    if (validation.error !== null) {
      toast.error(validation.error);
      return;
    }

    toastId.current = toast.loading('Сохраняем изменения');

    mutation.mutate(
      await preparePetition({ id: petitionId, ...validation.result })
    );
  }, [images, mutation, payload, tags, title, petitionId]);

  if (
    isError &&
    (error instanceof NotFoundError || error instanceof ValidationError)
  ) {
    return <NotFound text='Упс, такой петиции не существует' />;
  }

  if (petition && user && user?.id !== petition?.creator.id) {
    return <NotFound text='Упс, вас тут быть не должно' />;
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        {petition && (
          <>
            <NewsPanel petition={petition} onUpdate={refetch} />
            <div className={styles['editor-wrapper']}>
              <div className={styles['editor-label']}>
                Редактирование петиции
                {petition.isCompleted && (
                  <>
                    <br />
                    <span style={{ fontSize: '16px', color: '#a7a0a0' }}>
                      (Редактирование завершенной петиции невозможно)
                    </span>
                  </>
                )}
                {!petition.isCompleted && petition.signQuantity >= 1000 && (
                  <>
                    <br />
                    <span style={{ fontSize: '16px', color: '#a7a0a0' }}>
                      (Редактирование петиции с большим количеством подписей
                      невозможно)
                    </span>
                  </>
                )}
              </div>
              <input
                placeholder='Заголовок вашей петиции'
                onChange={onTitleChange}
                defaultValue={petition.title}
                className={styles['title-input']}
                disabled={petition.isCompleted || petition.signQuantity >= 1000}
              />
              <Tags
                tags={tags}
                onTagsChange={setTags}
                disabled={petition.isCompleted || petition.signQuantity >= 1000}
              />
              <Slider
                items={images}
                onItemsChange={setImages}
                disabled={petition.isCompleted || petition.signQuantity >= 1000}
              />
              <Editor
                onChange={setPayload}
                initialContentState={payload}
                disabled={petition.isCompleted || petition.signQuantity >= 1000}
              />
              {!petition.isCompleted && petition.signQuantity < 1000 && (
                <div className={styles['submit-btn-wrapper']}>
                  <button
                    onClick={updatePetition}
                    className={styles['submit-btn']}
                    disabled={mutation.isLoading}
                  >
                    Сохранить изменения
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Edit;
