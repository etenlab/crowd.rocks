import { useRef, useState } from 'react';
import { useTr } from '../../hooks/useTr';
import { styled } from 'styled-components';
// import { Textarea } from '../common/styled';
import { ConfirmButtons } from '../common/ConfirmButtons';
import { LangSelector } from '../common/LangSelector/LangSelector';
import { useAppContext } from '../../hooks/useAppContext';
import { IonButton } from '@ionic/react';

const ACCEPT_EXT = '*.*';

type NewDocumentFormProps = {
  onSave: (file: File | undefined) => void;
  onCancel: () => void;
};

export function NewDocumentForm({ onSave, onCancel }: NewDocumentFormProps) {
  const { tr } = useTr();
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
        {tr('Select file')}
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
        langSelectorId="documentsUploadLangSelector"
        selected={sourceLang ?? undefined}
        onChange={(_sourceLangTag, sourceLangInfo) => {
          setSourceLanguage(sourceLangInfo);
        }}
        onClearClick={() => setSourceLanguage(null)}
      />
      <ConfirmButtons onCancel={onCancel} onSave={() => handleSave(file)} />
    </Container>
  );
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
