import styles from './Editor.module.css';
import { useMemo, useState } from 'react';

import { Editor } from 'react-draft-wysiwyg';
import { convertFromRaw, EditorState, RawDraftContentState } from 'draft-js';
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
  initialContentState: RawDraftContentState;
  disabled?: boolean;
}

function TextEditor({ onChange, initialContentState, disabled }: Props) {
  const [toolbarHidden, setToolbarHidden] = useState(true);

  const initialEditorState = useMemo(
    () => EditorState.createWithContent(convertFromRaw(initialContentState)),
    [initialContentState]
  );

  if (initialContentState.blocks.length === 0) {
    return null;
  }

  return (
    <>
      {disabled ? (
        <Editor
          readOnly
          defaultEditorState={initialEditorState}
          toolbar={{
            options: [],
            link: {
              showOpenOptionOnHover: false,
            },
          }}
          toolbarHidden
          editorStyle={{ textIndent: '24px' }}
          editorClassName={styles.editor}
          wrapperClassName={styles.wrapper}
        ></Editor>
      ) : (
        <Editor
          spellCheck
          stripPastedStyles
          placeholder='Опишите проблему подробнее и предложите решение'
          onContentStateChange={onChange}
          defaultEditorState={initialEditorState}
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
      )}
    </>
  );
}

export default TextEditor;
