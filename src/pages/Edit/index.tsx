import { AxiosResponse } from 'axios';
import { RawDraftContentState } from 'draft-js';
import { ChangeEventHandler, useCallback, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer, type Id as ToastId } from 'react-toastify';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { api, apiPath } from '../../lib/api';
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

  const { data: petition, refetch } = useQuery(
    ['petition', petitionId],
    () => {
      return api.get<GetPetitionResponse>(apiPath.getPetition(petitionId));
    },
    {
      select: (response) => response.data,
      onSuccess: async (petition) => {
        setTitle(petition.title);
        setTags(petition.tags.map((tag) => tag.name));
        setPayload(expand(JSON.parse(petition.textPayload)));
        setImages(
          await Promise.all(
            petition.images
              .sort((a, b) => a.order - b.order)
              .map((image) => ({
                name: image.caption || '',
                image: imageUrl(image.uuid),
                id: image.uuid,
              }))
          )
        );
      },
    }
  );

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
        toast.dismiss(toastId.current);
      },
      onError: () => {
        toast.error('Произошла ошибка при редактировании петиции');
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

  return (
    <>
      <Header />
      <main className={styles.main}>
        <ToastContainer style={{ fontSize: 16 }} />
        {petition && (
          <>
            <NewsPanel petition={petition} onUpdate={refetch} />
            <div className={styles['editor-wrapper']}>
              <div className={styles['editor-label']}>
                Редактирование петиции
                {petition.isCompleted && (
                  <>
                    <br />
                    <span style={{ fontSize: '16px' }}>
                      (Редактирование завершенной петиции невозможно)
                    </span>
                  </>
                )}
              </div>
              <input
                placeholder='Заголовок вашей петиции'
                onChange={onTitleChange}
                defaultValue={petition.title}
                className={styles['title-input']}
                disabled={petition.isCompleted}
              />
              <Tags
                tags={tags}
                onTagsChange={setTags}
                disabled={petition.isCompleted}
              />
              <Slider
                items={images}
                onItemsChange={setImages}
                disabled={petition.isCompleted}
              />
              <Editor
                onChange={setPayload}
                initialContentState={payload}
                disabled={petition.isCompleted}
              />
              {!petition.isCompleted && (
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
