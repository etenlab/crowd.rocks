import { useState, useEffect } from 'react';
import { Stack, Typography, Button, CircularProgress } from '@mui/material';
import { useIonToast } from '@ionic/react';

import { typeOfString, StringContentTypes } from '../../../common/utility';

import { WordForm } from '../../common/forms/WordForm';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

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

  const [saving, setSaving] = useState<boolean>(false);

  const [upsertTranslation] =
    useUpsertTranslationFromWordAndDefinitionlikeStringMutation();

  useEffect(() => {
    if (!saving) {
      return;
    }

    if (!targetLang) {
      setSaving(false);
      return;
    }

    (async () => {
      await upsertTranslation({
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
    })();
  }, [
    definition_id,
    definition_type,
    description,
    saving,
    setUpdatedTrDefinitionIds,
    targetLang,
    translation,
    updatedTrDefinitionIds,
    upsertTranslation,
  ]);

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

    setSaving(true);
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
          disabled={saving}
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
            disabled={saving}
          >
            {tr('Cancel')}
          </Button>
          <Button
            variant="contained"
            color="green"
            startIcon={
              saving ? (
                <CircularProgress size="18px" color="inherit" />
              ) : (
                <CheckCircle sx={{ fontSize: 24 }} />
              )
            }
            onClick={handleNewTranslation}
            disabled={
              saving || translation.trim() === '' || description.trim() === ''
            }
            fullWidth
          >
            {tr('Save')}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
