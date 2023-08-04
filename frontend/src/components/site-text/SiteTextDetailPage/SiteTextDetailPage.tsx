import { useState, useEffect, useMemo, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonPage,
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
  useUpsertTranslationMutation,
  useToggleVoteStatusMutation,
} from '../../../generated/graphql';

import {
  SiteTextTranslationWithVoteListOutput,
  SiteTextPhraseDefinitionReadOutput,
  SiteTextWordDefinitionReadOutput,
  SiteTextTranslationWithVote,
  PhraseDefinition,
  WordDefinition,
  ErrorType,
} from '../../../generated/graphql';

import {
  SiteTextTranslationWithVoteFragmentFragmentDoc,
  GetAllTranslationFromSiteTextDefinitionIdDocument,
} from '../../../generated/graphql';

import { CaptainContainer, CardListContainer, CardContainer } from './styled';
import { Input, Textarea } from '../../common/styled';

import { useTr } from '../../../hooks/useTr';

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

  const [allTranslations, setAllTranslations] =
    useState<SiteTextTranslationWithVoteListOutput>();
  const [siteTextWordDefinition, setSiteTextWordDefinition] =
    useState<SiteTextWordDefinitionReadOutput>();
  const [siteTextPhraseDefinition, setSiteTextPhraseDefinition] =
    useState<SiteTextPhraseDefinitionReadOutput>();

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
  const [upsertTranslation] = useUpsertTranslationMutation({
    update(cache, { data, errors }) {
      if (data && !errors && translationsData) {
        const newSiteTextTranslation =
          data.upsertTranslation.site_text_translation;

        cache.writeQuery({
          query: GetAllTranslationFromSiteTextDefinitionIdDocument,
          data: {
            ...translationsData,
            getAllTranslationFromSiteTextDefinitionID: {
              ...translationsData.getAllTranslationFromSiteTextDefinitionID,
              site_text_translation_with_vote_list: [
                ...translationsData.getAllTranslationFromSiteTextDefinitionID.site_text_translation_with_vote_list.filter(
                  (translation) =>
                    translation?.site_text_translation_id !==
                    newSiteTextTranslation?.site_text_translation_id,
                ),
                {
                  ...newSiteTextTranslation,
                  __typename: 'SiteTextTranslationWithVote',
                  upvotes: 0,
                  downvotes: 0,
                  created_at: new Date().toISOString(),
                },
              ],
            },
          },
          variables: {
            site_text_id: match.params.site_text_id,
            site_text_type_is_word:
              match.params.definition_type === 'word' ? true : false,
            language_code: query.get('language_code')!,
            dialect_code: query.get('dialect_code'),
            geo_code: query.get('geo_code'),
          },
        });

        present({
          message: tr('Success at creating new site text translation!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });

        modal.current?.dismiss();
      } else {
        console.log('useUpsertTranslationMutation: ', errors);
        console.log(data?.upsertTranslation.error);

        present({
          message: tr('Failed at creating new site text translation!'),
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
  const [toggleVoteStatus] = useToggleVoteStatusMutation({
    update(cache, { data, errors }) {
      if (!errors && data && data.toggleVoteStatus.vote_status) {
        const newVoteStatus = data.toggleVoteStatus.vote_status;

        cache.updateFragment<SiteTextTranslationWithVote>(
          {
            id: cache.identify({
              __typename: 'SiteTextTranslationWithVote',
              site_text_translation_id: newVoteStatus.site_text_translation_id,
            }),
            fragment: SiteTextTranslationWithVoteFragmentFragmentDoc,
            fragmentName: 'SiteTextTranslationWithVoteFragment',
          },
          (data) => {
            if (data) {
              return {
                ...data,
                upvotes: newVoteStatus.upvotes,
                downvotes: newVoteStatus.downvotes,
              };
            } else {
              return data;
            }
          },
        );
      } else {
        console.log('useToggleVoteStatusMutation: ', errors);
        console.log(data?.toggleVoteStatus.error);

        present({
          message: tr('Failed at voting!'),
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
      setAllTranslations(
        translationsData.getAllTranslationFromSiteTextDefinitionID,
      );
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

  const translations = useMemo(() => {
    const tempTranslations: {
      siteTextTranslationId: string;
      isWord: boolean;
      siteTextlikeString: string;
      definitionlikeString: string;
      upvotes: number;
      downvotes: number;
    }[] = [];

    if (!allTranslations) {
      return tempTranslations;
    }

    for (const translation of allTranslations.site_text_translation_with_vote_list) {
      if (translation) {
        if (translation.to_type_is_word) {
          tempTranslations.push({
            siteTextTranslationId: translation.site_text_translation_id,
            isWord: true,
            siteTextlikeString: (translation.to_definition as WordDefinition)
              .word.word,
            definitionlikeString: (translation.to_definition as WordDefinition)
              .definition,
            upvotes: translation.upvotes,
            downvotes: translation.downvotes,
          });
        } else {
          tempTranslations.push({
            siteTextTranslationId: translation.site_text_translation_id,
            isWord: false,
            siteTextlikeString: (translation.to_definition as PhraseDefinition)
              .phrase.phrase,
            definitionlikeString: (
              translation.to_definition as PhraseDefinition
            ).definition,
            upvotes: translation.upvotes,
            downvotes: translation.downvotes,
          });
        }
      }
    }

    return tempTranslations;
  }, [allTranslations]);

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

  const translationsCom = translations
    ? translations.map((translation) => (
        <Card
          key={translation.siteTextTranslationId}
          content={translation.siteTextlikeString}
          description={translation.definitionlikeString}
          vote={{
            upVotes: translation.upvotes,
            downVotes: translation.downvotes,
            onVoteUpClick: () => {
              toggleVoteStatus({
                variables: {
                  site_text_translation_id: translation.siteTextTranslationId,
                  vote: true,
                },
              });
            },
            onVoteDownClick: () => {
              toggleVoteStatus({
                variables: {
                  site_text_translation_id: translation.siteTextTranslationId,
                  vote: false,
                },
              });
            },
          }}
          voteFor="description"
        />
      ))
    : null;

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
    <IonPage>
      <IonContent>
        <div className="page">
          <div className="section">
            <CaptainContainer>
              <Caption>
                {tr('Site Text')} - {title}
              </Caption>
            </CaptainContainer>

            <CardContainer>
              {wordCom}
              {phraseCom}
            </CardContainer>

            <hr />

            <p style={{ padding: '0 16px', fontSize: 16 }}>
              {tr('Site Text Translations')}
            </p>

            <IonButton id="open-site-text-translation-modal" expand="block">
              + {tr('Add More Translation')}
            </IonButton>

            <CardListContainer>{translationsCom}</CardListContainer>

            <IonModal ref={modal} trigger="open-site-text-translation-modal">
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonButton onClick={() => modal.current?.dismiss()}>
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
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
