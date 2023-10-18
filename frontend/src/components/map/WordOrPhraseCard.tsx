import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react';
import { styled } from 'styled-components';
import { VoteButtonsVertical } from '../common/VoteButtonsVertical/VoteButtonsVertical';
import { TableNameType } from '../../generated/graphql';
import { Flag } from '../flags/Flag';
import { FlagName } from '../flags/flagGroups';
import { Chat } from '../chat/Chat';
import { AuthorHeader } from '../common/AuthorHeader';

type TWordCardProps = {
  value?: string | null;
  definition?: string | null;
  onClick?: () => void;
  routerLink?: string;
  discussion?: {
    onChatClick: () => void;
    parent_id: string;
    parent_table: string;
  };
  vote?: {
    upVotes: number;
    downVotes: number;
    onVoteUpClick: () => void;
    onVoteDownClick: () => void;
  };
  flags?: {
    parent_table: TableNameType;
    parent_id: string;
    flag_names: FlagName[];
  };
  createdBy?: {
    username: string;
    isBot: boolean;
    createdAt: string;
  };
};

export const WordOrPhraseCard = ({
  value,
  definition,
  onClick,
  routerLink,
  discussion,
  vote,
  flags,
  createdBy,
}: TWordCardProps) => {
  const chatButton = discussion ? (
    <Chat
      parent_id={discussion.parent_id}
      parent_table={discussion.parent_table}
      onClick={discussion.onChatClick}
    />
  ) : null;
  const voteButtonCom = vote ? <VoteButtonsVertical {...vote} /> : null;
  const flagsCom = flags ? (
    <Flag
      parent_table={flags.parent_table}
      parent_id={flags.parent_id}
      flag_names={flags.flag_names}
    />
  ) : null;

  return (
    <StCard onClick={() => onClick && onClick()} routerLink={routerLink}>
      <IonCardHeader>
        <StHeaderContent>
          {createdBy && createdBy.createdAt && (
            <div>
              <AuthorHeader
                createdAt={createdBy.createdAt}
                createdBy={createdBy.username}
                isCreatedByBot={createdBy.isBot}
              />
            </div>
          )}
          <div>
            <IonCardTitle>{value || ''}</IonCardTitle>
            <StCardSubtitle>
              <div>{definition || ''}</div>
            </StCardSubtitle>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {flagsCom}
            {chatButton}
            {voteButtonCom}
          </div>
        </StHeaderContent>
      </IonCardHeader>
    </StCard>
  );
};

const StCard = styled(IonCard)(() => ({
  width: '90%',
  height: '90px',
}));

const StHeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StCardSubtitle = styled(IonCardSubtitle)(() => ({
  paddingTop: '5px',
}));
