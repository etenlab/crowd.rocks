import { useRef, useEffect } from 'react';
import { useIonToast } from '@ionic/react';

import { Textarea } from '../../common/styled';
import { Container } from './styled';

import { ErrorType } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';

import { ConfirmButtons } from '../../common/ConfirmButtons';
import { useThreadCreateMutation } from '../../../hooks/useThreadUpsertMutation';

type NewForumFormProps = {
  onCreated(): void;
  onCancel(): void;
  folder_id: string;
};

export function NewThreadForm({
  onCreated,
  onCancel,
  folder_id,
}: NewForumFormProps) {
  const { tr } = useTr();

  const [present] = useIonToast();

  const textarea = useRef<HTMLIonTextareaElement>(null);

  const [upsertThread, { data, loading, error, called }] =
    useThreadCreateMutation(folder_id);

  useEffect(() => {
    if (error) {
      return;
    }

    if (loading || !called) {
      return;
    }

    if (data) {
      if (data.threadUpsert.error !== ErrorType.NoError) {
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
        message: tr('Thread name cannot be empty string!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    upsertThread({
      variables: {
        folder_id: folder_id,
        name: textareaVal + '',
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
        label={tr('Input New Thread Name')}
      />
      <ConfirmButtons onCancel={handleCancel} onSave={handleSave} />
    </Container>
  );
}
