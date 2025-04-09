import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Editor from './components/Editor';
import Slider from './components/Slider';
import Tags from './components/Tags';
import { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import { RawDraftContentState } from 'draft-js';
import { useLocalStorage } from 'usehooks-ts';
import styles from './Create.module.css';
import { compress } from '../../utils/draft-js-compact';
import { api, apiPath } from '../../lib/api';
import { CreatePetitionResponse } from '../../lib/api/types';
import { useMutation, useQueryClient } from 'react-query';
import { AxiosResponse } from 'axios';
import { validatePetition } from './utils/validatePetition';
import { preparePetition } from './utils/preparePetition';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../lib/auth';

function Create() {
  const [payload, setPayload] = useState<RawDraftContentState>({
    blocks: [],
    entityMap: {},
  });
  const [title, setTitle] = useLocalStorage('_vm_petitionCreateStateTitle', '');

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

        localStorage.removeItem('_vm_petitionCreateStateImages');
        localStorage.removeItem('_vm_petitionCreateStateTags');
        localStorage.removeItem('_vm_petitionCreateStateText');
        localStorage.removeItem('_vm_petitionCreateStateTitle');

        navigate('/petition/' + response.data.id);
      },
      onError: () => {
        toast.dismiss();
        toast.error('Произошла ошибка при создании петиции');
      },
    }
  );

  const createPetition = useCallback(async () => {
    const validation = validatePetition({
      title: title.trim(),
      payload: JSON.stringify(compress(payload)),
      images: JSON.parse(
        localStorage.getItem('_vm_petitionCreateStateImages') || '[]'
      ),
      tags: JSON.parse(
        localStorage.getItem('_vm_petitionCreateStateTags') || '[]'
      ),
    });

    if (validation.error !== null) {
      toast.error(validation.error);
      return;
    }

    toast.loading('Создаём петицию');

    mutation.mutate(await preparePetition(validation.result));
  }, [title, payload, mutation]);

  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated]);

  return (
    <>
      <Header navigated='create' />
      <main className={styles.main}>
        <ToastContainer style={{ fontSize: 16 }} />
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
