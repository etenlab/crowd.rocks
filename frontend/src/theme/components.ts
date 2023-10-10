import { ThemeOptions } from '@mui/material';

export const components: ThemeOptions = {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          fontWeight: 600,
          lineHeight: '22px',
          letterSpacing: '-0.28px',
          borderRadius: '10px',
          padding: '10px',
          boxShadow: 'none',
          textTransform: 'none',
        },
      },
    },
  },
};
