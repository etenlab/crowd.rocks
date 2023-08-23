import { ApolloCache } from '@apollo/client';

import {
  PhraseWithVote,
  PhraseVoteStatus,
  PhraseWithDefinitions,
} from '../generated/graphql';
import {
  PhraseWithDefinitionsFragmentFragmentDoc,
  PhraseWithVoteFragmentFragmentDoc,
} from '../generated/graphql';

export function updateCacheWithTogglePhraseVoteStatus(
  cache: ApolloCache<unknown>,
  newVoteStatus: PhraseVoteStatus,
) {
  cache.updateFragment<PhraseWithDefinitions>(
    {
      id: cache.identify({
        __typename: 'PhraseWithDefinitions',
        phrase_id: newVoteStatus.phrase_id,
      }),
      fragment: PhraseWithDefinitionsFragmentFragmentDoc,
      fragmentName: 'PhraseWithDefinitionsFragment',
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

  cache.updateFragment<PhraseWithVote>(
    {
      id: cache.identify({
        __typename: 'PhraseWithVote',
        phrase_id: newVoteStatus.phrase_id,
      }),
      fragment: PhraseWithVoteFragmentFragmentDoc,
      fragmentName: 'PhraseWithVoteFragment',
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
