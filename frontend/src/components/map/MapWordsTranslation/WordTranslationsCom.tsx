import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Caption } from '../../common/Caption/Caption';
import { WordCard } from '../../word/WordCard/WordCard';
import { IonButton, IonIcon, IonInput } from '@ionic/react';
import { chatbubbleEllipses } from 'ionicons/icons';
import { VoteButtonsVertical } from '../../common/VoteButtonsVertical/VoteButtonsVertical';
import {
  WordTranslations,
  useAddWordAsTranslationForWordMutation,
} from '../../../generated/graphql';

interface WordTranslationsComProps {
  wordWithTranslations: WordTranslations;
  tLangInfo: LanguageInfo;
  onBackClick: () => void;
  fetchMapWordsFn: () => void;
}

export const WordTranslationsCom: React.FC<WordTranslationsComProps> = ({
  wordWithTranslations,
  tLangInfo,
  onBackClick,
  fetchMapWordsFn,
}: WordTranslationsComProps) => {
  const newTrRef = useRef<HTMLIonInputElement | null>(null);
  const newDefinitionRef = useRef<HTMLIonInputElement | null>(null);

  const [addWordAsTranslation, { data, loading, called, error }] =
    useAddWordAsTranslationForWordMutation();

  useEffect(() => {
    if (
      called &&
      !loading &&
      !error &&
      data?.addWordAsTranslationForWord.wordTranslationId
    ) {
      onBackClick();
    }
  }, [data, loading, called, error, onBackClick]);

  const handleNewTranslation = async () => {
    if (!newTrRef?.current?.value) {
      alert(`New translation value is mandatory`);
      return;
    }
    if (!wordWithTranslations.definition_id) {
      alert(`Not found wordWithTranslations.definition_id`);
      return;
    }
    if (!newDefinitionRef.current?.value) {
      alert(`Not found newDefinitionRef.current?.value`);
      return;
    }

    await addWordAsTranslation({
      variables: {
        originalDefinitionId: wordWithTranslations.definition_id,
        translationWord: {
          wordlike_string: String(newTrRef.current.value),
          language_code: tLangInfo.lang.tag,
          dialect_code: tLangInfo.dialect?.tag,
          geo_code: tLangInfo.region?.tag,
        },
        translationDefinition: String(newDefinitionRef.current.value),
      },
    });

    fetchMapWordsFn();

    if (newTrRef.current?.value) {
      newTrRef.current.value = '';
    }
    if (newDefinitionRef.current?.value) {
      newDefinitionRef.current.value = '';
    }
  };

  return (
    <>
      <Caption handleBackClick={() => onBackClick()}>Translations</Caption>
      <StSourceWordDiv>
        <WordCard word={wordWithTranslations?.word} />
        <StIonIcon
          icon={chatbubbleEllipses}
          onClick={() => alert('mock discussion')}
        />
      </StSourceWordDiv>

      <StTranslationsDiv>
        {wordWithTranslations.translations &&
          wordWithTranslations.translations.map((trv) => (
            <StTranslationDiv key={trv.word_id}>
              <WordCard word={trv.word} definition={trv.definition} />
              <VoteButtonsVertical
                onVoteUpClick={() => alert(`up ${trv.word_id}`)}
                onVoteDownClick={() => alert(`down ${trv.word_id}`)}
                upVotes={Number(trv.up_votes || 0)}
                downVotes={Number(trv.down_votes || 0)}
              />
            </StTranslationDiv>
          ))}
      </StTranslationsDiv>

      <StNewTranslationDiv>
        <IonInput
          label="New Translation"
          labelPlacement="floating"
          ref={newTrRef}
        />
        <IonInput
          label="Description"
          labelPlacement="floating"
          ref={newDefinitionRef}
        />
        <StButton onClick={() => handleNewTranslation()}>Submit</StButton>
      </StNewTranslationDiv>
    </>
  );
};

const StTranslationsDiv = styled.div`
  margin-top: 30px;
  width: 90%;
`;

const StTranslationDiv = styled.div`
  display: flex;
`;
const StSourceWordDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StIonIcon = styled(IonIcon)(() => ({
  fontSize: '30px',
  cursor: 'pointer',
}));

const StNewTranslationDiv = styled.div`
  width: 90%;
`;

const StButton = styled(IonButton)(() => ({
  marginTop: '20px',
  float: 'right',
}));
