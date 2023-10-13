import { ReactElement } from 'react';
import { useIonRouter } from '@ionic/react';

import { Stack, Typography, IconButton } from '@mui/material';
import { NavArrowLeft } from '../icons/NavArrowLeft';

export type TCaptionProps = {
  handleBackClick?: () => void;
  children: ReactElement | string | string[];
};

export const Caption = ({ handleBackClick, children }: TCaptionProps) => {
  const router = useIonRouter();

  let onClickAction: () => void;

  if (handleBackClick) {
    onClickAction = handleBackClick;
  } else {
    onClickAction = router.goBack;
  }

  return (
    <Stack
      direction="row"
      gap="10px"
      justifyContent="flex-start"
      alignItems="center"
    >
      <IconButton onClick={onClickAction} sx={{ padding: 0 }}>
        <NavArrowLeft color="dark" />
      </IconButton>
      <Typography variant="h2" color="dark">
        {children}
      </Typography>
    </Stack>
  );
};
