import { useMemo } from 'react';
import { Stack } from '@mui/material';

import { VoteButtonsHorizontal } from '../../common/VoteButtonsHorizontal';
import { DiscussionIconButton } from '../../Discussion/DiscussionButton/DiscussionIconButton';

import {
  useGetPericopeVoteStatusQuery,
  TableNameType,
  ErrorType,
} from '../../../generated/graphql';
import { useTogglePericopeVoteStatusMutation } from '../../../hooks/useTogglePericopeVoteStatusMutation';

type PericopeReactionProps = {
  pericopeId: string;
  onClose(): void;
};

export function PericopeReaction({
  pericopeId,
  onClose,
}: PericopeReactionProps) {
  const { data: voteStatusData, error: voteStatusError } =
    useGetPericopeVoteStatusQuery({
      variables: {
        pericope_id: pericopeId,
      },
    });
  const [togglePericopeVoteStatus] = useTogglePericopeVoteStatusMutation();

  const vote = useMemo(() => {
    if (
      voteStatusError ||
      !voteStatusData ||
      voteStatusData.getPericopeVoteStatus.error !== ErrorType.NoError ||
      !voteStatusData.getPericopeVoteStatus.vote_status
    ) {
      return null;
    }

    const voteStatus = voteStatusData.getPericopeVoteStatus.vote_status;

    if (pericopeId !== voteStatus.pericope_id) {
      return null;
    }

    const handleUpClick = () => {
      togglePericopeVoteStatus({
        variables: {
          pericope_id: voteStatus.pericope_id,
          vote: true,
        },
      });
    };

    const handleDownClick = () => {
      togglePericopeVoteStatus({
        variables: {
          pericope_id: voteStatus.pericope_id,
          vote: false,
        },
      });
    };

    return {
      upVotes: voteStatus.upvotes,
      downVotes: voteStatus.downvotes,
      onVoteUpClick: handleUpClick,
      onVoteDownClick: handleDownClick,
    };
  }, [pericopeId, voteStatusError, voteStatusData, togglePericopeVoteStatus]);

  const voteButtonCom = vote ? <VoteButtonsHorizontal {...vote} /> : null;

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
      {voteButtonCom}
      <DiscussionIconButton
        parent_id={pericopeId}
        parent_table={TableNameType.Pericopies}
        flex="1"
        onClick={onClose}
      />
    </Stack>
  );
}
