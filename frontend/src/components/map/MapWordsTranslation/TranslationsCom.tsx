import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Caption } from '../../common/Caption/Caption';
import { WordOrPhraseCard } from './WordOrPhraseCard';
import { IonButton, IonInput, useIonRouter, useIonToast } from '@ionic/react';
import {
  ErrorType,
  TableNameType,
  useToggleTranslationVoteStatusMutation,
  useUpsertTranslationFromWordAndDefinitionlikeStringMutation,
} from '../../../generated/graphql';
import { useTr } from '../../../hooks/useTr';
import { WordOrPhraseWithValueAndTranslations } from '../hooks/useMapTranslationTools';
import { StringContentTypes, typeOfString } from '../../../common/utility';

import { WORD_AND_PHRASE_FLAGS } from '../../flags/flagGroups';

interface TranslationsComProps {
  wordOrPhraseWithTranslations: WordOrPhraseWithValueAndTranslations;
  tLangInfo: LanguageInfo;
  onBackClick: () => void;
  nation_id: string;
  language_id: string;
}

export const TranslationsCom: React.FC<TranslationsComProps> = ({
  wordOrPhraseWithTranslations,
  tLangInfo,
  onBackClick,
  nation_id,
  language_id,
}: TranslationsComProps) => {
  const { tr } = useTr();
  const [present] = useIonToast();
  const router = useIonRouter();

  const newTrRef = useRef<HTMLIonInputElement | null>(null);
  const newDefinitionRef = useRef<HTMLIonInputElement | null>(null);

  const [upsertTranslation, { data: upsertData, loading: upsertLoading }] =
    useUpsertTranslationFromWordAndDefinitionlikeStringMutation({
      refetchQueries: ['GetOrigMapWords', 'GetOrigMapPhrases'],
    });

  const [toggleTrVoteStatus, { data: voteData, loading: voteLoading }] =
    useToggleTranslationVoteStatusMutation({
      refetchQueries: ['GetOrigMapWords', 'GetOrigMapPhrases'],
    });

  useEffect(() => {
    if (upsertLoading || voteLoading) return;
    if (
      (upsertData &&
        upsertData?.upsertTranslationFromWordAndDefinitionlikeString.error !==
          ErrorType.NoError) ||
      (voteData &&
        voteData?.toggleTranslationVoteStatus.error !== ErrorType.NoError)
    ) {
      present({
        message:
          upsertData?.upsertTranslationFromWordAndDefinitionlikeString.error ||
          voteData?.toggleTranslationVoteStatus.error,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
    }
  }, [present, upsertData, upsertLoading, voteData, voteLoading]);

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
  const isWord =
    wordOrPhraseWithTranslations.__typename === 'MapWordTranslations';

  return (
    <>
      <Caption handleBackClick={() => onBackClick()}>Translations</Caption>
      <StSourceWordDiv>
        <WordOrPhraseCard
          value={wordOrPhraseWithTranslations.value}
          definition={wordOrPhraseWithTranslations.definition}
          discussion={{
            onChatClick: () =>
              router.push(
                `/${nation_id}/${language_id}/1/discussion/${
                  isWord ? 'words' : 'phrases'
                }/${wordOrPhraseWithTranslations.id}`,
              ),
          }}
          flags={{
            parent_table: wordOrPhraseWithTranslations.is_word_type
              ? TableNameType.WordDefinitions
              : TableNameType.PhraseDefinitions,
            parent_id: wordOrPhraseWithTranslations.definition_id!,
            flag_names: WORD_AND_PHRASE_FLAGS,
          }}
        />
      </StSourceWordDiv>

      <StTranslationsDiv>
        {wordOrPhraseWithTranslations.translations &&
          wordOrPhraseWithTranslations.translations
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .sort((tr1: any, tr2: any) => {
              if (!tr1.value || !tr2.value) return 0;
              return tr1.value.localeCompare(tr2.value);
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((tr: any, i: any) => {
              const isWord = tr.__typename === 'MapWordWithVotes';

              return (
                <StTranslationDiv key={i}>
                  <WordOrPhraseCard
                    value={tr.value} // typing is somehow have lost after .sort
                    definition={tr.definition}
                    discussion={{
                      onChatClick: () =>
                        router.push(
                          `/${nation_id}/${language_id}/1/discussion/${
                            isWord ? 'words' : 'phrases'
                          }/${tr.id}`,
                        ),
                    }}
                    vote={{
                      upVotes: Number(tr.up_votes || 0),
                      downVotes: Number(tr.down_votes || 0),
                      onVoteUpClick: () => {
                        handleVoteClick(
                          tr.translation_id,
                          wordOrPhraseWithTranslations.__typename ===
                            'MapWordTranslations',
                          tr.__typename === 'MapWordWithVotes',
                          true,
                        );
                      },
                      onVoteDownClick: () => {
                        handleVoteClick(
                          tr.translation_id,
                          wordOrPhraseWithTranslations.__typename ===
                            'MapWordTranslations',
                          tr.__typename === 'MapWordWithVotes',
                          false,
                        );
                      },
                    }}
                    flags={{
                      parent_table: tr.is_word_type
                        ? TableNameType.WordDefinitions
                        : TableNameType.PhraseDefinitions,
                      parent_id: tr.definition_id!,
                      flag_names: WORD_AND_PHRASE_FLAGS,
                    }}
                  />
                </StTranslationDiv>
              );
            })}
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

const StNewTranslationDiv = styled.div`
  width: 90%;
`;

const StButton = styled(IonButton)(() => ({
  marginTop: '20px',
  float: 'right',
}));
