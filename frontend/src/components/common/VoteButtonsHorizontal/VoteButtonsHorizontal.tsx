import { useState } from 'react';
import { Stack } from '@mui/material';

import { UpvoteButton } from '../buttons/vote/UpvoteButton';
import { DownvoteButton } from '../buttons/vote/DownvoteButton';

export type VoteButtonsHerizontalProps = {
  onVoteUpClick: () => void;
  onVoteDownClick: () => void;
  upVotes: number;
  downVotes: number;
  flex?: string;
};

export function VoteButtonsHorizontal({
  onVoteUpClick,
  onVoteDownClick,
  upVotes,
  downVotes,
  flex,
}: VoteButtonsHerizontalProps) {
  const [selected, setSelected] = useState<string>('');

  const handleUpvote = () => {
    setSelected('upvote');
    onVoteUpClick();
  };

  const handleDownvote = () => {
    setSelected('downvote');
    onVoteDownClick();
  };

  return (
    <Stack direction="row" gap="16px" sx={{ flex: flex ? flex : '' }}>
      <UpvoteButton
        selected={selected === 'upvote'}
        upvotes={upVotes + ''}
        onClick={handleUpvote}
      />
      <DownvoteButton
        selected={selected === 'downvote'}
        downvotes={downVotes + ''}
        onClick={handleDownvote}
      />
    </Stack>
  );
}
