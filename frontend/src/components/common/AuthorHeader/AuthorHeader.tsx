import { IonBadge } from '@ionic/react';
import { AuthorContainer, TimestampContainer } from './styled';

type AuthorHeaderProps = {
  isCreatedByBot: boolean;
  createdBy: string;
  createdAt: string;
};
export function AuthorHeader({
  isCreatedByBot,
  createdBy,
  createdAt,
}: AuthorHeaderProps) {
  return (
    <AuthorContainer>
      {createdBy}
      <TimestampContainer>| {createdAt}</TimestampContainer>
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
