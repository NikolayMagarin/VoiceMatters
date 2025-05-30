import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSessionStorage } from 'usehooks-ts';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { config } from '../../config';
import { api } from '../../lib/api';
import { apiPath } from '../../lib/api/apiPath';
import { SearchPetitionsResponse } from '../../lib/api/types';
import Filters, { FilterParams } from './components/Filters';
import Petition from './components/Petition';
import styles from './SearchPetitions.module.css';

const DEFAULT_SEARCH_PARAMS: FilterParams = {
  title: '',
  userId: '',
  tagIds: [],
  completed: 'default',
  blocked: false,
  sort: {
    type: 'signsToday',
    descending: true, // сначала популярные сегодня
  },
};

const PAGE_SIZE = 20;

function SearchPetitions() {
  const [searchParams, setSearchParams] = useSessionStorage(
    config.sessionStorage.petitionSearchParams,
    DEFAULT_SEARCH_PARAMS
  );
  const [pageNumber, setPageNumber] = useSessionStorage(
    config.sessionStorage.petitionSearchPage,
    1
  );
  const [lastPageNumber, setLastPageNumber] = useState<number | null>(null);

  const { data, isLoading } = useQuery(
    ['searchPetitions', searchParams, pageNumber],
    () => {
      return api.get<SearchPetitionsResponse>(
        apiPath.searchPetitions({
          pageSize: PAGE_SIZE,
          pageNumber: pageNumber as number,
          ...(searchParams as FilterParams),
        })
      );
    },
    { select: ({ data }) => data, keepPreviousData: true }
  );

  const onParamsChange = useCallback(
    (params: FilterParams) => {
      setPageNumber(1);
      setLastPageNumber(null);
      setSearchParams(params);
    },
    [setPageNumber, setLastPageNumber, setSearchParams]
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
  }, [pageNumber, data, setPageNumber]);

  return (
    <>
      <Header navigated='petitions' />
      <main className={styles.main}>
        <Filters params={searchParams} onChange={onParamsChange} />
        {!!data?.length && (
          <Pagination
            pageNumber={pageNumber}
            lastPageNumber={lastPageNumber}
            onPageChange={onPageChange}
            disabled={isLoading}
          />
        )}
        <div className={styles.container}>
          {!isLoading && data?.length === 0 && 'Результатов не найдено'}
          {data?.map((petition) => (
            <Petition petition={petition} key={petition.id} />
          ))}
        </div>
        {!!data?.length && (
          <Pagination
            pageNumber={pageNumber}
            lastPageNumber={lastPageNumber}
            onPageChange={onPageChange}
            disabled={isLoading}
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
  disabled?: boolean;
}

function Pagination({
  pageNumber,
  onPageChange,
  lastPageNumber,
  disabled = false,
}: PaginationProps) {
  if (lastPageNumber === 1) return <></>;

  return (
    <div className={styles['page-btns']}>
      <button
        onClick={() => {
          onPageChange(pageNumber - 1);
        }}
        disabled={pageNumber === 1 || disabled}
      >
        Предыдущая
      </button>
      Страница {pageNumber} {lastPageNumber !== null && `из ${lastPageNumber}`}
      <button
        onClick={() => {
          onPageChange(pageNumber + 1);
        }}
        disabled={pageNumber === lastPageNumber || disabled}
      >
        Следующая
      </button>
    </div>
  );
}

export default SearchPetitions;
