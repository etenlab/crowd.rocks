import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router';
import { useIonRouter } from '@ionic/react';

import { Stack, Typography, Button } from '@mui/material';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { InfoFill } from '../../common/icons/InfoFill';
import { AddCircle } from '../../common/icons/AddCircle';
import { WordItem } from '../../common/WordItem';
import { MapWordOrPhraseTranslationList } from '../MapWordOrPhraseTranslation/MapWordOrPhraseTranslantionList';

export function MapNewTranslationConfirm() {
  const { tr } = useTr();
  const router = useIonRouter();
  const {
    nation_id,
    language_id,
    definition_id,
    type: definition_type,
  } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
    definition_id: string;
    type: string;
  }>();

  const {
    states: {
      global: {
        maps: { tempTranslations },
      },
    },
    actions: { clearTempTranslation },
  } = useAppContext();

  const goToTranslation = useCallback(() => {
    clearTempTranslation(`${definition_id}:${definition_type}`);
    router.push(`/${nation_id}/${language_id}/1/maps/translation`);
  }, [
    language_id,
    nation_id,
    router,
    clearTempTranslation,
    definition_id,
    definition_type,
  ]);

  useEffect(() => {
    if (!tempTranslations[`${definition_id}:${definition_type}`]) {
      goToTranslation();
    }
  }, [tempTranslations, definition_id, definition_type, goToTranslation]);

  const handleUpsertTranslation = () => {
    goToTranslation();
  };

  return (
    <>
      <Stack gap="8px">
        <Stack direction="row" gap="8px" alignItems="center">
          <InfoFill color="orange" />
          <Typography variant="h3">
            {tr('Your translation already exists!')}
          </Typography>
        </Stack>

        <Typography variant="body1" color="text.gray">
          {tr(
            'Compare translations below. Are you sure you want to duplicate the translation? ',
          )}
        </Typography>
      </Stack>

      <WordItem
        word="Asia"
        description="A geographical place phrase"
        viewData={tempTranslations[`${definition_id}:${definition_type}`]}
        onConfirm={() => {}}
        onDetail={() => {}}
      />

      <Typography variant="h3">{tr('Similar translation')}</Typography>

      <MapWordOrPhraseTranslationList
        definition_id={definition_id}
        definition_type={definition_type}
      />

      <Stack gap="16px">
        <Button
          variant="contained"
          color="green"
          startIcon={<AddCircle sx={{ fontSize: 24 }} />}
          onClick={handleUpsertTranslation}
        >
          {tr('Yes, add my translation')}
        </Button>
        <Button
          variant="contained"
          color="gray_stroke"
          onClick={goToTranslation}
        >
          {tr('Cancel')}
        </Button>
      </Stack>
    </>
  );
}
