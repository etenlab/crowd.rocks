import { Stack, Typography } from '@mui/material';

import { Checkbox } from '../../common/buttons/Checkbox';
import { UpvoteButton } from '../../common/buttons/vote/UpvoteButton';
import { DownvoteButton } from '../../common/buttons/vote/DownvoteButton';

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
          <Item sx={{ display: 'flex', gap: '16px' }}>
            {answer.question_items.map((item) =>
              item.item === 'agree' ? (
                <UpvoteButton
                  key={item.question_item_id}
                  selected
                  upvotes={tr('Agree')}
                  onClick={() => {}}
                />
              ) : (
                <DownvoteButton
                  key={item.question_item_id}
                  selected
                  downvotes={tr('Disagree')}
                  onClick={() => {}}
                />
              ),
            )}
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
