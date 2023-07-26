import { IonIcon } from '@ionic/react';
import { thumbsDown, thumbsUp } from 'ionicons/icons';
import { styled } from 'styled-components';

export type TVoteButtonsVerticalProps = {
  onVoteUpClick: () => void;
  onVoteDownClick: () => void;
  upVotes: number;
  downVotes: number;
};

export const VoteButtonsVertical = ({
  onVoteUpClick,
  onVoteDownClick,
  upVotes,
  downVotes,
}: TVoteButtonsVerticalProps) => {
  return (
    <StButtonsDiv>
      <StThumbDiv>
        <StIonIcon
          color="green"
          icon={thumbsUp}
          onClick={() => onVoteUpClick()}
        />
        {upVotes}
      </StThumbDiv>
      <StThumbDiv>
        <StIonIcon
          color="red"
          icon={thumbsDown}
          onClick={() => onVoteDownClick()}
        />
        {downVotes}
      </StThumbDiv>
    </StButtonsDiv>
  );
};

const StButtonsDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  gap: 10px;
`;

const StIonIcon = styled(IonIcon)(() => ({
  cursor: 'pointer',
  fontSize: '20px',
  padding: '5px',
}));

const StThumbDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
`;
