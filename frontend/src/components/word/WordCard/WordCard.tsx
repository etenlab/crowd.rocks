import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react';
import { styled } from 'styled-components';

type TWordCardProps = {
  word?: TWord;
  onClick?: () => void;
  routerLink?: string;
};

export const WordCard = ({ word, onClick, routerLink }: TWordCardProps) => {
  return (
    <StCard onClick={() => onClick && onClick()} routerLink={routerLink}>
      <IonCardHeader>
        <IonCardTitle>{word?.content || ''}</IonCardTitle>
        <IonCardSubtitle>
          <div>{word?.definition || ''}</div>
        </IonCardSubtitle>
      </IonCardHeader>
    </StCard>
  );
};

const StCard = styled(IonCard)(() => ({
  width: '90%',
  height: '90px',
  cursor: 'pointer',
}));
