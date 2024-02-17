import { ReactElement } from 'react';
import { useHistory } from 'react-router';

import { Stack, Typography, IconButton } from '@mui/material';
import { NavArrowLeft } from '../icons/NavArrowLeft';

export type TCaptionProps = {
  onBackClick?: () => void;
  children: ReactElement | string | string[];
};

export const Caption = ({ onBackClick, children }: TCaptionProps) => {
  const history = useHistory();

  let onClickAction: () => void;

  if (onBackClick) {
    onClickAction = onBackClick;
  } else {
    onClickAction = history.goBack;
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
