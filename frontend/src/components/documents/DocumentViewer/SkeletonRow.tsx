import { Skeleton, Box } from '@mui/material';
import { useEffect } from 'react';

import { TempPage } from './DocumentViewer';

export type SkeletonRowProps = {
  tempPage: TempPage;
  onLoading(tempPage: TempPage): void;
};

export function SkeletonRow({ onLoading, tempPage }: SkeletonRowProps) {
  useEffect(() => {
    onLoading(tempPage);
  }, [onLoading, tempPage]);

  return (
    <Box sx={{ padding: '5px 0' }}>
      <Skeleton animation="wave" sx={{ lineHeight: '22px' }} />
    </Box>
  );
}
