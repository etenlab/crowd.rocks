import { SvgIcon, type SvgIconProps } from '@mui/material';

export function WhiteFlag(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 15 .95-10.454A.6.6 0 0 1 6.548 4h13.795a.6.6 0 0 1 .598.654l-.891 9.8a.6.6 0 0 1-.598.546H5Zm0 0-.6 6"
      />
    </SvgIcon>
  );
}
