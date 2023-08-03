import { ReactNode } from 'react';
import {
  CustomCard,
  CustomCardTitle,
  CustomCardContent,
  CustomCardHeader,
} from './styled';

import { VoteButtonsHerizontal } from '../VoteButtonsHerizontal';

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
}: CardProps) {
  const voteButtonCom = vote ? <VoteButtonsHerizontal {...vote} /> : null;

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
      </CustomCardContent>
    </CustomCard>
  );
}
