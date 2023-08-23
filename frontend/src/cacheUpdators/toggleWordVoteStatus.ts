import { ApolloCache } from '@apollo/client';

import {
  WordWithVote,
  WordVoteStatus,
  WordWithDefinitions,
} from '../generated/graphql';
import {
  WordWithDefinitionsFragmentFragmentDoc,
  WordWithVoteFragmentFragmentDoc,
} from '../generated/graphql';

export function updateCacheWithToggleWordVoteStatus(
  cache: ApolloCache<unknown>,
  newVoteStatus: WordVoteStatus,
) {
  cache.updateFragment<WordWithDefinitions>(
    {
      id: cache.identify({
        __typename: 'WordWithDefinitions',
        word_id: newVoteStatus.word_id,
      }),
      fragment: WordWithDefinitionsFragmentFragmentDoc,
      fragmentName: 'WordWithDefinitionsFragment',
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

  cache.updateFragment<WordWithVote>(
    {
      id: cache.identify({
        __typename: 'WordWithVote',
        word_id: newVoteStatus.word_id,
      }),
      fragment: WordWithVoteFragmentFragmentDoc,
      fragmentName: 'WordWithVoteFragment',
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
