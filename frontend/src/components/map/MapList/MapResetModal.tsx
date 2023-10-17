import { useEffect } from 'react';
import { useIonToast } from '@ionic/react';

import { Stack, Typography, Divider, Button } from '@mui/material';

import { useTr } from '../../../hooks/useTr';
import { DeleteCircle } from '../../common/icons/DeleteCircle';

import {
  ErrorType,
  useMapsTranslationsResetMutation,
} from '../../../generated/graphql';

type MapResetModalProps = {
  onClose(): void;
};
export function MapResetModal({ onClose }: MapResetModalProps) {
  const { tr } = useTr();
  const [present] = useIonToast();

  const [
    mapTranslationReset,
    {
      loading: loadingMapReset,
      data: dataMapReset,
      called: dataMapResetCalled,
    },
  ] = useMapsTranslationsResetMutation();

  useEffect(() => {
    if (!dataMapResetCalled || loadingMapReset) return;
    if (dataMapReset?.mapsTranslationsReset.error === ErrorType.NoError) {
      present({
        message: `Maps translations data reset completed`,
        duration: 1500,
        position: 'top',
        color: 'primary',
      });
    } else {
      present({
        message: `Maps translations data reset error: ${dataMapReset?.mapsTranslationsReset.error}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataMapReset, dataMapReset?.mapsTranslationsReset.error, present]);

  const resetTranslatedMaps = () => {
    mapTranslationReset();
    onClose();
  };

  return (
    <Stack gap="24px">
      <Stack gap="18px">
        <Typography variant="h2">
          {tr('Do you want to reset map data?')}
        </Typography>
        <Divider />
        <Typography variant="body1" color="text.gray">
          {'You are about to reset map translation data. All '}
          <span style={{ color: '#476FFF' }}>original_map_words</span>
          {' and '}
          <span style={{ color: '#476FFF' }}>translated_maps</span>
          {
            ' will be deleted and then they will be recreated by reprocessing every original map, like each one of them was uploaded again.'
          }
        </Typography>
      </Stack>
      <Stack gap="16px">
        <Button
          variant="contained"
          color="red"
          startIcon={<DeleteCircle sx={{ fontSize: 24 }} />}
          fullWidth
          onClick={resetTranslatedMaps}
        >
          {tr('Yes, reset map data')}
        </Button>

        <Button
          variant="contained"
          color="gray_stroke"
          onClick={() => onClose()}
        >
          {tr('Cancel')}
        </Button>
      </Stack>
    </Stack>
  );
}
