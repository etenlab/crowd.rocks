import { useRef, useEffect } from 'react';
import { useIonToast } from '@ionic/react';

import { Textarea } from '../../common/styled';
import { Container } from './styled';

import { ErrorType } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';

import { ConfirmButtons } from '../../common/ConfirmButtons';
import { useForumUpsertMutation } from '../../../hooks/useForumUpsertMutation';

type NewForumFormProps = {
  onCreated(): void;
  onCancel(): void;
};

export function NewForumForm({ onCreated, onCancel }: NewForumFormProps) {
  const { tr } = useTr();

  const [present] = useIonToast();

  const textarea = useRef<HTMLIonTextareaElement>(null);

  const [upsertForum, { data, loading, error, called }] =
    useForumUpsertMutation();

  useEffect(() => {
    if (error) {
      return;
    }

    if (loading || !called) {
      return;
    }

    if (data) {
      if (data.forumUpsert.error !== ErrorType.NoError) {
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
        message: tr('Forum name cannot be empty string!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    upsertForum({
      variables: {
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
        label={tr('Input New Forum Name')}
      />
      <ConfirmButtons onCancel={handleCancel} onSave={handleSave} />
    </Container>
  );
}
