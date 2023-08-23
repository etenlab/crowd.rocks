import { useEffect, useMemo, useState } from 'react';

import {
  IonItemGroup,
  IonItemDivider,
  IonContent,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonLabel,
} from '@ionic/react';

import { Card } from '../../common/Card';
import { AddListHeader } from '../../common/ListHeader';

import { VerticalVoteButton } from './VerticalVoteButton';

import {
  useGetPhrasesByLanguageLazyQuery,
  useGetTranslationsByFromDefinitionIdLazyQuery,
  useGetWordsByLanguageLazyQuery,
} from '../../../generated/graphql';

import { ErrorType } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';

import { NewWordOrPhraseWithDefinitionForm } from '../NewWordOrPhraseWithDefinitionForm';

import { NoDefinition, CardContainer, CardListContainer } from './styled';
import { WordOrPhraseListContainer } from '../styled';

interface TranslationWordOrPhraseListProps {
  listLabel?: string;
  langInfo: LanguageInfo | null;
  filter?: string;
  onToggleSelectedValue(
    definitionId: number,
    is_word_definition: boolean,
  ): void;
  originalDefinition?: {
    definitionId: number;
    is_word_definition: boolean;
  };
  selectedValues: {
    definitionId: number;
    is_word_definition: boolean;
  }[];
}

function isInclude(
  selectedValues: {
    definitionId: number;
    is_word_definition: boolean;
  }[],
  definition: {
    definitionId: number;
    is_word_definition: boolean;
  },
) {
  for (const selectedValue of selectedValues) {
    if (
      selectedValue.definitionId === definition.definitionId &&
      selectedValue.is_word_definition === definition.is_word_definition
    ) {
      return true;
    }
  }

  return false;
}

export function TranslationWordOrPhraseList({
  listLabel,
  langInfo,
  filter,
  originalDefinition,
  selectedValues,
  onToggleSelectedValue,
}: TranslationWordOrPhraseListProps) {
  const { tr } = useTr();

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [getWordsByLanguage, { data: wordsData, error: wordsError }] =
    useGetWordsByLanguageLazyQuery();
  const [getPhrasesByLanguage, { data: phrasesData, error: phraseError }] =
    useGetPhrasesByLanguageLazyQuery();
  const [
    getTranslationsByFromDefinitionId,
    {
      data: translationData,
      error: translationError,
      loading: translationLoading,
      called: translationCalled,
    },
  ] = useGetTranslationsByFromDefinitionIdLazyQuery();

  useEffect(() => {
    if (!langInfo) {
      return;
    }

    getWordsByLanguage({
      variables: {
        language_code: langInfo.lang.tag,
        dialect_code: langInfo.dialect ? langInfo.dialect.tag : null,
        geo_code: langInfo.region ? langInfo.region.tag : null,
        filter: filter ? filter.trim() : null,
      },
    });

    getPhrasesByLanguage({
      variables: {
        language_code: langInfo.lang.tag,
        dialect_code: langInfo.dialect ? langInfo.dialect.tag : null,
        geo_code: langInfo.region ? langInfo.region.tag : null,
        filter: filter ? filter.trim() : null,
      },
    });
  }, [langInfo, getWordsByLanguage, getPhrasesByLanguage, filter]);

  useEffect(() => {
    if (!langInfo || !originalDefinition) {
      return;
    }

    getTranslationsByFromDefinitionId({
      variables: {
        definition_id: originalDefinition.definitionId + '',
        from_definition_type_is_word: originalDefinition.is_word_definition,
        language_code: langInfo.lang.tag,
        dialect_code: langInfo.dialect ? langInfo.dialect.tag : null,
        geo_code: langInfo.region ? langInfo.region.tag : null,
      },
    });
  }, [langInfo, getTranslationsByFromDefinitionId, originalDefinition]);

  const disabled = originalDefinition ? false : true;

  const cardListComs = useMemo(() => {
    const tempWordAndPhrases: {
      id: string;
      wordOrPhrase: string;
      definitions: {
        id: string;
        is_word_definition: boolean;
        definition: string;
        vote?: {
          upvotes: number;
          downvotes: number;
          translation_id: number;
          from_definition_type_is_word: boolean;
          to_definition_type_is_word: boolean;
        };
      }[];
    }[] = [];

    if (translationError) {
      return;
    }

    if (translationLoading || !translationCalled) {
      return;
    }

    const translationWithVoteList =
      !translationError &&
      translationData &&
      translationData.getTranslationsByFromDefinitionId.error ===
        ErrorType.NoError &&
      translationData.getTranslationsByFromDefinitionId
        .translation_with_vote_list
        ? translationData.getTranslationsByFromDefinitionId
            .translation_with_vote_list
        : [];

    const wordWithVoteList =
      !wordsError &&
      wordsData &&
      wordsData.getWordsByLanguage.error === ErrorType.NoError
        ? wordsData.getWordsByLanguage.word_with_vote_list
        : null;

    if (wordWithVoteList) {
      for (const wordWithVote of wordWithVoteList) {
        if (wordWithVote) {
          tempWordAndPhrases.push({
            id: `word_${wordWithVote.word_id}`,
            wordOrPhrase: wordWithVote.word,
            definitions: wordWithVote.definitions
              .filter((definition) => definition)
              .map((definition) => {
                let translationVote:
                  | {
                      upvotes: number;
                      downvotes: number;
                      translation_id: number;
                      from_definition_type_is_word: boolean;
                      to_definition_type_is_word: boolean;
                    }
                  | undefined = undefined;

                translationWithVoteList.forEach((translationWithVote) => {
                  switch (translationWithVote.__typename) {
                    case 'WordToWordTranslationWithVote': {
                      if (
                        translationWithVote.to_word_definition
                          .word_definition_id === definition?.word_definition_id
                      ) {
                        translationVote = {
                          translation_id:
                            +translationWithVote.word_to_word_translation_id,
                          from_definition_type_is_word: true,
                          to_definition_type_is_word: true,
                          upvotes: translationWithVote.upvotes,
                          downvotes: translationWithVote.downvotes,
                        };
                      }
                      break;
                    }
                    case 'PhraseToWordTranslationWithVote': {
                      if (
                        translationWithVote.to_word_definition
                          .word_definition_id === definition?.word_definition_id
                      ) {
                        translationVote = {
                          translation_id:
                            +translationWithVote.phrase_to_word_translation_id,
                          from_definition_type_is_word: false,
                          to_definition_type_is_word: true,
                          upvotes: translationWithVote.upvotes,
                          downvotes: translationWithVote.downvotes,
                        };
                      }
                      break;
                    }
                  }

                  return false;
                });

                return {
                  id: definition!.word_definition_id,
                  is_word_definition: true,
                  definition: definition!.definition,
                  vote: translationVote,
                };
              }),
          });
        }
      }
    }

    const phraseWithVoteList =
      !phraseError &&
      phrasesData &&
      phrasesData.getPhrasesByLanguage.error === ErrorType.NoError
        ? phrasesData.getPhrasesByLanguage.phrase_with_vote_list
        : null;

    if (phraseWithVoteList) {
      for (const phraseWithVote of phraseWithVoteList) {
        if (phraseWithVote) {
          tempWordAndPhrases.push({
            id: `phrase_${phraseWithVote.phrase_id}`,
            wordOrPhrase: phraseWithVote.phrase,
            definitions: phraseWithVote.definitions
              .filter((definition) => definition)
              .map((definition) => {
                let translationVote:
                  | {
                      upvotes: number;
                      downvotes: number;
                      translation_id: number;
                      from_definition_type_is_word: boolean;
                      to_definition_type_is_word: boolean;
                    }
                  | undefined = undefined;

                translationWithVoteList.forEach((translationWithVote) => {
                  switch (translationWithVote.__typename) {
                    case 'WordToPhraseTranslationWithVote': {
                      if (
                        translationWithVote.to_phrase_definition
                          .phrase_definition_id ===
                        definition?.phrase_definition_id
                      ) {
                        translationVote = {
                          translation_id:
                            +translationWithVote.word_to_phrase_translation_id,
                          from_definition_type_is_word: true,
                          to_definition_type_is_word: false,
                          upvotes: translationWithVote.upvotes,
                          downvotes: translationWithVote.downvotes,
                        };
                      }
                      break;
                    }
                    case 'PhraseToPhraseTranslationWithVote': {
                      if (
                        translationWithVote.to_phrase_definition
                          .phrase_definition_id ===
                        definition?.phrase_definition_id
                      ) {
                        translationVote = {
                          translation_id:
                            +translationWithVote.phrase_to_phrase_translation_id,
                          from_definition_type_is_word: false,
                          to_definition_type_is_word: false,
                          upvotes: translationWithVote.upvotes,
                          downvotes: translationWithVote.downvotes,
                        };
                      }
                      break;
                    }
                  }

                  return false;
                });

                return {
                  id: definition!.phrase_definition_id,
                  is_word_definition: true,
                  definition: definition!.definition,
                  vote: translationVote,
                };
              }),
          });
        }
      }
    }

    return tempWordAndPhrases
      .sort((a, b) => {
        if (a.wordOrPhrase < b.wordOrPhrase) {
          return 1;
        } else if (a.wordOrPhrase > b.wordOrPhrase) {
          return -1;
        } else {
          return 0;
        }
      })
      .filter((wordOrPhrase) => wordOrPhrase.definitions.length > 0)
      .map((wordOrPhrase) => (
        <IonItemGroup
          key={wordOrPhrase.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '100%',
          }}
        >
          <IonItemDivider>
            <IonLabel>{wordOrPhrase.wordOrPhrase}</IonLabel>
          </IonItemDivider>

          {wordOrPhrase.definitions.length > 0 ? (
            wordOrPhrase.definitions.map((definition) => (
              <CardContainer key={definition.id}>
                <VerticalVoteButton
                  disabled={disabled}
                  checked={isInclude(selectedValues, {
                    definitionId: +definition.id,
                    is_word_definition: definition.is_word_definition,
                  })}
                  vote={definition.vote}
                  onClick={() => {
                    onToggleSelectedValue(
                      +definition.id,
                      definition.is_word_definition,
                    );
                  }}
                />
                <Card
                  description={definition.definition}
                  onClick={() => {
                    if (!disabled) {
                      onToggleSelectedValue(
                        +definition.id,
                        definition.is_word_definition,
                      );
                    }
                  }}
                />
              </CardContainer>
            ))
          ) : (
            <NoDefinition>{tr('No definitions')}</NoDefinition>
          )}
        </IonItemGroup>
      ));
  }, [
    translationError,
    translationLoading,
    translationCalled,
    translationData,
    wordsError,
    wordsData,
    phraseError,
    phrasesData,
    tr,
    disabled,
    selectedValues,
    onToggleSelectedValue,
  ]);

  return (
    <WordOrPhraseListContainer>
      <AddListHeader
        title={listLabel || tr('Translation')}
        onClick={() => setIsOpenModal(true)}
      />

      <CardListContainer>{cardListComs}</CardListContainer>

      <IonModal isOpen={isOpenModal}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{tr('Add New Definition')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {langInfo ? (
            <NewWordOrPhraseWithDefinitionForm
              langInfo={langInfo}
              onCreated={() => {
                setIsOpenModal(false);
              }}
              onCancel={() => {
                setIsOpenModal(false);
              }}
            />
          ) : null}
        </IonContent>
      </IonModal>
    </WordOrPhraseListContainer>
  );
}
