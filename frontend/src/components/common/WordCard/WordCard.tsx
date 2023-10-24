import { Typography, Stack } from '@mui/material';

import { TableNameType } from '../../../generated/graphql';

import { FlagName, authorizedForAnyFlag } from '../../flags/flagGroups';
import { FlagV2 } from '../../flags/Flag';
import { DiscussionIconButton } from '../../Discussion/DiscussionButton';
import { VoteButtonsHorizontal } from '../VoteButtonsHorizontal';
import { PostAuthor } from '../PostAuthor';
import { MoreHorizButton } from '../buttons/MoreHorizButton';

export type Author = {
  username: string;
  avatar?: string;
  createdAt: Date;
};

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
  author?: Author;
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
        <MoreHorizButton
          sx={{
            display: authorizedForAnyFlag(flags?.flag_names ?? [])
              ? undefined
              : 'none',
          }}
          component={flags ? <FlagV2 {...flags} /> : null}
        />
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
