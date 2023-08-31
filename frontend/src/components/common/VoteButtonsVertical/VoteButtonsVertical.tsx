import { thumbsDown, thumbsUp } from 'ionicons/icons';
import { StIonVoteIcon, StThumbDiv, StVoteButtonsDiv } from '../styled';

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
    <StVoteButtonsDiv style={{ flexDirection: 'column' }}>
      <StThumbDiv>
        <StIonVoteIcon
          color="success"
          icon={thumbsUp}
          onClick={() => onVoteUpClick()}
        />
        {upVotes}
      </StThumbDiv>
      <StThumbDiv>
        <StIonVoteIcon
          color="danger"
          icon={thumbsDown}
          onClick={() => onVoteDownClick()}
        />
        {downVotes}
      </StThumbDiv>
    </StVoteButtonsDiv>
  );
};
