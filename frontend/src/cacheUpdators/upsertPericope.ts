import { ApolloCache } from '@apollo/client';

import {
  Pericope,
  PericopeWithVotesEdge,
  PericopeWithVotesEdgeFragmentFragmentDoc,
  DocumentWordEntryFragmentFragmentDoc,
  DocumentWordEntry,
  GetPericopiesByDocumentIdQuery,
  GetPericopiesByDocumentIdDocument,
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

    return;
  }

  cache.writeQuery<GetPericopiesByDocumentIdQuery>({
    query: GetPericopiesByDocumentIdDocument,
    variables: {
      document_id: documentId + '',
    },
    data: {
      getPericopiesByDocumentId: {
        ...pericopiesData.getPericopiesByDocumentId,
        edges: [
          ...pericopiesData.getPericopiesByDocumentId.edges,
          {
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
          },
        ],
      },
    },
  });
}
