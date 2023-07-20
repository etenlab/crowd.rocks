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
          color="black"
          icon={thumbsUp}
          onClick={() => onVoteUpClick()}
        />
        {upVotes}
      </StThumbDiv>
      <StThumbDiv>
        <StIonIcon
          color="black"
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
`;

const StIonIcon = styled(IonIcon)(() => ({
  cursor: 'pointer',
  fontSize: '26px',
  padding: '5px',
}));

const StThumbDiv = styled.div`
  width: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
