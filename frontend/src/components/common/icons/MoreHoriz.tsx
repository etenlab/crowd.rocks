import { SvgIcon, type SvgIconProps } from '@mui/material';

export function MoreHoriz(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 12.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1ZM12 12.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1ZM4 12.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z"
      />
    </SvgIcon>
  );
}
