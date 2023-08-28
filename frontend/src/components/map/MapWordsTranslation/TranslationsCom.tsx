import { useRef } from 'react';
import styled from 'styled-components';
import { Caption } from '../../common/Caption/Caption';
import { WordOrPhraseCard } from '../../word/WordCard/WordOrPhraseCard';
import { IonButton, IonIcon, IonInput, useIonToast } from '@ionic/react';
import { chatbubbleEllipses } from 'ionicons/icons';
import { VoteButtonsVertical } from '../../common/VoteButtonsVertical/VoteButtonsVertical';
import {
  useToggleTranslationVoteStatusMutation,
  useUpsertTranslationFromWordAndDefinitionlikeStringMutation,
} from '../../../generated/graphql';
import { useTr } from '../../../hooks/useTr';
import { WordOrPhraseWithValueAndTranslations } from '../hooks/useMapTranslationTools';
import { StringContentTypes, typeOfString } from '../../../common/utility';

interface TranslationsComProps {
  wordOrPhraseWithTranslations: WordOrPhraseWithValueAndTranslations;
  tLangInfo: LanguageInfo;
  onBackClick: () => void;
}

export const TranslationsCom: React.FC<TranslationsComProps> = ({
  wordOrPhraseWithTranslations,
  tLangInfo,
  onBackClick,
}: TranslationsComProps) => {
  const { tr } = useTr();
  const [present] = useIonToast();

  const newTrRef = useRef<HTMLIonInputElement | null>(null);
  const newDefinitionRef = useRef<HTMLIonInputElement | null>(null);

  const [upsertTranslation] =
    useUpsertTranslationFromWordAndDefinitionlikeStringMutation({
      refetchQueries: ['GetOrigMapWords', 'GetOrigMapPhrases'],
    });

  const [toggleTrVoteStatus] = useToggleTranslationVoteStatusMutation({
    refetchQueries: ['GetOrigMapWords', 'GetOrigMapPhrases'],
  });

  const handleNewTranslation = async (
    from_definition_type_is_word: boolean,
  ) => {
    if (!newTrRef?.current?.value) {
      present({
        message: `${tr('New translation value is mandatory')}`,
        duration: 1500,
        position: 'top',
        color: 'warning',
      });
      return;
    }
    if (!wordOrPhraseWithTranslations.definition_id) {
      present({
        message: `${tr('Error: Not found definition_id')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
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
    const word_or_phrase = String(newTrRef?.current?.value);

    await upsertTranslation({
      variables: {
        language_code: tLangInfo.lang.tag,
        dialect_code: tLangInfo.dialect?.tag,
        geo_code: tLangInfo.region?.tag,
        word_or_phrase: String(newTrRef.current.value),
        definition: String(newDefinitionRef.current.value),
        from_definition_id: wordOrPhraseWithTranslations.definition_id,
        from_definition_type_is_word,
        is_type_word: typeOfString(word_or_phrase) === StringContentTypes.WORD,
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
    translation_id: string,
    from_definition_type_is_word: boolean,
    to_definition_type_is_word: boolean,
    vote: boolean,
  ): void => {
    toggleTrVoteStatus({
      variables: {
        from_definition_type_is_word,
        to_definition_type_is_word,
        translation_id,
        vote,
      },
    });
  };

  return (
    <>
      <Caption handleBackClick={() => onBackClick()}>Translations</Caption>
      <StSourceWordDiv>
        <WordOrPhraseCard
          value={wordOrPhraseWithTranslations.value}
          definition={wordOrPhraseWithTranslations.definition}
        />
        <StIonIcon
          icon={chatbubbleEllipses}
          onClick={() => alert('mock discussion')}
        />
      </StSourceWordDiv>

      <StTranslationsDiv>
        {wordOrPhraseWithTranslations.translations &&
          wordOrPhraseWithTranslations.translations
            .sort((tr1, tr2) => {
              if (!tr1.value || !tr2.value) return 0;
              return tr1.value.localeCompare(tr2.value);
            })
            .map((tr, i) => (
              <StTranslationDiv key={i}>
                <WordOrPhraseCard
                  value={tr.value} // typing is somehave have lost after .sort
                  definition={tr.definition}
                />
                <VoteButtonsVertical
                  onVoteUpClick={() =>
                    handleVoteClick(
                      tr.translation_id,
                      wordOrPhraseWithTranslations.__typename ===
                        'MapWordTranslations',
                      tr.__typename === 'MapWordWithVotes',
                      true,
                    )
                  }
                  onVoteDownClick={() =>
                    handleVoteClick(
                      tr.translation_id,
                      wordOrPhraseWithTranslations.__typename ===
                        'MapWordTranslations',
                      tr.__typename === 'MapWordWithVotes',
                      false,
                    )
                  }
                  upVotes={Number(tr.up_votes || 0)}
                  downVotes={Number(tr.down_votes || 0)}
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
        <StButton
          onClick={() =>
            handleNewTranslation(
              wordOrPhraseWithTranslations.__typename === 'MapWordTranslations',
            )
          }
        >
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
