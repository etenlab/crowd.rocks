import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  SiteTextTranslationWithVoteListOutput,
  useGetAllTranslationFromSiteTextDefinitionIdLazyQuery,
  ErrorType,
  PhraseDefinition,
  WordDefinition,
} from '../../../generated/graphql';
import { Card } from '../../common/Card';

interface TranslatedCardProps {
  siteTextId: string;
  isWord: boolean;
  languageInfo: LanguageInfo | null;
}

interface Translation {
  siteTextTranslationId: string;
  isWord: boolean;
  siteTextlikeString: string;
  definitionlikeString: string;
  upvotes: number;
  downvotes: number;
}

export function TranslatedCard(props: TranslatedCardProps) {
  const [allTranslations, setAllTranslations] =
    useState<SiteTextTranslationWithVoteListOutput>();

  const [
    getAllTranslationFromSiteTextDefinitionID,
    {
      data: translationsData,
      error: translationsError,
      loading: translationsLoading,
      called: translationsCalled,
    },
  ] = useGetAllTranslationFromSiteTextDefinitionIdLazyQuery();

  const chooseBestTranslation = useCallback((translations?: Translation[]) => {
    const res = translations?.reduce((bestTr, currTr) => {
      if (bestTr?.upvotes === undefined) {
        return currTr;
      }

      const bestTrTotal =
        Number(bestTr?.upvotes || 0) - Number(bestTr?.downvotes || 0);

      const currTrTotal =
        Number(currTr?.upvotes || 0) - Number(currTr?.downvotes || 0);

      if (currTrTotal > bestTrTotal) {
        return currTr;
      }

      return bestTr;
    }, {} as Translation);
    return res;
  }, []);

  useEffect(() => {
    if (!props.languageInfo?.lang.tag) {
      return;
    }

    getAllTranslationFromSiteTextDefinitionID({
      variables: {
        site_text_id: props.siteTextId,
        site_text_type_is_word: props.isWord,
        language_code: props.languageInfo.lang.tag!,
        dialect_code: props.languageInfo.dialect?.tag,
        geo_code: props.languageInfo.region?.tag,
      },
    });
  }, [
    getAllTranslationFromSiteTextDefinitionID,
    props.isWord,
    props.languageInfo?.dialect?.tag,
    props.languageInfo?.lang.tag,
    props.languageInfo?.region?.tag,
    props.siteTextId,
  ]);

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

  const bestTr = chooseBestTranslation(translations);

  return (
    <Card
      content={bestTr?.siteTextlikeString || ''}
      description={bestTr?.definitionlikeString || ''}
    />
  );
}
