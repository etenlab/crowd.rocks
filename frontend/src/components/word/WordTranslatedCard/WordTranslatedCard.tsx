import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react';
import { styled } from 'styled-components';

export type TWordTranslationCardProps = {
  wordTranslated: TWordTranslated;
};

export const WordTranslatedCard = ({
  wordTranslated,
}: TWordTranslationCardProps) => {
  const { translation } = wordTranslated;
  return (
    <WordCard>
      <IonCardHeader>
        <IonCardTitle>{wordTranslated.word.content}</IonCardTitle>
        <IonCardSubtitle>
          <div>{translation.word.content}</div>
        </IonCardSubtitle>
      </IonCardHeader>
    </WordCard>
  );
};

const WordCard = styled(IonCard)(() => ({
  width: '45%',
  display: 'inline-block',
}));
