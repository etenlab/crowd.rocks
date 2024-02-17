import { ApolloCache } from '@apollo/client';

import { TextyDocument, GetAllDocumentsQuery } from '../generated/graphql';
import { GetAllDocumentsDocument } from '../generated/graphql';
import { GetAllDocumentsVariable } from '../reducers/non-persistent.reducer';

export function updateCacheWithUploadDocument(
  cache: ApolloCache<unknown>,
  newDocument: TextyDocument,
  variablesList: GetAllDocumentsVariable[],
) {
  for (const variables of variablesList) {
    cache.updateQuery<GetAllDocumentsQuery>(
      {
        query: GetAllDocumentsDocument,
        variables,
      },
      (data) => {
        if (data) {
          const alreadyExists =
            data.getAllDocuments.edges.filter((edge) => {
              return edge.node.document_id === newDocument.document_id;
            }) || [];

          if (alreadyExists.length > 0) {
            return data;
          }

          return {
            ...data,
            getAllDocuments: {
              ...data.getAllDocuments,
              edges: [
                {
                  __typename: 'DocumentEdge',
                  node: newDocument,
                  cursor: JSON.stringify({
                    file_name: newDocument.file_name,
                    document_id: newDocument.document_id,
                  }),
                },
                ...data.getAllDocuments.edges,
              ],
              pageInfo: {
                ...data.getAllDocuments.pageInfo,
                totalEdges: data.getAllDocuments.pageInfo.totalEdges
                  ? data.getAllDocuments.pageInfo.totalEdges + 1
                  : 1,
              },
            },
          };
        } else {
          return data;
        }
      },
    );
  }
}
