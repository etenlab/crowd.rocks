import { useEffect } from 'react';
import { Card } from '../../common/Card';

import { useGetRecommendedTranslationFromSiteTextDefinitionIdLazyQuery } from '../../../generated/graphql';
import {
  ErrorType,
  // SiteTextTranslationWithVote,
} from '../../../generated/graphql';

interface TranslatedCardProps {
  siteTextId: string;
  isWord: boolean;
  languageInfo: LanguageInfo | null;
  onClick: () => void;
}

export function TranslatedCard(props: TranslatedCardProps) {
  const [
    getRecommendedTranslationFromSiteTextDefinitionId,
    { data, error, loading },
  ] = useGetRecommendedTranslationFromSiteTextDefinitionIdLazyQuery();

  useEffect(() => {
    if (!props.languageInfo) {
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
    props.languageInfo,
    props.siteTextId,
  ]);

  let siteTextlikeString = '';
  let definitionlikeString = '';

  const siteTextTranslationWithVote =
    !error &&
    !loading &&
    data &&
    data.getRecommendedTranslationFromSiteTextDefinitionID.error ===
      ErrorType.NoError
      ? data.getRecommendedTranslationFromSiteTextDefinitionID
          .site_text_translation_with_vote
      : null;

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
