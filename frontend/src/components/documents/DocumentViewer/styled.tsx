import { styled } from '@mui/material';

export const Word = styled('div')({
  display: 'inline-block',
  position: 'relative',
  padding: '0px 3px',
  fontSize: '14px',
  fontStyle: 'normal',
  fontFamily: 'Poppins',
  fontWeight: 400,
  lineHeight: '32px',
  letterSpacing: '-0.28px',
  '&.edit': {
    cursor: 'pointer',
  },
  '&.edit:hover': {
    background: '#EFF1F8',
  },
  '&.selected': {
    background: '#EFF1F8',
    fontWeight: 600,
  },
  '&.left-boundary': {
    borderRadius: '5px',
  },
  '&.right-boundary': {
    borderRadius: '0 5px 5px 0',
  },
});

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
