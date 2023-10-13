import { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import {
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonItemDivider,
  IonItemGroup,
  IonContent,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  AccordionGroupChangeEventDetail,
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import {
  IonAccordionGroupCustomEvent,
  IonInfiniteScrollCustomEvent,
} from '@ionic/core/components';

import { subTags2LangInfo, compareLangInfo } from '../../../common/langUtils';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { Card } from '../../common/Card';
import { Flag } from '../../flags/Flag';

import { LangSelector } from '../../common/LangSelector/LangSelector';

import {
  StChatIcon,
  FilterContainer,
  CaptionContainer,
  CardListContainer,
  FullWidthContainer,
  LanguageSelectorContainer,
} from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import {
  useGetWordDefinitionsByFlagLazyQuery,
  useGetPhraseDefinitionsByFlagLazyQuery,
  useGetTranslationsByFromDefinitionIdLazyQuery,
  FlagType,
  ErrorType,
  TableNameType,
} from '../../../generated/graphql';
import { useUpsertTranslationMutation } from '../../../hooks/useUpsertTranslationMutation';

import { PAGE_SIZE } from '../../../const/commonConst';
import { CardContainer } from '../OriginalWordOrPhraseList/styled';
import { WORD_AND_PHRASE_FLAGS } from '../../flags/flagGroups';

import { NewWordOrPhraseWithDefinitionForm } from '../NewWordOrPhraseWithDefinitionForm';

export function FastTranslationPage() {
  const { tr } = useTr();

  const modalRef = useRef<HTMLIonModalElement>(null);
  const tempMapRef = useRef(
    new Map<
      string,
      {
        id: string;
        wordOrPhraseLikeString: string;
        type: TableNameType.PhraseDefinitions | TableNameType.WordDefinitions;
        definition_id: string;
        definition: string;
      }[]
    >(),
  );

  const [isOpenModal, setIsOpenModal] = useState<{
    is_word_type: boolean;
    definition_id: string;
  } | null>(null);

  const {
    states: {
      global: {
        langauges: {
          translationPage: { source, target },
        },
      },
    },
    actions: {
      changeTranslationSourceLanguage,
      changeTranslationTargetLanguage,
    },
  } = useAppContext();
  const translationRef = useRef(
    new Map<
      string,
      {
        wordOrPhrase: string;
        definition_id: string;
        definition: string;
        language_code: string;
        dialect_code?: string;
        geo_code?: string;
      }[]
    >(),
  );

  const [
    getWordDefinitionsByFlag,
    { data: wordDefinitionsData, fetchMore: wordDefinitionFetchMore },
  ] = useGetWordDefinitionsByFlagLazyQuery();
  const [
    getPhraseDefinitionsByFlag,
    { data: phraseDefinitionsData, fetchMore: phraseDefinitionFetchMore },
  ] = useGetPhraseDefinitionsByFlagLazyQuery();
  const [getTranslationsByFromDefinitionId, { data: translationData }] =
    useGetTranslationsByFromDefinitionIdLazyQuery();
  const [upsertTranslation] = useUpsertTranslationMutation();

  useEffect(() => {
    getWordDefinitionsByFlag({
      variables: {
        first: PAGE_SIZE,
        after: null,
        flag_name: FlagType.FastTranslation,
      },
    });
    getPhraseDefinitionsByFlag({
      variables: {
        first: PAGE_SIZE,
        after: null,
        flag_name: FlagType.FastTranslation,
      },
    });
  }, [getWordDefinitionsByFlag, getPhraseDefinitionsByFlag, source]);

  const handleInfinite = useCallback(
    async (ev: IonInfiniteScrollCustomEvent<void>) => {
      if (wordDefinitionsData?.getWordDefinitionsByFlag.pageInfo.hasNextPage) {
        await wordDefinitionFetchMore({
          variables: {
            first: PAGE_SIZE,
            after:
              wordDefinitionsData.getWordDefinitionsByFlag.pageInfo.endCursor,
            flag_name: FlagType.FastTranslation,
          },
        });
      }
      if (
        phraseDefinitionsData?.getPhraseDefinitionsByFlag.pageInfo.hasNextPage
      ) {
        await phraseDefinitionFetchMore({
          variables: {
            first: PAGE_SIZE,
            after:
              phraseDefinitionsData.getPhraseDefinitionsByFlag.pageInfo
                .endCursor,
            flag_name: FlagType.FastTranslation,
          },
        });
      }

      setTimeout(() => ev.target.complete(), 500);
    },
    [
      phraseDefinitionFetchMore,
      phraseDefinitionsData,
      wordDefinitionFetchMore,
      wordDefinitionsData,
    ],
  );

  const handleChangeAccordionValue = useCallback(
    (
      e: IonAccordionGroupCustomEvent<AccordionGroupChangeEventDetail<string>>,
    ) => {
      if (!target || !e.detail.value) {
        return;
      }

      const obj = JSON.parse(e.detail.value);

      getTranslationsByFromDefinitionId({
        variables: {
          definition_id: obj.id + '',
          from_definition_type_is_word:
            obj.type === TableNameType.WordDefinitions ? true : false,
          language_code: target.lang.tag,
          dialect_code: target.dialect ? target.dialect.tag : null,
          geo_code: target.region ? target.region.tag : null,
        },
      });
    },
    [getTranslationsByFromDefinitionId, target],
  );

  const handleCreatedNewDefinition = useCallback(
    ({
      is_word_type,
      definition_id,
    }: {
      is_word_type: boolean;
      definition_id: string;
    }) => {
      if (!isOpenModal) {
        setIsOpenModal(null);
        return;
      }

      upsertTranslation({
        variables: {
          from_definition_id: isOpenModal.definition_id + '',
          from_definition_type_is_word: isOpenModal.is_word_type,
          to_definition_id: definition_id + '',
          to_definition_type_is_word: is_word_type,
        },
      });
      setIsOpenModal(null);
    },
    [isOpenModal, upsertTranslation],
  );

  const cardListCom = useMemo(() => {
    const temp: {
      id: string;
      wordOrPhraseLikeString: string;
      type: TableNameType.PhraseDefinitions | TableNameType.WordDefinitions;
      definitions: {
        id: string;
        definition: string;
      }[];
    }[] = [];

    const tempMap = tempMapRef.current;

    if (!source) {
      return null;
    }

    if (
      translationData &&
      translationData.getTranslationsByFromDefinitionId.error ===
        ErrorType.NoError
    ) {
      translationData.getTranslationsByFromDefinitionId.translation_with_vote_list.forEach(
        (translation) => {
          if (!translation) {
            return;
          }

          let keyStr: string;
          let item: {
            wordOrPhrase: string;
            definition_id: string;
            definition: string;
            language_code: string;
            dialect_code?: string;
            geo_code?: string;
          };

          switch (translation.__typename) {
            case 'WordToWordTranslationWithVote': {
              keyStr = `${translation.from_word_definition.word_definition_id}-word-definition`;

              item = {
                wordOrPhrase: translation.to_word_definition.word.word,
                definition_id:
                  translation.to_word_definition.word_definition_id,
                definition: translation.to_word_definition.definition,
                language_code:
                  translation.to_word_definition.word.language_code,
                dialect_code:
                  translation.to_word_definition.word.dialect_code || undefined,
                geo_code:
                  translation.to_word_definition.word.geo_code || undefined,
              };

              break;
            }
            case 'WordToPhraseTranslationWithVote': {
              keyStr = `${translation.from_word_definition.word_definition_id}-word-definition`;

              item = {
                wordOrPhrase: translation.to_phrase_definition.phrase.phrase,
                definition_id:
                  translation.to_phrase_definition.phrase_definition_id,
                definition: translation.to_phrase_definition.definition,
                language_code:
                  translation.to_phrase_definition.phrase.language_code,
                dialect_code:
                  translation.to_phrase_definition.phrase.dialect_code ||
                  undefined,
                geo_code:
                  translation.to_phrase_definition.phrase.geo_code || undefined,
              };

              break;
            }
            case 'PhraseToWordTranslationWithVote': {
              keyStr = `${translation.from_phrase_definition.phrase_definition_id}-phrase-definition`;

              item = {
                wordOrPhrase: translation.to_word_definition.word.word,
                definition_id:
                  translation.to_word_definition.word_definition_id,
                definition: translation.to_word_definition.definition,
                language_code:
                  translation.to_word_definition.word.language_code,
                dialect_code:
                  translation.to_word_definition.word.dialect_code || undefined,
                geo_code:
                  translation.to_word_definition.word.geo_code || undefined,
              };

              break;
            }
            case 'PhraseToPhraseTranslationWithVote': {
              keyStr = `${translation.from_phrase_definition.phrase_definition_id}-phrase-definition`;

              item = {
                wordOrPhrase: translation.to_phrase_definition.phrase.phrase,
                definition_id:
                  translation.to_phrase_definition.phrase_definition_id,
                definition: translation.to_phrase_definition.definition,
                language_code:
                  translation.to_phrase_definition.phrase.language_code,
                dialect_code:
                  translation.to_phrase_definition.phrase.dialect_code ||
                  undefined,
                geo_code:
                  translation.to_phrase_definition.phrase.geo_code || undefined,
              };

              break;
            }
          }

          const arr = translationRef.current.get(keyStr!);

          if (arr) {
            const exists = arr.find(
              (data) => data.definition_id === item.definition_id,
            );

            if (!exists) {
              arr.push(item!);
            }
          } else {
            translationRef.current.set(keyStr!, [item!]);
          }
        },
      );
    }

    if (
      wordDefinitionsData &&
      wordDefinitionsData.getWordDefinitionsByFlag.error === ErrorType.NoError
    ) {
      wordDefinitionsData.getWordDefinitionsByFlag.edges.forEach((edge) => {
        const langInfo = subTags2LangInfo({
          lang: edge.node.word.language_code,
          dialect: edge.node.word.dialect_code || undefined,
          region: edge.node.word.geo_code || undefined,
        });

        if (!compareLangInfo(langInfo, source)) {
          return;
        }

        const keyStr = `${edge.node.word.word_id}-${edge.node.word.word}-word-definition`;
        const arr = tempMap.get(keyStr);
        const item: {
          id: string;
          wordOrPhraseLikeString: string;
          type: TableNameType.PhraseDefinitions | TableNameType.WordDefinitions;
          definition_id: string;
          definition: string;
        } = {
          id: edge.node.word.word_id,
          type: TableNameType.WordDefinitions,
          wordOrPhraseLikeString: edge.node.word.word,
          definition_id: edge.node.word_definition_id,
          definition: edge.node.definition,
        };

        if (arr) {
          const exists = arr.find(
            (data) => data.definition_id === item.definition_id,
          );

          if (!exists) {
            arr.push(item);
          }
        } else {
          tempMap.set(keyStr, [item]);
        }
      });
    }

    if (
      phraseDefinitionsData &&
      phraseDefinitionsData.getPhraseDefinitionsByFlag.error ===
        ErrorType.NoError
    ) {
      phraseDefinitionsData.getPhraseDefinitionsByFlag.edges.map((edge) => {
        const langInfo = subTags2LangInfo({
          lang: edge.node.phrase.language_code,
          dialect: edge.node.phrase.dialect_code || undefined,
          region: edge.node.phrase.geo_code || undefined,
        });

        if (!compareLangInfo(langInfo, source)) {
          return;
        }

        const keyStr = `${edge.node.phrase.phrase_id}-${edge.node.phrase.phrase}-phrase-definition`;
        const arr = tempMap.get(keyStr);
        const item: {
          id: string;
          wordOrPhraseLikeString: string;
          type: TableNameType.PhraseDefinitions | TableNameType.WordDefinitions;
          definition_id: string;
          definition: string;
        } = {
          id: edge.node.phrase.phrase_id,
          type: TableNameType.PhraseDefinitions,
          wordOrPhraseLikeString: edge.node.phrase.phrase,
          definition_id: edge.node.phrase_definition_id,
          definition: edge.node.definition,
        };

        if (arr) {
          const exists = arr.find(
            (data) => data.definition_id === item.definition_id,
          );

          if (!exists) {
            arr.push(item);
          }
        } else {
          tempMap.set(keyStr, [item]);
        }
      });
    }

    for (const items of tempMap.values()) {
      if (items.length === 0) {
        continue;
      }

      temp.push({
        id: items[0].id,
        wordOrPhraseLikeString: items[0].wordOrPhraseLikeString,
        type: items[0].type,
        definitions: items.map((item) => ({
          id: item.definition_id,
          definition: item.definition,
        })),
      });
    }

    return temp
      .sort((a, b) => {
        const wordA = a.wordOrPhraseLikeString.toLowerCase();
        const wordB = b.wordOrPhraseLikeString.toLowerCase();
        if (wordA > wordB) return 1;
        if (wordA < wordB) return -1;
        return 0;
      })
      .map((item) => (
        <CardContainer key={`${item.id}-${item.wordOrPhraseLikeString}`}>
          <Card
            content={item.wordOrPhraseLikeString}
            description={
              <IonAccordionGroup onIonChange={handleChangeAccordionValue}>
                {item.definitions.map((definition) => {
                  const keyStr = `${definition.id}-${
                    item.type === TableNameType.WordDefinitions
                      ? 'word-definition'
                      : 'phrase-definition'
                  }`;
                  const translations = (
                    translationRef.current.get(keyStr) || []
                  ).filter((translation) => {
                    const langInfo = subTags2LangInfo({
                      lang: translation.language_code,
                      dialect: translation.dialect_code,
                      region: translation.geo_code,
                    });

                    return compareLangInfo(target, langInfo);
                  });

                  const groupMap = new Map<
                    string,
                    { id: string; translation: string }[]
                  >();

                  translations.forEach((translation) => {
                    const arr = groupMap.get(translation.wordOrPhrase);

                    if (arr) {
                      const exists = arr.find(
                        (item) => item.id === translation.definition_id,
                      );

                      if (!exists) {
                        arr.push({
                          id: translation.definition_id,
                          translation: translation.definition,
                        });
                      }
                    } else {
                      groupMap.set(translation.wordOrPhrase, [
                        {
                          id: translation.definition_id,
                          translation: translation.definition,
                        },
                      ]);
                    }
                  });

                  const wordOrPhrases: string[] = [];

                  for (const item of groupMap.keys()) {
                    wordOrPhrases.push(item);
                  }

                  const translationsCom =
                    wordOrPhrases.length > 0 ? (
                      wordOrPhrases.map((wordOrPhrase) => {
                        const translations = groupMap.get(wordOrPhrase) || [];

                        return (
                          <IonItemGroup key={`${wordOrPhrase}`}>
                            <IonItemDivider>
                              <IonLabel>{wordOrPhrase}</IonLabel>
                            </IonItemDivider>

                            {translations.map((translation) => (
                              <IonItem key={translation.id}>
                                <IonLabel>{translation.translation}</IonLabel>
                              </IonItem>
                            ))}
                          </IonItemGroup>
                        );
                      })
                    ) : (
                      <div>{tr('No Translations')}</div>
                    );

                  return (
                    <IonAccordion
                      key={`${definition.id}-${definition.definition}`}
                      value={JSON.stringify({
                        id: definition.id,
                        type: item.type,
                      })}
                    >
                      <IonItem slot="header" color="light">
                        <IonLabel>{definition.definition}</IonLabel>
                        <Flag
                          parent_table={item.type}
                          parent_id={definition.id}
                          flag_names={WORD_AND_PHRASE_FLAGS}
                        />
                        <StChatIcon
                          color="primary"
                          icon={addOutline}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOpenModal({
                              is_word_type:
                                item.type === TableNameType.WordDefinitions
                                  ? true
                                  : false,
                              definition_id: definition.id,
                            });
                          }}
                        />
                      </IonItem>
                      <div className="ion-padding" slot="content">
                        {translationsCom}
                      </div>
                    </IonAccordion>
                  );
                })}
              </IonAccordionGroup>
            }
            flags={{
              parent_table:
                item.type === TableNameType.WordDefinitions
                  ? TableNameType.Words
                  : TableNameType.Phrases,
              parent_id: item.id,
              flag_names: WORD_AND_PHRASE_FLAGS,
            }}
          />
        </CardContainer>
      ));
  }, [
    tr,
    target,
    source,
    translationData,
    wordDefinitionsData,
    phraseDefinitionsData,
    handleChangeAccordionValue,
  ]);

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption>{tr('Fast Translation')}</Caption>
      </CaptionContainer>

      <FilterContainer>
        <LanguageSelectorContainer>
          <FullWidthContainer>
            <LangSelector
              title={tr('Source language')}
              selected={source as LanguageInfo}
              onChange={(_sourceLangTag, sourceLangInfo) => {
                changeTranslationSourceLanguage(sourceLangInfo);
              }}
              onClearClick={() => changeTranslationSourceLanguage(null)}
            />
          </FullWidthContainer>

          <FullWidthContainer>
            <LangSelector
              title={tr('Target language')}
              selected={target as LanguageInfo}
              onChange={(_targetLangTag, targetLanguageInfo) => {
                changeTranslationTargetLanguage(targetLanguageInfo);
              }}
              onClearClick={() => changeTranslationTargetLanguage(null)}
            />
          </FullWidthContainer>
        </LanguageSelectorContainer>
      </FilterContainer>
      <CardListContainer>{cardListCom}</CardListContainer>

      <IonInfiniteScroll onIonInfinite={handleInfinite}>
        <IonInfiniteScrollContent
          loadingText={`${tr('Loading')}...`}
          loadingSpinner="bubbles"
        />
      </IonInfiniteScroll>

      <IonModal
        isOpen={!!isOpenModal}
        ref={modalRef}
        onDidDismiss={() => setIsOpenModal(null)}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>{tr('Add New Definition')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {target ? (
            <NewWordOrPhraseWithDefinitionForm
              langInfo={target}
              onCreated={handleCreatedNewDefinition}
              onCancel={() => {
                setIsOpenModal(null);
              }}
            />
          ) : null}
        </IonContent>
      </IonModal>
    </PageLayout>
  );
}
