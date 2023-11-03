import { useCallback, useState } from 'react';
import { useIonToast } from '@ionic/react';
import { Stack, Typography, Button } from '@mui/material';

import { useTr } from '../../../hooks/useTr';
import { AddCircle } from '../../common/icons/AddCircle';

import { Input } from '../../common/forms/Input';

import { useSiteTextUpsertMutation } from '../../../hooks/useSiteTextUpsertMutation';

type NewSiteTextModalProps = {
  onClose(): void;
};

export function NewSiteTextModal({ onClose }: NewSiteTextModalProps) {
  const [present] = useIonToast();
  const { tr } = useTr();

  const [siteTextlikeString, setSiteTextlikeString] = useState<string>('');
  const [definitionString, setDefinitionString] = useState<string>('');

  const [siteTextUpsert] = useSiteTextUpsertMutation();

  const handleUpsert = useCallback(async () => {
    if (siteTextlikeString.trim().length === 0) {
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
        siteTextlike_string: siteTextlikeString.trim(),
        definitionlike_string:
          definitionString.trim() === ''
            ? 'Site User Interface Text'
            : definitionString.trim(),
        language_code: 'en',
        dialect_code: null,
        geo_code: null,
      },
    });

    onClose();
  }, [
    siteTextlikeString,
    siteTextUpsert,
    definitionString,
    onClose,
    present,
    tr,
  ]);

  return (
    <Stack gap="24px">
      <Typography variant="h2">{tr('Add new site text')}</Typography>

      <Stack gap="16px">
        <Input
          placeholder={tr('Site text')}
          value={siteTextlikeString}
          onChange={setSiteTextlikeString}
        />
        <Input
          placeholder={tr('Description...(optional)')}
          value={definitionString}
          onChange={setDefinitionString}
          multiline
          rows={4}
        />
      </Stack>

      <Stack gap="16px">
        <Button
          variant="contained"
          color="blue"
          startIcon={<AddCircle sx={{ fontSize: 24 }} />}
          fullWidth
          onClick={handleUpsert}
        >
          {tr('Create New')}
        </Button>

        <Button variant="contained" color="gray_stroke" onClick={onClose}>
          {tr('Cancel')}
        </Button>
      </Stack>
    </Stack>
  );
}
