import { useRef, useEffect } from 'react';
import { useIonToast } from '@ionic/react';

import { Input, Textarea } from '../../common/styled';
import { Container } from './styled';

import { useUpsertSiteTextTranslationMutation } from '../../../hooks/useUpsertSiteTextTranslationMutation';
import { ErrorType } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';

import { ConfirmButtons } from '../../common/ConfirmButtons';

type NewSiteTextDefinitionFormProps = {
  site_text_id: number;
  is_word_definition: boolean;
  langInfo: LanguageInfo;
  onCreated(): void;
  onCancel(): void;
};

export function NewSiteTextDefinitionForm({
  site_text_id,
  is_word_definition,
  langInfo,
  onCreated,
  onCancel,
}: NewSiteTextDefinitionFormProps) {
  const { tr } = useTr();

  const [present] = useIonToast();

  const input = useRef<HTMLIonInputElement>(null);
  const textarea = useRef<HTMLIonTextareaElement>(null);

  const [upsertTranslation, { data, loading, error, called }] =
    useUpsertSiteTextTranslationMutation(
      site_text_id,
      is_word_definition,
      langInfo,
    );

  useEffect(() => {
    if (error) {
      return;
    }

    if (loading || !called) {
      return;
    }

    if (data) {
      if (data.upsertSiteTextTranslation.error !== ErrorType.NoError) {
        return;
      }

      onCreated();
    }
  }, [data, error, loading, called, present, tr, onCreated]);

  const handleSave = () => {
    const inputEl = input.current;
    const textareaEl = textarea.current;

    if (!inputEl || !textareaEl) {
      alert('Input or Textarea not exists');
      return;
    }

    const inputVal = (inputEl.value + '').trim();
    const textareaVal = (textareaEl.value + '').trim();

    if (inputVal.length === 0) {
      alert('Invalid input');
      return;
    }

    upsertTranslation({
      variables: {
        site_text_id: site_text_id + '',
        is_word_definition,
        translationlike_string: inputVal,
        definitionlike_string:
          textareaVal === ''
            ? 'Site User Interface Text Translation'
            : textareaVal,
        language_code: langInfo.lang.tag,
        dialect_code: langInfo.dialect?.tag,
        geo_code: langInfo.region?.tag,
      },
    });
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Container>
      <Input
        ref={input}
        type="text"
        label={tr('Input Site Text Translation')}
        labelPlacement="floating"
        fill="outline"
      />
      <Textarea
        ref={textarea}
        labelPlacement="floating"
        fill="solid"
        label={tr('Input Definition')}
      />
      <ConfirmButtons onCancel={handleCancel} onSave={handleSave} />
    </Container>
  );
}
