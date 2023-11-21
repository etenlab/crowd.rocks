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
  console.log(newAnswer);
  cache.updateQuery<GetAnswersByQuestionIdQuery>(
    {
      query: GetAnswersByQuestionIdDocument,
      variables: {
        id: newAnswer.question_id,
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
            answers: [
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
