import { ApolloCache } from '@apollo/client';

import {
  Answer,
  GetAnswerByUserIdQuery,
  GetAnswerByUserIdDocument,
  GetAnswersByQuestionIdDocument,
  GetAnswersByQuestionIdQuery,
  GetQuestionStatisticDocument,
  GetQuestionStatisticQuery,
} from '../generated/graphql';

export function updateCacheWithUpsertAnswer(
  cache: ApolloCache<unknown>,
  newAnswer: Answer,
) {
  cache.updateQuery<GetAnswerByUserIdQuery>(
    {
      query: GetAnswerByUserIdDocument,
      variables: {
        user_id: newAnswer.created_by_user.user_id,
        question_id: newAnswer.question_id,
      },
    },
    (data) => {
      if (data) {
        return {
          ...data,
          getAnswerByUserId: {
            ...data.getAnswerByUserId,
            answers: [newAnswer],
          },
        };
      } else {
        return data;
      }
    },
  );
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

  const answers = cache.readQuery<GetAnswersByQuestionIdQuery>({
    query: GetAnswersByQuestionIdDocument,
    variables: {
      id: newAnswer.question_id,
    },
  });

  if (!answers || answers.getAnswersByQuestionIds.answers.length === 0) {
    return;
  }

  const statisticData = cache.readQuery<GetQuestionStatisticQuery>({
    query: GetQuestionStatisticDocument,
    variables: {
      question_id: newAnswer.question_id,
    },
  });

  if (
    !statisticData ||
    !statisticData.getQuestionStatistic.question_with_statistic
  ) {
    return;
  }

  const answersMap = new Map<string, Answer[]>();

  answers.getAnswersByQuestionIds.answers.map((answer) => {
    if (!answer) {
      return;
    }
    const questionItems = answer.question_items;

    questionItems.map((item) => {
      const arr = answersMap.get(item.question_item_id);

      if (arr) {
        const exists = arr.find((t) => t.answer_id === answer.answer_id);

        if (exists) {
          return;
        }

        arr.push(answer);
      } else {
        answersMap.set(item.question_item_id, [answer]);
      }
    });
  });

  cache.updateQuery<GetQuestionStatisticQuery>(
    {
      query: GetQuestionStatisticDocument,
      variables: {
        question_id: newAnswer.question_id,
      },
    },
    (data) => {
      if (data) {
        const questionItems =
          data.getQuestionStatistic.question_with_statistic.question_items.map(
            (questionItem) => ({
              ...questionItem,
              statistic: (answersMap.get(questionItem.question_item_id) || [])
                .length,
            }),
          );
        return {
          ...data,
          getQuestionStatistic: {
            ...data.getQuestionStatistic,
            question_with_statistic: {
              ...data.getQuestionStatistic.question_with_statistic,
              question_items: questionItems,
            },
          },
        };
      } else {
        return data;
      }
    },
  );
}
