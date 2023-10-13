import { Stack, Button, styled } from '@mui/material';

import { ThumbsUp } from '../icons/ThumbsUp';
import { ThumbsDown } from '../icons/ThumbsDown';

const VoteButton = styled(Button)({
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '13px',
  letterSpacing: '-0.26px',
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
        variant="contained"
        color="green"
        startIcon={<ThumbsUp sx={{ fontSize: 24 }} />}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();

          onVoteUpClick();
        }}
      >
        {upVotes}
      </VoteButton>
      <VoteButton
        variant="contained"
        color="red"
        startIcon={<ThumbsDown sx={{ fontSize: 24 }} />}
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
