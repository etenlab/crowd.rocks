import { ApolloCache } from '@apollo/client';

import {
  GetQuestionOnWordRangesByDocumentIdQuery,
  QuestionOnWordRange,
} from '../generated/graphql';
import { GetQuestionOnWordRangesByDocumentIdDocument } from '../generated/graphql';

export function updateCacheWithCreateQuestionOnWordRange(
  cache: ApolloCache<unknown>,
  newQuestion: QuestionOnWordRange,
) {
  cache.updateQuery<GetQuestionOnWordRangesByDocumentIdQuery>(
    {
      query: GetQuestionOnWordRangesByDocumentIdDocument,
      variables: {
        document_id: newQuestion.begin.document_id,
      },
    },
    (data) => {
      if (data) {
        const alreadyExists =
          data.getQuestionOnWordRangesByDocumentId.questions?.filter(
            (question) => {
              if (question) {
                return question.question_id === newQuestion.question_id;
              }

              return false;
            },
          ) || [];

        if (alreadyExists.length > 0) {
          return data;
        }

        return {
          ...data,
          getQuestionOnWordRangesByDocumentId: {
            ...data.getQuestionOnWordRangesByDocumentId,
            questions: [
              ...(data.getQuestionOnWordRangesByDocumentId.questions || []),
              newQuestion,
            ],
          },
        };
      } else {
        return data;
      }
    },
  );
}
