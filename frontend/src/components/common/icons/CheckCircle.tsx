import { SvgIcon, type SvgIconProps } from '@mui/material';

export function CheckCircle(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m7 12.5 3 3 7-7"
      />
      <path
        stroke="currentColor"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
      />
    </SvgIcon>
  );
}
