import { ApolloCache } from '@apollo/client';

import {
  WordDefinitionWithVote,
  DefinitionVoteStatus,
} from '../generated/graphql';
import { WordDefinitionWithVoteFragmentFragmentDoc } from '../generated/graphql';

export function updateCacheWithToggleWordDefinitionVoteStatus(
  cache: ApolloCache<unknown>,
  newVoteStatus: DefinitionVoteStatus,
) {
  cache.updateFragment<WordDefinitionWithVote>(
    {
      id: cache.identify({
        __typename: 'WordDefinitionWithVote',
        word_definition_id: newVoteStatus.definition_id,
      }),
      fragment: WordDefinitionWithVoteFragmentFragmentDoc,
      fragmentName: 'WordDefinitionWithVoteFragment',
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
