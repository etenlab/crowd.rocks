import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react';
import { styled } from 'styled-components';
import { StChatIcon } from '../../common/styled';
import { chatbubbleEllipsesSharp } from 'ionicons/icons';
import { VoteButtonsVertical } from '../../common/VoteButtonsVertical/VoteButtonsVertical';

type TWordCardProps = {
  value?: string | null;
  definition?: string | null;
  onClick?: () => void;
  routerLink?: string;
  discussion?: {
    onChatClick: () => void;
  };
  vote?: {
    upVotes: number;
    downVotes: number;
    onVoteUpClick: () => void;
    onVoteDownClick: () => void;
  };
};

export const WordOrPhraseCard = ({
  value,
  definition,
  onClick,
  routerLink,
  discussion,
  vote,
}: TWordCardProps) => {
  const chatButton = discussion ? (
    <StChatIcon
      icon={chatbubbleEllipsesSharp}
      onClick={() => discussion.onChatClick && discussion.onChatClick()}
    />
  ) : null;
  const voteButtonCom = vote ? <VoteButtonsVertical {...vote} /> : null;
  return (
    <StCard onClick={() => onClick && onClick()} routerLink={routerLink}>
      <IonCardHeader>
        <StHeaderContent>
          <div>
            <IonCardTitle>{value || ''}</IonCardTitle>
            <StCardSubtitle>
              <div>{definition || ''}</div>
            </StCardSubtitle>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
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
