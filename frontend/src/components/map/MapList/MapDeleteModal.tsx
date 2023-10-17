import { useEffect } from 'react';
import { useIonToast } from '@ionic/react';

import {
  Stack,
  Typography,
  Divider,
  Button,
  LinearProgress,
} from '@mui/material';

import { useTr } from '../../../hooks/useTr';
import { DeleteCircle } from '../../common/icons/DeleteCircle';
import { Check } from '../../common/icons/Check';
import { FilledCheckCircle } from '../../common/icons/FilledCheckCircle';

import {
  ErrorType,
  MapDetailsInfo,
  useMapDeleteMutation,
} from '../../../generated/graphql';

export type MapDeleteModalProps = {
  mapInfo: MapDetailsInfo;
  onClose(): void;
};

export function MapDeleteModal({ mapInfo, onClose }: MapDeleteModalProps) {
  const { tr } = useTr();
  const [present] = useIonToast();

  const [mapDelete, { loading, data }] = useMapDeleteMutation();

  useEffect(() => {
    if (loading) return;
    if (data && data.mapDelete.error !== ErrorType.NoError) {
      present({
        message: data.mapDelete.error,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
    }
  }, [data, loading, present]);

  const deleteMap = () => {
    const mapId = mapInfo.is_original
      ? mapInfo.original_map_id
      : mapInfo.translated_map_id;
    if (!mapId) {
      console.error(
        `Error: original_map_id or translated_map_id isn't specified`,
      );
      return;
    }
    mapDelete({
      variables: {
        mapId,
        is_original: mapInfo.is_original,
      },
      refetchQueries: ['GetAllMapsList'],
    });
  };

  let title = mapInfo.is_original
    ? `${tr('You are about to delete original map ')} ${mapInfo.map_file_name}`
    : `${tr(`You are about to delete translated map`)} ${
        mapInfo.map_file_name_with_langs
      }`;
  let content = mapInfo.is_original
    ? tr(`All related data (translated maps) will be also deleted permanently`)
    : tr(
        `It will be deleted after confirmation. Note that it will be re-created on any translation action performed by any user with original map.`,
      );
  let bottomCom = (
    <Stack gap="16px">
      <Button
        variant="contained"
        color="red"
        startIcon={<DeleteCircle sx={{ fontSize: 24 }} />}
        fullWidth
        onClick={deleteMap}
      >
        {tr('Yes, delete map data')}
      </Button>

      <Button variant="contained" color="gray_stroke" onClick={onClose}>
        {tr('Cancel')}
      </Button>
    </Stack>
  );

  if (loading) {
    title = tr('Deleting map');
    content = tr('Started map deleting');
    bottomCom = (
      <Stack gap="16px">
        <LinearProgress color="orange" />
        <Typography variant="body1" color="text.gray">
          {mapInfo.is_original
            ? mapInfo.map_file_name.replace('.cf.svg', '')
            : mapInfo.map_file_name_with_langs.replace('.cf.svg', '')}
        </Typography>
      </Stack>
    );
  }

  if (data && data.mapDelete.error === ErrorType.NoError) {
    title = tr('Done!');
    content = tr('Go to your maps.');
    bottomCom = (
      <Stack gap="16px">
        <Button
          variant="contained"
          color="blue"
          onClick={() => onClose}
          startIcon={<Check sx={{ fontSize: 24 }} />}
        >
          {tr('Go to Maps')}
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="24px">
      <Stack gap="18px">
        <Stack
          gap="10px"
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          {data && data.mapDelete.error === ErrorType.NoError ? (
            <FilledCheckCircle color="green" />
          ) : null}
          <Typography variant="h2">{title}</Typography>
        </Stack>
        <Divider />
        <Typography variant="body1" color="text.gray">
          {content}
        </Typography>
      </Stack>
      {bottomCom}
    </Stack>
  );
}
