import { ApolloCache } from '@apollo/client';

import {
  GetQuestionOnWordRangesByDocumentIdQuery,
  GetQuestionOnWordRangesByDocumentIdDocument,
  QuestionOnWordRange,
  QuestionOnWordRangesEdge,
  QuestionOnWordRangesEdgeFragmentFragmentDoc,
  DocumentWordEntry,
  DocumentWordEntryFragmentFragmentDoc,
} from '../generated/graphql';

export function updateCacheWithCreateQuestionOnWordRange(
  cache: ApolloCache<unknown>,
  newQuestion: QuestionOnWordRange,
) {
  const start_word = newQuestion.begin.document_word_entry_id;

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

  const questionsData =
    cache.readQuery<GetQuestionOnWordRangesByDocumentIdQuery>({
      query: GetQuestionOnWordRangesByDocumentIdDocument,
      variables: {
        document_id: documentId + '',
      },
    });

  if (!questionsData) {
    return;
  }

  const exists = questionsData.getQuestionOnWordRangesByDocumentId.edges.filter(
    (edge) => edge.cursor === JSON.stringify({ document_id: documentId, page }),
  );

  if (exists.length > 0) {
    cache.updateFragment<QuestionOnWordRangesEdge>(
      {
        id: cache.identify({
          __typename: 'QuestionOnWordRangesEdge',
          cursor: JSON.stringify({ document_id: documentId, page }),
        }),
        fragment: QuestionOnWordRangesEdgeFragmentFragmentDoc,
        fragmentName: 'QuestionOnWordRangesEdgeFragment',
      },
      (data) => {
        if (data) {
          return {
            ...data,
            node: [
              ...data.node,
              {
                ...newQuestion,
              },
            ],
          };
        } else {
          return {
            __typename: 'QuestionOnWordRangesEdge',
            cursor: JSON.stringify({ document_id: documentId, page }),
            node: [
              {
                ...newQuestion,
              },
            ],
          };
        }
      },
    );

    return;
  }

  cache.writeQuery<GetQuestionOnWordRangesByDocumentIdQuery>({
    query: GetQuestionOnWordRangesByDocumentIdDocument,
    variables: {
      document_id: documentId + '',
    },
    data: {
      getQuestionOnWordRangesByDocumentId: {
        ...questionsData.getQuestionOnWordRangesByDocumentId,
        edges: [
          ...questionsData.getQuestionOnWordRangesByDocumentId.edges,
          {
            __typename: 'QuestionOnWordRangesEdge',
            cursor: JSON.stringify({ document_id: documentId, page }),
            node: [
              {
                ...newQuestion,
              },
            ],
          },
        ],
      },
    },
  });
}
