import { AxiosResponse } from 'axios';
import { ChangeEventHandler, useCallback, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from '../../../../components/Modal';
import { api } from '../../../../lib/api';
import { apiPath } from '../../../../lib/api/apiPath';
import {
  CreateNewsResponse,
  GetPetitionResponse,
  UpdateNewsResponse,
} from '../../../../lib/api/types';
import { plural } from '../../../../utils/plural';
import cn from 'classnames';
import styles from './NewsPanel.module.css';

interface Props {
  petition: GetPetitionResponse;
  onUpdate: () => void;
}

function NewsPanel({ petition, onUpdate }: Props) {
  const [newsTitle, setNewsTitle] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onTitleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => setNewsTitle(e.target.value),
    [setNewsTitle]
  );

  const closeModal = useCallback(() => {
    setShowCompleteModal(false);
    setShowDeleteModal(false);
  }, [setShowCompleteModal, setShowDeleteModal]);

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const completePetitionMutation = useMutation<AxiosResponse, any, string>(
    (petitionId) => {
      return api.post(apiPath.completePetiton(petitionId));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['petition', petition.id]);

        onUpdate();
        toast.info('Петиция завершена');
      },
    }
  );

  const deletePetitionMutation = useMutation<AxiosResponse, any, string>(
    (id) => {
      return api.delete(apiPath.deletePetition(id));
    },
    {
      onSuccess: () => {
        toast.info('Петиция удалена');
        navigate('/');
        queryClient.removeQueries(['petition', petition.id]);
      },
    }
  );

  const deletePetition = useCallback(() => {
    closeModal();
    deletePetitionMutation.mutate(petition.id);
  }, [closeModal, petition.id, deletePetitionMutation]);

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

        onUpdate();
        toast.info('Новость опубликована');
      },
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

        onUpdate();
        toast.info('Новость обновлена');
      },
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

        onUpdate();
        toast.info('Новость удалена');
      },
    }
  );

  const completePetition = useCallback(() => {
    closeModal();
    completePetitionMutation.mutate(petition.id);
  }, [closeModal, completePetitionMutation, petition.id]);

  const createOrUpdateNews = useCallback(
    (title: string) => {
      if (title.length < 10 || title.length > 200) {
        toast.error('Заголовок новости должен содержать от 10 до 200 символов');
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
      <div className={styles['label']}>Управление петициией </div>
      <Link
        to={'/petition/' + petition.id}
        className={cn(styles['btn'], styles['link'])}
      >
        Перейти к петиции
      </Link>
      <button
        onClick={() => setShowCompleteModal(true)}
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
      <button
        onClick={() => setShowDeleteModal(true)}
        className={styles['btn']}
      >
        Удалить петицию
      </button>
      {showCompleteModal && (
        <Modal
          title='Вы уверены, что хотите завершить петицию?'
          onClose={closeModal}
        >
          <div>
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
      {showDeleteModal && (
        <Modal
          title='Вы уверены, что хотите удалить петицию?'
          onClose={closeModal}
        >
          <div>
            <p>Петиция станет недоступна вам и другим пользователям</p>
            <p>Петицию нельзя восстановить</p>
          </div>
          <div className={styles['news-btns-wrapper']}>
            <button className={styles['btn']} onClick={closeModal}>
              Отмена
            </button>
            <button className={styles['btn']} onClick={deletePetition}>
              Удалить петициию
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default NewsPanel;
