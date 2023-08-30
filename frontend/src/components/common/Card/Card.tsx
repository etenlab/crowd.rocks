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
  content?: string;
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
  const chatButton = discussion ? (
    <StChatIcon
      icon={chatbubbleEllipsesSharp}
      onClick={() => discussion.onChatClick && discussion.onChatClick()}
    />
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
            {voteFor === 'content' ? voteButtonCom : null}
          </CustomCardTitle>
        </CustomCardHeader>
      ) : null}

      {description ? (
        <CustomCardContent>
          {description}
          <div style={{ display: 'flex' }}>
            {voteFor === 'description' ? voteButtonCom : null}
            {chatButton}
          </div>
        </CustomCardContent>
      ) : null}
    </CustomCard>
  );
}
