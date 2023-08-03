import { RouteComponentProps } from 'react-router';
import { Caption } from '../../common/Caption/Caption';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGetOrigMapContentQuery } from '../../../generated/graphql';

interface MapDetailsProps
  extends RouteComponentProps<{
    id: string;
  }> {}

export const MapDetails: React.FC<MapDetailsProps> = ({
  match,
}: MapDetailsProps) => {
  const origMapContent = useGetOrigMapContentQuery({
    variables: { id: match.params.id },
  });

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleWindowResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <>
      <Caption>
        Map - {origMapContent.data?.getOrigMapContent.map_file_name || ''}
      </Caption>

      <StyledMapImg>
        {origMapContent.data?.getOrigMapContent.content && (
          <img
            width={`${windowWidth - 10}px`}
            height={'auto'}
            src={`data:image/svg+xml;utf8,${encodeURIComponent(
              origMapContent.data?.getOrigMapContent.content,
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
