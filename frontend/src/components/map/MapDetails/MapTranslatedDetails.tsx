import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { IonBadge, IonIcon } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';
import styled from 'styled-components';

import { Caption } from '../../common/Caption/Caption';

import { useGetTranslatedMapContentLazyQuery } from '../../../generated/graphql';

import { langInfo2String, subTags2LangInfo } from '../../../common/langUtils';
import { downloadFromSrc } from '../../../common/utility';

import { useTr } from '../../../hooks/useTr';

interface MapDetailsProps
  extends RouteComponentProps<{
    id: string;
  }> {}

export const MapTranslatedDetails: React.FC<MapDetailsProps> = ({
  match,
}: MapDetailsProps) => {
  const { tr } = useTr();

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
    const getMap = async () => {
      // const map = await getOrigMapContent(_mapId);
      // setCurrentMapWithContent(map);
      getTranslatedMapContent({ variables: { id: mapId } });
    };
    getMap();
  }, [getTranslatedMapContent, mapId]);

  const handleDownloadSvg = () => {
    if (currentMapWithContent) {
      downloadFromSrc(
        currentMapWithContent.map_file_name,
        `data:image/svg+xml;utf8,${encodeURIComponent(
          currentMapWithContent.content,
        )}`,
      );
    }
  };

  const langInfo = currentMapWithContent
    ? subTags2LangInfo({
        lang: currentMapWithContent.language.language_code,
        dialect: currentMapWithContent.language.dialect_code || undefined,
        region: currentMapWithContent.language.geo_code || undefined,
      })
    : undefined;

  return (
    <>
      <Caption>
        <>
          {tr('Map')} - {currentMapWithContent?.map_file_name || ''}
          <IonBadge>
            {tr('translated to')} {langInfo2String(langInfo)}
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
        {currentMapWithContent && (
          <img
            width={`${windowWidth - 10}px`}
            height={'auto'}
            src={`data:image/svg+xml;utf8,${encodeURIComponent(
              currentMapWithContent.content,
            )}`} // without `encodeURIComponent(image)` everal .svg images won't work
            alt="Original map"
          />
        )}
      </StyledMapImg>
    </>
  );
};

const StyledMapImg = styled.div`
  margin-top: 10px;
  border: solid 1px gray;
`;
