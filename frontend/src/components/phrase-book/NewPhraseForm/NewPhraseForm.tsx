import { useRef, useEffect } from 'react';
import { useIonToast } from '@ionic/react';

import { Input } from '../../common/styled';
import { Container } from './styled';

import { usePhraseUpsertMutation } from '../../../hooks/usePhraseUpsertMutation';
import { ErrorType } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';

import { ConfirmButtons } from '../../common/ConfirmButtons';

type NewPhraseFormProps = {
  langInfo: LanguageInfo;
  onCreated(): void;
  onCancel(): void;
};

export function NewPhraseForm({
  langInfo,
  onCreated,
  onCancel,
}: NewPhraseFormProps) {
  const { tr } = useTr();

  const [present] = useIonToast();

  const inputRef = useRef<HTMLIonInputElement>(null);

  const [upsertPhrase, { data, loading, error, called }] =
    usePhraseUpsertMutation();

  useEffect(() => {
    if (error) {
      return;
    }

    if (loading || !called) {
      return;
    }

    if (data) {
      if (data.phraseUpsert.error !== ErrorType.NoError) {
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

    const inputVal = (inputEl.value + '').trim();

    if (inputVal.length === 0) {
      present({
        message: tr('Phrase cannot be empty string!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    upsertPhrase({
      variables: {
        language_code: langInfo.lang.tag,
        dialect_code: langInfo.dialect ? langInfo.dialect.tag : null,
        geo_code: langInfo.region ? langInfo.region.tag : null,
        phraselike_string: inputVal.trim(),
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
        label={tr('Input New Phrase')}
      />
      <ConfirmButtons onCancel={handleCancel} onSave={handleSave} />
    </Container>
  );
}
