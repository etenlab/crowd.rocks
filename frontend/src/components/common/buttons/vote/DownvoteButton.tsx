import { Button } from '@mui/material';

import { ThumbsDown } from '../../icons/ThumbsDown';

export type DownvoteButtonProps = {
  onClick(): void;
  downvotes: string;
  selected?: boolean;
};

export function DownvoteButton({
  onClick,
  downvotes,
  selected,
}: DownvoteButtonProps) {
  return (
    <Button
      variant="outlined"
      sx={(theme) => ({
        padding: '5px 10px',
        borderRadius: '6px',
        background: selected ? '#FFDBDB' : '',
        color: selected ? theme.palette.text.red : '',
        border: selected ? 'none' : '',
      })}
      startIcon={<ThumbsDown sx={{ fontSize: 22 }} />}
      color="red"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
      fullWidth
    >
      {downvotes}
    </Button>
  );
}
