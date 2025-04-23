import { ChangeEventHandler, useCallback, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useDebounceCallback, useSessionStorage } from 'usehooks-ts';
import { api, apiPath } from '../../../../lib/api';
import { GetTagsResponse } from '../../../../lib/api/types';
import Suggestions from './components/Suggestions';
import styles from './Tags.module.css';
import cs from 'classnames';

interface Props {
  onAppend: (tagId: string) => void;
  onDelete: (tagId: string) => void;
}

function Tags({ onAppend, onDelete }: Props) {
  const [searchingTag, setSearchingTag] = useState('');
  const [tags, setTags] = useSessionStorage<GetTagsResponse>(
    '_vm_searchPetitionsTags',
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
      updateSearchingTagDebounced.cancel();
      setSearchingTag('');
    }
  }, [updateSearchingTagDebounced]);

  const onOptionChoose = useCallback<
    (value: { id: string; name: string }) => void
  >(
    (newTag) => {
      if (!tags.find((tag) => tag.id === newTag.id)) {
        if (newTag) {
          onAppend(newTag.id);
          tags.push(newTag);
          setTags(tags);
        }
      } else {
        alert('Такой тег уже добавлен');
      }

      inputRef.current!.value = '';
      updateSearchingTagDebounced.cancel();
      setSearchingTag('');
    },
    [tags, onAppend, updateSearchingTagDebounced]
  );

  const onKeyDown = useCallback<React.KeyboardEventHandler<HTMLInputElement>>(
    (e) => {
      if (e.key === 'Escape') {
        inputRef.current!.value = '';
        setSearchingTag('');
      }
    },
    []
  );

  return (
    <div className={styles.tags}>
      <div className={styles['input-wrapper']}>
        <img
          alt=''
          className={cs(styles.loader, !isSuggestionsLoading && styles.hidden)}
          src='/assets/images/loader.svg'
        ></img>
        <input
          ref={inputRef}
          className={styles.input}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          placeholder='Теги'
        ></input>
        <div>
          {searchingTag && !isError && suggestions && !!suggestions.length && (
            <Suggestions values={suggestions} onChoose={onOptionChoose} />
          )}
        </div>
      </div>
      {!!tags.length && (
        <div className={styles.container}>
          {tags.map((tag, i) => (
            <div key={i} className={styles.tag}>
              {tag.name}
              <img
                src='/assets/images/cross-icon.svg'
                alt='x'
                className={styles['remove-tag']}
                onClick={() => {
                  const id = tags.splice(i, 1)[0].id;
                  onDelete(id);
                  setTags([...tags]);
                }}
              ></img>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tags;
