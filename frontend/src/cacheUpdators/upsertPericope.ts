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
          data.getPericopiesByDocumentId.pericopies?.filter((pericope) => {
            if (pericope) {
              return pericope.pericope_id === newPericope.pericope_id;
            }

            return false;
          }) || [];

        if (alreadyExists.length > 0) {
          return data;
        }

        return {
          ...data,
          getPericopiesByDocumentId: {
            ...data.getPericopiesByDocumentId,
            pericopies: [
              ...(data.getPericopiesByDocumentId.pericopies || []),
              newPericope,
            ],
          },
        };
      } else {
        return data;
      }
    },
  );
}
