import { useRef, useEffect } from 'react';
import { useIonToast } from '@ionic/react';

import { Container } from './styled';
import { Input, Textarea } from '../../common/styled';

import { ErrorType } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';

import { useUpsertWordDefinitionFromWordAndDefinitionlikeStringMutation } from '../../../hooks/useUpsertWordDefinitionFromWordAndDefinitionlikeStringMutation';
import { useUpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation } from '../../../hooks/useUpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation';

import { ConfirmButtons } from '../../common/ConfirmButtons';

interface NewWordOrPhraseWithDefinitionFormProps {
  onCreated(data: { is_word_type: boolean; definition_id: string }): void;
  onCancel(): void;
  langInfo: LanguageInfo;
}

export function NewWordOrPhraseWithDefinitionForm({
  langInfo,
  onCreated,
  onCancel,
}: NewWordOrPhraseWithDefinitionFormProps) {
  const { tr } = useTr();

  const [present] = useIonToast();

  const input = useRef<HTMLIonInputElement>(null);
  const textarea = useRef<HTMLIonTextareaElement>(null);

  const [
    upsertWordDefinition,
    {
      data: wordData,
      loading: wordLoading,
      error: wordError,
      called: wordCalled,
    },
  ] = useUpsertWordDefinitionFromWordAndDefinitionlikeStringMutation();
  const [
    upsertPhraseDefinition,
    {
      data: phraseData,
      loading: phraseLoading,
      error: phraseError,
      called: phraseCalled,
    },
  ] = useUpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation();

  useEffect(() => {
    if (wordError) {
      return;
    }

    if (wordLoading || !wordCalled) {
      return;
    }

    if (wordData) {
      if (
        wordData.upsertWordDefinitionFromWordAndDefinitionlikeString.error !==
        ErrorType.NoError
      ) {
        return;
      }

      onCreated({
        is_word_type: true,
        definition_id:
          wordData.upsertWordDefinitionFromWordAndDefinitionlikeString
            .word_definition!.word_definition_id,
      });
    }
  }, [wordData, wordError, wordLoading, wordCalled, present, tr, onCreated]);

  useEffect(() => {
    if (phraseError) {
      return;
    }

    if (phraseLoading || !phraseCalled) {
      return;
    }

    if (phraseData) {
      if (
        phraseData.upsertPhraseDefinitionFromPhraseAndDefinitionlikeString
          .error !== ErrorType.NoError
      ) {
        return;
      }

      onCreated({
        is_word_type: false,
        definition_id:
          phraseData.upsertPhraseDefinitionFromPhraseAndDefinitionlikeString
            .phrase_definition!.phrase_definition_id,
      });
    }
  }, [
    phraseData,
    phraseError,
    phraseLoading,
    phraseCalled,
    present,
    tr,
    onCreated,
  ]);

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

    if (inputVal.split(' ').length === 1) {
      upsertPhraseDefinition({
        variables: {
          phraselike_string: inputVal,
          definitionlike_string: textareaVal,
          language_code: langInfo.lang.tag,
          dialect_code: langInfo.dialect?.tag,
          geo_code: langInfo.region?.tag,
        },
      });
    } else {
      upsertWordDefinition({
        variables: {
          wordlike_string: inputVal,
          definitionlike_string: textareaVal,
          language_code: langInfo.lang.tag,
          dialect_code: langInfo.dialect?.tag,
          geo_code: langInfo.region?.tag,
        },
      });
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Container>
      <Input
        ref={input}
        type="text"
        label={tr('Input Word or Phrase!')}
        labelPlacement="floating"
        fill="outline"
      />
      <Textarea
        ref={textarea}
        labelPlacement="floating"
        fill="solid"
        label={tr('Input Definition!')}
      />
      <ConfirmButtons onCancel={handleCancel} onSave={handleSave} />
    </Container>
  );
}
