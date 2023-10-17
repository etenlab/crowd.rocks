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
      {isCreatedByBot && <IonBadge>bot</IonBadge>}
      {createdBy}
      <TimestampContainer>| {createdAt}</TimestampContainer>
    </AuthorContainer>
  );
}
