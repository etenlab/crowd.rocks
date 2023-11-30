import { ApolloCache } from '@apollo/client';

import {
  PericopeTrVoteStatus,
  PericopeTranslationWithVotes,
  PericopeTranslationWithVotesFragmentFragmentDoc,
} from '../generated/graphql';

export function updateCacheWithTogglePericopeTrVoteStatus(
  cache: ApolloCache<unknown>,
  newVoteStatus: PericopeTrVoteStatus,
) {
  cache.updateFragment<PericopeTranslationWithVotes>(
    {
      id: cache.identify({
        __typename: 'PericopeTranslationWithVotes',
        pericope_transation_id: newVoteStatus.pericope_translation_id,
      }),
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

  // cache.updateFragment<PericopeTrVoteStatus>(
  //   {
  //     id: cache.identify({
  //       __typename: 'PericopeTrVoteStatus',
  //       pericope_id: newVoteStatus.pericope_translation_id,
  //     }),
  //     fragment: PericopeTrVoteStatusFragmentFragmentDoc,
  //     fragmentName: 'PericopeTrVoteStatusFragment',
  //   },
  //   (data) => {
  //     if (data) {
  //       return {
  //         ...data,
  //         upvotes: newVoteStatus.upvotes,
  //         downvotes: newVoteStatus.downvotes,
  //       };
  //     } else {
  //       return data;
  //     }
  //   },
  // );
}
