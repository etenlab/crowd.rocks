import { useRef, useState } from 'react';
import { IonButton } from '@ionic/react';

import { ConfirmButtons } from '../../common/ConfirmButtons';
import { LangSelector } from '../../common/LangSelector/LangSelector';

import { useAppContext } from '../../../hooks/useAppContext';
import { useTr } from '../../../hooks/useTr';

import { Container } from './styled';

const ACCEPT_EXT = '*';

type NewDocumentFormProps = {
  onSave: (file: File | undefined) => void;
  onCancel: () => void;
};

export function NewDocumentForm({ onSave, onCancel }: NewDocumentFormProps) {
  const { tr } = useTr();
  // const [present] = useIonToast();

  const {
    states: {
      global: {
        langauges: { sourceLang },
      },
    },
    actions: { setSourceLanguage },
  } = useAppContext();

  const fileInput = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File>();

  const handleSave = (file: File | undefined) => {
    onSave(file);
  };

  return (
    <Container>
      <div>{file?.name ? file?.name : tr('No file selected')}</div>
      <IonButton
        onClick={() => {
          fileInput?.current?.click();
        }}
      >
        {file?.name ? tr('Change selected file') : tr('Select file')}
      </IonButton>
      <input
        ref={fileInput}
        hidden
        type="file"
        accept={ACCEPT_EXT}
        onChange={(e) => {
          e.target.files?.[0] && setFile(e.target.files[0]);
        }}
      />
      <LangSelector
        title={tr('Select language')}
        selected={sourceLang}
        onChange={(_sourceLangTag, sourceLangInfo) => {
          setSourceLanguage(sourceLangInfo);
        }}
        onClearClick={() => setSourceLanguage(null)}
      />
      <ConfirmButtons onCancel={onCancel} onSave={() => handleSave(file)} />
    </Container>
  );
}
