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

  const translationWithVote =
    !error &&
    !loading &&
    data &&
    data.getRecommendedTranslationFromSiteTextDefinitionID.error ===
      ErrorType.NoError
      ? data.getRecommendedTranslationFromSiteTextDefinitionID
          .translation_with_vote
      : null;

  if (translationWithVote) {
    switch (translationWithVote.__typename) {
      case 'WordToWordTranslationWithVote': {
        siteTextlikeString = translationWithVote.to_word_definition.word.word;
        definitionlikeString =
          translationWithVote.to_word_definition.definition;
        break;
      }
      case 'WordToPhraseTranslationWithVote': {
        siteTextlikeString =
          translationWithVote.to_phrase_definition.phrase.phrase;
        definitionlikeString =
          translationWithVote.to_phrase_definition.definition;
        break;
      }
      case 'PhraseToWordTranslationWithVote': {
        siteTextlikeString = translationWithVote.to_word_definition.word.word;
        definitionlikeString =
          translationWithVote.to_word_definition.definition;
        break;
      }
      case 'PhraseToPhraseTranslationWithVote': {
        siteTextlikeString =
          translationWithVote.to_phrase_definition.phrase.phrase;
        definitionlikeString =
          translationWithVote.to_phrase_definition.definition;
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
