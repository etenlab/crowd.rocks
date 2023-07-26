import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { mockWordTranslations } from '../mocks/mapData.mock';
import { Caption } from '../../common/Caption/Caption';
import { RouteComponentProps } from 'react-router';
import { tag2langInfo } from '../../../common/langUtils';
import { WordCard } from '../../word/WordCard/WordCard';
import { IonButton, IonIcon, IonInput } from '@ionic/react';
import { chatbubbleEllipses } from 'ionicons/icons';
import { VoteButtonsVertical } from '../../common/VoteButtonsVertical/VoteButtonsVertical';

interface WordTranslationsProps
  extends RouteComponentProps<{
    id: string;
    fullLangTag: string;
  }> {}

export const WordTranslations: React.FC<WordTranslationsProps> = ({
  match: {
    params: { id, fullLangTag },
  },
}: WordTranslationsProps) => {
  const wordId = Number(id);

  const targetLang: LanguageInfo = useMemo(
    () => tag2langInfo(fullLangTag),
    [fullLangTag],
  );

  const [wordWithTranslations, setWordWithTranslations] = useState<
    TWordWithTranslations | undefined
  >();

  const newTrRef = useRef<HTMLIonInputElement | null>(null);
  const newDescRef = useRef<HTMLIonInputElement | null>(null);

  useEffect(() => {
    const getWordWithTranslations = async (
      _wordId: number,
      _targetLang: LanguageInfo,
    ) => {
      console.log(
        `mocked loading word with translations for ${_wordId} to lang ${JSON.stringify(
          _targetLang,
        )}`,
      );
      const word = mockWordTranslations;
      setWordWithTranslations(word);
    };
    getWordWithTranslations(wordId, targetLang);
  }, [wordId, targetLang]);

  const handleNewTranslation = async () => {
    if (!newTrRef?.current?.value) {
      alert(`New translation value is mandatory`);
      return;
    }
    console.log(
      `mock send new transation (${newTrRef.current.value}) and description (${newDescRef?.current?.value})`,
    );

    if (newTrRef.current?.value) {
      newTrRef.current.value = '';
    }
    if (newDescRef.current?.value) {
      newDescRef.current.value = '';
    }
  };

  return (
    <>
      <Caption>Translations</Caption>
      <StSourceWordDiv>
        <WordCard word={wordWithTranslations?.word} />
        <StIonIcon
          icon={chatbubbleEllipses}
          onClick={() => alert('mock discussion')}
        />
      </StSourceWordDiv>

      <StTranslationsDiv>
        {wordWithTranslations &&
          wordWithTranslations.translationsVoted.map((trv) => (
            <StTranslationDiv key={trv.word.id}>
              <WordCard word={trv.word} />
              <VoteButtonsVertical
                onVoteUpClick={() => alert(`up ${trv.word.id}`)}
                onVoteDownClick={() => alert(`down ${trv.word.id}`)}
                upVotes={50}
                downVotes={245}
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
          ref={newDescRef}
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
