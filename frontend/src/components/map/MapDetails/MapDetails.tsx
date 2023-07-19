import { RouteComponentProps } from 'react-router';
import { Caption } from '../../common/Caption/Caption';
import { useEffect, useState } from 'react';
import { mockMapWithContentList } from '../mocks/mapData.mock';
import styled from 'styled-components';

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

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const mapId = Number(match.params.id);

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
    const getMap = async (_mapId: number) => {
      const map = mockMapWithContentList.find((m) => m.id === _mapId);
      setCurrentMapWithContent(map);
    };
    getMap(mapId);
  }, [mapId]);

  // if (isNaN(mapId)) return <div>Map not found</div>;

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
