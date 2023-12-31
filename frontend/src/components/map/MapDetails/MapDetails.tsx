import {
  useEffect,
  useMemo,
  useState,
  MouseEventHandler,
  useCallback,
} from 'react';
import { useLocation, useParams, useHistory } from 'react-router';
import { useIonToast } from '@ionic/react';
import {
  Button,
  Divider,
  Stack,
  Typography,
  Skeleton,
  Box,
} from '@mui/material';

import { downloadFromUrl } from '../../../common/utility';
import { Caption } from '../../common/Caption/Caption';
import { Tag } from '../../common/chips/Tag';
import { FlagV2 } from '../../flags/Flag';
import { MoreHorizButton } from '../../common/buttons/MoreHorizButton';
import { DiscussionIconButton } from '../../Discussion/DiscussionButton';
import { VoteButtonsHorizontal } from '../../common/VoteButtonsHorizontal';
import { DownloadCircle } from '../../common/icons/DownloadCircle';

import {
  ErrorType,
  TableNameType,
  useForceMarkAndRetranslateOriginalMapsIdsMutation,
  useGetMapDetailsQuery,
  useGetMapVoteStatusQuery,
} from '../../../generated/graphql';

import { langInfo2String, subTags2LangInfo } from '../../../../../utils';

import { useTr } from '../../../hooks/useTr';
import { useToggleMapVoteStatusMutation } from '../../../hooks/useToggleMapVoteStatusMutation';

import { MAPS_FLAGS, authorizedForAnyFlag } from '../../flags/flagGroups';
import { globals } from '../../../services/globals';

export function MapDetails() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const { search } = useLocation();
  const history = useHistory();
  const { id, nation_id, language_id } = useParams<{
    id: string;
    nation_id: string;
    language_id: string;
  }>();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isOriginal = useMemo(() => {
    return new URLSearchParams(search).get('is_original') === 'true';
  }, [search]);

  const currentMapWithContent = useGetMapDetailsQuery({
    variables: { map_id: id, is_original: isOriginal },
    fetchPolicy: 'no-cache',
  });

  const currentMapVoteStatus = useGetMapVoteStatusQuery({
    variables: { map_id: id, is_original: isOriginal },
  });

  const [toggleMapVoteStatus] = useToggleMapVoteStatusMutation();

  const [forceMarkAndRetranslateOriginalMapsIdsMutation] =
    useForceMarkAndRetranslateOriginalMapsIdsMutation();

  const currMapContent = currentMapWithContent?.data?.getMapDetails;

  useEffect(() => {
    if (currMapContent?.error && currMapContent?.error !== ErrorType.NoError) {
      present({
        message: currMapContent.error,
        position: 'top',
        color: 'danger',
        duration: 2000,
      });
    }
  }, [currMapContent?.error, present]);

  const langInfo = useMemo(() => {
    if (!currMapContent?.mapDetails?.language.language_code) {
      return undefined;
    }
    return currentMapWithContent
      ? subTags2LangInfo({
          lang: currMapContent.mapDetails.language.language_code,
          dialect: currMapContent.mapDetails.language.dialect_code || undefined,
          region: currMapContent.mapDetails.language.geo_code || undefined,
        })
      : undefined;
  }, [
    currMapContent?.mapDetails?.language.dialect_code,
    currMapContent?.mapDetails?.language.geo_code,
    currMapContent?.mapDetails?.language.language_code,
    currentMapWithContent,
  ]);

  const handleDownloadSvg: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (currMapContent && currMapContent.mapDetails) {
      if (isOriginal) {
        downloadFromUrl(
          currMapContent.mapDetails.map_file_name,
          currMapContent.mapDetails.content_file_url,
        );
      } else {
        downloadFromUrl(
          currMapContent.mapDetails.map_file_name_with_langs,
          currMapContent.mapDetails.content_file_url,
        );
      }
    }

    e.preventDefault();
    e.stopPropagation();
  };

  const handleImageLoad = () => {
    setTimeout(() => {
      setImageLoaded(true);
    }, 100);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleGoToView = () => {
    history.push(
      `/${nation_id}/${language_id}/1/maps/detail_view/${id}?is_original=${!!isOriginal}`,
    );
  };

  const handleGoToTranslation = () => {
    if (currMapContent?.mapDetails?.original_map_id) {
      history.push(
        `/${nation_id}/${language_id}/1/maps/translation/${currMapContent?.mapDetails?.original_map_id}`,
      );
    } else {
      history.push(`/${nation_id}/${language_id}/1/maps/translation/all`);
    }
  };

  const handleRetrnanslateClick = useCallback(
    (originalMapId: string) => {
      present({
        message: tr(
          `Original map id ${originalMapId} is marked for retranslation to all known languages`,
        ),
        position: 'top',
        color: 'success',
        duration: 2000,
      });
      forceMarkAndRetranslateOriginalMapsIdsMutation({
        variables: {
          originalMapsIds: [originalMapId],
        },
      });
    },
    [forceMarkAndRetranslateOriginalMapsIdsMutation, present, tr],
  );

  const tagLabel = currMapContent?.mapDetails?.is_original
    ? tr('Original')
    : langInfo2String(langInfo) +
      (currMapContent?.mapDetails?.translated_percent
        ? ' ' + currMapContent?.mapDetails?.translated_percent + '%'
        : ' ? %');
  const tagColor = currMapContent?.mapDetails?.is_original ? 'orange' : 'green';

  const loadingOrError =
    !!currentMapWithContent.error ||
    !!currentMapWithContent.loading ||
    !currentMapWithContent.data;

  const dropDownList = [
    {
      key: 'flag_button',
      component: authorizedForAnyFlag(MAPS_FLAGS) ? (
        <FlagV2
          parent_table={
            isOriginal
              ? TableNameType.OriginalMaps
              : TableNameType.TranslatedMaps
          }
          parent_id={id}
          flag_names={MAPS_FLAGS}
        />
      ) : null,
    },
    {
      key: 'download_button',
      component: (
        <Button
          variant="text"
          startIcon={<DownloadCircle sx={{ fontSize: '24px' }} />}
          color="dark"
          sx={{ padding: 0, justifyContent: 'flex-start' }}
          onClick={handleDownloadSvg}
          disabled={loadingOrError}
        >
          {tr('Download')}
        </Button>
      ),
    },
  ].filter((item) => item.component !== null);

  return (
    <>
      <Caption>{tr('Map Details')}</Caption>

      <Stack gap="14px">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Tag label={tagLabel} color={tagColor} />

          <MoreHorizButton dropDownList={dropDownList} />
        </Stack>

        <Typography variant="h5">
          {currMapContent?.mapDetails?.map_file_name_with_langs}
        </Typography>

        <Divider />

        <Button
          variant="contained"
          color="blue"
          onClick={handleGoToTranslation}
        >
          {tr('Translate This Map')}
        </Button>
      </Stack>

      <Stack
        gap="16px"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <VoteButtonsHorizontal
          downVotes={
            currentMapVoteStatus.data?.getMapVoteStatus.vote_status
              ?.downvotes || 0
          }
          upVotes={
            currentMapVoteStatus.data?.getMapVoteStatus.vote_status?.upvotes ||
            0
          }
          onVoteUpClick={() => {
            toggleMapVoteStatus({
              variables: {
                map_id: id,
                is_original: isOriginal,
                vote: true,
              },
            });
          }}
          onVoteDownClick={() => {
            toggleMapVoteStatus({
              variables: {
                map_id: id,
                is_original: isOriginal,
                vote: false,
              },
            });
          }}
        />

        {globals.is_admin_user() && isOriginal && (
          <Button
            variant="outlined"
            onClick={() => handleRetrnanslateClick(id)}
            sx={{
              padding: `5px`,
              minWidth: '34px',
              maxWidth: '160px',
              borderRadius: '6px',
              fontSize: '13px',
              gap: '4px',
              // ...flexObj,
            }}
            color="blue"
          >
            {tr('Force Retranslation')}
          </Button>
        )}

        <DiscussionIconButton
          parent_table={
            isOriginal
              ? TableNameType.OriginalMaps
              : TableNameType.TranslatedMaps
          }
          parent_id={id}
          flex="1"
        />
      </Stack>

      {!imageLoaded && !imageError ? (
        <Skeleton
          variant="rounded"
          width="calc(100vw - 30px)"
          height="500px"
          animation="wave"
          sx={{
            marginTop: '15px',
            borderRadius: '10px',
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: 'calc(777px - 60px)',
          }}
        />
      ) : null}

      <Box
        sx={(theme) => ({
          border: `1px solid ${
            !imageLoaded && !imageError
              ? 'none'
              : theme.palette.text.gray_stroke
          }`,
          borderRadius: '10px',
          display: !imageLoaded && !imageError ? 'hidden' : 'inherit',
        })}
        onClick={handleGoToView}
      >
        {currMapContent?.mapDetails && (
          <>
            {imageError && <p>{tr('Error loading image')}</p>}

            <img
              style={{
                userSelect: 'none',
                width: 'calc(100vw - 60px)',
                maxWidth: 'calc(777px - 60px)',
                minHeight: '300px',
              }}
              src={currMapContent?.mapDetails?.content_file_url}
              alt="Translated map"
              placeholder="asdf"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        )}
      </Box>
    </>
  );
}
