import { useRef, useEffect } from 'react';
import { useIonToast } from '@ionic/react';

import { Textarea } from '../../common/styled';
import { Container } from './styled';

import { useWordDefinitionUpsertMutation } from '../../../hooks/useWordDefinitionUpsertMutation';
import { ErrorType } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';

import { ConfirmButtons } from '../../common/ConfirmButtons';

type NewWordDefinitionFormProps = {
  word_id: string;
  onCreated(): void;
  onCancel(): void;
};

export function NewWordDefinitionForm({
  word_id,
  onCreated,
  onCancel,
}: NewWordDefinitionFormProps) {
  const { tr } = useTr();

  const [present] = useIonToast();

  const textarea = useRef<HTMLIonTextareaElement>(null);

  const [upsertWordDefinition, { data, loading, error, called }] =
    useWordDefinitionUpsertMutation();

  useEffect(() => {
    if (error) {
      return;
    }

    if (loading || !called) {
      return;
    }

    if (data) {
      if (data.wordDefinitionUpsert.error !== ErrorType.NoError) {
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

    upsertWordDefinition({
      variables: {
        word_id: word_id + '',
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
        label={tr('Input New Word Definition')}
      />
      <ConfirmButtons onCancel={handleCancel} onSave={handleSave} />
    </Container>
  );
}
