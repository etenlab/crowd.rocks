import { ReactNode } from 'react';

import { chatbubbleEllipsesSharp } from 'ionicons/icons';
import { StChatIcon } from '../../common/styled';
import { VoteButtonsHerizontal } from '../../common/VoteButtonsHerizontal';
import {
  AuthorContainer,
  CustomCard,
  CustomCardContent,
  CustomCardHeader,
  CustomCardTitle,
  TimestampContainer,
} from './styled';

type PostProps = {
  created_by: string;
  created_at: string;
  chatContent: ReactNode;
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

export function Post({
  created_by,
  created_at,
  chatContent,
  voteFor = 'content',
  onClick,
  routerLink,
  vote,
  discussion,
}: PostProps) {
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
      <CustomCardHeader>
        <CustomCardTitle>
          <AuthorContainer>
            {created_by}
            <TimestampContainer>{created_at}</TimestampContainer>
          </AuthorContainer>
          {voteFor === 'content' ? voteButtonCom : null}
        </CustomCardTitle>
      </CustomCardHeader>

      <CustomCardContent>
        {chatContent}
        <div style={{ display: 'flex' }}>
          {voteFor === 'description' ? voteButtonCom : null}
          {chatButton}
        </div>
      </CustomCardContent>
    </CustomCard>
  );
}
