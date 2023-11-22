import { Stack, Typography } from '@mui/material';

import { QuestionWithStatistic } from '../../../generated/graphql';

import { Item } from '../styled';
import { Checkbox } from '../../common/buttons/Checkbox';
import { ThumbsUp } from '../../common/icons/ThumbsUp';
import { ThumbsDown } from '../../common/icons/ThumbsDown';
import { FilledCheckCircle } from '../../common/icons/FilledCheckCircle';

export type StatisticsProps = {
  question: QuestionWithStatistic;
};

export function Statistics({ question }: StatisticsProps) {
  if (question.question_type_is_multiselect) {
    return (
      <Stack gap="16px">
        {question.question_items.map((item) => (
          <Item
            key={item.question_item_id}
            sx={{
              display: 'flex',
              flexDireciton: 'row',
              gap: '10px',
              alignItem: 'center',
            }}
          >
            <Checkbox checked color="blue" />
            <Typography variant="h5">{item.item}</Typography>
            <Typography
              variant="h5"
              color="text.gray"
              sx={{ marginLeft: '-7px' }}
            >{`(${item.statistic})`}</Typography>
          </Item>
        ))}
      </Stack>
    );
  }

  if (question.question_items.length === 0) {
    return null;
  }

  if (question.question_items.length === 2) {
    if (
      (question.question_items[0].item === 'agree' &&
        question.question_items[1].item === 'disagree') ||
      (question.question_items[0].item === 'disagree' &&
        question.question_items[1].item === 'agree')
    ) {
      return (
        <Stack gap="16px">
          {question.question_items.map((item) => (
            <Item
              key={item.question_item_id}
              sx={{
                display: 'flex',
                flexDireciton: 'row',
                gap: '10px',
                alignItem: 'center',
              }}
            >
              {item.item === 'agree' ? (
                <ThumbsUp sx={{ fontSize: 22 }} color="green" />
              ) : (
                <ThumbsDown sx={{ fontSize: 22 }} color="red" />
              )}
              <Typography variant="h5">{item.item}</Typography>
              <Typography
                variant="h5"
                color="text.gray"
                sx={{ marginLeft: '-7px' }}
              >{`(${item.statistic})`}</Typography>
            </Item>
          ))}
        </Stack>
      );
    } else if (
      (question.question_items[0].item === 'true' &&
        question.question_items[1].item === 'false') ||
      (question.question_items[0].item === 'false' &&
        question.question_items[1].item === 'true')
    ) {
      return (
        <Stack gap="16px">
          {question.question_items.map((item) => (
            <Item
              key={item.question_item_id}
              sx={{
                display: 'flex',
                flexDireciton: 'row',
                gap: '10px',
                alignItem: 'center',
              }}
            >
              {item.item === 'true' ? (
                <FilledCheckCircle sx={{ fontSize: 22 }} color="green" />
              ) : (
                <FilledCheckCircle sx={{ fontSize: 22 }} color="red" />
              )}
              <Typography variant="h5">{item.item}</Typography>
              <Typography
                variant="h5"
                color="text.gray"
                sx={{ marginLeft: '-7px' }}
              >{`(${item.statistic})`}</Typography>
            </Item>
          ))}
        </Stack>
      );
    }
  }

  return (
    <Stack gap="16px">
      {question.question_items.map((item) => (
        <Item
          key={item.question_item_id}
          sx={{
            display: 'flex',
            flexDireciton: 'row',
            gap: '10px',
            alignItem: 'center',
          }}
        >
          <FilledCheckCircle sx={{ fontSize: 22 }} color="blue" />
          <Typography variant="h5">{item.item}</Typography>
          <Typography
            variant="h5"
            color="text.gray"
            sx={{ marginLeft: '-7px' }}
          >{`(${item.statistic})`}</Typography>
        </Item>
      ))}
    </Stack>
  );
}
