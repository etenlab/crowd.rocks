import { ApolloCache } from '@apollo/client';

import {
  GetPericopeTranslationsDocument,
  GetPericopeTranslationsQuery,
  LanguageInput,
  PericopeTextWithTranslationAndDescription,
  PericopeTextWithTranslationAndDescriptionFragmentFragmentDoc,
  PericopeTrVoteStatus,
  PericopeTranslation,
  PericopeTranslationWithVotes,
  PericopeTranslationWithVotesFragmentFragmentDoc,
} from '../generated/graphql';

export function updateCacheWithTogglePericopeTrVoteStatus(
  cache: ApolloCache<unknown>,
  newVoteStatus: PericopeTrVoteStatus,
  newBestTranslation: PericopeTranslation,
) {
  const id = cache.identify({
    __typename: 'PericopeTranslationWithVotes',
    pericope_translation_id: newVoteStatus.pericope_translation_id,
  });
  cache.updateFragment<PericopeTranslationWithVotes>(
    {
      id,
      fragment: PericopeTranslationWithVotesFragmentFragmentDoc,
      fragmentName: 'PericopeTranslationWithVotesFragment',
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

  const translationId = cache.identify({
    __typename: 'PericopeTextWithTranslationAndDescription',
    pericope_id: newBestTranslation.pericope_id,
  });

  if (newBestTranslation) {
    // update pericopes translations at all pericopes list (PericopiesTrListPage.tsx)
    cache.updateFragment<PericopeTextWithTranslationAndDescription>(
      {
        id: translationId,
        fragment: PericopeTextWithTranslationAndDescriptionFragmentFragmentDoc,
        fragmentName: 'PericopeTextWithTranslationAndDescriptionFragment',
      },
      (data) => {
        if (data) {
          return {
            ...data,
            translation: newBestTranslation,
          };
        } else {
          return data;
        }
      },
    );

    // update best pericope transltion at detailed page (PericopeTranslationPage.tsx)
    cache.updateQuery<GetPericopeTranslationsQuery>(
      {
        query: GetPericopeTranslationsDocument,
        variables: {
          pericopeId: newBestTranslation.pericope_id,
          targetLang: {
            language_code: newBestTranslation.language.language_code,
            dialect_code: newBestTranslation.language.dialect_code,
            geo_code: newBestTranslation.language.geo_code,
          } as LanguageInput,
        },
      },
      (data) => {
        if (!data) {
          return data;
        }
        return {
          ...data,
          getPericopeTranslations: {
            ...data.getPericopeTranslations,
            translations: data.getPericopeTranslations.translations.map(
              (oldTr) => {
                return {
                  ...oldTr,
                  isBest:
                    oldTr.pericope_translation_id ===
                    newBestTranslation.pericope_translation_id,
                };
              },
            ),
          },
        };
      },
    );
  }
}
