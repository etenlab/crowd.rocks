import { Typography, Stack } from '@mui/material';

import { TableNameType } from '../../../generated/graphql';

import { FlagName } from '../../flags/flagGroups';
import { FlagV2 } from '../../flags/Flag';
import { DiscussionIconButton } from '../../Discussion/DiscussionButton';
import { VoteButtonsHorizontal } from '../VoteButtonsHorizontal';
import { PostAuthor } from '../PostAuthor';

export type WordCardProps = {
  word: string;
  description: string;
  vote?: {
    upVotes: number;
    downVotes: number;
    onVoteUpClick: () => void;
    onVoteDownClick: () => void;
  };
  discussion?: {
    parent_table: string;
    parent_id: string;
  };
  flags?: {
    parent_table: TableNameType;
    parent_id: string;
    flag_names: FlagName[];
  };
  author?: {
    username: string;
    avatar?: string;
    createdAt: Date;
  };
};

export function WordCard({
  word,
  description,
  vote,
  discussion,
  flags,
  author,
}: WordCardProps) {
  const voteButtonCom = vote ? (
    <VoteButtonsHorizontal {...vote} />
  ) : (
    <div></div>
  );
  const discussionBtnCom = discussion ? (
    <DiscussionIconButton {...discussion} />
  ) : null;
  const flagCom = flags ? <FlagV2 {...flags} /> : null;

  return (
    <Stack gap="10px">
      <Stack direction="row" justifyContent="space-between">
        {author ? (
          <PostAuthor
            username={author.username}
            date={author.createdAt}
            avatar={author.avatar}
          />
        ) : (
          <div />
        )}
        {flagCom}
      </Stack>

      <Stack
        gap="16px"
        sx={(theme) => ({
          padding: '16px',
          borderRadius: '10px',
          border: `1px solid ${theme.palette.text.gray_stroke}`,
        })}
      >
        <Stack>
          <Typography variant="h3" color="text.dark">
            {word}
          </Typography>
          <Typography variant="body2" color="text.gray">
            {description}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {voteButtonCom}
          {discussionBtnCom}
        </Stack>
      </Stack>
    </Stack>
  );
}
