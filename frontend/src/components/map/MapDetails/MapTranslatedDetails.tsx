import { RouteComponentProps } from 'react-router';
import { Caption } from '../../common/Caption/Caption';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
// import { useMapTranslationTools } from '../hooks/useMapTranslationTools';
import { useGetTranslatedMapContentLazyQuery } from '../../../generated/graphql';
import { langInfo2String, subTags2LangInfo } from '../../../common/langUtils';
import { IonBadge } from '@ionic/react';

interface MapDetailsProps
  extends RouteComponentProps<{
    id: string;
  }> {}

export const MapTranslatedDetails: React.FC<MapDetailsProps> = ({
  match,
}: MapDetailsProps) => {
  // const [currentMapWithContent, setCurrentMapWithContent] = useState<
  //   TMapWithContent | undefined
  // >();

  // const { getOrigMapContent } = useMapTranslationTools();
  const [getTranslatedMapContent, { data }] =
    useGetTranslatedMapContentLazyQuery();
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
          Map - {currentMapWithContent?.map_file_name || ''}{' '}
          <>
            <IonBadge>translated to {langInfo2String(langInfo)}</IonBadge>
          </>
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
