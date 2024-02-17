import { SvgIcon, type SvgIconProps } from '@mui/material';

export function SunLight(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM22 12h1M12 2V1M12 23v-1M20 20l-1-1M20 4l-1 1M4 20l1-1M4 4l1 1M1 12h1"
      />
    </SvgIcon>
  );
}
