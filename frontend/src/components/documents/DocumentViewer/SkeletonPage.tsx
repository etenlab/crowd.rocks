import { Skeleton, Stack } from '@mui/material';
import { useEffect } from 'react';

import { TempPage } from './DocumentViewer';

export type SkeletonPageProps = {
  tempPage: TempPage;
  onLoading(tempPage: TempPage): void;
  height: number;
};

export function SkeletonPage({
  onLoading,
  tempPage,
  height,
}: SkeletonPageProps) {
  useEffect(() => {
    onLoading(tempPage);
  }, [onLoading, tempPage]);

  const skeletons: JSX.Element[] = [];

  for (let i = 0; i < height / 32; i++) {
    skeletons.push(<Skeleton animation="wave" key={i} />);
  }

  return (
    <Stack gap="10px">
      {skeletons}
      <Skeleton animation="wave" sx={{ width: '80%' }} />
    </Stack>
  );
}
