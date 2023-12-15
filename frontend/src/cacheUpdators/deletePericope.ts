import { ApolloCache } from '@apollo/client';

import {
  PericopeWithVote,
  PericopeWithVotesEdge,
  PericopeWithVoteFragmentFragmentDoc,
  PericopeWithVotesEdgeFragmentFragmentDoc,
  DocumentWordEntryFragmentFragmentDoc,
  DocumentWordEntry,
  GetPericopiesByDocumentIdQuery,
  GetPericopiesByDocumentIdDocument,
} from '../generated/graphql';

export function updateCacheWithDeletePericope(
  cache: ApolloCache<unknown>,
  deleted_pericope_id: string,
) {
  const prevPericope = cache.readFragment<PericopeWithVote>({
    id: cache.identify({
      __typename: 'PericopeWithVote',
      pericope_id: deleted_pericope_id,
    }),
    fragment: PericopeWithVoteFragmentFragmentDoc,
    fragmentName: 'PericopeWithVoteFragment',
  });

  if (!prevPericope) {
    return;
  }

  const start_word = prevPericope.start_word;

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

  const pericopiesData = cache.readQuery<GetPericopiesByDocumentIdQuery>({
    query: GetPericopiesByDocumentIdDocument,
    variables: {
      document_id: documentId + '',
    },
  });

  if (!pericopiesData) {
    return;
  }

  const exists = pericopiesData.getPericopiesByDocumentId.edges.filter(
    (edge) => edge.cursor === JSON.stringify({ document_id: documentId, page }),
  );

  if (exists.length > 0) {
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
              ...data.node.filter((item) => {
                return +item.pericope_id !== +deleted_pericope_id;
              }),
            ],
          };
        } else {
          return data;
        }
      },
    );
  }
}
