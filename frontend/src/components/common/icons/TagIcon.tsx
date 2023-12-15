import { SvgIcon, type SvgIconProps } from '@mui/material';

export function TagIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1282_10258)">
          <path
            d="M8.5 9.5C9.05228 9.5 9.5 9.05228 9.5 8.5C9.5 7.94772 9.05228 7.5 8.5 7.5C7.94772 7.5 7.5 7.94772 7.5 8.5C7.5 9.05228 7.94772 9.5 8.5 9.5Z"
            fill="#FF5F2D"
            stroke="#FF5F2D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 7V10.859C4 11.396 4.213 11.911 4.593 12.291L12.709 20.407C12.897 20.5951 13.1203 20.7443 13.366 20.846C13.6117 20.9478 13.875 21.0002 14.141 21.0002C14.407 21.0002 14.6703 20.9478 14.916 20.846C15.1617 20.7443 15.385 20.5951 15.573 20.407L20.407 15.573C20.5951 15.385 20.7443 15.1617 20.846 14.916C20.9478 14.6703 21.0002 14.407 21.0002 14.141C21.0002 13.875 20.9478 13.6117 20.846 13.366C20.7443 13.1203 20.5951 12.897 20.407 12.709L12.29 4.593C11.9104 4.2135 11.3957 4.00021 10.859 4H7C6.20435 4 5.44129 4.31607 4.87868 4.87868C4.31607 5.44129 4 6.20435 4 7Z"
            stroke="#FF5F2D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_1282_10258">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
}
