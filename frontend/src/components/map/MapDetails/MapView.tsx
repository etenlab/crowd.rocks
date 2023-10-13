import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { useIonToast } from '@ionic/react';
import { Skeleton, Box } from '@mui/material';

import { Caption } from '../../common/Caption/Caption';
import { ErrorType, useGetMapDetailsQuery } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

export function MapView() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const { search } = useLocation();
  const { id } = useParams<{
    id: string;
  }>();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isOriginal = useMemo(() => {
    return new URLSearchParams(search).get('is_original') === 'true';
  }, [search]);

  const currentMapWithContent = useGetMapDetailsQuery({
    variables: { map_id: id, is_original: isOriginal },
    fetchPolicy: 'no-cache',
  });

  const currMapContent = currentMapWithContent?.data?.getMapDetails;

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

  const handleImageLoad = () => {
    setTimeout(() => {
      setImageLoaded(true);
    }, 100);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <Caption>{tr('View Map')}</Caption>

      <Box
        sx={(theme) => ({
          position: 'fixed',
          bottom: 0,
          left: 0,
          borderTop: `2px solid ${theme.palette.text.dark}`,
        })}
      >
        {!imageLoaded && !imageError ? (
          <Skeleton
            variant="rounded"
            width="calc(100vw - 34px)"
            height="500px"
            animation="wave"
            sx={{ borderRadius: '10px' }}
          />
        ) : null}
        {currMapContent?.mapDetails && (
          <TransformWrapper>
            <TransformComponent>
              <img
                style={{
                  userSelect: 'none',
                  width: '100vw',
                  height: 'calc(100vh - 141px)',
                }}
                src={currMapContent?.mapDetails?.content_file_url}
                alt="Translated map"
                placeholder="asdf"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </TransformComponent>
          </TransformWrapper>
        )}
      </Box>
    </>
  );
}
