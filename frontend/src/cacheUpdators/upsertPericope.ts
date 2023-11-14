import { ApolloCache } from '@apollo/client';

import {
  Pericope,
  GetPericopiesByDocumentIdDocument,
  GetPericopiesByDocumentIdQuery,
} from '../generated/graphql';

export function updateCacheWithUpsertPericope(
  cache: ApolloCache<unknown>,
  newPericope: Pericope,
  documentId: string,
) {
  cache.updateQuery<GetPericopiesByDocumentIdQuery>(
    {
      query: GetPericopiesByDocumentIdDocument,
      variables: {
        document_id: documentId,
      },
    },
    (data) => {
      if (data) {
        const alreadyExists =
          data.getPericopiesByDocumentId.pericope_with_votes?.filter(
            (pericope) => {
              if (pericope) {
                return pericope.pericope_id === newPericope.pericope_id;
              }

              return false;
            },
          ) || [];

        if (alreadyExists.length > 0) {
          return data;
        }

        return {
          ...data,
          getPericopiesByDocumentId: {
            ...data.getPericopiesByDocumentId,
            pericope_with_votes: [
              ...data.getPericopiesByDocumentId.pericope_with_votes,
              {
                __typename: 'PericopeWithVote',
                pericope_id: newPericope.pericope_id,
                start_word: newPericope.start_word,
                upvotes: 0,
                downvotes: 0,
              },
            ],
          },
        };
      } else {
        return data;
      }
    },
  );
}
