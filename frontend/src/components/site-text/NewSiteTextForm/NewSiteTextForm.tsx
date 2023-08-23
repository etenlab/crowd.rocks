import { useRef, useEffect } from 'react';
import { useIonToast } from '@ionic/react';

import { Input } from '../../common/styled';
import { Container } from './styled';

import { useSiteTextUpsertMutation } from '../../../hooks/useSiteTextUpsertMutation';
import { ErrorType } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';

import { ConfirmButtons } from '../../common/ConfirmButtons';

type NewSiteTextFormProps = {
  onCreated(): void;
  onCancel(): void;
};

export function NewSiteTextForm({ onCreated, onCancel }: NewSiteTextFormProps) {
  const { tr } = useTr();

  const [present] = useIonToast();

  const inputRef = useRef<HTMLIonInputElement>(null);

  const [siteTextUpsert, { data, loading, error, called }] =
    useSiteTextUpsertMutation();

  useEffect(() => {
    if (error) {
      return;
    }

    if (loading || !called) {
      return;
    }

    if (data) {
      if (data.siteTextUpsert.error !== ErrorType.NoError) {
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
        message: tr('Site Text cannot be empty string!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    siteTextUpsert({
      variables: {
        siteTextlike_string: inputVal,
        definitionlike_string: 'Site User Interface Text',
        language_code: 'en',
        dialect_code: null,
        geo_code: null,
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
        label={tr('Input Site Text')}
      />
      <ConfirmButtons onCancel={handleCancel} onSave={handleSave} />
    </Container>
  );
}
