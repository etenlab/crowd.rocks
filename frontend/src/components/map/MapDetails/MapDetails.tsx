import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { IonIcon } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';
import styled from 'styled-components';

import { Caption } from '../../common/Caption/Caption';
import { useGetOrigMapContentQuery } from '../../../generated/graphql';
import { downloadFromSrc } from '../../../common/utility';

import { useTr } from '../../../hooks/useTr';

interface MapDetailsProps
  extends RouteComponentProps<{
    id: string;
  }> {}

export const MapDetails: React.FC<MapDetailsProps> = ({
  match,
}: MapDetailsProps) => {
  const { tr } = useTr();

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

  const handleDownloadSvg = () => {
    if (origMapContent.data?.getOrigMapContent.content) {
      downloadFromSrc(
        origMapContent.data?.getOrigMapContent.map_file_name,
        `data:image/svg+xml;utf8,${encodeURIComponent(
          origMapContent.data?.getOrigMapContent.content,
        )}`,
      );
    }
  };

  return (
    <>
      <Caption>
        <>
          {tr('Map')} -{' '}
          {origMapContent.data?.getOrigMapContent.map_file_name || ''}
          {origMapContent.data?.getOrigMapContent.content && (
            <IonIcon
              icon={downloadOutline}
              onClick={handleDownloadSvg}
              size="large"
              color="primary"
              className="clickable theme-icon"
            />
          )}
        </>
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
