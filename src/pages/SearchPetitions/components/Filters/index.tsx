import { ChangeEventHandler, useCallback, useState } from 'react';
import Tags from '../Tags';
import styles from './Filters.module.css';
import cs from 'classnames';
import { useDebounceCallback } from 'usehooks-ts';
import { useAuth } from '../../../../lib/auth';

type SortType = 'signs' | 'signsToday' | 'date';

const SORT_OPTIONS_TEXT: Record<
  SortType,
  { sortType: string; order: { ascending: string; descending: string } }
> = {
  signs: {
    sortType: 'По количеству подписей',
    order: {
      ascending: 'меньше подписей',
      descending: 'больше подписей',
    },
  },
  signsToday: {
    sortType: 'По количеству подписей сегодня',
    order: {
      ascending: 'меньше подписей',
      descending: 'больше подписей',
    },
  },
  date: {
    sortType: 'По дате публикации',
    order: {
      ascending: 'старые',
      descending: 'новые',
    },
  },
};

export interface FilterParams {
  title: string;
  userId: string;
  tagIds: string[];
  completed: 'include' | 'exclude' | 'default';
  blocked: boolean;
  sort: {
    type: SortType;
    descending: boolean;
  };
}

interface Props {
  params: FilterParams;
  onChange: (params: FilterParams) => void;
}

function Filters({ params, onChange }: Props) {
  const {
    user: { role: userRole },
  } = useAuth();
  const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);

  const handleIncludeCompleted = useCallback(
    (value: FilterParams['completed']) => {
      if (params.completed === 'default' || params.completed === value) {
        params.completed = value === 'include' ? 'exclude' : 'include';
      } else {
        params.completed = 'default';
      }

      onChange({ ...params });
    },
    [params, onChange]
  );

  const handleIncludeBlocked = useCallback(() => {
    params.blocked = !params.blocked;
    onChange({ ...params });
  }, [params, onChange]);

  const handleTagAppend = useCallback(
    (tagId: string) => {
      params.tagIds.push(tagId);
      onChange({ ...params });
    },
    [params, onChange]
  );

  const handleTagDelete = useCallback(
    (tagId: string) => {
      params.tagIds = params.tagIds.filter((t) => t !== tagId);
      onChange({ ...params });
    },
    [params, onChange]
  );

  // eslint-disable-next-line
  const handleTitleChangeDebounced = useCallback(
    useDebounceCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
      params.title = e.target.value.trim();
      onChange({ ...params });
    }, 500),
    [params, onChange]
  );

  const setSortType = useCallback(
    (sortType: SortType) => {
      setShowSortOptions(false);
      params.sort.type = sortType;
      onChange({ ...params });
    },
    [setShowSortOptions, params, onChange]
  );

  const switchSortOrder = useCallback(() => {
    params.sort.descending = !params.sort.descending;
    onChange({ ...params });
  }, [params, onChange]);

  return (
    <div className={styles.filters}>
      <input
        className={styles['title-input']}
        defaultValue={params.title}
        placeholder='Поиск по названию'
        type='search'
        onChange={handleTitleChangeDebounced}
      />

      <div className={styles.buttons}>
        <button
          onClick={() => setShowAdditionalFilters(!showAdditionalFilters)}
        >
          {showAdditionalFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
          {(!!params.tagIds.length ||
            params.completed !== 'default' ||
            params.blocked) && <> &bull;</>}
        </button>

        <button
          className={styles['sort-options-btn']}
          onClick={() => setShowSortOptions(!showSortOptions)}
        >
          {`Сортировать ${SORT_OPTIONS_TEXT[
            params.sort.type
          ].sortType.toLocaleLowerCase('ru')}`}

          {showSortOptions && (
            <div className={styles['sort-options']}>
              <div onClick={() => setSortType('signs')}>
                {SORT_OPTIONS_TEXT.signs.sortType}
              </div>
              <div onClick={() => setSortType('signsToday')}>
                {SORT_OPTIONS_TEXT.signsToday.sortType}
              </div>
              <div onClick={() => setSortType('date')}>
                {SORT_OPTIONS_TEXT.date.sortType}
              </div>
            </div>
          )}
        </button>

        <button onClick={switchSortOrder}>
          {`Сначала ${SORT_OPTIONS_TEXT[params.sort.type].order[
            params.sort.descending ? 'descending' : 'ascending'
          ].toLocaleLowerCase('ru')}`}
        </button>
      </div>

      <div
        className={cs(
          styles['additional-filters'],
          showAdditionalFilters || styles.closed
        )}
      >
        <div className={styles['include-btns']}>
          <div
            className={cs(styles['include-btn'], {
              [styles['checked']]: params.completed !== 'include',
            })}
            onClick={() => handleIncludeCompleted('exclude')}
          >
            <img
              src={
                params.completed !== 'include'
                  ? '/assets/images/checkbox-checked.svg'
                  : '/assets/images/checkbox-empty.svg'
              }
              alt=''
            />{' '}
            Показывать активные петиции
          </div>
          <div
            className={cs(styles['include-btn'], {
              [styles['checked']]: params.completed !== 'exclude',
            })}
            onClick={() => handleIncludeCompleted('include')}
          >
            <img
              src={
                params.completed !== 'exclude'
                  ? '/assets/images/checkbox-checked.svg'
                  : '/assets/images/checkbox-empty.svg'
              }
              alt=''
            />{' '}
            Показывать завершенные петиции
          </div>
        </div>
        {userRole === 'admin' && (
          <div
            className={cs(styles['include-btn'], {
              [styles['checked']]: params.completed !== 'exclude',
            })}
            onClick={handleIncludeBlocked}
          >
            <img
              src={
                params.blocked
                  ? '/assets/images/checkbox-checked.svg'
                  : '/assets/images/checkbox-empty.svg'
              }
              alt=''
            />{' '}
            Показывать заблокированные петиции
          </div>
        )}
        <Tags onAppend={handleTagAppend} onDelete={handleTagDelete} />
      </div>
    </div>
  );
}

export default Filters;
