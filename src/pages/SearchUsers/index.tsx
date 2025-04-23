import { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useDebounceCallback, useSessionStorage } from 'usehooks-ts';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { api, apiPath } from '../../lib/api';
import { SearchUsersResponse } from '../../lib/api/types';
import { imageUrl } from '../../utils/imageUrl';
import styles from './SearchUsers.module.css';

const PAGE_SIZE = 10;

function SearchUsers() {
  const [searchName, setSearchName] = useSessionStorage(
    '_vm_searchUsersName',
    ''
  );
  const [pageNumber, setPageNumber] = useSessionStorage(
    '_vm_searchUsersPageNumber',
    1
  );
  const [lastPageNumber, setLastPageNumber] = useState<number | null>(null);

  const { data, isLoading } = useQuery(
    ['searchUsers', searchName, pageNumber],
    () => {
      return api.get<SearchUsersResponse>(
        apiPath.searchUsers(searchName, PAGE_SIZE, pageNumber)
      );
    },
    { select: ({ data }) => data, keepPreviousData: true, staleTime: 300_000 }
  );

  // eslint-disable-next-line
  const handleTitleChangeDebounced = useCallback(
    useDebounceCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
      setPageNumber(1);
      setLastPageNumber(null);
      setSearchName(e.target.value.trim());
    }, 500),
    [setPageNumber, setLastPageNumber, setSearchName]
  );

  const onPageChange = useCallback(
    (newPageNumber: number) => {
      window.scrollTo(0, 0);
      setPageNumber(newPageNumber);
    },
    [setPageNumber]
  );

  useEffect(() => {
    if (data && data.length < PAGE_SIZE) {
      setLastPageNumber(pageNumber);
      setPageNumber(pageNumber);
    } else if (pageNumber > 1 && data?.length === 0) {
      setLastPageNumber(pageNumber - 1);
      setPageNumber(pageNumber - 1);
    }
  }, [pageNumber, data, searchName, setPageNumber]);

  return (
    <>
      <Header navigated='users' />
      <main className={styles.main}>
        <input
          className={styles['username-input']}
          defaultValue={searchName}
          placeholder='Поиск по имени'
          type='search'
          onChange={handleTitleChangeDebounced}
        />
        {!!data?.length && (
          <Pagination
            pageNumber={pageNumber}
            lastPageNumber={lastPageNumber}
            onPageChange={onPageChange}
          />
        )}
        <div className={styles.container}>
          {!isLoading && data?.length === 0 && 'Результатов не найдено'}
          {data?.map((user) => {
            return (
              <Link className={styles.user} to={'/user/' + user.id}>
                <img
                  className={styles.image}
                  src={
                    user.imageUuid
                      ? imageUrl(user.imageUuid)
                      : '/assets/images/image-placeholder.png'
                  }
                  alt=''
                  style={!user.imageUuid ? { objectFit: 'contain' } : {}}
                />
                <div className={styles['username']}>
                  {user.firstName} {user.lastName}
                </div>
              </Link>
            );
          })}
        </div>
        {!!data?.length && (
          <Pagination
            pageNumber={pageNumber}
            lastPageNumber={lastPageNumber}
            onPageChange={onPageChange}
          />
        )}
      </main>
      <Footer />
    </>
  );
}

interface PaginationProps {
  pageNumber: number;
  lastPageNumber: number | null;
  onPageChange: (pageNumber: number) => void;
}

function Pagination({
  pageNumber,
  onPageChange,
  lastPageNumber,
}: PaginationProps) {
  return (
    <div className={styles['page-btns']}>
      <button
        onClick={() => {
          onPageChange(pageNumber - 1);
        }}
        disabled={pageNumber === 1}
      >
        Предыдущая
      </button>
      Страница {pageNumber} {lastPageNumber !== null && `из ${lastPageNumber}`}
      <button
        onClick={() => {
          onPageChange(pageNumber + 1);
        }}
        disabled={pageNumber === lastPageNumber}
      >
        Следующая
      </button>
    </div>
  );
}

export default SearchUsers;
