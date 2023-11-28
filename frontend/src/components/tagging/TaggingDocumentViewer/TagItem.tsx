import { useCallback } from 'react';
import { Stack, Typography } from '@mui/material';

import {
  TableNameType,
  WordRangeTagWithVote,
  useToggleWordRangeTagVoteStatusMutation,
} from '../../../generated/graphql';

import { VoteButtonsHorizontal } from '../../common/VoteButtonsHorizontal';
import { DiscussionIconButton } from '../../Discussion/DiscussionButton';

type TagItemProps = {
  tag: WordRangeTagWithVote;
};

export function TagItem({ tag }: TagItemProps) {
  const [toggleWordRangeTagVoteStatus] =
    useToggleWordRangeTagVoteStatusMutation();

  const handleVoteClick = useCallback(
    (vote: boolean): void => {
      toggleWordRangeTagVoteStatus({
        variables: {
          word_range_tag_id: tag.word_range_tag_id,
          vote,
        },
      });
    },
    [tag.word_range_tag_id, toggleWordRangeTagVoteStatus],
  );

  return (
    <Stack
      gap="10px"
      sx={(theme) => ({
        padding: '12px 10px',
        borderRadius: '8px',
        border: `1px solid ${theme.palette.background.gray_stroke}`,
      })}
    >
      <Typography variant="body3" sx={{ fontWeight: 600 }}>
        {tag.tag_name}
      </Typography>

      <Stack
        gap="16px"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <VoteButtonsHorizontal
          upVotes={tag.upvotes}
          downVotes={tag.downvotes}
          onVoteUpClick={() => handleVoteClick(true)}
          onVoteDownClick={() => handleVoteClick(false)}
        />
        <DiscussionIconButton
          parent_table={TableNameType.WordRangeTags}
          parent_id={tag.word_range_tag_id}
          flex="1"
        />
      </Stack>
    </Stack>
  );
}
