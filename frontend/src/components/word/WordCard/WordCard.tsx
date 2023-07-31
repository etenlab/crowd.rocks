import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react';
import { styled } from 'styled-components';

type TWordCardProps = {
  word?: string | null;
  definition?: string | null;
  onClick?: () => void;
  routerLink?: string;
};

export const WordCard = ({
  word,
  definition,
  onClick,
  routerLink,
}: TWordCardProps) => {
  return (
    <StCard onClick={() => onClick && onClick()} routerLink={routerLink}>
      <IonCardHeader>
        <IonCardTitle>{word || ''}</IonCardTitle>
        <IonCardSubtitle>
          <div>{definition || ''}</div>
        </IonCardSubtitle>
      </IonCardHeader>
    </StCard>
  );
};

const StCard = styled(IonCard)(() => ({
  width: '90%',
  height: '90px',
}));
