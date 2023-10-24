import { useState, MouseEvent, ReactNode } from 'react';
import { IconButton, Popover, IconButtonProps } from '@mui/material';

import { MoreHoriz } from '../../icons/MoreHoriz';

export type MoreHorizButtonProps = Omit<IconButtonProps, 'component'> & {
  component: ReactNode;
  popoverWidth?: string;
};

export function MoreHorizButton({
  component,
  popoverWidth,
  ...props
}: MoreHorizButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();

    setAnchorEl(event.currentTarget);
    // onClick && onClick(event);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleClick}
        color="gray"
        sx={(theme) => ({
          padding: '4px',
          background: theme.palette.text.white,
          '&:hover': {
            background: theme.palette.background.gray_stroke,
          },
          border: `1.5px solid ${theme.palette.text.gray_stroke}`,
        })}
        {...props}
      >
        <MoreHoriz sx={{ fontSize: 24 }} />
      </IconButton>
      <Popover
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={(theme) => ({
          '& .MuiPopover-paper': {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '19px 15px',
            border: `1.5px solid ${theme.palette.text.gray_stroke}`,
            borderRadius: '8px',
            width: popoverWidth ? popoverWidth : '150px',
          },
        })}
      >
        {component}
      </Popover>
    </>
  );
}
