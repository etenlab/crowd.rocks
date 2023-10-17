import { deepmerge } from '@mui/utils';

import { getColorPalette } from './palette';
import { components } from './components';
import { getTypographyPalette } from './typography';

export function getThemeOptions(mode: 'light' | 'dark') {
  return deepmerge(
    deepmerge(getColorPalette(mode), getTypographyPalette(mode)),
    components,
  );
}
