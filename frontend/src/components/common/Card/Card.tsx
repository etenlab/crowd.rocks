import { IonCardHeader } from '@ionic/react';

import {
  CustomCard,
  CustomCardTitle,
  Layout,
  CustomCardContent,
} from './styled';

import { VoteButtonsVertical } from '../VoteButtonsVertical/VoteButtonsVertical';

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
    <Layout>
      <CustomCard onClick={() => onClick && onClick()} routerLink={routerLink}>
        <IonCardHeader>
          <CustomCardTitle>{content || ''}</CustomCardTitle>
        </IonCardHeader>
        <CustomCardContent>{description || ''}</CustomCardContent>
      </CustomCard>
      {vote ? <VoteButtonsVertical {...vote} /> : null}
    </Layout>
  );
}
