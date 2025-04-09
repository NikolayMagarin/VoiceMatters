import { useLocalStorage, useDebounceCallback } from 'usehooks-ts';
import styles from './Editor.module.css';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Editor } from 'react-draft-wysiwyg';
import { RawDraftContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const TOOLBAR_OPTIONS = {
  options: ['inline', 'link'],
  inline: {
    inDropdown: false,
    options: ['bold', 'italic', 'underline', 'strikethrough'],
  },
  link: {
    inDropdown: false,
    showOpenOptionOnHover: true,
    defaultTargetOption: '_self',
    options: ['link', 'unlink'],
  },
};

interface Props {
  onChange: (state: RawDraftContentState) => void;
}

function TextEditor({ onChange }: Props) {
  const [toolbarHidden, setToolbarHidden] = useState(true);
  const [savedState, setSavedState] = useLocalStorage(
    '_vm_petitionCreateStateText',
    ''
  );

  // eslint-disable-next-line
  const saveStateDebounced = useCallback(
    useDebounceCallback((state: RawDraftContentState) => {
      setSavedState(JSON.stringify(state));
    }, 1000),
    [setSavedState]
  );

  const updateContentState = useCallback(
    (state: RawDraftContentState) => {
      saveStateDebounced(state);
      onChange(state);
    },
    [saveStateDebounced, onChange]
  );

  const initialContentState = useMemo(() => {
    if (savedState) {
      const parsed = JSON.parse(savedState);
      return parsed;
    } else {
      return undefined;
    }
  }, [savedState]);

  useEffect(() => {
    onChange(initialContentState);
  }, [onChange, initialContentState]);

  return (
    <Editor
      spellCheck
      stripPastedStyles
      placeholder='Опишите проблему подробнее и предложите решение'
      contentState={initialContentState}
      onContentStateChange={updateContentState}
      toolbar={TOOLBAR_OPTIONS}
      localization={{ locale: 'ru' }}
      onFocus={() => setToolbarHidden(false)}
      onBlur={() => setToolbarHidden(true)}
      toolbarClassName={styles.toolbar}
      toolbarStyle={
        toolbarHidden
          ? { visibility: 'hidden', opacity: 0 }
          : { visibility: 'visible', opacity: 1 }
      }
      editorClassName={styles.editor}
      wrapperClassName={styles.wrapper}
    />
  );
}

export default TextEditor;
