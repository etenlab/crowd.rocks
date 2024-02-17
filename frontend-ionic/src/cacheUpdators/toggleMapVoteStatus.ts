import { ApolloCache } from '@apollo/client';

import {
  MapVoteStatus,
  MapVoteStatusFragmentFragmentDoc,
} from '../generated/graphql';
import {} from '../generated/graphql';

export function updateCacheWithToggleMapVoteStatus(
  cache: ApolloCache<unknown>,
  newVoteStatus: MapVoteStatus,
) {
  cache.updateFragment<MapVoteStatus>(
    {
      id: cache.identify({
        __typename: 'MapVoteStatus',
        map_id: newVoteStatus.map_id,
        is_original: newVoteStatus.is_original,
      }),
      fragment: MapVoteStatusFragmentFragmentDoc,
      fragmentName: 'MapVoteStatusFragment',
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
