import { SvgIcon, type SvgIconProps } from '@mui/material';

export function FilterList(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 6h18M7 12h10M11 18h2"
      />
    </SvgIcon>
  );
}
