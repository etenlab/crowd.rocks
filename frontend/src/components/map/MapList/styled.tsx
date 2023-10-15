import { IonBadge } from '@ionic/react';
import { styled } from '@mui/material';

export const OrigBadge = styled(IonBadge)(() => ({
  background: 'purple',
}));

export const PreviewContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  border: `1.5px solid ${theme.palette.text.gray_stroke}`,
  borderRadius: '10px',
  width: '162px',
  height: '165px',
}));
