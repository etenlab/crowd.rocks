import { ApolloCache } from '@apollo/client';

import { TextyDocument, GetAllDocumentsQuery } from '../generated/graphql';
import { GetAllDocumentsDocument } from '../generated/graphql';

export function updateCacheWithUploadDocument(
  cache: ApolloCache<unknown>,
  newDocument: TextyDocument,
  sourceLang: LanguageInfo | null,
) {
  cache.updateQuery<GetAllDocumentsQuery>(
    {
      query: GetAllDocumentsDocument,
      variables: {
        languageInput: sourceLang
          ? {
              language_code: sourceLang?.lang.tag,
              dialect_code: sourceLang?.dialect?.tag,
              geo_code: sourceLang?.region?.tag,
            }
          : undefined,
      },
    },
    (data) => {
      if (data) {
        const alreadyExists =
          data.getAllDocuments.documents?.filter((document) => {
            return document.document_id === newDocument.document_id;
          }) || [];

        if (alreadyExists.length > 0) {
          return data;
        }

        return {
          ...data,
          getAllDocuments: {
            ...data.getAllDocuments,
            documents: [...(data.getAllDocuments.documents || []), newDocument],
          },
        };
      } else {
        return data;
      }
    },
  );
}
