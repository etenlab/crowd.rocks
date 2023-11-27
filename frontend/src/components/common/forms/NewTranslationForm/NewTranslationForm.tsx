import { useState, useCallback } from 'react';
import { Stack, Typography, Button, CircularProgress } from '@mui/material';
import { useIonToast } from '@ionic/react';
import { TextForm } from '../TextForm';
import { useTr } from '../../../../hooks/useTr';
import { CheckCircle } from '../../icons/CheckCircle';

export type NewTranslationForm = {
  onSave: ({
    translation,
    description,
  }: {
    translation: string;
    description: string;
  }) => void;
  onCancel: () => void;
};

export function NewTranslationForm({ onCancel, onSave }: NewTranslationForm) {
  const { tr } = useTr();
  const [present] = useIonToast();

  const [translation, setTranslation] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [saving, setSaving] = useState<boolean>(false);
  const handleNewTranslation = useCallback(async () => {
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

    setSaving(true);

    await onSave({
      translation,
      description,
    });

    setTranslation('');
    setDescription('');

    setSaving(false);
  }, [description, onSave, present, tr, translation]);

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

        <TextForm
          text={translation}
          description={description}
          textPlaceholder={tr('Your translation')}
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
