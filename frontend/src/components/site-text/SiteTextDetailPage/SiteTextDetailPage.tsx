import { useState, useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router';
import { IonContent, IonPage } from '@ionic/react';

import { Caption } from '../../common/Caption/Caption';
import { Card } from '../../common/Card';

import { useQuery } from '../../hooks/useQuery';

import {
  useGetAllTranslationFromSiteTextDefinitionIdLazyQuery,
  useSiteTextPhraseDefinitionReadLazyQuery,
  useSiteTextWordDefinitionReadLazyQuery,
  SiteTextTranslationWithVoteListOutput,
  ErrorType,
  SiteTextPhraseDefinitionReadOutput,
  SiteTextWordDefinitionReadOutput,
  WordDefinition,
  PhraseDefinition,
} from '../../../generated/graphql';

import { CaptainContainer, CardListContainer, CardContainer } from './styled';

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

  const [allTranslations, setAllTranslations] =
    useState<SiteTextTranslationWithVoteListOutput>();
  const [siteTextWordDefinition, setSiteTextWordDefinition] =
    useState<SiteTextWordDefinitionReadOutput>();
  const [siteTextPhraseDefinition, setSiteTextPhraseDefinition] =
    useState<SiteTextPhraseDefinitionReadOutput>();

  useEffect(() => {
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
        <CardContainer key={translation.siteTextTranslationId}>
          <Card
            content={translation.siteTextlikeString}
            description={translation.definitionlikeString}
            vote={{
              upVotes: translation.upvotes,
              downVotes: translation.downvotes,
              onVoteUpClick: () => {},
              onVoteDownClick: () => {},
            }}
          />
        </CardContainer>
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

            <CardListContainer>{translationsCom}</CardListContainer>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
