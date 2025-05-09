import { AxiosResponse } from 'axios';
import { ChangeEventHandler, useCallback, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from '../../../../components/Modal';
import { api, apiPath } from '../../../../lib/api';
import {
  CreateNewsResponse,
  GetPetitionResponse,
  UpdateNewsResponse,
} from '../../../../lib/api/types';
import { plural } from '../../../../utils/plural';
import styles from './NewsPanel.module.css';

interface Props {
  petition: GetPetitionResponse;
}

function NewsPanel({ petition }: Props) {
  const [newsTitle, setNewsTitle] = useState('');
  const [showModal, setShowModal] = useState(false);

  const onTitleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => setNewsTitle(e.target.value),
    [setNewsTitle]
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const completePetitionMutation = useMutation<AxiosResponse, any, string>(
    (petitionId) => {
      return api.post(apiPath.completePetiton(petitionId));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['petition', petition.id]);

        navigate('.');

        toast.info('Петиция завершена');
      },
      onError: () => {},
    }
  );

  const createNewsMutation = useMutation<
    AxiosResponse<CreateNewsResponse>,
    any,
    { petitionId: string; title: string }
  >(
    ({ petitionId, title }) => {
      return api.post(apiPath.createNews, {
        petitionId: petitionId,
        title: title,
      });
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(['petition', response.data.petitionId]);
        queryClient.invalidateQueries(['news', response.data.id]);

        navigate('.');

        toast.info('Новость опубликована');
      },
      onError: () => {},
    }
  );

  const updateNewsMutation = useMutation<
    AxiosResponse<UpdateNewsResponse>,
    any,
    { id: string; title: string }
  >(
    ({ id, title }) => {
      return api.put(apiPath.updateNews, {
        id: id,
        title: title,
      });
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(['petition', response.data.petitionId]);
        queryClient.invalidateQueries(['news', response.data.id]);

        navigate('.');

        toast.info('Новость обновлена');
      },
      onError: () => {},
    }
  );

  const deleteNewsMutation = useMutation<AxiosResponse, any, string>(
    (id) => {
      return api.delete(apiPath.deleteNews(id));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['petition', petition.id]);
        queryClient.invalidateQueries(['news', petition.newsId]);

        navigate('.');

        toast.info('Новость удалена');
      },
      onError: () => {},
    }
  );

  const completePetition = useCallback(() => {
    setShowModal(false);
    completePetitionMutation.mutate(petition.id);
  }, [completePetitionMutation, petition.id]);

  const createOrUpdateNews = useCallback(
    (title: string) => {
      if (title.length < 10 || title.length > 200) {
        toast.error('Введите заголовок новости от 10 до 200 символов');
        return;
      }

      if (petition.newsId) {
        updateNewsMutation.mutate({ id: petition.newsId!, title });
      } else {
        createNewsMutation.mutate({ petitionId: petition.id, title });
      }
    },
    [createNewsMutation, petition.id, petition.newsId, updateNewsMutation]
  );

  const deleteNews = useCallback(() => {
    deleteNewsMutation.mutate(petition.newsId!);
  }, [petition.newsId, deleteNewsMutation]);

  return (
    <div className={styles['wrapper']}>
      <div className={styles['label']}>Управление петициией</div>
      <button
        onClick={() => setShowModal(true)}
        className={styles['btn']}
        disabled={petition.isCompleted}
      >
        {petition.isCompleted ? 'Петиция завершена' : 'Завершить петицию'}
      </button>
      {petition.isCompleted && (
        <>
          <input
            onChange={onTitleChange}
            placeholder={
              petition.newsTitle ||
              `${petition.title} — Мы набрали ${petition.signQuantity} ${plural(
                petition.signQuantity,
                'подпись',
                'подписи',
                'подписей'
              )}!`
            }
            className={styles['title-input']}
            style={{ marginTop: '10px' }}
          />
          <div className={styles['news-btns-wrapper']}>
            <button
              onClick={() => createOrUpdateNews(newsTitle)}
              className={styles['btn']}
              disabled={
                createNewsMutation.isLoading ||
                updateNewsMutation.isLoading ||
                petition.newsTitle === newsTitle ||
                newsTitle.length === 0
              }
            >
              {petition.newsTitle ? 'Изменить новость' : 'Опубликовать новость'}
            </button>
            {petition.newsTitle && (
              <button
                onClick={deleteNews}
                className={styles['btn']}
                disabled={deleteNewsMutation.isLoading}
              >
                Удалить новость
              </button>
            )}
          </div>
        </>
      )}
      {showModal && (
        <Modal
          title='Вы уверены, что хотите завершить петицию?'
          onClose={closeModal}
        >
          <div style={{ lineHeight: '10px' }}>
            <p>Завершив петицию, вы не сможете отменить это действие</p>
            <p>Завершенная петиция больше не сможет набирать подписи</p>
            <p>Завершенную петицию нельзя отредактировать</p>
          </div>
          <div className={styles['news-btns-wrapper']}>
            <button className={styles['btn']} onClick={closeModal}>
              Отмена
            </button>
            <button className={styles['btn']} onClick={completePetition}>
              Завершить петициию
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default NewsPanel;
