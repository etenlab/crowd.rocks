import { ApolloCache } from '@apollo/client';

import {
  DefinitionVoteStatus,
  PhraseDefinitionWithVote,
} from '../generated/graphql';
import { PhraseDefinitionWithVoteFragmentFragmentDoc } from '../generated/graphql';

export function updateCacheWithTogglePhraseDefinitionVoteStatus(
  cache: ApolloCache<unknown>,
  newVoteStatus: DefinitionVoteStatus,
) {
  cache.updateFragment<PhraseDefinitionWithVote>(
    {
      id: cache.identify({
        __typename: 'PhraseDefinitionWithVote',
        phrase_definition_id: newVoteStatus.definition_id,
      }),
      fragment: PhraseDefinitionWithVoteFragmentFragmentDoc,
      fragmentName: 'PhraseDefinitionWithVoteFragment',
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
