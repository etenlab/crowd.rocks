import { ReactElement, ReactNode } from 'react';

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
import { AudioPlayer } from '../AudioPlayer';
import { VideoPlayer } from '../VideoPlayer';

export const getMimeType = (fileType: string | null): string => {
  if (fileType === null || fileType.trim().length === 0) {
    return 'normal';
  }

  const classic = fileType.trim().split('/');

  if (classic.length < 2) return 'normal';

  switch (classic[0]) {
    case 'video': {
      return 'video';
    }
    case 'audio': {
      return 'audio';
    }
    case 'image': {
      return 'image';
    }
    default: {
      return 'normal';
    }
  }
};

type PostProps = {
  created_by: string;
  created_at: string;
  chatContent: ReactNode;
  av_file_url?: string | null;
  av_file_type?: string | null;
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
  av_file_url,
  av_file_type,
}: PostProps) {
  const voteButtonCom = vote ? <VoteButtonsHerizontal {...vote} /> : null;
  const chatButton = discussion ? (
    <StChatIcon
      icon={chatbubbleEllipsesSharp}
      onClick={() => discussion.onChatClick && discussion.onChatClick()}
    />
  ) : null;

  const mime = getMimeType(av_file_type ?? null);
  console.log(`av_file_url: ${av_file_url}`);
  console.log(`av_file_type: ${av_file_type}`);

  let avComp: ReactElement | null = null;

  if (av_file_url) {
    switch (mime) {
      case 'video': {
        avComp = (
          <VideoPlayer src={av_file_url} file_type={av_file_type || ''} />
        );
        break;
      }
      case 'audio': {
        avComp = <AudioPlayer src={av_file_url} file_type="audio/x-wav" />;
        break;
      }
      default: {
        // put stuff here for other attachments...
        console.log('not implemented yet');
        break;
      }
    }
  }

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
            <TimestampContainer>| {created_at}</TimestampContainer>
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
        {avComp}
      </CustomCardContent>
    </CustomCard>
  );
}
