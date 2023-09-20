import { useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { IonBadge, IonIcon, useIonToast } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';
import styled from 'styled-components';

import { Caption } from '../../common/Caption/Caption';

import {
  ErrorType,
  useGetTranslatedMapContentLazyQuery,
} from '../../../generated/graphql';

import { langInfo2String, subTags2LangInfo } from '../../../common/langUtils';
import { downloadFromSrc } from '../../../common/utility';

import { useTr } from '../../../hooks/useTr';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

interface MapDetailsProps
  extends RouteComponentProps<{
    id: string;
  }> {}

export const MapTranslatedDetails: React.FC<MapDetailsProps> = ({
  match,
}: MapDetailsProps) => {
  const { tr } = useTr();
  const [present] = useIonToast();

  const [getTranslatedMapContent, { data }] =
    useGetTranslatedMapContentLazyQuery({ fetchPolicy: 'no-cache' });
  const currentMapWithContent = data?.getTranslatedMapContent;

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const mapId = match.params.id;

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
    if (
      currentMapWithContent?.error &&
      currentMapWithContent?.error !== ErrorType.NoError
    ) {
      present({
        message: currentMapWithContent?.error,
        position: 'top',
        color: 'danger',
        duration: 2000,
      });
    }
  }, [currentMapWithContent?.error, present]);

  useEffect(() => {
    const getMap = async () => {
      getTranslatedMapContent({ variables: { id: mapId } });
    };
    getMap();
  }, [getTranslatedMapContent, mapId]);

  const handleDownloadSvg = () => {
    if (currentMapWithContent?.mapFileInfo) {
      downloadFromSrc(
        currentMapWithContent.mapFileInfo.map_file_name_with_langs,
        `data:image/svg+xml;utf8,${encodeURIComponent(
          currentMapWithContent.mapFileInfo.content_file_url,
        )}`,
      );
    }
  };

  const langInfo = useMemo(() => {
    if (!currentMapWithContent?.mapFileInfo?.language.language_code) {
      return undefined;
    }
    return currentMapWithContent
      ? subTags2LangInfo({
          lang: currentMapWithContent.mapFileInfo.language.language_code,
          dialect:
            currentMapWithContent.mapFileInfo.language.dialect_code ||
            undefined,
          region:
            currentMapWithContent.mapFileInfo.language.geo_code || undefined,
        })
      : undefined;
  }, [currentMapWithContent]);

  return (
    <>
      <Caption>
        <>
          {tr('Map')} -{' '}
          {currentMapWithContent?.mapFileInfo?.map_file_name_with_langs}
          <IonBadge>
            {tr('translated to')} {langInfo2String(langInfo)}
            {currentMapWithContent?.mapFileInfo?.translated_percent
              ? ` [${currentMapWithContent.mapFileInfo.translated_percent}%]`
              : ''}
          </IonBadge>
          <IonIcon
            icon={downloadOutline}
            onClick={handleDownloadSvg}
            size="large"
            color="primary"
            className="clickable theme-icon"
          />
        </>
      </Caption>

      <StyledMapImg>
        {currentMapWithContent?.mapFileInfo && (
          <TransformWrapper>
            <TransformComponent>
              <img
                width={`${windowWidth - 10}px`}
                height={'auto'}
                src={currentMapWithContent.mapFileInfo.content_file_url}
                alt="Translated map"
              />
            </TransformComponent>
          </TransformWrapper>
        )}
      </StyledMapImg>
    </>
  );
};

const StyledMapImg = styled.div`
  margin-top: 10px;
  border: solid 1px gray;
`;
