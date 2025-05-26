import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Editor from './components/Editor';
import Slider from './components/Slider';
import Tags from './components/Tags';
import { ChangeEventHandler, useCallback, useRef, useState } from 'react';
import { RawDraftContentState } from 'draft-js';
import { useLocalStorage } from 'usehooks-ts';
import styles from './Create.module.css';
import { compress } from '../../utils/draft-js-compact';
import { api } from '../../lib/api';
import { CreatePetitionResponse } from '../../lib/api/types';
import { useMutation, useQueryClient } from 'react-query';
import { AxiosResponse } from 'axios';
import { validatePetition } from './utils/validatePetition';
import { preparePetition } from './utils/preparePetition';
import { useNavigate } from 'react-router-dom';
import { toast, type Id as ToastId } from 'react-toastify';
import { useAuth } from '../../lib/auth';
import { apiPath } from '../../lib/api/apiPath';
import { config } from '../../config';

function Create() {
  const [payload, setPayload] = useState<RawDraftContentState>({
    blocks: [],
    entityMap: {},
  });
  const [title, setTitle] = useLocalStorage(
    config.localStorage.petitionCreateTitle,
    ''
  );
  const toastId = useRef<ToastId>();
  const { isAuthenticated } = useAuth();

  const onTitleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => setTitle(e.target.value),
    [setTitle]
  );

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const mutation = useMutation<
    AxiosResponse<CreatePetitionResponse>,
    any,
    FormData
  >(
    (formData) => {
      return api.post<CreatePetitionResponse>(apiPath.createPetition, formData);
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(['petition', response.data.id]);

        localStorage.removeItem(config.localStorage.petitionCreateImages);
        localStorage.removeItem(config.localStorage.petitionCreateTags);
        localStorage.removeItem(config.localStorage.petitionCreateText);
        localStorage.removeItem(config.localStorage.petitionCreateTitle);

        navigate('/petition/' + response.data.id);
      },
      onSettled() {
        toast.dismiss(toastId.current);
      },
    }
  );

  const createPetition = useCallback(async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirect: '/create' } });
      return;
    }

    const validation = validatePetition({
      title: title.trim(),
      payload: JSON.stringify(compress(payload)),
      images: JSON.parse(
        localStorage.getItem(config.localStorage.petitionCreateImages) || '[]'
      ),
      tags: JSON.parse(
        localStorage.getItem(config.localStorage.petitionCreateTags) || '[]'
      ),
    });

    if (validation.error !== null) {
      toast.error(validation.error);
      return;
    }

    toastId.current = toast.loading('Создаём петицию');

    mutation.mutate(await preparePetition(validation.result));
  }, [title, payload, mutation, isAuthenticated, navigate]);

  return (
    <>
      <Header navigated='create' />
      <main className={styles.main}>
        <div className={styles['editor-wrapper']}>
          <input
            placeholder='Заголовок вашей петиции'
            onChange={onTitleChange}
            value={title}
            className={styles['title-input']}
          />
          <Tags />
          <Slider />
          <Editor onChange={setPayload} />
          <div className={styles['submit-btn-wrapper']}>
            <button
              onClick={createPetition}
              className={styles['submit-btn']}
              disabled={mutation.isLoading}
            >
              Опубликовать петицию
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Create;
