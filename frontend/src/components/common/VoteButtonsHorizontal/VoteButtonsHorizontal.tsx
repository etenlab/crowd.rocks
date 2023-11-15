import { Stack, Button, styled } from '@mui/material';

import { ThumbsUp } from '../icons/ThumbsUp';
import { ThumbsDown } from '../icons/ThumbsDown';

const VoteButton = styled(Button)({
  padding: '5px 10px',
  borderRadius: '6px',
  fontSize: '13px',
  letterSpacing: '-0.26px',
  minWidth: '52px',
  '& .MuiButton-startIcon': {
    marginRight: '4px',
  },
});

export type VoteButtonsHerizontalProps = {
  onVoteUpClick: () => void;
  onVoteDownClick: () => void;
  upVotes: number;
  downVotes: number;
};

export function VoteButtonsHorizontal({
  onVoteUpClick,
  onVoteDownClick,
  upVotes,
  downVotes,
}: VoteButtonsHerizontalProps) {
  return (
    <Stack direction="row" gap="16px">
      <VoteButton
        variant="outlined"
        color="green"
        startIcon={<ThumbsUp sx={{ fontSize: 20 }} />}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();

          onVoteUpClick();
        }}
      >
        {upVotes}
      </VoteButton>
      <VoteButton
        variant="outlined"
        color="red"
        startIcon={<ThumbsDown sx={{ fontSize: 20 }} />}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();

          onVoteDownClick();
        }}
      >
        {downVotes}
      </VoteButton>
    </Stack>
  );
}
