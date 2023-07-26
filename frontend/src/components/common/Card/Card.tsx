import { IonCardHeader } from '@ionic/react';

import { CustomCard, CustomCardTitle, CustomCardContent } from './styled';

import { VoteButtonsHerizontal } from '../VoteButtonsHerizontal';

type CardProps = {
  content?: string;
  description?: string;
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
  onClick,
  routerLink,
  vote,
}: CardProps) {
  return (
    <CustomCard onClick={() => onClick && onClick()} routerLink={routerLink}>
      <IonCardHeader>
        <CustomCardTitle>{content || ''}</CustomCardTitle>
      </IonCardHeader>

      <CustomCardContent>
        {description || ''} {vote ? <VoteButtonsHerizontal {...vote} /> : null}
      </CustomCardContent>
    </CustomCard>
  );
}
