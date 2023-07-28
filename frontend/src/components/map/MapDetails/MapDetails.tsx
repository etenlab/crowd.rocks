import { RouteComponentProps } from 'react-router';
import { Caption } from '../../common/Caption/Caption';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useMapTranslationTools } from '../hooks/useMapTranslationTools';

interface MapDetailsProps
  extends RouteComponentProps<{
    id: string;
  }> {}

export const MapDetails: React.FC<MapDetailsProps> = ({
  match,
}: MapDetailsProps) => {
  const [currentMapWithContent, setCurrentMapWithContent] = useState<
    TMapWithContent | undefined
  >();

  const { getOrigMapContent } = useMapTranslationTools();

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
    const getMap = async (_mapId: string) => {
      const map = await getOrigMapContent(_mapId);
      setCurrentMapWithContent(map);
    };
    getMap(mapId);
  }, [getOrigMapContent, mapId]);

  return (
    <>
      <Caption>Map - {currentMapWithContent?.name || ''}</Caption>

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
