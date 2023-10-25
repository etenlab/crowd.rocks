import { SvgIcon, type SvgIconProps } from '@mui/material';

export function AppNotification(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM21 12v3a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6V9a6 6 0 0 1 6-6h3"
      />
    </SvgIcon>
  );
}
