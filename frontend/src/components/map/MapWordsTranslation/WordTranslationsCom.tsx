import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Caption } from '../../common/Caption/Caption';
import { WordCard } from '../../word/WordCard/WordCard';
import { IonButton, IonIcon, IonInput, useIonToast } from '@ionic/react';
import { chatbubbleEllipses } from 'ionicons/icons';
import { VoteButtonsVertical } from '../../common/VoteButtonsVertical/VoteButtonsVertical';
import {
  WordTranslations,
  useAddWordAsTranslationForWordMutation,
  useToggleWordTranslationVoteStatusMutation,
} from '../../../generated/graphql';
import { useTr } from '../../../hooks/useTr';

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
  const { tr } = useTr();
  const [present] = useIonToast();

  const newTrRef = useRef<HTMLIonInputElement | null>(null);
  const newDefinitionRef = useRef<HTMLIonInputElement | null>(null);

  const [addWordAsTranslation, { data, reset }] =
    useAddWordAsTranslationForWordMutation({
      refetchQueries: ['GetOrigMapWords'],
    });

  const [
    toggleWordTrVoteStatus,
    { data: toggleVoteData, reset: resetToggleVote },
  ] = useToggleWordTranslationVoteStatusMutation({
    refetchQueries: ['GetOrigMapWords'],
  });

  useEffect(() => {
    if (data?.addWordAsTranslationForWord.wordTranslationId) {
      fetchMapWordsFn();
      reset();
    }
    if (toggleVoteData?.toggleWordTrVoteStatus) {
      fetchMapWordsFn();
      resetToggleVote();
    }
  }, [
    data,
    reset,
    fetchMapWordsFn,
    toggleVoteData?.toggleWordTrVoteStatus,
    resetToggleVote,
  ]);

  const handleNewTranslation = async () => {
    if (!newTrRef?.current?.value) {
      present({
        message: `${tr('New translation value is mandatory')}`,
        duration: 1500,
        position: 'top',
        color: 'warning',
      });
      return;
    }
    if (!wordWithTranslations.definition_id) {
      alert(`Not found wordWithTranslations.definition_id`);
      return;
    }
    if (!newDefinitionRef.current?.value) {
      present({
        message: `${tr('Translated value of definition is mandatory')}`,
        duration: 1500,
        position: 'top',
        color: 'warning',
      });
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

    if (newTrRef.current?.value) {
      newTrRef.current.value = '';
    }
    if (newDefinitionRef.current?.value) {
      newDefinitionRef.current.value = '';
    }
  };

  const handleVoteClick = (
    word_to_word_translation_id: string,
    vote: boolean,
  ): void => {
    toggleWordTrVoteStatus({
      variables: {
        word_to_word_translation_id,
        vote: vote,
      },
    });
    // fetchMapWordsFn();
  };

  return (
    <>
      <Caption handleBackClick={() => onBackClick()}>Translations</Caption>
      <StSourceWordDiv>
        <WordCard
          word={wordWithTranslations?.word}
          definition={wordWithTranslations?.definition}
        />
        <StIonIcon
          icon={chatbubbleEllipses}
          onClick={() => alert('mock discussion')}
        />
      </StSourceWordDiv>

      <StTranslationsDiv>
        {wordWithTranslations.translations &&
          wordWithTranslations.translations
            .sort((wtr1, wtr2) => wtr1.word.localeCompare(wtr2.word))
            .map((wtr) => (
              <StTranslationDiv key={wtr.word_id}>
                <WordCard word={wtr.word} definition={wtr.definition} />
                <VoteButtonsVertical
                  onVoteUpClick={() =>
                    handleVoteClick(wtr.translation_id, true)
                  }
                  onVoteDownClick={() =>
                    handleVoteClick(wtr.translation_id, false)
                  }
                  upVotes={Number(wtr.up_votes || 0)}
                  downVotes={Number(wtr.down_votes || 0)}
                />
              </StTranslationDiv>
            ))}
      </StTranslationsDiv>

      <StNewTranslationDiv>
        <IonInput
          label={tr('New Translation')}
          labelPlacement="floating"
          ref={newTrRef}
        />
        <IonInput
          label={tr('Definition')}
          labelPlacement="floating"
          ref={newDefinitionRef}
        />
        <StButton onClick={() => handleNewTranslation()}>
          {tr('Submit')}
        </StButton>
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
