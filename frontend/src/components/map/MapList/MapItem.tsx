import { useRef, MouseEventHandler } from 'react';
import { useHistory } from 'react-router';
import { Typography, IconButton, Button, Divider, Stack } from '@mui/material';

import {
  MapDetailsInfo,
  useGetMapDetailsLazyQuery,
} from '../../../generated/graphql';

import { langInfo2String, subTags2LangInfo } from '../../../../../utils';
import { downloadFromUrl } from '../../../common/utility';
import { DownloadCircle } from '../../common/icons/DownloadCircle';
import { DeleteCircle } from '../../common/icons/DeleteCircle';
import { Checkbox } from '../../common/buttons/Checkbox';
import { Tag } from '../../common/chips/Tag';
import { MoreHorizButton } from '../../common/buttons/MoreHorizButton';

import { globals } from '../../../services/globals';

import { useAppContext } from '../../../hooks/useAppContext';
import { useTr } from '../../../hooks/useTr';

import { PreviewContainer } from './styled';
import { MapDeleteModal } from './MapDeleteModal';

export type ViewMode = 'normal' | 'selection';

export type MapItemProps = {
  mapInfo: MapDetailsInfo;
  onChangeViewMode(mode: ViewMode): void;
  viewMode: ViewMode;
  checked: boolean;
  onChangeCheck(checked: boolean): void;
};

export function MapItem({
  mapInfo,
  viewMode,
  checked,
  onChangeCheck,
}: MapItemProps) {
  const { tr } = useTr();
  const history = useHistory();
  const {
    states: {
      global: {
        langauges: { appLanguage },
      },
    },
    actions: { createModal },
  } = useAppContext();
  const { openModal, closeModal } = createModal();

  const downloadFlagRef = useRef<'original' | 'translated' | null>(null);
  const singleClickTimerRef = useRef<NodeJS.Timeout>();
  const clickCountRef = useRef<number>(0);

  const [getMapDetails, mapContent] = useGetMapDetailsLazyQuery();

  const langInfo = subTags2LangInfo({
    lang: mapInfo.language.language_code,
    dialect: mapInfo.language.dialect_code || undefined,
    region: mapInfo.language.geo_code || undefined,
  });

  const handleGoToSelectedMap: MouseEventHandler<HTMLDivElement> = (e) => {
    clickCountRef.current++;
    if (clickCountRef.current === 1) {
      singleClickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;

        e.stopPropagation();

        history.push(
          `/US/${appLanguage.lang.tag}/1/maps/details/${
            mapInfo.is_original
              ? mapInfo.original_map_id
              : mapInfo.translated_map_id
          }?is_original=${!!mapInfo.is_original}`,
        );
      }, 400);
    } else if (clickCountRef.current === 2) {
      clearTimeout(singleClickTimerRef.current);
      clickCountRef.current = 0;
    }
  };

  const handleDownloadSvg: MouseEventHandler<HTMLButtonElement> = (e) => {
    downloadFlagRef.current = mapInfo.is_original ? 'original' : 'translated';
    getMapDetails({
      variables: {
        is_original: mapInfo.is_original,
        map_id: mapInfo.is_original
          ? mapInfo.original_map_id!
          : mapInfo.translated_map_id!,
      },
    });

    e.preventDefault();
    e.stopPropagation();
  };

  const handleDeleteMap: MouseEventHandler<HTMLButtonElement> = (e) => {
    openModal(<MapDeleteModal mapInfo={mapInfo} onClose={closeModal} />);

    e.preventDefault();
    e.stopPropagation();
  };

  if (
    mapContent.data &&
    !mapContent.error &&
    !mapContent.loading &&
    downloadFlagRef.current === 'original' &&
    mapContent.data.getMapDetails.mapDetails
  ) {
    downloadFromUrl(
      mapContent.data.getMapDetails.mapDetails.map_file_name,
      mapContent.data.getMapDetails.mapDetails.content_file_url,
    );
    downloadFlagRef.current = null;
  }

  if (
    mapContent.data &&
    !mapContent.error &&
    !mapContent.loading &&
    downloadFlagRef.current === 'translated' &&
    mapContent.data.getMapDetails.mapDetails
  ) {
    downloadFromUrl(
      mapContent.data.getMapDetails.mapDetails.map_file_name_with_langs,
      mapContent.data.getMapDetails.mapDetails.content_file_url,
    );
    downloadFlagRef.current = null;
  }

  const adminMode = globals.is_admin_user();

  const tagLabel = mapInfo.is_original
    ? tr('Original')
    : langInfo2String(langInfo) +
      (mapInfo.translated_percent
        ? ' ' + mapInfo.translated_percent + '%'
        : ' ? %');
  const tagColor = mapInfo.is_original ? 'orange' : 'green';

  return (
    <Stack gap="14px" sx={{ width: '162px', cursor: 'pointer' }}>
      <PreviewContainer
        onClick={handleGoToSelectedMap}
        onDoubleClick={(e) => {
          console.log(e);
        }}
        sx={{
          borderColor: (theme) =>
            checked && viewMode === 'selection'
              ? theme.palette.text.blue
              : theme.palette.text.gray_stroke,
        }}
      >
        <img
          src={mapInfo.preview_file_url || ''}
          width="165px"
          height="165px"
        />

        {viewMode === 'normal' ? (
          <MoreHorizButton
            component={
              <>
                <Button
                  variant="text"
                  startIcon={<DownloadCircle sx={{ fontSize: '24px' }} />}
                  color="dark"
                  sx={{ padding: 0, justifyContent: 'flex-start' }}
                  onClick={handleDownloadSvg}
                >
                  {tr('Download')}
                </Button>
                {adminMode ? (
                  <>
                    <Divider />
                    <Button
                      variant="text"
                      startIcon={
                        <DeleteCircle sx={{ fontSize: '24px' }} color="red" />
                      }
                      color="red"
                      onClick={handleDeleteMap}
                      sx={{ padding: 0, justifyContent: 'flex-start' }}
                    >
                      {tr('Delete')}
                    </Button>
                  </>
                ) : null}
              </>
            }
            color="gray"
            sx={(theme) => ({
              position: 'absolute',
              top: '6px',
              right: '6px',
              padding: '4px',
              background: theme.palette.text.white,
              '&:hover': {
                background: theme.palette.background.gray_stroke,
              },
              border: `1.5px solid ${theme.palette.text.gray_stroke}`,
            })}
          />
        ) : (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
            }}
            sx={{ position: 'absolute', top: '3px', right: '3px' }}
          >
            <Checkbox
              checked={checked}
              onChange={(e) => {
                onChangeCheck(e.target.checked);
                e.preventDefault();
                e.stopPropagation();
              }}
            />
          </IconButton>
        )}

        <Tag
          label={tagLabel}
          color={tagColor}
          sx={{ position: 'absolute', bottom: '8px', left: '8px' }}
        />
      </PreviewContainer>

      <Typography variant="body3">
        {mapInfo.is_original
          ? mapInfo.map_file_name.replace('.cf.svg', '')
          : mapInfo.map_file_name_with_langs.replace('.cf.svg', '')}
      </Typography>
    </Stack>
  );
}
