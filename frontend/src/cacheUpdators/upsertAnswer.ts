import { ApolloCache } from '@apollo/client';

import {
  Answer,
  GetAnswersByQuestionIdDocument,
  GetAnswersByQuestionIdQuery,
} from '../generated/graphql';

export function updateCacheWithUpsertAnswer(
  cache: ApolloCache<unknown>,
  newAnswer: Answer,
) {
  cache.updateQuery<GetAnswersByQuestionIdQuery>(
    {
      query: GetAnswersByQuestionIdDocument,
      variables: {
        question_id: newAnswer.question_id,
        answer: newAnswer.answer,
        question_item_ids: newAnswer.question_items.map(
          (item) => item.question_item_id,
        ),
      },
    },
    (data) => {
      if (data) {
        const alreadyExists =
          data.getAnswersByQuestionIds.answers?.filter((answer) => {
            if (answer) {
              return answer.answer_id === newAnswer.answer_id;
            }

            return false;
          }) || [];

        if (alreadyExists.length > 0) {
          return data;
        }

        return {
          ...data,
          getAnswersByQuestionIds: {
            ...data.getAnswersByQuestionIds,
            documents: [
              ...(data.getAnswersByQuestionIds.answers || []),
              newAnswer,
            ],
          },
        };
      } else {
        return data;
      }
    },
  );
}
