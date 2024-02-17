import { useRef, useEffect } from 'react';
import { useIonToast } from '@ionic/react';

import { Textarea } from '../../common/styled';
import { Container } from './styled';

import { usePhraseDefinitionUpsertMutation } from '../../../hooks/usePhraseDefinitionUpsertMutation';
import { ErrorType } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';

import { ConfirmButtons } from '../../common/ConfirmButtons';

type NewPhraseDefinitionFormProps = {
  phrase_id: string;
  onCreated(): void;
  onCancel(): void;
};

export function NewPhraseDefinitionForm({
  phrase_id,
  onCreated,
  onCancel,
}: NewPhraseDefinitionFormProps) {
  const { tr } = useTr();

  const [present] = useIonToast();

  const textarea = useRef<HTMLIonTextareaElement>(null);

  const [upsertPhraseDefinition, { data, loading, error, called }] =
    usePhraseDefinitionUpsertMutation();

  useEffect(() => {
    if (error) {
      return;
    }

    if (loading || !called) {
      return;
    }

    if (data) {
      if (data.phraseDefinitionUpsert.error !== ErrorType.NoError) {
        return;
      }

      onCreated();
    }
  }, [data, error, loading, called, present, tr, onCreated]);

  const handleSave = () => {
    const textareaEl = textarea.current;
    if (!textareaEl) {
      present({
        message: tr('Input or Textarea not exists!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    const textareaVal = (textareaEl.value + '').trim();

    if (textareaVal.length === 0) {
      present({
        message: tr('Word Definition cannot be empty string!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    upsertPhraseDefinition({
      variables: {
        phrase_id: phrase_id + '',
        definition: textareaVal.trim(),
      },
    });
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Container>
      <Textarea
        ref={textarea}
        labelPlacement="floating"
        fill="solid"
        label={tr('Input New Phrase Definition')}
      />
      <ConfirmButtons onCancel={handleCancel} onSave={handleSave} />
    </Container>
  );
}
