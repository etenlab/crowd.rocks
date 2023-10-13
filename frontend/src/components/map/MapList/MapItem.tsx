import { useRef, useState, MouseEvent, MouseEventHandler } from 'react';
import { useHistory } from 'react-router';
import {
  Typography,
  Popover,
  IconButton,
  Button,
  Divider,
  Stack,
} from '@mui/material';

import {
  MapDetailsInfo,
  useGetMapDetailsLazyQuery,
} from '../../../generated/graphql';

import { langInfo2String, subTags2LangInfo } from '../../../common/langUtils';
import { downloadFromUrl } from '../../../common/utility';
import { MoreHoriz } from '../../common/icons/MoreHoriz';
import { DownloadCircle } from '../../common/icons/DownloadCircle';
import { DeleteCircle } from '../../common/icons/DeleteCircle';
import { Checkbox } from '../../common/buttons/Checkbox';
import { Tag } from '../../common/chips/Tag';

import { globals } from '../../../services/globals';

import { useAppContext } from '../../../hooks/useAppContext';
import { useTr } from '../../../hooks/useTr';

import { PreviewContainer } from './styled';
import { MapDeleteModal } from './MapDeleteModal';
import { MoreVert } from '../../common/icons/MoreVert';

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
    actions: { setModal },
  } = useAppContext();

  const downloadFlagRef = useRef<'original' | 'translated' | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
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
    setModal(<MapDeleteModal mapInfo={mapInfo} />);

    e.preventDefault();
    e.stopPropagation();
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);

    event.preventDefault();
    event.stopPropagation();
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  const open = Boolean(anchorEl);
  const adminMode = globals.is_admin_user();

  const tagLabel = mapInfo.is_original
    ? tr('Original')
    : langInfo2String(langInfo) +
      (mapInfo.translated_percent
        ? ' ' + mapInfo.translated_percent + '%'
        : ' ? %');
  const tagColor = mapInfo.is_original ? 'orange' : 'green';

  return (
    <Stack gap="14px" sx={{ width: '162px' }}>
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
          <IconButton
            onClick={handleClick}
            color="gray"
            sx={(theme) => ({
              position: 'absolute',
              top: '6px',
              right: '6px',
              padding: '4px',
              background: theme.palette.text.white,
              border: `1.5px solid ${theme.palette.text.gray_stroke}`,
            })}
          >
            <MoreHoriz sx={{ fontSize: 24 }} />
          </IconButton>
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

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={(theme) => ({
          '& .MuiPopover-paper': {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '19px 15px',
            border: `1.5px solid ${theme.palette.text.gray_stroke}`,
            borderRadius: '8px',
            width: '150px',
          },
        })}
      >
        <IconButton
          sx={{ position: 'absolute', top: 0, right: 0 }}
          color="gray"
        >
          <MoreVert
            sx={{
              fontSize: 24,
            }}
            color="gray"
          />
        </IconButton>
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
              startIcon={<DeleteCircle sx={{ fontSize: '24px' }} color="red" />}
              color="red"
              onClick={handleDeleteMap}
              sx={{ padding: 0, justifyContent: 'flex-start' }}
            >
              {tr('Delete')}
            </Button>
          </>
        ) : null}
      </Popover>

      <Typography variant="body3">
        {mapInfo.is_original
          ? mapInfo.map_file_name.replace('.cf.svg', '')
          : mapInfo.map_file_name_with_langs.replace('.cf.svg', '')}
      </Typography>
    </Stack>
  );
}
