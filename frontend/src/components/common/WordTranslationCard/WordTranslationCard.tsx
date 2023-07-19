import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react';
import { styled } from 'styled-components';

export type TWordTranslationCardProps = {
  wordWithTranslations: TWordWithTranslations;
};

export const WordTranslationCard = ({
  wordWithTranslations,
}: TWordTranslationCardProps) => {
  const { translations } = wordWithTranslations;
  return (
    <WordCard>
      <IonCardHeader>
        <IonCardTitle>{wordWithTranslations.word.content}</IonCardTitle>
        <IonCardSubtitle>
          {translations.map((tr) => (
            <div key={tr.id}>{tr.content}</div>
          ))}
        </IonCardSubtitle>
      </IonCardHeader>
    </WordCard>
  );
};

const WordCard = styled(IonCard)(() => ({
  width: '45%',
  display: 'inline-block',
}));
