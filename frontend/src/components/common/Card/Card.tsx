import { ReactNode } from 'react';
import {
  CustomCard,
  CustomCardTitle,
  CustomCardContent,
  CustomCardHeader,
  CustomChatIcon,
} from './styled';

import { VoteButtonsHerizontal } from '../VoteButtonsHerizontal';
import { chatbubbleEllipsesSharp } from 'ionicons/icons';

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
    <CustomChatIcon icon={chatbubbleEllipsesSharp} />
  ) : null;

  return (
    <CustomCard onClick={() => onClick && onClick()} routerLink={routerLink}>
      <CustomCardHeader>
        <CustomCardTitle>
          {content || ''}
          {voteFor === 'content' ? voteButtonCom : null}
        </CustomCardTitle>
      </CustomCardHeader>

      <CustomCardContent>
        {description}
        {voteFor === 'description' ? voteButtonCom : null}
        {chatButton}
      </CustomCardContent>
    </CustomCard>
  );
}
