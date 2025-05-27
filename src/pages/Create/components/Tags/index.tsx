import { ChangeEventHandler, useCallback, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useDebounceCallback, useLocalStorage } from 'usehooks-ts';
import { api } from '../../../../lib/api';
import { GetTagsResponse } from '../../../../lib/api/types';
import Suggestions from './components/Suggestions';
import styles from './Tags.module.css';
import cn from 'classnames';
import { apiPath } from '../../../../lib/api/apiPath';
import { toast } from 'react-toastify';
import { config } from '../../../../config';

function Tags() {
  const [searchingTag, setSearchingTag] = useState('');
  const [chosenTags, setChosenTags] = useLocalStorage<string[]>(
    config.localStorage.petitionCreateTags,
    []
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isLoading: isSuggestionsLoading,
    data: suggestions,
    isError,
  } = useQuery(
    ['tagSuggestions', searchingTag],
    ({ queryKey: [_, searchingTag] }) =>
      api.get<GetTagsResponse>(apiPath.getTags(searchingTag)),
    {
      select: ({ data }) => data,
      enabled: searchingTag.length > 0,
    }
  );

  // eslint-disable-next-line
  const updateSearchingTagDebounced = useCallback(
    useDebounceCallback((value: string) => {
      setSearchingTag(value.trim());
    }, 500),
    [setSearchingTag]
  );

  const onInputChange = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(() => {
    updateSearchingTagDebounced(inputRef.current!.value);
    if (!inputRef.current!.value.length) {
      setSearchingTag('');
      updateSearchingTagDebounced.cancel();
    }
  }, [updateSearchingTagDebounced]);

  const onOptionChoose = useCallback<(value: string) => void>(
    (value) => {
      if (!chosenTags.includes(value)) {
        if (value.length <= 30) {
          setChosenTags(
            chosenTags.concat([value.charAt(0).toUpperCase() + value.slice(1)])
          );
        } else {
          toast.error('Тег слишком длинный');
        }
      } else {
        toast.info('Такой тег уже добавлен');
      }

      setSearchingTag('');
      updateSearchingTagDebounced.cancel();
      inputRef.current!.value = '';
    },
    [chosenTags, setChosenTags, updateSearchingTagDebounced]
  );

  return (
    <div className={styles.tags}>
      <div className={styles['input-wrapper']}>
        <img
          alt=''
          className={cn(styles.loader, !isSuggestionsLoading && styles.hidden)}
          src='/assets/images/loader.svg'
        ></img>
        <input
          ref={inputRef}
          className={styles.input}
          onChange={onInputChange}
          onSubmit={() => onOptionChoose(inputRef.current!.value)}
          placeholder='К каким темам относится проблема, например "Природа"'
          name='tag'
          autoComplete='off'
        ></input>
        <button
          className={styles['choose-btn']}
          onClick={() => onOptionChoose(inputRef.current!.value)}
          disabled={!inputRef.current?.value.length}
        >
          Добавить тег
        </button>
        <div>
          {searchingTag && !isError && suggestions && !!suggestions.length && (
            <Suggestions
              values={suggestions?.map((suggestion) => suggestion.name)}
              onChoose={onOptionChoose}
            />
          )}
        </div>
      </div>
      <div className={styles.container}>
        {chosenTags.map((tag, i) => (
          <div key={i} className={styles.tag}>
            {tag}
            <img
              src='/assets/images/cross-icon.svg'
              alt='x'
              className={styles['remove-tag']}
              onClick={() => {
                chosenTags.splice(i, 1);
                setChosenTags(chosenTags);
              }}
            ></img>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tags;
