import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import {
  ThemeProvider as MuiThemeProvider,
  GlobalStyles,
  // CssBaseline,
  createTheme,
  useMediaQuery,
  PaletteColorOptions,
} from '@mui/material';

import { deepmerge } from '@mui/utils';
import { getThemeOptions } from './themeOptions';
import { designColors, colors } from './palette';

export const mode =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

const ColorModeContext = createContext({
  setColorMode: (colorMode: 'light' | 'dark') => {
    console.log(colorMode);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getColor: (lightModeColor: string, _darkModeColor?: string) => {
    return lightModeColor;
  },
});

export function useColorModeContext() {
  const context = useContext(ColorModeContext);

  if (context === undefined) {
    throw new Error(
      'useColorModeContext must be within ThemeProvider which provided by @eten-lab/ui-kit package!',
    );
  }

  return context;
}

type ThemeProviderProps = {
  autoDetectPrefersDarkMode?: boolean;
  children?: React.ReactNode;
};

export function ThemeProvider({
  children,
  autoDetectPrefersDarkMode = true,
}: ThemeProviderProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (!autoDetectPrefersDarkMode) {
      return;
    }

    if (prefersDarkMode) {
      setMode('dark');
    } else {
      setMode('light');
    }
  }, [prefersDarkMode, autoDetectPrefersDarkMode]);

  const colorMode = useMemo(
    () => ({
      setColorMode: (colorMode: 'light' | 'dark') => {
        setMode(colorMode);
      },
      getColor: (lightModeColor: string, darkModeColor?: string) => {
        if (mode === 'light' && darkModeColor) {
          if (designColors[lightModeColor as keyof typeof designColors]) {
            return designColors[lightModeColor as keyof typeof designColors];
          } else {
            return lightModeColor;
          }
        }

        if (mode === 'dark' && darkModeColor) {
          if (designColors[darkModeColor as keyof typeof designColors]) {
            return designColors[darkModeColor as keyof typeof designColors];
          } else {
            return darkModeColor;
          }
        }

        if (colors[lightModeColor as keyof typeof colors]) {
          return colors[lightModeColor as keyof typeof colors][mode];
        } else if (designColors[lightModeColor as keyof typeof designColors]) {
          return designColors[lightModeColor as keyof typeof designColors];
        } else {
          return lightModeColor;
        }
      },
    }),
    [mode],
  );

  const theme = useMemo(
    () =>
      createTheme(
        deepmerge(getThemeOptions(mode), {
          palette: {
            mode,
          },
        }),
      ),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        {/* <CssBaseline /> */}
        <GlobalStyles
          styles={() => ({
            '*, *::before, *::after, html': {
              boxSizing: 'border-box',
            },
            body: {
              fontFamily: 'Poppins',
            },
            input: {
              fontFamily: 'Poppins',
            },
          })}
        />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}

declare module '@mui/material/styles' {
  interface CustomPalette {
    blue: PaletteColorOptions;
    orange: PaletteColorOptions;
    red: PaletteColorOptions;
    white: PaletteColorOptions;
    green: PaletteColorOptions;
    dark: PaletteColorOptions;
    gray_stroke: PaletteColorOptions;
    gray_bg: PaletteColorOptions;
    gray: PaletteColorOptions;
  }

  interface CustomTypeText {
    blue: string;
    orange: string;
    red: string;
    white: string;
    green: string;
    dark: string;
    gray: string;
    gray_text: string;
    gray_stroke: string;
    gray_bg: string;
  }

  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
  interface TypeText extends CustomTypeText {}

  interface TypographyVariants {
    body3: React.CSSProperties;
    body4: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
    body4?: React.CSSProperties;
  }

  interface TypeBackground {
    blue: string;
    orange: string;
    red: string;
    white: string;
    green: string;
    dark: string;
    gray: string;
    gray_text: string;
    gray_stroke: string;
    gray_bg: string;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body3: true;
    body4: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    blue: true;
    orange: true;
    red: true;
    white: true;
    green: true;
    dark: true;
    gray_stroke: true;
    gray: true;
    gray_bg: true;
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    blue: true;
    orange: true;
    red: true;
    white: true;
    green: true;
    dark: true;
    gray_stroke: true;
    gray: true;
    gray_bg: true;
  }
}

declare module '@mui/material/Badge' {
  interface BadgePropsColorOverrides {
    blue: true;
    orange: true;
    red: true;
    white: true;
    green: true;
    dark: true;
    gray_stroke: true;
    gray: true;
    gray_bg: true;
  }
}

declare module '@mui/material/Checkbox' {
  interface CheckboxPropsColorOverrides {
    blue: true;
    orange: true;
    red: true;
    white: true;
    green: true;
    dark: true;
    gray_stroke: true;
    gray: true;
    gray_bg: true;
  }
}

declare module '@mui/material/Radio' {
  interface RadioPropsColorOverrides {
    blue: true;
    orange: true;
    red: true;
    white: true;
    green: true;
    dark: true;
    gray_stroke: true;
    gray: true;
    gray_bg: true;
  }
}

declare module '@mui/material/LinearProgress' {
  interface LinearProgressPropsColorOverrides {
    blue: true;
    orange: true;
    red: true;
    white: true;
    green: true;
    dark: true;
    gray_stroke: true;
    gray: true;
    gray_bg: true;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    blue: true;
    orange: true;
    red: true;
    white: true;
    green: true;
    dark: true;
    gray_stroke: true;
    gray: true;
    gray_bg: true;
  }
}

declare module '@mui/material/SvgIcon' {
  interface SvgIconPropsColorOverrides {
    blue: true;
    orange: true;
    red: true;
    white: true;
    green: true;
    dark: true;
    gray: true;
    gray_text: true;
    gray_stroke: true;
    gray_bg: true;
  }
}
