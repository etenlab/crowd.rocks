import { styled } from '@mui/material';

export const Item = styled('div')(({ theme }) => ({
  borderRadius: '10px',
  border: `1px solid ${theme.palette.text.gray_stroke}`,
  marginBottom: '16px',
  padding: '16px',
  width: '100%',
}));
