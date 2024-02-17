import { Radio as MuiRadio, RadioProps, useTheme } from '@mui/material';

import { BpCheckedIcon, BpIcon } from './styled';

export function Radio(props: RadioProps) {
  const theme = useTheme();

  return (
    <MuiRadio
      sx={{
        '&:hover': { bgcolor: 'transparent' },
        padding: 0,
      }}
      disableRipple
      color="default"
      checkedIcon={
        <BpCheckedIcon
          color={
            theme.palette.text[
              (props.color
                ? props.color
                : 'blue') as keyof typeof theme.palette.text
            ]
          }
        />
      }
      icon={
        <BpIcon
          color={
            theme.palette.text[
              (props.color
                ? props.color
                : 'blue') as keyof typeof theme.palette.text
            ]
          }
        />
      }
      inputProps={{ 'aria-label': 'Checkbox demo' }}
      {...props}
    />
  );
}
