import { SvgIcon, type SvgIconProps } from '@mui/material';

export function DownloadCircle(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17h6M12 6v7m0 0 3.5-3.5M12 13 8.5 9.5M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
      />
    </SvgIcon>
  );
}
