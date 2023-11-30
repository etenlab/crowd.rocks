import { ApolloCache } from '@apollo/client';

import {
  GetPericopeTranslationsQuery,
  GetPericopeTranslationsDocument,
  PericopeTranslation,
  // LanguageInput,
  PericopeTranslationWithVotes,
  LanguageInput,
  PericopeTextWithTranslationAndDescriptionFragmentFragmentDoc,
  PericopeTextWithTranslationAndDescription,
} from '../generated/graphql';

export function updateCacheWithAddPrericopeTr(
  cache: ApolloCache<unknown>,
  newPericopeTr: PericopeTranslation,
) {
  const newPericopeTrWithVotes: PericopeTranslationWithVotes = {
    ...newPericopeTr,
    __typename: 'PericopeTranslationWithVotes',
    upvotes: 0,
    downvotes: 0,
  };
  cache.updateQuery<GetPericopeTranslationsQuery>(
    {
      query: GetPericopeTranslationsDocument,
      variables: {
        pericopeId: newPericopeTr.pericope_id,
        targetLang: {
          language_code: newPericopeTr.language.language_code,
          dialect_code: newPericopeTr.language.dialect_code || null,
          geo_code: newPericopeTr.language.geo_code || null,
        } as LanguageInput,
      },
    },
    (data) => {
      if (data) {
        return {
          ...data,
          getPericopeTranslations: {
            ...data.getPericopeTranslations,
            translations: [
              newPericopeTrWithVotes,
              ...data.getPericopeTranslations.translations,
            ],
          },
        };
      } else {
        return data;
      }
    },
  );

  const id = cache.identify({
    __typename: 'PericopeTextWithTranslationAndDescription',
    pericope_id: newPericopeTr.pericope_id,
  });

  const fragmentData =
    cache.readFragment<PericopeTextWithTranslationAndDescription>({
      id,
      fragment: PericopeTextWithTranslationAndDescriptionFragmentFragmentDoc,
      fragmentName: 'PericopeTextWithTranslationAndDescriptionFragment',
    });

  if (!fragmentData) {
    return;
  }

  const newTranslation: PericopeTranslation = fragmentData.translation
    ? {
        ...fragmentData.translation,
        translation: newPericopeTr.translation,
        translation_description: newPericopeTr.translation_description,
      }
    : newPericopeTr;

  cache.writeFragment<PericopeTextWithTranslationAndDescription>({
    id,
    fragment: PericopeTextWithTranslationAndDescriptionFragmentFragmentDoc,
    fragmentName: 'PericopeTextWithTranslationAndDescriptionFragment',
    data: {
      ...fragmentData,
      translation: newTranslation,
    },
  });
}
