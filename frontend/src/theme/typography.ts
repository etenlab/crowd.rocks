import { ThemeOptions } from '@mui/material';
import { colors } from './palette';

export function getTypographyPalette(mode: 'light' | 'dark'): ThemeOptions {
  return {
    typography: {
      fontFamily: ['Poppins'].join(','),
      fontSize: 12,
      h1: {
        fontWeight: 600,
        fontSize: 22,
        lineHeight: '26px',
        letterSpacing: '-0.44px',
        textTransform: 'none',
        color: colors['dark'][mode],
      },
      h2: {
        fontWeight: 600,
        fontSize: 18,
        lineHeight: '22px',
        letterSpacing: '-0.36px',
        textTransform: 'none',
        color: colors['dark'][mode],
      },
      h3: {
        fontWeight: 600,
        fontSize: 15,
        lineHeight: '22px',
        letterSpacing: '-0.3px',
        color: colors['dark'][mode],
      },
      h4: {
        fontWeight: 600,
        fontSize: '14px',
        lineHeight: '22px',
        letterSpacing: '-0.28px',
        color: colors['dark'][mode],
      },
      h5: {
        fontWeight: 500,
        fontSize: '13px',
        lineHeight: '22px',
        letterSpacing: '-0.26px',
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
        fontSize: '13px',
        lineHeight: '24px',
        letterSpacing: '-0.28px',
        color: colors['dark'][mode],
      },
      body3: {
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '-0.24px',
        color: colors['dark'][mode],
      },
      body4: {
        fontWeight: 400,
        fontSize: '11px',
        lineHeight: '24px',
        letterSpacing: '-0.28px',
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
        lineHeight: '24px',
        letterSpacing: '-0.28px',
        color: colors['dark'][mode],
      },
      subtitle2: {
        fontWeight: 600,
        fontSize: '13px',
        lineHeight: '22px',
        letterSpacing: '-0.26px',
        color: colors['dark'][mode],
      },
    },
  };
}
