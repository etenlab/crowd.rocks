import { useEffect, useMemo, useState } from 'react';
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

import { Caption } from '../../common/Caption/Caption';
import { Tag } from '../../common/chips/Tag';
import { FlagV2 } from '../../flags/Flag';
import { DiscussionButton } from '../../Discussion/DiscussionButton';
import { VoteButtonsHorizontal } from '../../common/VoteButtonsHorizontal';

import {
  ErrorType,
  TableNameType,
  useGetMapDetailsQuery,
  useGetMapVoteStatusQuery,
} from '../../../generated/graphql';

import { langInfo2String, subTags2LangInfo } from '../../../../../utils';

import { useTr } from '../../../hooks/useTr';
import { useToggleMapVoteStatusMutation } from '../../../hooks/useToggleMapVoteStatusMutation';

import { MAPS_FLAGS } from '../../flags/flagGroups';

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

  const tagLabel = currMapContent?.mapDetails?.is_original
    ? tr('Original')
    : langInfo2String(langInfo) +
      (currMapContent?.mapDetails?.translated_percent
        ? ' ' + currMapContent?.mapDetails?.translated_percent + '%'
        : ' ? %');
  const tagColor = currMapContent?.mapDetails?.is_original ? 'orange' : 'green';

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
          <FlagV2
            parent_table={
              isOriginal
                ? TableNameType.OriginalMaps
                : TableNameType.TranslatedMaps
            }
            parent_id={id}
            flag_names={MAPS_FLAGS}
          />
        </Stack>

        <Typography variant="h5">
          {currMapContent?.mapDetails?.map_file_name_with_langs}
        </Typography>

        <Divider />

        {isOriginal ? (
          <Button
            variant="contained"
            color="blue"
            onClick={() => {
              history.push(
                `/${nation_id}/${language_id}/1/maps/translation/${id}`,
              );
            }}
          >
            {tr('Translate This Map')}
          </Button>
        ) : null}

        <DiscussionButton
          parent_table={
            isOriginal
              ? TableNameType.OriginalMaps
              : TableNameType.TranslatedMaps
          }
          parent_id={id}
          label={tr('Go to Discussion')}
        />
      </Stack>

      <Divider />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">{tr('Voting')}</Typography>
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
      </Stack>

      <Box
        sx={(theme) => ({
          border: `1px solid ${theme.palette.text.gray_stroke}`,
          borderRadius: '10px',
        })}
        onClick={handleGoToView}
      >
        {!imageLoaded && !imageError ? (
          <Skeleton
            variant="rounded"
            width="calc(100vw - 60px)"
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
