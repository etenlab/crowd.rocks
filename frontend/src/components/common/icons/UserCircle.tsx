import { SvgIcon, type SvgIconProps } from '@mui/material';

export function UserCircle(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        d="M7 18v-1a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v1"
      />
      <path
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
      />
    </SvgIcon>
  );
}
