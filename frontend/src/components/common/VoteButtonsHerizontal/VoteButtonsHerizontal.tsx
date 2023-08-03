import { thumbsDown, thumbsUp } from 'ionicons/icons';

import { StButtonsDiv, StThumbDiv, StIonIcon } from './styled';

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
    <StButtonsDiv>
      <StThumbDiv>
        <StIonIcon
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
        <StIonIcon
          color="danger"
          icon={thumbsDown}
          onClick={(e) => {
            e.stopPropagation();
            onVoteDownClick();
          }}
        />
        {downVotes}
      </StThumbDiv>
    </StButtonsDiv>
  );
}
