import { Stack, Typography, Button } from '@mui/material';

import { Checkbox } from '../../common/buttons/Checkbox';
import { ThumbsUp } from '../../common/icons/ThumbsUp';
import { ThumbsDown } from '../../common/icons/ThumbsDown';

import { Item } from '../styled';

import { Answer, QuestionWithStatistic } from '../../../generated/graphql';
import { PostAuthor } from '../../common/PostAuthor';
import { useTr } from '../../../hooks/useTr';
import { FilledCheckCircle } from '../../common/icons/FilledCheckCircle';

type AnswerItemProps = {
  question: QuestionWithStatistic;
  answer: Answer;
};

export function AnswerItem({ question, answer }: AnswerItemProps) {
  const { tr } = useTr();

  if (question.question_type_is_multiselect) {
    return (
      <Stack gap="10px">
        <PostAuthor
          username={answer.created_by_user.avatar}
          date={new Date(answer.created_at)}
          avatar={answer.created_by_user.avatar_url || ''}
        />
        <Item sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {answer.question_items.map((item) => (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              gap="10px"
              key={item.question_item_id}
            >
              <Checkbox checked color="blue" />
              <Typography>{item.item}</Typography>
            </Stack>
          ))}
        </Item>
      </Stack>
    );
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

          {answer.question_items.map((item) =>
            item.item === 'agree' ? (
              <Button
                key={item.question_item_id}
                variant="outlined"
                startIcon={
                  <ThumbsUp sx={{ fontSize: 22, padding: 0 }} color="green" />
                }
                color="gray_stroke"
                sx={{
                  justifyContent: 'flex-start',
                  padding: '16px',
                  color: (theme) => theme.palette.text.dark,
                  borderColor: (theme) => theme.palette.text.gray_stroke,
                }}
              >
                {tr('Agree')}
              </Button>
            ) : (
              <Button
                key={item.question_item_id}
                variant="outlined"
                startIcon={
                  <ThumbsDown sx={{ fontSize: 22, padding: 0 }} color="red" />
                }
                color="gray_stroke"
                sx={{
                  justifyContent: 'flex-start',
                  padding: '16px',
                  color: (theme) => theme.palette.text.dark,
                  borderColor: (theme) => theme.palette.text.gray_stroke,
                }}
              >
                {tr('Disagree')}
              </Button>
            ),
          )}
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
              <Stack
                key={item.question_item_id}
                direction="row"
                alignContent="center"
                gap="10px"
              >
                {item.item === 'true' ? (
                  <FilledCheckCircle sx={{ fontSize: 22 }} color="green" />
                ) : (
                  <FilledCheckCircle sx={{ fontSize: 22 }} color="red" />
                )}
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 500, textTransform: 'capitalize' }}
                >
                  {item.item}
                </Typography>
              </Stack>
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
      <Stack gap="16px">
        {answer.question_items.map((item) => (
          <Item
            key={item.question_item_id}
            sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <FilledCheckCircle sx={{ fontSize: 22 }} color="blue" />
            <Typography>{item.item}</Typography>
          </Item>
        ))}
      </Stack>
    </Stack>
  );
}
