import { SvgIcon, type SvgIconProps } from '@mui/material';

export function Dot(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="2" cy="2" r="2" fill="currentColor" />
    </SvgIcon>
  );
}
