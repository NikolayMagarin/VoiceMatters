import { useLocalStorage, useDebounceCallback } from 'usehooks-ts';
import styles from './Editor.module.css';
import { useCallback, useEffect, useState } from 'react';

import { Editor } from 'react-draft-wysiwyg';
import { RawDraftContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { config } from '../../../../config';

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
  const [savedState, setSavedState] = useLocalStorage<RawDraftContentState>(
    config.localStorage.petitionCreateText,
    { blocks: [], entityMap: {} }
  );

  // eslint-disable-next-line
  const saveStateDebounced = useCallback(
    useDebounceCallback((state: RawDraftContentState) => {
      setSavedState(state);
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

  useEffect(() => {
    onChange(savedState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Editor
      spellCheck
      stripPastedStyles
      placeholder='Опишите проблему подробнее и предложите решение'
      contentState={savedState}
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
