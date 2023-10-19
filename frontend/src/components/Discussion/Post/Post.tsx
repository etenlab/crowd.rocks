import { ReactElement, ReactNode } from 'react';

import { chatbubbleEllipsesSharp } from 'ionicons/icons';
import { StChatIcon } from '../../common/styled';
import { VoteButtonsHorizontal } from '../../common/VoteButtonsHorizontal';
import {
  CustomCard,
  CustomCardContent,
  CustomCardHeader,
  CustomCardTitle,
} from './styled';
import { AudioPlayer } from '../AudioPlayer';
import { VideoPlayer } from '../VideoPlayer';
import { PostAuthor } from '../../common/PostAuthor';
import { Stack } from '@mui/material';

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
  chatContent: ReactNode;
  av_file_url?: string | null;
  av_file_type?: string | null;
  author?: {
    username: string;
    avatar?: string;
    createdAt: Date;
  };
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
  author,
  chatContent,
  voteFor = 'content',
  onClick,
  routerLink,
  vote,
  discussion,
  av_file_url,
  av_file_type,
}: PostProps) {
  const voteButtonCom = vote ? <VoteButtonsHorizontal {...vote} /> : null;
  const chatButton = discussion ? (
    <StChatIcon
      icon={chatbubbleEllipsesSharp}
      onClick={() => discussion.onChatClick && discussion.onChatClick()}
    />
  ) : null;

  const mime = getMimeType(av_file_type ?? null);

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
    <Stack gap="10px">
      {author ? (
        <PostAuthor
          username={author.username}
          avatar={author.avatar}
          date={author.createdAt}
        />
      ) : (
        <div />
      )}
      <CustomCard
        onClick={() => onClick && onClick()}
        routerLink={routerLink}
        style={{ cursor: onClick ? 'pointer' : 'unset' }}
      >
        <CustomCardHeader>
          <CustomCardTitle>
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
    </Stack>
  );
}
