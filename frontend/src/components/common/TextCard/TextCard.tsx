import { Typography, Stack, Box } from '@mui/material';

import { TableNameType } from '../../../generated/graphql';

import { FlagName, authorizedForAnyFlag } from '../../flags/flagGroups';
import { FlagV2 } from '../../flags/Flag';
import { DiscussionIconButton } from '../../Discussion/DiscussionButton';
import { VoteButtonsHorizontal } from '../VoteButtonsHorizontal';
import { PostAuthor } from '../PostAuthor';
import { MoreHorizButton } from '../buttons/MoreHorizButton';
import { StarYellow } from '../icons/StarYellow';

export type Author = {
  username: string;
  avatar?: string;
  createdAt: Date;
  createdByBot?: boolean;
};

export type TextCardProps = {
  text: string;
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
  isStarred?: boolean;
};

export function TextCard({
  text,
  description,
  vote,
  discussion,
  flags,
  author,
  isStarred,
}: TextCardProps) {
  const voteButtonCom = vote ? <VoteButtonsHorizontal {...vote} /> : null;
  const discussionBtnCom = discussion ? (
    <DiscussionIconButton {...discussion} flex="1" />
  ) : null;

  return (
    <Stack gap="10px">
      <Stack direction="row" justifyContent="space-between">
        <Box display={'flex'} alignItems={'center'} gap="20px">
          {author ? (
            <PostAuthor
              username={author.username}
              date={author.createdAt}
              avatar={author.avatar}
              isCreatedByBot={author.createdByBot}
            />
          ) : (
            <div />
          )}
          {isStarred && <StarYellow />}
        </Box>
        {authorizedForAnyFlag(flags?.flag_names ?? []) ? (
          <MoreHorizButton
            dropDownList={
              flags ? [{ key: 'flag', component: <FlagV2 {...flags} /> }] : []
            }
          />
        ) : null}
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
            {text}
          </Typography>
          <Typography variant="body2" color="text.gray">
            {description}
          </Typography>
        </Stack>

        <Stack
          gap="16px"
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
