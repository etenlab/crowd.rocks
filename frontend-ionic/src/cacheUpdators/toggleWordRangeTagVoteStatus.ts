import { ApolloCache } from '@apollo/client';

import {
  WordRangeTagVoteStatus,
  WordRangeTagWithVote,
} from '../generated/graphql';
import { WordRangeTagWithVoteFragmentFragmentDoc } from '../generated/graphql';

export function updateCacheWithToggleWordRangeTagVoteStatus(
  cache: ApolloCache<unknown>,
  newVoteStatus: WordRangeTagVoteStatus,
) {
  cache.updateFragment<WordRangeTagWithVote>(
    {
      id: cache.identify({
        __typename: 'WordRangeTagWithVote',
        word_range_tag_id: newVoteStatus.word_range_tag_id,
      }),
      fragment: WordRangeTagWithVoteFragmentFragmentDoc,
      fragmentName: 'WordRangeTagWithVoteFragment',
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
