import { IonButton } from '@ionic/react';
import { chatbubbleEllipsesSharp } from 'ionicons/icons';
import { useTr } from '../../../hooks/useTr';
import { RowStack } from '../../common/Layout/styled';

import { VoteButtonsHorizontal } from '../../common/VoteButtonsHorizontal';

import { StChatIcon } from '../../common/styled';

type PericopeReaction = {
  mode: 'view' | 'edit';
  vote?: {
    upVotes: number;
    downVotes: number;
    onVoteUpClick: () => void;
    onVoteDownClick: () => void;
  };
  onClickAddPericope(): void;
  onClickDiscussion?: () => void;
};

export function PericopeReaction({
  mode,
  vote,
  onClickAddPericope,
  onClickDiscussion,
}: PericopeReaction) {
  const { tr } = useTr();

  if (mode === 'edit') {
    return (
      <IonButton fill="clear" onClick={onClickAddPericope}>
        {tr('Add Pericope')}
      </IonButton>
    );
  } else {
    const voteButtonCom = vote ? <VoteButtonsHorizontal {...vote} /> : null;

    const discussionCom = onClickDiscussion ? (
      <StChatIcon
        icon={chatbubbleEllipsesSharp}
        onClick={(e) => {
          e.stopPropagation();
          onClickDiscussion();
        }}
      />
    ) : null;

    return (
      <RowStack>
        {voteButtonCom}
        {discussionCom}
      </RowStack>
    );
  }
}
