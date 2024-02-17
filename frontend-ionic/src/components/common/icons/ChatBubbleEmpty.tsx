import { SvgIcon, type SvgIconProps } from '@mui/material';

export function ChatBubbleEmpty(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        d="M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 13.821 2.487 15.53 3.338 17L2.5 21.5L7 20.662C8.51954 21.5411 10.2445 22.0027 12 22Z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}
