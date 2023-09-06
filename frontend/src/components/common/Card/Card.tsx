import { ReactNode } from 'react';
import {
  CustomCard,
  CustomCardTitle,
  CustomCardContent,
  CustomCardHeader,
} from './styled';

import { VoteButtonsHerizontal } from '../VoteButtonsHerizontal';
import { chatbubbleEllipsesSharp } from 'ionicons/icons';
import { StChatIcon } from '../styled';

type CardProps = {
  content?: string | ReactNode;
  description?: ReactNode;
  voteFor?: 'content' | 'description';
  vote?: {
    upVotes: number;
    downVotes: number;
    onVoteUpClick: () => void;
    onVoteDownClick: () => void;
  };
  discussion?: {
    onChatClick: () => void;
  };
  onClick?: () => void;
  routerLink?: string;
};

export function Card({
  content,
  description,
  voteFor = 'content',
  onClick,
  routerLink,
  vote,
  discussion,
}: CardProps) {
  const voteButtonCom = vote ? <VoteButtonsHerizontal {...vote} /> : null;

  // the chat icon should be grouped with the vote buttons
  const reactionCom = discussion ? (
    vote ? (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {voteButtonCom}
        <StChatIcon
          icon={chatbubbleEllipsesSharp}
          onClick={(e) => {
            e.stopPropagation();
            discussion.onChatClick && discussion.onChatClick();
          }}
        />
      </div>
    ) : (
      <StChatIcon
        icon={chatbubbleEllipsesSharp}
        onClick={(e) => {
          e.stopPropagation();
          discussion.onChatClick && discussion.onChatClick();
        }}
      />
    )
  ) : vote ? (
    voteButtonCom
  ) : null;

  return (
    <CustomCard
      onClick={() => onClick && onClick()}
      routerLink={routerLink}
      style={{ cursor: onClick ? 'pointer' : 'unset' }}
    >
      {content ? (
        <CustomCardHeader>
          <CustomCardTitle>
            {content || ''}
            {voteFor === 'content' ? reactionCom : null}
          </CustomCardTitle>
        </CustomCardHeader>
      ) : null}

      {description ? (
        <CustomCardContent>
          {description}
          {voteFor === 'description' ? reactionCom : null}
        </CustomCardContent>
      ) : null}
    </CustomCard>
  );
}
