import { ApolloCache } from '@apollo/client';

import { PericopeVoteStatus } from '../generated/graphql';
import { PericopeVoteStatusFragmentFragmentDoc } from '../generated/graphql';

export function updateCacheWithTogglePericopeVoteStatus(
  cache: ApolloCache<unknown>,
  newVoteStatus: PericopeVoteStatus,
) {
  cache.updateFragment<PericopeVoteStatus>(
    {
      id: cache.identify({
        __typename: 'PericopeVoteStatus',
        pericope_id: newVoteStatus.pericope_id,
      }),
      fragment: PericopeVoteStatusFragmentFragmentDoc,
      fragmentName: 'PericopeVoteStatusFragment',
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
}
