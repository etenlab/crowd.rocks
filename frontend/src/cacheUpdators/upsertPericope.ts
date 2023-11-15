import { ApolloCache } from '@apollo/client';

import {
  Pericope,
  PericopeWithVotesEdge,
  PericopeWithVotesEdgeFragmentFragmentDoc,
  DocumentWordEntryFragmentFragmentDoc,
  DocumentWordEntry,
} from '../generated/graphql';

export function updateCacheWithUpsertPericope(
  cache: ApolloCache<unknown>,
  newPericope: Pericope,
) {
  const start_word = newPericope.start_word;

  const wordEntryData = cache.readFragment<DocumentWordEntry>({
    id: cache.identify({
      __typename: 'DocumentWordEntry',
      document_word_entry_id: start_word,
    }),
    fragment: DocumentWordEntryFragmentFragmentDoc,
    fragmentName: 'DocumentWordEntryFragment',
  });

  if (!wordEntryData) {
    return;
  }

  const documentId = +wordEntryData.document_id;
  const page = +wordEntryData.page;

  cache.updateFragment<PericopeWithVotesEdge>(
    {
      id: cache.identify({
        __typename: 'PericopeWithVotesEdge',
        cursor: JSON.stringify({ document_id: documentId, page }),
      }),
      fragment: PericopeWithVotesEdgeFragmentFragmentDoc,
      fragmentName: 'PericopeWithVotesEdgeFragment',
    },
    (data) => {
      if (data) {
        return {
          ...data,
          node: [
            ...data.node,
            {
              __typename: 'PericopeWithVote',
              pericope_id: newPericope.pericope_id,
              start_word: newPericope.start_word,
              upvotes: 0,
              downvotes: 0,
            },
          ],
        };
      } else {
        return {
          __typename: 'PericopeWithVotesEdge',
          cursor: JSON.stringify({ document_id: documentId, page }),
          node: [
            {
              __typename: 'PericopeWithVote',
              pericope_id: newPericope.pericope_id,
              start_word: newPericope.start_word,
              upvotes: 0,
              downvotes: 0,
            },
          ],
        };
      }
    },
  );
}
