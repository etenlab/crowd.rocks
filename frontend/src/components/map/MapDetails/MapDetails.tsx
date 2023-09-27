import { useEffect, useMemo, useState } from 'react';
import { RouteComponentProps, useLocation } from 'react-router';
import {
  IonBadge,
  IonIcon,
  IonLoading,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import { chatbubbleEllipsesSharp, downloadOutline } from 'ionicons/icons';
import styled from 'styled-components';

import { Caption } from '../../common/Caption/Caption';

import {
  ErrorType,
  // GetMapVoteStatusDocument,
  TableNameType,
  useGetMapDetailsQuery,
  useGetMapVoteStatusQuery,
} from '../../../generated/graphql';

import { langInfo2String, subTags2LangInfo } from '../../../common/langUtils';
import { downloadFromUrl } from '../../../common/utility';

import { useTr } from '../../../hooks/useTr';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { OrigBadge } from '../MapList/styled';
import { StChatIcon } from '../../common/styled';
import { Flag } from '../../flags/Flag';
import { MAPS_FLAGS } from '../../flags/flagGroups';
import { VoteButtonsHorizontal } from '../../common/VoteButtonsHorizontal';
import { useToggleMapVoteStatusMutation } from '../../../hooks/useToggleMapVoteStatusMutation';

interface MapDetailsProps
  extends RouteComponentProps<{
    id: string;
    nation_id: string;
    language_id: string;
  }> {}

export const MapDetails: React.FC<MapDetailsProps> = ({
  match,
}: MapDetailsProps) => {
  const { tr } = useTr();
  const [present] = useIonToast();
  const { search } = useLocation();
  const router = useIonRouter();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isOriginal = useMemo(() => {
    return new URLSearchParams(search).get('is_original') === 'true';
  }, [search]);
  const { id, nation_id, language_id } = match.params;

  const currentMapWithContent = useGetMapDetailsQuery({
    variables: { map_id: id, is_original: isOriginal },
    fetchPolicy: 'no-cache',
  });

  const currentMapVoteStatus = useGetMapVoteStatusQuery({
    variables: { map_id: id, is_original: isOriginal },
  });

  const [toggleMapVoteStatus] = useToggleMapVoteStatusMutation();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const currMapContent = currentMapWithContent?.data?.getMapDetails;

  useEffect(() => {
    function handleWindowResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

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

  const handleDownloadSvg = () => {
    if (currMapContent?.mapFileInfo) {
      downloadFromUrl(
        currMapContent?.mapFileInfo.map_file_name_with_langs,
        currMapContent?.mapFileInfo.content_file_url,
      );
    }
  };

  const langInfo = useMemo(() => {
    if (!currMapContent?.mapFileInfo?.language.language_code) {
      return undefined;
    }
    return currentMapWithContent
      ? subTags2LangInfo({
          lang: currMapContent.mapFileInfo.language.language_code,
          dialect:
            currMapContent.mapFileInfo.language.dialect_code || undefined,
          region: currMapContent.mapFileInfo.language.geo_code || undefined,
        })
      : undefined;
  }, [
    currMapContent?.mapFileInfo?.language.dialect_code,
    currMapContent?.mapFileInfo?.language.geo_code,
    currMapContent?.mapFileInfo?.language.language_code,
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

  const chatButton = (
    <StChatIcon
      icon={chatbubbleEllipsesSharp}
      onClick={() => {
        router.push(
          `/${nation_id}/${language_id}/1/discussion/${
            isOriginal
              ? TableNameType.OriginalMaps
              : TableNameType.TranslatedMaps
          }/${id}`,
        );
      }}
    />
  );
  const flagsCom = (
    <Flag
      parent_table={
        isOriginal ? TableNameType.OriginalMaps : TableNameType.TranslatedMaps
      }
      parent_id={id}
      flag_names={MAPS_FLAGS}
    />
  );

  const voteButtonCom = (
    <VoteButtonsHorizontal
      downVotes={
        currentMapVoteStatus.data?.getMapVoteStatus.vote_status?.downvotes || 0
      }
      upVotes={
        currentMapVoteStatus.data?.getMapVoteStatus.vote_status?.upvotes || 0
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
  );

  return (
    <>
      <Caption>
        <>
          {tr('Map')} - {currMapContent?.mapFileInfo?.map_file_name_with_langs}
          {currMapContent?.mapFileInfo?.is_original ? (
            <OrigBadge>{tr('original')}</OrigBadge>
          ) : (
            <IonBadge>
              {tr('translated to')} {langInfo2String(langInfo)}
              {currMapContent?.mapFileInfo?.translated_percent
                ? ` [${currMapContent.mapFileInfo.translated_percent}%]`
                : ''}
            </IonBadge>
          )}
          <IonIcon
            icon={downloadOutline}
            onClick={handleDownloadSvg}
            size="large"
            color="primary"
            className="clickable theme-icon"
          />
        </>
      </Caption>
      <StButtonsSection>
        {chatButton}
        {flagsCom}
        {voteButtonCom}
      </StButtonsSection>
      <StyledMapImg>
        {currMapContent?.mapFileInfo && (
          <>
            {imageError && <p>{tr('Error loading image')}</p>}
            <IonLoading
              message={tr('Loading image')}
              isOpen={!imageLoaded && !imageError}
            />
            <TransformWrapper>
              <TransformComponent>
                <img
                  width={`${windowWidth - 10}px`}
                  height={'auto'}
                  src={currMapContent.mapFileInfo.content_file_url}
                  alt="Translated map"
                  placeholder="asdf"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </TransformComponent>
            </TransformWrapper>
          </>
        )}
      </StyledMapImg>
    </>
  );
};

const StyledMapImg = styled.div`
  margin-top: 10px;
  border: solid 1px gray;
`;

const StButtonsSection = styled.div`
  & > * {
    margin-right: 30px;
  }
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: end;
`;
