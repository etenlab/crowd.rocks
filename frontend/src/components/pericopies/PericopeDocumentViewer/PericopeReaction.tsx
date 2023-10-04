import { IonButton } from '@ionic/react';
import { chatbubbleEllipsesSharp } from 'ionicons/icons';
import { useTr } from '../../../hooks/useTr';
import { RowStack } from '../../common/Layout/styled';

import { VoteButtonsHorizontal } from '../../common/VoteButtonsHorizontal';
// import { Flag } from '../../flags/Flag';
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
  // onClickFlag?: () => void;
};

export function PericopeReaction({
  mode,
  vote,
  onClickAddPericope,
  onClickDiscussion, // onClickFlag,
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
    // const flagsCom = onClickFlag ? (
    //   <Flag
    //     parent_table={flags.parent_table}
    //     parent_id={flags.parent_id}
    //     flag_names={flags.flag_names}
    //   />
    // ) : null;
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
