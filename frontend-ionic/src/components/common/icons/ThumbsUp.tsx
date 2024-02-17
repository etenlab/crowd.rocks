import { SvgIcon, type SvgIconProps } from '@mui/material';

export function ThumbsUp(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        d="M16.472 20H4.1a.6.6 0 0 1-.6-.6V9.6a.6.6 0 0 1 .6-.6h2.768a2 2 0 0 0 1.715-.971l2.71-4.517a1.631 1.631 0 0 1 2.961 1.308l-1.022 3.408a.6.6 0 0 0 .574.772h4.575a2 2 0 0 1 1.93 2.526l-1.91 7A2 2 0 0 1 16.473 20Z"
      />
      <path
        stroke="currentColor"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 20V9"
      />
    </SvgIcon>
  );
}
