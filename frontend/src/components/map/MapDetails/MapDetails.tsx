import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { IonIcon, useIonToast } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';
import styled from 'styled-components';

import { Caption } from '../../common/Caption/Caption';
import {
  ErrorType,
  useGetOrigMapContentQuery,
} from '../../../generated/graphql';
import { downloadFromUrl } from '../../../common/utility';

import { useTr } from '../../../hooks/useTr';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

interface MapDetailsProps
  extends RouteComponentProps<{
    id: string;
  }> {}

export const MapDetails: React.FC<MapDetailsProps> = ({
  match,
}: MapDetailsProps) => {
  const { tr } = useTr();
  const [present] = useIonToast();

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
    if (
      origMapContent.data?.getOrigMapContent.mapFileInfo?.content_file_url &&
      origMapContent.data?.getOrigMapContent.error === ErrorType.NoError
    ) {
      downloadFromUrl(
        origMapContent.data?.getOrigMapContent.mapFileInfo.map_file_name,
        origMapContent.data?.getOrigMapContent.mapFileInfo.content_file_url,
      );
    } else {
      present({
        message: origMapContent.data?.getOrigMapContent.error,
        position: 'top',
        color: 'danger',
        duration: 2000,
      });
    }
  };

  return (
    <>
      <Caption>
        <>
          {tr('Map')} -{' '}
          {origMapContent.data?.getOrigMapContent.mapFileInfo?.map_file_name ||
            ''}
          {origMapContent.data?.getOrigMapContent.mapFileInfo
            ?.content_file_url && (
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
        {origMapContent.data?.getOrigMapContent.mapFileInfo
          ?.content_file_url && (
          <TransformWrapper>
            <TransformComponent>
              <img
                width={`${windowWidth - 10}px`}
                height={'auto'}
                src={
                  origMapContent.data?.getOrigMapContent.mapFileInfo
                    .content_file_url
                }
                alt="Original map"
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
