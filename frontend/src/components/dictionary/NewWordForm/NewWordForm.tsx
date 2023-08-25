import { useRef, useEffect } from 'react';
import { useIonToast } from '@ionic/react';

import { Input } from '../../common/styled';
import { Container } from './styled';

import { useWordUpsertMutation } from '../../../hooks/useWordUpsertMutation';
import { ErrorType } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';

import { ConfirmButtons } from '../../common/ConfirmButtons';

type NewWordFormProps = {
  langInfo: LanguageInfo;
  onCreated(): void;
  onCancel(): void;
};

export function NewWordForm({
  langInfo,
  onCreated,
  onCancel,
}: NewWordFormProps) {
  const { tr } = useTr();

  const [present] = useIonToast();

  const inputRef = useRef<HTMLIonInputElement>(null);

  const [upsertWord, { data, loading, error, called }] =
    useWordUpsertMutation();

  useEffect(() => {
    if (error) {
      return;
    }

    if (loading || !called) {
      return;
    }

    if (data) {
      if (data.wordUpsert.error !== ErrorType.NoError) {
        return;
      }

      onCreated();
    }
  }, [data, error, loading, called, present, tr, onCreated]);

  const handleSave = () => {
    const inputEl = inputRef.current;
    if (!inputEl) {
      present({
        message: tr('Input or Textarea not exists!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    const textareaVal = (inputEl.value + '').trim();

    if (textareaVal.length === 0) {
      present({
        message: tr('Word cannot be empty string!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    upsertWord({
      variables: {
        language_code: langInfo.lang.tag,
        dialect_code: langInfo.dialect ? langInfo.dialect.tag : null,
        geo_code: langInfo.region ? langInfo.region.tag : null,
        wordlike_string: textareaVal.trim(),
      },
    });
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Container>
      <Input
        ref={inputRef}
        labelPlacement="floating"
        fill="solid"
        label={tr('Input New Word')}
      />
      <ConfirmButtons onCancel={handleCancel} onSave={handleSave} />
    </Container>
  );
}
