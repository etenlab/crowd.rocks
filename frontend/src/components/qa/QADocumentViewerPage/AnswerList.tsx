import { useMemo } from 'react';
import { Stack } from '@mui/material';

import {
  ErrorType,
  Answer,
  useGetAnswersByQuestionIdQuery,
  QuestionWithStatistic,
} from '../../../generated/graphql';

import { AnswerItem } from './AnswerItem';

type AnswerListProps = {
  question: QuestionWithStatistic;
};

export function AnswerList({ question }: AnswerListProps) {
  const { data, error } = useGetAnswersByQuestionIdQuery({
    variables: {
      id: question.question_id,
    },
  });

  const answers = useMemo(() => {
    if (
      error ||
      !data ||
      data.getAnswersByQuestionIds.error !== ErrorType.NoError
    ) {
      return [];
    }

    return data.getAnswersByQuestionIds.answers.filter(
      (answer) => answer,
    ) as Answer[];
  }, [data, error]);

  return (
    <Stack gap="24px">
      {answers.map((answer) => (
        <AnswerItem
          key={answer.answer_id}
          answer={answer}
          question={question}
        />
      ))}
    </Stack>
  );
}
