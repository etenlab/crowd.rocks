import { styled, Paper, Popper, autocompleteClasses } from '@mui/material';

export const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: 'border-box',
    width: '100%',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
});

export const StyledPaper = styled(Paper)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 12px',
  borderRadius: '10px',
  gap: '12px',
});

export const StyledInput = styled('input')({
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '22px',
  letterSpacing: '-0.28px',
  padding: 0,
  flex: 1,
  outline: 'none',
  border: 'none',
});
