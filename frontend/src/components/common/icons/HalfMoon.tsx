import { SvgIcon, type SvgIconProps } from '@mui/material';

export function HalfMoon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 11.507a9.493 9.493 0 0 0 18 4.219c-8.507 0-12.726-4.22-12.726-12.726A9.494 9.494 0 0 0 3 11.507Z"
      />
    </SvgIcon>
  );
}
