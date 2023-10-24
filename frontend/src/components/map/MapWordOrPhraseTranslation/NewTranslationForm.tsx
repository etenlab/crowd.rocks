import { useState, useEffect } from 'react';
import { Stack, Typography, Button } from '@mui/material';
import { useIonToast } from '@ionic/react';

import { typeOfString, StringContentTypes } from '../../../common/utility';

import { WordForm } from '../../common/forms/WordForm';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { ErrorType } from '../../../generated/graphql';
import { useUpsertTranslationFromWordAndDefinitionlikeStringMutation } from '../../../hooks/useUpsertTranslationFromWordAndDefinitionlikeStringMutation';
import { CheckCircle } from '../../common/icons/CheckCircle';

export type NewTranslationForm = {
  definition_id: string;
  definition_type: string;
  onCancel(): void;
};

export function NewTranslationForm({
  onCancel,
  definition_id,
  definition_type,
}: NewTranslationForm) {
  const { tr } = useTr();
  const [present] = useIonToast();
  const {
    states: {
      global: {
        langauges: { targetLang },
        maps: { updatedTrDefinitionIds },
      },
    },
    actions: { setUpdatedTrDefinitionIds },
  } = useAppContext();

  const [translation, setTranslation] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [upsertTranslation, { data: upsertData, loading: upsertLoading }] =
    useUpsertTranslationFromWordAndDefinitionlikeStringMutation();

  useEffect(() => {
    if (upsertLoading) return;
    if (
      upsertData &&
      upsertData?.upsertTranslationFromWordAndDefinitionlikeString.error !==
        ErrorType.NoError
    ) {
      present({
        message:
          upsertData?.upsertTranslationFromWordAndDefinitionlikeString.error,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
    }
  }, [present, upsertData, upsertLoading]);

  const handleNewTranslation = () => {
    if (translation.trim() === '') {
      present({
        message: `${tr('New translation value is mandatory')}`,
        duration: 1500,
        position: 'top',
        color: 'warning',
      });
      return;
    }

    if (description.trim() === '') {
      present({
        message: `${tr('Translated value of definition is mandatory')}`,
        duration: 1500,
        position: 'top',
        color: 'warning',
      });
      return;
    }

    if (!targetLang?.lang) {
      present({
        message: `${tr('Target language must be selected')}`,
        duration: 1500,
        position: 'top',
        color: 'warning',
      });
      return;
    }

    upsertTranslation({
      variables: {
        language_code: targetLang?.lang.tag,
        dialect_code: targetLang?.dialect?.tag,
        geo_code: targetLang?.region?.tag,
        word_or_phrase: translation,
        definition: description,
        from_definition_id: definition_id,
        from_definition_type_is_word:
          definition_type === StringContentTypes.WORD,
        is_type_word: typeOfString(translation) === StringContentTypes.WORD,
      },
    });

    setUpdatedTrDefinitionIds([...updatedTrDefinitionIds, definition_id]);

    setTranslation('');
    setDescription('');
  };

  const handleChangeWordForm = (word: string, description: string) => {
    setTranslation(word);
    setDescription(description);
  };

  return (
    <Stack gap="20px">
      <Stack gap="10px">
        <Typography variant="body2" color="text.gray">
          {tr('Add your translation')}
        </Typography>

        <WordForm
          word={translation}
          description={description}
          wordPlaceholder={tr('Your translation')}
          descriptionPlaceholder={tr('Description')}
          onChange={handleChangeWordForm}
        />
      </Stack>
      {translation.trim() === '' || description.trim() === '' ? (
        <Button variant="contained" color="gray_stroke" onClick={onCancel}>
          {tr('Cancel')}
        </Button>
      ) : (
        <Stack
          gap="24px"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            fullWidth
            variant="contained"
            color="gray_stroke"
            onClick={onCancel}
          >
            {tr('Cancel')}
          </Button>
          <Button
            variant="contained"
            color="green"
            startIcon={<CheckCircle sx={{ fontSize: 24 }} />}
            onClick={handleNewTranslation}
            disabled={translation.trim() === '' || description.trim() === ''}
            fullWidth
          >
            {tr('Save')}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
