import { useState, useEffect, useMemo, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  useIonToast,
} from '@ionic/react';

import { Caption } from '../../common/Caption/Caption';
import { Card } from '../../common/Card';

import { useQuery } from '../../hooks/useQuery';

import {
  useGetAllTranslationFromSiteTextDefinitionIdLazyQuery,
  useSiteTextPhraseDefinitionReadLazyQuery,
  useSiteTextWordDefinitionReadLazyQuery,
  useUpsertSiteTextTranslationMutation,
  useToggleSiteTextTranslationVoteStatusMutation,
} from '../../../generated/graphql';

import {
  GetAllTranslationFromSiteTextDefinitionIdQuery,
  SiteTextPhraseDefinitionOutput,
  SiteTextWordDefinitionOutput,
  SiteTextTranslationWithVote,
  SiteTextWordToWordTranslationWithVote,
  SiteTextWordToPhraseTranslationWithVote,
  SiteTextPhraseToWordTranslationWithVote,
  SiteTextPhraseToPhraseTranslationWithVote,
  ErrorType,
} from '../../../generated/graphql';

import {
  GetAllTranslationFromSiteTextDefinitionIdDocument,
  SiteTextWordToWordTranslationWithVoteFragmentFragmentDoc,
  SiteTextWordToPhraseTranslationWithVoteFragmentFragmentDoc,
  SiteTextPhraseToWordTranslationWithVoteFragmentFragmentDoc,
  SiteTextPhraseToPhraseTranslationWithVoteFragmentFragmentDoc,
} from '../../../generated/graphql';

import {
  Input,
  Textarea,
  CaptionContainer,
  CardListContainer,
  CardContainer,
} from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { AddListHeader } from '../../common/ListHeader';
import { PageLayout } from '../../common/PageLayout';

interface SiteTextDetailPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
    site_text_id: string;
    definition_type: string;
  }> {}

export function SiteTextDetailPage({ match }: SiteTextDetailPageProps) {
  const query = useQuery();
  const { tr } = useTr();
  const [present] = useIonToast();

  const [translationWithVoteList, setTranslationWithVoteList] = useState<
    SiteTextTranslationWithVote[]
  >([]);
  const [siteTextWordDefinition, setSiteTextWordDefinition] =
    useState<SiteTextWordDefinitionOutput>();
  const [siteTextPhraseDefinition, setSiteTextPhraseDefinition] =
    useState<SiteTextPhraseDefinitionOutput>();

  const [showModal, setShowModal] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);
  const textarea = useRef<HTMLIonTextareaElement>(null);

  const [
    getAllTranslationFromSiteTextDefinitionID,
    {
      data: translationsData,
      error: translationsError,
      loading: translationsLoading,
      called: translationsCalled,
    },
  ] = useGetAllTranslationFromSiteTextDefinitionIdLazyQuery();
  const [
    siteTextWordDefinitionRead,
    {
      data: wordData,
      error: wordError,
      loading: wordLoading,
      called: wordCalled,
    },
  ] = useSiteTextWordDefinitionReadLazyQuery();
  const [
    siteTextPhraseDefinitionRead,
    {
      data: phraseData,
      error: phraseError,
      loading: phraseLoading,
      called: phraseCalled,
    },
  ] = useSiteTextPhraseDefinitionReadLazyQuery();
  const [upsertTranslation] = useUpsertSiteTextTranslationMutation({
    update(cache, { data: upsertData, errors }) {
      if (
        !errors &&
        upsertData &&
        upsertData.upsertSiteTextTranslation.error === ErrorType.NoError
      ) {
        const newTranslation = upsertData.upsertSiteTextTranslation.translation;

        if (!newTranslation) {
          return;
        }

        cache.updateQuery<GetAllTranslationFromSiteTextDefinitionIdQuery>(
          {
            query: GetAllTranslationFromSiteTextDefinitionIdDocument,
            variables: {
              site_text_id: match.params.site_text_id,
              site_text_type_is_word:
                match.params.definition_type === 'word' ? true : false,
              language_code: query.get('language_code')!,
              dialect_code: query.get('dialect_code'),
              geo_code: query.get('geo_code'),
            },
          },
          (data) => {
            if (
              data &&
              data.getAllTranslationFromSiteTextDefinitionID
                .site_text_translation_with_vote_list
            ) {
              const alreadyExists =
                data.getAllTranslationFromSiteTextDefinitionID.site_text_translation_with_vote_list.filter(
                  (site_text_translation_with_vote) => {
                    switch (site_text_translation_with_vote.__typename) {
                      case 'SiteTextWordToWordTranslationWithVote': {
                        if (
                          newTranslation.__typename ===
                            'WordToWordTranslation' &&
                          site_text_translation_with_vote.word_to_word_translation_id ===
                            newTranslation.word_to_word_translation_id
                        ) {
                          return true;
                        }

                        return false;
                      }
                      case 'SiteTextWordToPhraseTranslationWithVote': {
                        if (
                          newTranslation.__typename ===
                            'WordToPhraseTranslation' &&
                          site_text_translation_with_vote.word_to_phrase_translation_id ===
                            newTranslation.word_to_phrase_translation_id
                        ) {
                          return true;
                        }

                        return false;
                      }
                      case 'SiteTextPhraseToWordTranslationWithVote': {
                        if (
                          newTranslation.__typename ===
                            'PhraseToWordTranslation' &&
                          site_text_translation_with_vote.phrase_to_word_translation_id ===
                            newTranslation.phrase_to_word_translation_id
                        ) {
                          return true;
                        }

                        return false;
                      }
                      case 'SiteTextPhraseToPhraseTranslationWithVote': {
                        if (
                          newTranslation.__typename ===
                            'PhraseToPhraseTranslation' &&
                          site_text_translation_with_vote.phrase_to_phrase_translation_id ===
                            newTranslation.phrase_to_phrase_translation_id
                        ) {
                          return true;
                        }

                        return false;
                      }
                    }
                    return false;
                  },
                );

              if (alreadyExists.length > 0) {
                return data;
              }

              let newTypeName:
                | 'SiteTextWordToWordTranslationWithVote'
                | 'SiteTextWordToPhraseTranslationWithVote'
                | 'SiteTextPhraseToWordTranslationWithVote'
                | 'SiteTextPhraseToPhraseTranslationWithVote'
                | undefined;

              switch (newTranslation.__typename) {
                case 'WordToWordTranslation': {
                  newTypeName = 'SiteTextWordToWordTranslationWithVote';
                  break;
                }
                case 'WordToPhraseTranslation': {
                  newTypeName = 'SiteTextWordToPhraseTranslationWithVote';
                  break;
                }
                case 'PhraseToWordTranslation': {
                  newTypeName = 'SiteTextPhraseToWordTranslationWithVote';
                  break;
                }
                case 'PhraseToPhraseTranslation': {
                  newTypeName = 'SiteTextPhraseToPhraseTranslationWithVote';
                  break;
                }
              }

              if (!newTypeName) {
                return data;
              }

              return {
                ...data,
                getAllTranslationFromSiteTextDefinitionID: {
                  ...data.getAllTranslationFromSiteTextDefinitionID,
                  site_text_translation_with_vote_list: [
                    ...data.getAllTranslationFromSiteTextDefinitionID
                      .site_text_translation_with_vote_list,
                    {
                      ...newTranslation,
                      __typename: newTypeName,
                      upvotes: 0,
                      downvotes: 0,
                    } as SiteTextTranslationWithVote,
                  ],
                },
              };
            } else {
              return data;
            }
          },
        );

        present({
          message: tr('Success at creating new site text translation!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });

        modal.current?.dismiss();
      } else {
        console.log('useUpsertTranslationMutation: ', errors);
        console.log(upsertData?.upsertSiteTextTranslation.error);

        present({
          message: `${tr(
            'Failed at creating new site text translation!',
          )} [${upsertData?.upsertSiteTextTranslation.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
  const [toggleVoteStatus] = useToggleSiteTextTranslationVoteStatusMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.toggleSiteTextTranslationVoteStatus.vote_status &&
        data.toggleSiteTextTranslationVoteStatus.error === ErrorType.NoError
      ) {
        const {
          translation_id,
          from_type_is_word,
          to_type_is_word,
          upvotes,
          downvotes,
        } = data.toggleSiteTextTranslationVoteStatus.vote_status;

        if (from_type_is_word === true && to_type_is_word === true) {
          cache.updateFragment<SiteTextWordToWordTranslationWithVote>(
            {
              id: cache.identify({
                __typename: 'SiteTextWordToWordTranslationWithVote',
                word_to_word_translation_id: translation_id,
              }),
              fragment:
                SiteTextWordToWordTranslationWithVoteFragmentFragmentDoc,
              fragmentName: 'SiteTextWordToWordTranslationWithVoteFragment',
            },
            (data) => {
              if (data) {
                return {
                  ...data,
                  upvotes: upvotes,
                  downvotes: downvotes,
                };
              } else {
                return data;
              }
            },
          );
        }

        if (from_type_is_word === true && to_type_is_word === false) {
          cache.updateFragment<SiteTextWordToPhraseTranslationWithVote>(
            {
              id: cache.identify({
                __typename: 'SiteTextWordToPhraseTranslationWithVote',
                word_to_phrase_translation_id: translation_id,
              }),
              fragment:
                SiteTextWordToPhraseTranslationWithVoteFragmentFragmentDoc,
              fragmentName: 'SiteTextWordToPhraseTranslationWithVoteFragment',
            },
            (data) => {
              if (data) {
                return {
                  ...data,
                  upvotes: upvotes,
                  downvotes: downvotes,
                };
              } else {
                return data;
              }
            },
          );
        }

        if (from_type_is_word === false && to_type_is_word === true) {
          cache.updateFragment<SiteTextPhraseToWordTranslationWithVote>(
            {
              id: cache.identify({
                __typename: 'SiteTextPhraseToWordTranslationWithVote',
                phrase_to_word_translation_id: translation_id,
              }),
              fragment:
                SiteTextPhraseToWordTranslationWithVoteFragmentFragmentDoc,
              fragmentName: 'SiteTextPhraseToWordTranslationWithVoteFragment',
            },
            (data) => {
              if (data) {
                return {
                  ...data,
                  upvotes: upvotes,
                  downvotes: downvotes,
                };
              } else {
                return data;
              }
            },
          );
        }

        if (from_type_is_word === false && to_type_is_word === false) {
          cache.updateFragment<SiteTextPhraseToPhraseTranslationWithVote>(
            {
              id: cache.identify({
                __typename: 'SiteTextPhraseToPhraseTranslationWithVote',
                phrase_to_phrase_translation_id: translation_id,
              }),
              fragment:
                SiteTextPhraseToPhraseTranslationWithVoteFragmentFragmentDoc,
              fragmentName: 'SiteTextPhraseToPhraseTranslationWithVoteFragment',
            },
            (data) => {
              if (data) {
                return {
                  ...data,
                  upvotes: upvotes,
                  downvotes: downvotes,
                };
              } else {
                return data;
              }
            },
          );
        }
      } else {
        console.log('useToggleVoteStatusMutation: ', errors);
        console.log(data?.toggleSiteTextTranslationVoteStatus.error);

        present({
          message: `${tr('Failed at voting!')} [${data
            ?.toggleSiteTextTranslationVoteStatus.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });

  useEffect(() => {
    if (!query.get('language_code')) {
      return;
    }

    getAllTranslationFromSiteTextDefinitionID({
      variables: {
        site_text_id: match.params.site_text_id,
        site_text_type_is_word:
          match.params.definition_type === 'word' ? true : false,
        language_code: query.get('language_code')!,
        dialect_code: query.get('dialect_code'),
        geo_code: query.get('geo_code'),
      },
    });
  }, [getAllTranslationFromSiteTextDefinitionID, query, match]);

  useEffect(() => {
    if (match.params.definition_type === 'word') {
      siteTextWordDefinitionRead({
        variables: {
          id: match.params.site_text_id,
        },
      });
    } else {
      siteTextPhraseDefinitionRead({
        variables: {
          id: match.params.site_text_id,
        },
      });
    }
  }, [siteTextWordDefinitionRead, siteTextPhraseDefinitionRead, match]);

  useEffect(() => {
    if (translationsError) {
      console.log(translationsError);
      alert('Error');

      return;
    }

    if (translationsLoading || !translationsCalled) {
      return;
    }

    if (translationsData) {
      if (
        translationsData.getAllTranslationFromSiteTextDefinitionID.error !==
        ErrorType.NoError
      ) {
        console.log(
          translationsData.getAllTranslationFromSiteTextDefinitionID.error,
        );
        alert(translationsData.getAllTranslationFromSiteTextDefinitionID.error);
        return;
      }

      if (
        translationsData.getAllTranslationFromSiteTextDefinitionID
          .site_text_translation_with_vote_list
      ) {
        setTranslationWithVoteList(
          translationsData.getAllTranslationFromSiteTextDefinitionID
            .site_text_translation_with_vote_list,
        );
      } else {
        setTranslationWithVoteList([]);
      }
    }
  }, [
    translationsData,
    translationsError,
    translationsLoading,
    translationsCalled,
  ]);

  useEffect(() => {
    if (wordError) {
      console.log(wordError);
      alert('Error');

      return;
    }

    if (wordLoading || !wordCalled) {
      return;
    }

    if (wordData) {
      if (wordData.siteTextWordDefinitionRead.error !== ErrorType.NoError) {
        console.log(wordData.siteTextWordDefinitionRead.error);
        alert(wordData.siteTextWordDefinitionRead.error);
        return;
      }

      setSiteTextWordDefinition(wordData.siteTextWordDefinitionRead);
    }
  }, [wordData, wordError, wordLoading, wordCalled]);

  useEffect(() => {
    if (phraseError) {
      console.log(phraseError);
      alert('Error');

      return;
    }

    if (phraseLoading || !phraseCalled) {
      return;
    }

    if (phraseData) {
      if (phraseData.siteTextPhraseDefinitionRead.error !== ErrorType.NoError) {
        console.log(phraseData.siteTextPhraseDefinitionRead.error);
        alert(phraseData.siteTextPhraseDefinitionRead.error);
        return;
      }

      setSiteTextPhraseDefinition(phraseData.siteTextPhraseDefinitionRead);
    }
  }, [phraseData, phraseError, phraseLoading, phraseCalled]);

  const handleSaveNewTranslation = () => {
    const inputEl = input.current;
    const textareaEl = textarea.current;

    if (!inputEl || !textareaEl) {
      alert('Input or Textarea not exists');
      return;
    }

    const inputVal = (inputEl.value + '').trim();
    const textareaVal = (textareaEl.value + '').trim();

    if (inputVal.length === 0) {
      alert('Invalid input');
      return;
    }

    upsertTranslation({
      variables: {
        site_text_id: match.params.site_text_id,
        is_word_definition:
          match.params.definition_type === 'word' ? true : false,
        translationlike_string: inputVal,
        definitionlike_string:
          textareaVal === ''
            ? 'Site User Interface Text Translation'
            : textareaVal,
        language_code: query.get('language_code')!,
        dialect_code: query.get('dialect_code'),
        geo_code: query.get('geo_code'),
      },
    });
  };

  const wordCom =
    siteTextWordDefinition &&
    siteTextWordDefinition.site_text_word_definition ? (
      <Card
        content={
          siteTextWordDefinition.site_text_word_definition.word_definition.word
            .word
        }
        description={
          siteTextWordDefinition.site_text_word_definition.word_definition
            .definition
        }
      />
    ) : null;

  const phraseCom =
    siteTextPhraseDefinition &&
    siteTextPhraseDefinition.site_text_phrase_definition ? (
      <Card
        content={
          siteTextPhraseDefinition.site_text_phrase_definition.phrase_definition
            .phrase.phrase
        }
        description={
          siteTextPhraseDefinition.site_text_phrase_definition.phrase_definition
            .definition
        }
      />
    ) : null;

  const translationsCom = useMemo(() => {
    const tempTranslations: {
      key: string;
      translationId: string;
      from_type_is_word: boolean;
      to_type_is_word: boolean;
      siteTextlikeString: string;
      definitionlikeString: string;
      upvotes: number;
      downvotes: number;
    }[] = [];

    if (!translationWithVoteList) {
      return null;
    }

    for (const translationWithVote of translationWithVoteList) {
      switch (translationWithVote.__typename) {
        case 'SiteTextWordToWordTranslationWithVote': {
          tempTranslations.push({
            key: `SiteTextWordToWordTranslationWithVote_${translationWithVote.word_to_word_translation_id}`,
            translationId: translationWithVote.word_to_word_translation_id,
            from_type_is_word: true,
            to_type_is_word: true,
            siteTextlikeString:
              translationWithVote.to_word_definition.word.word,
            definitionlikeString:
              translationWithVote.to_word_definition.definition,
            upvotes: translationWithVote.upvotes,
            downvotes: translationWithVote.downvotes,
          });
          break;
        }
        case 'SiteTextWordToPhraseTranslationWithVote': {
          tempTranslations.push({
            key: `SiteTextWordToPhraseTranslationWithVote_${translationWithVote.word_to_phrase_translation_id}`,
            translationId: translationWithVote.word_to_phrase_translation_id,
            from_type_is_word: true,
            to_type_is_word: false,
            siteTextlikeString:
              translationWithVote.to_phrase_definition.phrase.phrase,
            definitionlikeString:
              translationWithVote.to_phrase_definition.definition,
            upvotes: translationWithVote.upvotes,
            downvotes: translationWithVote.downvotes,
          });
          break;
        }
        case 'SiteTextPhraseToWordTranslationWithVote': {
          tempTranslations.push({
            key: `SiteTextPhraseToWordTranslationWithVote-${translationWithVote.phrase_to_word_translation_id}`,
            translationId: translationWithVote.phrase_to_word_translation_id,
            from_type_is_word: false,
            to_type_is_word: true,
            siteTextlikeString:
              translationWithVote.to_word_definition.word.word,
            definitionlikeString:
              translationWithVote.to_word_definition.definition,
            upvotes: translationWithVote.upvotes,
            downvotes: translationWithVote.downvotes,
          });
          break;
        }
        case 'SiteTextPhraseToPhraseTranslationWithVote': {
          tempTranslations.push({
            key: `SiteTextPhraseToPhraseTranslationWithVote-${translationWithVote.phrase_to_phrase_translation_id}`,
            translationId: translationWithVote.phrase_to_phrase_translation_id,
            from_type_is_word: false,
            to_type_is_word: false,
            siteTextlikeString:
              translationWithVote.to_phrase_definition.phrase.phrase,
            definitionlikeString:
              translationWithVote.to_phrase_definition.definition,
            upvotes: translationWithVote.upvotes,
            downvotes: translationWithVote.downvotes,
          });
          break;
        }
      }
    }

    return tempTranslations.map((translation) => (
      <Card
        key={translation.key}
        content={translation.siteTextlikeString}
        description={translation.definitionlikeString}
        vote={{
          upVotes: translation.upvotes,
          downVotes: translation.downvotes,
          onVoteUpClick: () => {
            toggleVoteStatus({
              variables: {
                translation_id: translation.translationId + '',
                from_type_is_word: translation.from_type_is_word,
                to_type_is_word: translation.to_type_is_word,
                vote: true,
              },
            });
          },
          onVoteDownClick: () => {
            toggleVoteStatus({
              variables: {
                translation_id: translation.translationId + '',
                from_type_is_word: translation.from_type_is_word,
                to_type_is_word: translation.to_type_is_word,
                vote: false,
              },
            });
          },
        }}
        voteFor="description"
      />
    ));
  }, [translationWithVoteList, toggleVoteStatus]);

  let title = 'Loading';
  title =
    (siteTextWordDefinition &&
      siteTextWordDefinition.site_text_word_definition &&
      siteTextWordDefinition.site_text_word_definition.word_definition.word
        .word) ||
    title;
  title =
    (siteTextPhraseDefinition &&
      siteTextPhraseDefinition.site_text_phrase_definition &&
      siteTextPhraseDefinition.site_text_phrase_definition.phrase_definition
        .phrase.phrase) ||
    title;

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption>
          {tr('Site Text')} - {title}
        </Caption>
      </CaptionContainer>

      <CardContainer>
        {wordCom}
        {phraseCom}
      </CardContainer>

      <AddListHeader
        title={tr('Site Text Translations')}
        onClick={() => setShowModal(true)}
      />

      <CardListContainer>{translationsCom}</CardListContainer>

      <IonModal ref={modal} isOpen={showModal}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => setShowModal(false)}>
                {tr('Cancel')}
              </IonButton>
            </IonButtons>
            <IonTitle>
              {tr('Site Text')} - {title}
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexDirection: 'column',
            }}
          >
            <Input
              ref={input}
              type="text"
              label={tr('Site Text')}
              labelPlacement="floating"
              fill="outline"
            />
            <Textarea
              ref={textarea}
              labelPlacement="floating"
              fill="solid"
              label={tr('Site Text Definition')}
            />
            <IonButton onClick={handleSaveNewTranslation}>
              {tr('Save')}
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
    </PageLayout>
  );
}
