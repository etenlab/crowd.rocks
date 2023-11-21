import { ThemeOptions } from '@mui/material';

export const designColors = {
  blue: '#476FFF',
  blue_10: '#ECF0FF',
  orange: '#FF5F2D',
  orange_light: '#FFECE5',
  red: '#FF4747',
  white: '#ffffff',
  green: '#14c972',
  gray_bg: '#F8F8F9',
  gray_text: '#8A8E9D',
  gray: '#6A6D7A',
  gray_stroke: '#DEE0E8',
  dark: '#181818',
};

export const colors = {
  blue: {
    light: designColors['blue'],
    dark: designColors['blue'],
  },
  blue_10: {
    light: designColors['blue_10'],
    dark: designColors['blue_10'],
  },
  orange: {
    light: designColors['orange'],
    dark: designColors['orange'],
  },
  orange_light: {
    light: designColors['orange_light'],
    dark: designColors['orange_light'],
  },
  red: {
    light: designColors['red'],
    dark: designColors['red'],
  },
  white: {
    light: designColors['white'],
    dark: designColors['dark'],
  },
  green: {
    light: designColors['green'],
    dark: designColors['green'],
  },
  gray: {
    light: designColors['gray'],
    dark: designColors['white'],
  },
  gray_stroke: {
    light: designColors['gray_stroke'],
    dark: designColors['gray'],
  },
  gray_text: {
    light: designColors['gray_text'],
    dark: designColors['white'],
  },
  dark: {
    light: designColors['dark'],
    dark: designColors['white'],
  },
  gray_bg: {
    light: designColors['gray_bg'],
    dark: designColors['dark'],
  },
};

export function getColorPalette(mode: 'light' | 'dark'): ThemeOptions {
  return {
    palette: {
      blue: {
        main: colors['blue'][mode],
        contrastText: colors['white'][mode],
      },
      orange: {
        main: colors['orange'][mode],
        contrastText: colors['white'][mode],
      },
      red: {
        main: colors['red'][mode],
        contrastText: colors['white'][mode],
      },
      white: {
        main: colors['white'][mode],
        contrastText: colors['dark'][mode],
      },
      green: {
        main: colors['green'][mode],
        contrastText: colors['white'][mode],
      },
      dark: {
        main: colors['dark'][mode],
        contrastText: colors['white'][mode],
      },
      gray: {
        main: colors['gray'][mode],
        contrastText: colors['dark'][mode],
      },
      gray_stroke: {
        main: colors['gray_stroke'][mode],
        contrastText: colors['gray'][mode],
      },
      gray_bg: {
        main: colors['gray_bg'][mode],
        contrastText: colors['gray'][mode],
      },
      text: {
        blue: colors['blue'][mode],
        blue_10: colors['blue'][mode],
        orange: colors['orange'][mode],
        red: colors['red'][mode],
        white: colors['white'][mode],
        green: colors['green'][mode],
        dark: colors['dark'][mode],
        gray: colors['gray'][mode],
        gray_text: colors['gray_text'][mode],
        gray_stroke: colors['gray_stroke'][mode],
        gray_bg: colors['gray_bg'][mode],
        orange_light: colors['orange_light'][mode],
      },
      background: {
        blue: colors['blue'][mode],
        blue_10: colors['blue'][mode],
        orange: colors['orange'][mode],
        red: colors['red'][mode],
        white: colors['white'][mode],
        green: colors['green'][mode],
        dark: colors['dark'][mode],
        gray: colors['gray'][mode],
        gray_text: colors['gray_text'][mode],
        gray_stroke: colors['gray_stroke'][mode],
        gray_bg: colors['gray_bg'][mode],
        orange_light: colors['orange_light'][mode],
      },
    },
  };
}
