import { IonBadge } from '@ionic/react';
import { AuthorContainer, TimestampContainer } from './styled';
import { Avatar } from '../Avatar';
import Typography from '@mui/material/Typography';

type AuthorHeaderProps = {
  isCreatedByBot: boolean;
  createdBy: string;
  createdAt: string;
  createdByUrl?: string;
};
export function AuthorHeader({
  isCreatedByBot,
  createdBy,
  createdAt,
  createdByUrl,
}: AuthorHeaderProps) {
  return (
    <AuthorContainer>
      <Avatar username={createdBy} mini={true} url={createdByUrl}></Avatar>
      <Typography variant="body1" color="dark">
        @{createdBy}
      </Typography>
      <TimestampContainer>• {createdAt}</TimestampContainer>
      {isCreatedByBot && (
        <IonBadge
          style={{ fontSize: '12px', marginLeft: '5px', marginTop: '-2px' }}
        >
          bot
        </IonBadge>
      )}
    </AuthorContainer>
  );
}
