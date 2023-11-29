import { Stack } from '@mui/material';

// import { VoteButtonsHorizontal } from '../../common/VoteButtonsHorizontal';
import { DiscussionIconButton } from '../../Discussion/DiscussionButton/DiscussionIconButton';

import { TableNameType, PericopeWithVote } from '../../../generated/graphql';
// import { useTogglePericopeVoteStatusMutation } from '../../../hooks/useTogglePericopeVoteStatusMutation';

type PericopeReactionProps = {
  pericope: PericopeWithVote;
  onClose(): void;
};

export function PericopeReaction({ pericope, onClose }: PericopeReactionProps) {
  // const [togglePericopeVoteStatus] = useTogglePericopeVoteStatusMutation();

  // const handleUpClick = () => {
  //   togglePericopeVoteStatus({
  //     variables: {
  //       pericope_id: pericope.pericope_id,
  //       vote: true,
  //     },
  //   });
  // };

  // const handleDownClick = () => {
  //   togglePericopeVoteStatus({
  //     variables: {
  //       pericope_id: pericope.pericope_id,
  //       vote: false,
  //     },
  //   });
  // };

  return (
    <Stack
      direction="row"
      gap="16px"
      alignItems="center"
      sx={(theme) => ({
        padding: '10px',
        border: `1px solid ${theme.palette.text.gray_stroke}`,
        borderRadius: '6px',
        backgroundColor: theme.palette.background.white,
      })}
    >
      {/* <VoteButtonsHorizontal
        upVotes={pericope.upvotes}
        downVotes={pericope.downvotes}
        onVoteDownClick={handleDownClick}
        onVoteUpClick={handleUpClick}
      /> */}
      <DiscussionIconButton
        parent_id={pericope.pericope_id}
        parent_table={TableNameType.Pericopies}
        flex="1"
        onClick={onClose}
      />
    </Stack>
  );
}
