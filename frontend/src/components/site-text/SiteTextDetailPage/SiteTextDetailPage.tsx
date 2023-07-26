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
  SiteTextTranslationWithVoteListOutput,
  SiteTextTranslationWithVote,
  ErrorType,
  SiteTextPhraseDefinitionReadOutput,
  SiteTextWordDefinitionReadOutput,
  WordDefinition,
  PhraseDefinition,
  useToggleVoteStatusMutation,
} from '../../../generated/graphql';

import {
  CaptainContainer,
  CardListContainer,
  CardContainer,
  Textarea,
  Input,
} from './styled';

interface SiteTextDetailPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
    site_text_id: string;
    definition_type: string;
  }> {}

export function SiteTextDetailPage({ match }: SiteTextDetailPageProps) {
  const query = useQuery();
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
  const [
    upsertTranslation,
    { data: upsertData, error: upsertError, loading: upsertLoading },
  ] = useUpsertTranslationMutation();
  const [
    toggleVoteStatus,
    { data: voteData, error: voteError, loading: voteLoading },
  ] = useToggleVoteStatusMutation();

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

  useEffect(() => {
    if (upsertError) {
      console.log(upsertError);
      alert('Error');

      return;
    }

    if (upsertLoading) {
      return;
    }

    if (upsertData) {
      if (upsertData.upsertTranslation.error !== ErrorType.NoError) {
        console.log(upsertData.upsertTranslation.error);
        present({
          message: 'Failed at creating new translation!',
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        return;
      }

      present({
        message: 'Success at creating new translation!',
        duration: 1500,
        position: 'top',
        color: 'success',
      });

      setAllTranslations((_translations) => {
        const site_text_translation =
          upsertData.upsertTranslation.site_text_translation;

        if (!_translations || !site_text_translation) {
          return _translations;
        }

        return {
          ..._translations,
          site_text_translation_with_vote_list: [
            ..._translations.site_text_translation_with_vote_list,
            {
              ...site_text_translation,
              upvotes: 0,
              downvotes: 0,
              created_at: new Date().toISOString(),
            } as SiteTextTranslationWithVote,
          ],
        };
      });

      modal.current?.dismiss();
    }
  }, [upsertData, upsertError, upsertLoading, present]);

  useEffect(() => {
    if (voteError) {
      console.log(voteError);
      alert('Error');

      return;
    }

    if (voteLoading) {
      return;
    }

    if (voteData) {
      if (voteData.toggleVoteStatus.error !== ErrorType.NoError) {
        console.log(voteData.toggleVoteStatus.error);
        present({
          message: 'Failed at voting!',
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        return;
      }

      setAllTranslations((_translations) => {
        const vote_status = voteData.toggleVoteStatus.vote_status;

        if (!_translations || !vote_status) {
          return _translations;
        }

        return {
          ..._translations,
          site_text_translation_with_vote_list: [
            ..._translations.site_text_translation_with_vote_list.map(
              (translation) => {
                if (!translation) {
                  return translation;
                }

                if (
                  translation.site_text_translation_id ===
                  vote_status.site_text_translation_id
                ) {
                  return {
                    ...translation,
                    downvotes: vote_status.downvotes,
                    upvotes: vote_status.upvotes,
                  } as SiteTextTranslationWithVote;
                }

                return translation;
              },
            ),
          ],
        };
      });

      modal.current?.dismiss();
    }
  }, [voteData, voteError, voteLoading, present]);

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
              <Caption>Site Text - {title}</Caption>
            </CaptainContainer>

            <CardContainer>
              {wordCom}
              {phraseCom}
            </CardContainer>

            <hr />

            <p style={{ padding: '0 16px', fontSize: 16 }}>
              Site Text Translations
            </p>

            <IonButton id="open-modal" expand="block">
              + Add More Translation
            </IonButton>

            <CardListContainer>{translationsCom}</CardListContainer>

            <IonModal ref={modal} trigger="open-modal">
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonButton onClick={() => modal.current?.dismiss()}>
                      Cancel
                    </IonButton>
                  </IonButtons>
                  <IonTitle>Site Text - {title}</IonTitle>
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
                    placeholder="Site Text..."
                    labelPlacement="floating"
                    label="Input Site Text"
                    fill="outline"
                  />
                  <Textarea
                    ref={textarea}
                    label="Input Site Text Description"
                    labelPlacement="floating"
                    fill="solid"
                    placeholder="Site Text Description..."
                  />
                  <IonButton onClick={handleSaveNewTranslation}>Save</IonButton>
                </div>
              </IonContent>
            </IonModal>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
