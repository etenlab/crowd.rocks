import { Stack, Typography } from '@mui/material';

import { Checkbox } from '../../common/buttons/Checkbox';
import { Radio } from '../../common/buttons/Radio';
import { ThumbsUp } from '../../common/icons/ThumbsUp';
import { ThumbsDown } from '../../common/icons/ThumbsDown';
import { CheckCircle } from '../../common/icons/CheckCircle';

import { Item } from '../styled';

import { Answer, QuestionWithStatistic } from '../../../generated/graphql';
import { PostAuthor } from '../../common/PostAuthor';

type AnswerItemProps = {
  question: QuestionWithStatistic;
  answer: Answer;
};

export function AnswerItem({ question, answer }: AnswerItemProps) {
  if (question.question_type_is_multiselect) {
    <Stack gap="10px">
      <PostAuthor
        username={answer.created_by_user.avatar}
        date={new Date(answer.created_at)}
        avatar={answer.created_by_user.avatar_url || ''}
      />
      <Item sx={{ display: 'flex', direction: 'column', gap: '16px' }}>
        {answer.question_items.map((item) => (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            key={item.question_item_id}
          >
            <Checkbox checked color="blue" />
            <Typography>{item.item}</Typography>
          </Stack>
        ))}
      </Item>
    </Stack>;
  }

  if (question.question_items.length === 0) {
    return (
      <Stack gap="10px">
        <PostAuthor
          username={answer.created_by_user.avatar}
          date={new Date(answer.created_at)}
          avatar={answer.created_by_user.avatar_url || ''}
        />
        <Item>
          <Typography>{answer.answer || ''}</Typography>
        </Item>
      </Stack>
    );
  }

  if (question.question_items.length === 2) {
    if (
      (question.question_items[0].item === 'agree' &&
        question.question_items[1].item === 'disagree') ||
      (question.question_items[0].item === 'disagree' &&
        question.question_items[1].item === 'agree')
    ) {
      return (
        <Stack gap="10px">
          <PostAuthor
            username={answer.created_by_user.avatar}
            date={new Date(answer.created_at)}
            avatar={answer.created_by_user.avatar_url || ''}
          />
          <Item sx={{ display: 'flex', direction: 'column', gap: '16px' }}>
            {answer.question_items.map((item) => (
              <Item key={item.question_item_id}>
                {item.item === 'agree' ? (
                  <ThumbsUp sx={{ fontSize: 22 }} color="green" />
                ) : (
                  <ThumbsDown sx={{ fontSize: 22 }} color="red" />
                )}
                <Typography>{item.item}</Typography>
              </Item>
            ))}
          </Item>
        </Stack>
      );
    } else if (
      (question.question_items[0].item === 'true' &&
        question.question_items[1].item === 'false') ||
      (question.question_items[0].item === 'false' &&
        question.question_items[1].item === 'true')
    ) {
      return (
        <Stack gap="10px">
          <PostAuthor
            username={answer.created_by_user.avatar}
            date={new Date(answer.created_at)}
            avatar={answer.created_by_user.avatar_url || ''}
          />
          <Item sx={{ display: 'flex', direction: 'column', gap: '16px' }}>
            {answer.question_items.map((item) => (
              <Item key={item.question_item_id}>
                {item.item === 'true' ? (
                  <CheckCircle sx={{ fontSize: 22 }} color="green" />
                ) : (
                  <CheckCircle sx={{ fontSize: 22 }} color="red" />
                )}
                <Typography>{item.item}</Typography>
              </Item>
            ))}
          </Item>
        </Stack>
      );
    }
  }

  return (
    <Stack gap="10px">
      <PostAuthor
        username={answer.created_by_user.avatar}
        date={new Date(answer.created_at)}
        avatar={answer.created_by_user.avatar_url || ''}
      />
      <Item sx={{ display: 'flex', direction: 'column', gap: '16px' }}>
        {answer.question_items.map((item) => (
          <Item key={item.question_item_id}>
            <Radio checked color="blue" />
            <Typography>{item.item}</Typography>
          </Item>
        ))}
      </Item>
    </Stack>
  );
}
