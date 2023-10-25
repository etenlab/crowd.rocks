import { SvgIcon, type SvgIconProps } from '@mui/material';

export function AddUser(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 10h3m3 0h-3m0 0V7m0 3v3M1 20v-1a7 7 0 0 1 7-7v0a7 7 0 0 1 7 7v1M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
      />
    </SvgIcon>
  );
}
