import { ChangeEventHandler, useCallback, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useDebounceCallback } from 'usehooks-ts';
import { api, apiPath } from '../../../../lib/api';
import { GetTagsResponse } from '../../../../lib/api/types';
import Suggestions from './components/Suggestions';
import styles from './Tags.module.css';
import cs from 'classnames';

interface Props {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  disabled?: boolean;
}

function Tags({ tags, onTagsChange, disabled }: Props) {
  const [searchingTag, setSearchingTag] = useState('');
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
      // value = value.trim();
      if (!tags.includes(value)) {
        if (value.length <= 30) {
          onTagsChange(
            tags.concat([value.charAt(0).toUpperCase() + value.slice(1)])
          );
        } else {
          alert('Тег слишком длинный');
        }
      } else {
        alert('Такой тег уже добавлен');
      }

      setSearchingTag('');
      updateSearchingTagDebounced.cancel();
      inputRef.current!.value = '';
    },
    [tags, onTagsChange, updateSearchingTagDebounced]
  );

  return (
    <div className={styles.tags}>
      <div className={styles['input-wrapper']}>
        <img
          alt=''
          className={cs(styles.loader, !isSuggestionsLoading && styles.hidden)}
          src='/assets/images/loader.svg'
        ></img>
        {!disabled && (
          <>
            <input
              ref={inputRef}
              className={styles.input}
              onChange={onInputChange}
              onSubmit={() => onOptionChoose(inputRef.current!.value)}
              placeholder='К каким темам относится проблема, например "Природа"'
            ></input>
            <button
              className={styles['choose-btn']}
              onClick={() => onOptionChoose(inputRef.current!.value)}
              disabled={!inputRef.current?.value.length}
            >
              Добавить тег
            </button>
          </>
        )}

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
        {tags.map((tag, i) => (
          <div key={i} className={styles.tag}>
            {tag}
            {!disabled && (
              <img
                src='/assets/images/cross-icon.svg'
                alt='x'
                className={styles['remove-tag']}
                onClick={() => {
                  tags.splice(i, 1);
                  onTagsChange([...tags]);
                }}
              ></img>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tags;
