import { Stack, Button } from '@mui/material';

import { VoteButtonsHorizontal } from '../../common/VoteButtonsHorizontal';
import { DiscussionIconButton } from '../../Discussion/DiscussionButton/DiscussionIconButton';

import { TableNameType, PericopeWithVote } from '../../../generated/graphql';
import { useTogglePericopeVoteStatusMutation } from '../../../hooks/useTogglePericopeVoteStatusMutation';
import { useDeletePericopeMutation } from '../../../hooks/useDeletePericopeMutation';

import { useTr } from '../../../hooks/useTr';
import { DeleteCircle } from '../../common/icons/DeleteCircle';

type PericopeReactionV2Props = {
  pericope: PericopeWithVote;
  onClose(): void;
};

export function PericopeReactionV2({
  pericope,
  onClose,
}: PericopeReactionV2Props) {
  const { tr } = useTr();
  const [deletePericope] = useDeletePericopeMutation();

  const [togglePericopeVoteStatus] = useTogglePericopeVoteStatusMutation();

  const handleUpClick = () => {
    togglePericopeVoteStatus({
      variables: {
        pericope_id: pericope.pericope_id,
        vote: true,
      },
    });
  };

  const handleDeletePericope = () => {
    deletePericope({
      variables: {
        pericope_id: pericope.pericope_id,
      },
    });
    onClose();
  };

  const handleDownClick = () => {
    togglePericopeVoteStatus({
      variables: {
        pericope_id: pericope.pericope_id,
        vote: false,
      },
    });
  };

  return (
    <Stack
      direction="row"
      gap="16px"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        width: '100%',
      }}
    >
      <VoteButtonsHorizontal
        upVotes={pericope.upvotes}
        downVotes={pericope.downvotes}
        onVoteDownClick={handleDownClick}
        onVoteUpClick={handleUpClick}
        flex="2"
      />
      <DiscussionIconButton
        parent_id={pericope.pericope_id}
        parent_table={TableNameType.Pericopies}
        flex="1"
        onClick={onClose}
      />
      <Button
        onClick={handleDeletePericope}
        variant="outlined"
        startIcon={<DeleteCircle sx={{ fontSize: 20 }} />}
        color="orange"
        sx={{ borderRadius: '6px', padding: '4px 10px', flex: 1 }}
      >
        {tr('Delete')}
      </Button>
    </Stack>
  );
}
