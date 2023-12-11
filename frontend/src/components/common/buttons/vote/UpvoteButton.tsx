import { Button } from '@mui/material';

import { ThumbsUp } from '../../icons/ThumbsUp';

export type UpvoteButtonProps = {
  onClick(): void;
  upvotes: string;
  selected?: boolean;
  flex?: string;
};

export function UpvoteButton({
  onClick,
  upvotes,
  selected,
}: UpvoteButtonProps) {
  return (
    <Button
      variant="outlined"
      sx={(theme) => ({
        padding: '5px 10px',
        borderRadius: '6px',
        background: selected ? '#D4F5E5' : '',
        color: selected ? theme.palette.text.green : '',
        border: selected ? 'none' : '',
      })}
      startIcon={<ThumbsUp sx={{ fontSize: 22 }} />}
      color="green"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
      fullWidth
    >
      {upvotes}
    </Button>
  );
}
