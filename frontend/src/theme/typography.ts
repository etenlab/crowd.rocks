import { ThemeOptions } from '@mui/material';
import { colors } from './palette';

export function getTypographyPalette(mode: 'light' | 'dark'): ThemeOptions {
  return {
    typography: {
      fontFamily: ['Poppins'].join(','),
      fontSize: 12,
      h1: {
        fontWeight: 600,
        fontSize: 18,
        lineHeight: '22px',
        letterSpacing: '-0.36px',
        textTransform: 'none',
        color: colors['dark'][mode],
      },
      h2: {
        fontWeight: 600,
        fontSize: 20,
        lineHeight: '28px',
        letterSpacing: '-0.02em',
        textTransform: 'capitalize',
        color: colors['dark'][mode],
      },
      h3: {
        fontWeight: 600,
        fontSize: 15,
        lineHeight: '22px',
        letterSpacing: '-0.3px',
        color: colors['dark'][mode],
      },
      body1: {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '24px',
        letterSpacing: '-0.28px',
        color: colors['dark'][mode],
      },
      body2: {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        color: colors['dark'][mode],
      },
      body3: {
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '20px',
        color: colors['dark'][mode],
      },
      overline: {
        fontWeight: 500,
        fontSize: '13px',
        lineHeight: '22px',
        color: colors['dark'][mode],
        textTransform: 'none',
        letterSpacing: '-0.26px',
      },
      caption: {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '30px',
        color: colors['dark'][mode],
      },
      subtitle1: {
        fontWeight: 600,
        fontSize: '14px',
        lineHeight: '20px',
        color: colors['dark'][mode],
      },
      subtitle2: {
        fontWeight: 700,
        fontSize: '14px',
        lineHeight: '18px',
        color: colors['dark'][mode],
      },
    },
  };
}
