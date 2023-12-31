import { styled } from '@mui/material';

export const Word = styled('div')(({ theme }) => ({
  display: 'inline-block',
  position: 'relative',
  padding: '0px 3px',
  fontSize: '14px',
  fontStyle: 'normal',
  fontFamily: 'Poppins',
  fontWeight: 400,
  lineHeight: '32px',
  '&.edit': {
    cursor: 'pointer',
  },
  '&.edit:hover': {
    background: theme.palette.background.blue_20,
  },
  '&.selected': {
    background: theme.palette.background.blue_20,
    fontWeight: 600,
    letterSpacing: '-0.5px',
  },
  '&.left-boundary': {
    borderLeft: `1px solid ${theme.palette.background.blue}`,
  },
  '&.right-boundary': {
    borderRight: `1px solid ${theme.palette.background.blue}`,
  },
}));

export const Dot = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '3px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: theme.palette.background.blue,
  width: '5px',
  height: '5px',
  borderRadius: '50%',
  cursor: 'pointer',
}));
