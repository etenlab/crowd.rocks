import { thumbsDown, thumbsUp } from 'ionicons/icons';
import { StIonVoteIcon, StThumbDiv, StVoteButtonsDiv } from '../styled';

export type VoteButtonsHerizontalProps = {
  onVoteUpClick: () => void;
  onVoteDownClick: () => void;
  upVotes: number;
  downVotes: number;
};

export function VoteButtonsHerizontal({
  onVoteUpClick,
  onVoteDownClick,
  upVotes,
  downVotes,
}: VoteButtonsHerizontalProps) {
  return (
    <StVoteButtonsDiv style={{ flexDirection: 'row' }}>
      <StThumbDiv>
        <StIonVoteIcon
          color="success"
          icon={thumbsUp}
          onClick={(e) => {
            e.stopPropagation();
            onVoteUpClick();
          }}
        />
        {upVotes}
      </StThumbDiv>
      <StThumbDiv>
        <StIonVoteIcon
          color="danger"
          icon={thumbsDown}
          onClick={(e) => {
            e.stopPropagation();
            onVoteDownClick();
          }}
        />
        {downVotes}
      </StThumbDiv>
    </StVoteButtonsDiv>
  );
}
