import { useEffect, useMemo, useState } from 'react';
import { RouteComponentProps, useLocation } from 'react-router';
import {
  IonBadge,
  IonButton,
  IonIcon,
  IonLoading,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import {
  addCircleOutline,
  arrowBackOutline,
  arrowDownOutline,
  arrowForwardOutline,
  arrowUpOutline,
  chatbubbleEllipsesSharp,
  downloadOutline,
  refreshCircleOutline,
  removeCircleOutline,
} from 'ionicons/icons';
import styled from 'styled-components';
import { Caption } from '../../common/Caption/Caption';
import {
  ErrorType,
  TableNameType,
  useGetMapDetailsQuery,
  useGetMapVoteStatusQuery,
} from '../../../generated/graphql';
import { langInfo2String, subTags2LangInfo } from '../../../common/langUtils';
import { downloadFromUrl } from '../../../common/utility';
import { useTr } from '../../../hooks/useTr';
import {
  ReactZoomPanPinchContentRef,
  TransformComponent,
  TransformWrapper,
} from 'react-zoom-pan-pinch';
import { OrigBadge } from '../MapList/styled';
import { StChatIcon } from '../../common/styled';
import { Flag } from '../../flags/Flag';
import { MAPS_FLAGS } from '../../flags/flagGroups';
import { VoteButtonsHorizontal } from '../../common/VoteButtonsHorizontal';
import { useToggleMapVoteStatusMutation } from '../../../hooks/useToggleMapVoteStatusMutation';

const TRANSFORM_STEP = 200;
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
    if (currMapContent?.mapDetails) {
      downloadFromUrl(
        currMapContent?.mapDetails.map_file_name_with_langs,
        currMapContent?.mapDetails.content_file_url,
      );
    }
  };

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

  const Controls = ({
    zoomIn,
    zoomOut,
    resetTransform,
    setTransform,
    instance,
  }: ReactZoomPanPinchContentRef) => {
    const moveOn = (x: number, y: number): void => {
      const os = instance.transformState.scale;
      const ox = instance.transformState.positionX;
      const oy = instance.transformState.positionY;
      const newX = ox + x;
      const newY = oy + y;
      setTransform(newX, newY, os);
    };

    return (
      <StControls>
        <IonButton onClick={() => zoomIn()}>
          <IonIcon icon={addCircleOutline} size="medium" />
        </IonButton>
        <IonButton onClick={() => zoomOut()}>
          <IonIcon icon={removeCircleOutline} size="medium" />
        </IonButton>
        <IonButton
          onClick={() => {
            resetTransform();
          }}
        >
          <IonIcon icon={refreshCircleOutline} size="medium" />
        </IonButton>
        <IonButton
          onClick={() => {
            moveOn(0, TRANSFORM_STEP);
          }}
        >
          <IonIcon icon={arrowUpOutline} size="medium" />
        </IonButton>
        <IonButton
          onClick={() => {
            moveOn(0, -TRANSFORM_STEP);
          }}
        >
          <IonIcon icon={arrowDownOutline} size="medium" />
        </IonButton>
        <IonButton
          onClick={() => {
            moveOn(TRANSFORM_STEP, 0);
          }}
        >
          <IonIcon icon={arrowBackOutline} size="medium" />
        </IonButton>
        <IonButton
          onClick={() => {
            moveOn(-TRANSFORM_STEP, 0);
          }}
        >
          <IonIcon icon={arrowForwardOutline} size="medium" />
        </IonButton>
      </StControls>
    );
  };

  return (
    <>
      <Caption>
        <>
          {tr('Map')} - {currMapContent?.mapDetails?.map_file_name_with_langs}
          {currMapContent?.mapDetails?.is_original ? (
            <OrigBadge>{tr('original')}</OrigBadge>
          ) : (
            <IonBadge>
              {tr('translated to')} {langInfo2String(langInfo)}
              {currMapContent?.mapDetails?.translated_percent
                ? ` [${currMapContent.mapDetails.translated_percent}%]`
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
        {currMapContent?.mapDetails && (
          <>
            {imageError && <p>{tr('Error loading image')}</p>}
            <IonLoading
              message={tr('Loading image')}
              isOpen={!imageLoaded && !imageError}
            />

            <TransformWrapper>
              {(utils) => (
                <>
                  <Controls {...utils} />
                  <TransformComponent>
                    <img
                      style={{ userSelect: 'none' }}
                      width={`${windowWidth - 10}px`}
                      height={'auto'}
                      src={currMapContent?.mapDetails?.content_file_url}
                      alt="Translated map"
                      placeholder="asdf"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  </TransformComponent>
                </>
              )}
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

const StControls = styled('div')`
  height: 0;
  position: relative;
  top: -55px;
  z-index: 1000;
`;
