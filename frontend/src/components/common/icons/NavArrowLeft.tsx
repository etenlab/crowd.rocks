import { SvgIcon, type SvgIconProps } from '@mui/material';

export function NavArrowLeft(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m15 6-6 6 6 6"
      />
    </SvgIcon>
  );
}
