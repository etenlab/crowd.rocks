import { ApolloCache } from '@apollo/client';

import {
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
  }
}
