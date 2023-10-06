import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Caption } from '../../common/Caption/Caption';
import { WordOrPhraseCard } from '../WordOrPhraseCard';
import { IonButton, IonInput, useIonRouter, useIonToast } from '@ionic/react';
import {
  ErrorType,
  Exact,
  GetMapWordOrPhraseAsOrigByDefinitionIdQuery,
  TableNameType,
  useGetMapWordOrPhraseAsOrigByDefinitionIdQuery,
  useGetTranslationsByFromDefinitionIdQuery,
  useToggleTranslationVoteStatusMutation,
  useUpsertTranslationFromWordAndDefinitionlikeStringMutation,
} from '../../../generated/graphql';
import { useTr } from '../../../hooks/useTr';
import { StringContentTypes, typeOfString } from '../../../common/utility';

import { WORD_AND_PHRASE_FLAGS } from '../../flags/flagGroups';
import { RouteComponentProps } from 'react-router';
import { useAppContext } from '../../../hooks/useAppContext';
import { QueryResult } from '@apollo/client';
interface MapWordOrPhraseTranslationProps
  extends RouteComponentProps<{
    definition_id: string;
    type: string;
    nation_id: string;
    language_id: string;
  }> {}

export const MapWordOrPhraseTranslation: React.FC<
  MapWordOrPhraseTranslationProps
> = ({
  match: {
    params: { definition_id, type, nation_id, language_id },
  },
}: MapWordOrPhraseTranslationProps) => {
  const { tr } = useTr();
  const {
    states: {
      global: {
        langauges: { targetLang },
        maps: { updatedTrDefinitionIds },
      },
    },
    actions: { setUpdatedTrDefinitionIds },
  } = useAppContext();
  const [present] = useIonToast();
  const router = useIonRouter();

  const newTrRef = useRef<HTMLIonInputElement | null>(null);
  const newDefinitionRef = useRef<HTMLIonInputElement | null>(null);

  const wordOrPhraseQ = useGetMapWordOrPhraseAsOrigByDefinitionIdQuery({
    variables: {
      definition_id,
      is_word_definition: type === 'word',
    },
  });

  const translationsQ = useGetTranslationsByFromDefinitionIdQuery({
    variables: {
      definition_id,
      from_definition_type_is_word: type === 'word',
      language_code: targetLang?.lang.tag || '',
      dialect_code: targetLang?.dialect?.tag,
      geo_code: targetLang?.region?.tag,
    },
  });

  const [upsertTranslation, { data: upsertData, loading: upsertLoading }] =
    useUpsertTranslationFromWordAndDefinitionlikeStringMutation({
      refetchQueries: ['GetTranslationsByFromDefinitionId'],
    });

  const [toggleTrVoteStatus, { data: voteData, loading: voteLoading }] =
    useToggleTranslationVoteStatusMutation({
      refetchQueries: ['GetTranslationsByFromDefinitionId'],
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
    if (!definition_id) {
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

    if (!targetLang?.lang) {
      present({
        message: `${tr('Target language must be selected')}`,
        duration: 1500,
        position: 'top',
        color: 'warning',
      });
      return;
    }
    const word_or_phrase = String(newTrRef?.current?.value);

    await upsertTranslation({
      variables: {
        language_code: targetLang?.lang.tag,
        dialect_code: targetLang?.dialect?.tag,
        geo_code: targetLang?.region?.tag,
        word_or_phrase: String(newTrRef.current.value),
        definition: String(newDefinitionRef.current.value),
        from_definition_id: definition_id,
        from_definition_type_is_word,
        is_type_word: typeOfString(word_or_phrase) === StringContentTypes.WORD,
      },
    });
    setUpdatedTrDefinitionIds([...updatedTrDefinitionIds, definition_id]);

    if (newTrRef.current?.value) {
      newTrRef.current.value = '';
    }
    if (newDefinitionRef.current?.value) {
      newDefinitionRef.current.value = '';
    }
  };

  const handleVoteClick = useCallback(
    (
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
      setUpdatedTrDefinitionIds([...updatedTrDefinitionIds, definition_id]);
    },
    [
      definition_id,
      setUpdatedTrDefinitionIds,
      toggleTrVoteStatus,
      updatedTrDefinitionIds,
    ],
  );

  const getOrig = useCallback(
    (
      wordOrPhraseQ: QueryResult<
        GetMapWordOrPhraseAsOrigByDefinitionIdQuery,
        Exact<{
          definition_id: string;
          is_word_definition: boolean;
        }>
      >,
    ) => {
      const wordOrPhrase =
        wordOrPhraseQ.data?.getMapWordOrPhraseAsOrigByDefinitionId.wordOrPhrase;
      const isWord = wordOrPhrase?.__typename === 'WordWithDefinition';
      const isPhrase = wordOrPhrase?.__typename === 'PhraseWithDefinition';
      const value = isWord
        ? wordOrPhrase?.word
        : isPhrase
        ? wordOrPhrase?.phrase
        : '';
      const id = isWord
        ? wordOrPhrase?.word_id
        : isPhrase
        ? wordOrPhrase?.phrase_id
        : '';

      return {
        isWord,
        isPhrase,
        wordOrPhrase,
        value,
        id,
        definition: wordOrPhrase?.definition,
      };
    },
    [],
  );

  const getTr = useCallback((translation: TTranslationAnyToAny) => {
    {
      let value: string = '';
      let id: string = '';
      let to_type: 'phrase' | 'word' = 'word';
      let definition_id: string = '';
      let definition: string = '';
      if (translation?.__typename === 'PhraseToPhraseTranslationWithVote') {
        value = translation.to_phrase_definition.phrase.phrase;
        id = translation.phrase_to_phrase_translation_id;
        to_type = 'phrase';
        definition_id = translation.to_phrase_definition.phrase_definition_id;
        definition = translation.to_phrase_definition.definition;
      }
      if (translation?.__typename === 'PhraseToWordTranslationWithVote') {
        value = translation.to_word_definition.word.word;
        id = translation.phrase_to_word_translation_id;
        to_type = 'word';
        definition_id = translation.to_word_definition.word_definition_id;
        definition = translation.to_word_definition.definition;
      }
      if (translation?.__typename === 'WordToPhraseTranslationWithVote') {
        value = translation.to_phrase_definition.phrase.phrase;
        id = translation.word_to_phrase_translation_id;
        to_type = 'phrase';
        definition = translation.to_phrase_definition.definition;
        definition_id = translation.to_phrase_definition.phrase_definition_id;
      }
      if (translation?.__typename === 'WordToWordTranslationWithVote') {
        value = translation.to_word_definition.word.word;
        id = translation.word_to_word_translation_id;
        to_type = 'word';
        definition = translation.to_word_definition.definition;
        definition_id = translation.to_word_definition.word_definition_id;
      }
      return {
        value,
        id,
        to_type,
        definition_id,
        definition,
      };
    }
  }, []);

  const translations =
    translationsQ.data?.getTranslationsByFromDefinitionId
      .translation_with_vote_list;

  return (
    <>
      <Caption handleBackClick={() => router.goBack()}>Translations</Caption>
      <StSourceWordDiv>
        {(getOrig(wordOrPhraseQ).isWord || getOrig(wordOrPhraseQ).isPhrase) && (
          <WordOrPhraseCard
            value={getOrig(wordOrPhraseQ).value}
            definition={getOrig(wordOrPhraseQ).definition}
            discussion={{
              parent_id: getOrig(wordOrPhraseQ).id,
              parent_table: getOrig(wordOrPhraseQ).isWord ? 'words' : 'phrases',
              onChatClick: () =>
                router.push(
                  `/${nation_id}/${language_id}/1/discussion/${
                    getOrig(wordOrPhraseQ).isWord ? 'words' : 'phrases'
                  }/${getOrig(wordOrPhraseQ).id}`,
                ),
            }}
            flags={{
              parent_table: getOrig(wordOrPhraseQ).isWord
                ? TableNameType.WordDefinitions
                : TableNameType.PhraseDefinitions,
              parent_id: definition_id,
              flag_names: WORD_AND_PHRASE_FLAGS,
            }}
          />
        )}
      </StSourceWordDiv>

      <StTranslationsDiv>
        {translations &&
          translations.map((translation, i) => {
            return (
              <StTranslationDiv key={i}>
                <WordOrPhraseCard
                  value={getTr(translation).value}
                  definition={getTr(translation).definition}
                  discussion={{
                    parent_id: getTr(translation).id,
                    parent_table: getOrig(wordOrPhraseQ).isWord
                      ? 'words'
                      : 'phrases',
                    onChatClick: () =>
                      router.push(
                        `/${nation_id}/${language_id}/1/discussion/${
                          getOrig(wordOrPhraseQ).isWord ? 'words' : 'phrases'
                        }/${getTr(translation).id}`,
                      ),
                  }}
                  vote={{
                    upVotes: Number(translation?.upvotes || 0),
                    downVotes: Number(translation?.downvotes || 0),
                    onVoteUpClick: () => {
                      handleVoteClick(
                        getTr(translation).id,
                        getOrig(wordOrPhraseQ).isWord,
                        getTr(translation).to_type === 'word',
                        true,
                      );
                    },
                    onVoteDownClick: () => {
                      handleVoteClick(
                        getTr(translation).id,
                        getOrig(wordOrPhraseQ).isWord,
                        getTr(translation).to_type === 'word',
                        false,
                      );
                    },
                  }}
                  flags={{
                    parent_table:
                      getTr(translation).to_type === 'word'
                        ? TableNameType.WordDefinitions
                        : TableNameType.PhraseDefinitions,
                    parent_id: getTr(translation).definition_id!,
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
          onClick={() => handleNewTranslation(getOrig(wordOrPhraseQ).isWord)}
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
