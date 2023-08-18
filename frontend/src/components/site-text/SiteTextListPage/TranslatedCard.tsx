import { useEffect, useState } from 'react';

import { Card } from '../../common/Card';

import { useGetRecommendedTranslationFromSiteTextDefinitionIdLazyQuery } from '../../../generated/graphql';
import {
  ErrorType,
  SiteTextTranslationWithVote,
} from '../../../generated/graphql';

interface TranslatedCardProps {
  siteTextId: string;
  isWord: boolean;
  languageInfo: LanguageInfo | null;
  onClick: () => void;
}

export function TranslatedCard(props: TranslatedCardProps) {
  const [siteTextTranslationWithVote, setSiteTextTranslationWithVote] =
    useState<SiteTextTranslationWithVote | null>(null);

  const [
    getRecommendedTranslationFromSiteTextDefinitionId,
    { data, error, loading, called },
  ] = useGetRecommendedTranslationFromSiteTextDefinitionIdLazyQuery();

  useEffect(() => {
    if (!props.languageInfo?.lang.tag) {
      return;
    }

    getRecommendedTranslationFromSiteTextDefinitionId({
      variables: {
        site_text_id: props.siteTextId,
        site_text_type_is_word: props.isWord,
        language_code: props.languageInfo.lang.tag!,
        dialect_code: props.languageInfo.dialect?.tag,
        geo_code: props.languageInfo.region?.tag,
      },
    });
  }, [
    getRecommendedTranslationFromSiteTextDefinitionId,
    props.isWord,
    props.languageInfo?.dialect?.tag,
    props.languageInfo?.lang.tag,
    props.languageInfo?.region?.tag,
    props.siteTextId,
  ]);

  useEffect(() => {
    if (error) {
      console.log(error);
      alert('Error');

      return;
    }

    if (loading || !called) {
      return;
    }

    if (data) {
      if (
        data.getRecommendedTranslationFromSiteTextDefinitionID.error !==
        ErrorType.NoError
      ) {
        console.log(
          data.getRecommendedTranslationFromSiteTextDefinitionID.error,
        );
        alert(data.getRecommendedTranslationFromSiteTextDefinitionID.error);
        return;
      }

      if (
        data.getRecommendedTranslationFromSiteTextDefinitionID
          .site_text_translation_with_vote
      ) {
        setSiteTextTranslationWithVote(
          data.getRecommendedTranslationFromSiteTextDefinitionID
            .site_text_translation_with_vote,
        );
      } else {
        setSiteTextTranslationWithVote(null);
      }
    }
  }, [data, error, loading, called]);

  let siteTextlikeString = '';
  let definitionlikeString = '';

  if (siteTextTranslationWithVote) {
    switch (siteTextTranslationWithVote.__typename) {
      case 'SiteTextWordToWordTranslationWithVote': {
        siteTextlikeString =
          siteTextTranslationWithVote.to_word_definition.word.word;
        definitionlikeString =
          siteTextTranslationWithVote.to_word_definition.definition;
        break;
      }
      case 'SiteTextWordToPhraseTranslationWithVote': {
        siteTextlikeString =
          siteTextTranslationWithVote.to_phrase_definition.phrase.phrase;
        definitionlikeString =
          siteTextTranslationWithVote.to_phrase_definition.definition;
        break;
      }
      case 'SiteTextPhraseToWordTranslationWithVote': {
        siteTextlikeString =
          siteTextTranslationWithVote.to_word_definition.word.word;
        definitionlikeString =
          siteTextTranslationWithVote.to_word_definition.definition;
        break;
      }
      case 'SiteTextPhraseToPhraseTranslationWithVote': {
        siteTextlikeString =
          siteTextTranslationWithVote.to_phrase_definition.phrase.phrase;
        definitionlikeString =
          siteTextTranslationWithVote.to_phrase_definition.definition;
        break;
      }
    }
  }

  return (
    <Card
      content={siteTextlikeString}
      description={definitionlikeString}
      onClick={() => props.onClick()}
    />
  );
}
