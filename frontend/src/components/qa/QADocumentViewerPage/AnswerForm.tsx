import { useState, useCallback, useEffect } from 'react';
import { Stack, Button } from '@mui/material';

import { Checkbox } from '../../common/buttons/Checkbox';
import { Radio } from '../../common/buttons/Radio';
import { Input } from '../../common/forms/Input';
import { UpvoteButton } from '../../common/buttons/vote/UpvoteButton';
import { DownvoteButton } from '../../common/buttons/vote/DownvoteButton';

import { useTr } from '../../../hooks/useTr';
import { useUpsertAnswerMutation } from '../../../hooks/useUpsertAnswerMutation';

import {
  QuestionItem,
  QuestionWithStatistic,
} from '../../../generated/graphql';
import { Typography } from '@mui/material';

export type AnswerFormProps = {
  question: QuestionWithStatistic;
  initialItems: QuestionItem[];
  onClose(): void;
};

export function AnswerForm({
  onClose,
  question,
  initialItems,
}: AnswerFormProps) {
  const { tr } = useTr();

  const [upsertAnswer] = useUpsertAnswerMutation();

  const [items, setItems] = useState<string[]>(
    initialItems.map((item) => item.item),
  );
  const [text, setText] = useState<string>('');
  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);

  useEffect(() => {
    if (text.trim() === '' && items.length === 0) {
      setShowSaveButton(false);
    } else {
      setShowSaveButton(true);
    }
  }, [items, text]);

  const handleSaveAnswer = async () => {
    const itemIds = items
      .map((item) => {
        const exists = question.question_items.find(
          (question_item) => question_item.item === item,
        );

        if (exists) {
          return exists.question_item_id;
        } else {
          return null;
        }
      })
      .filter((item) => item) as string[];

    await upsertAnswer({
      variables: {
        question_id: question.question_id,
        answer: text.trim(),
        question_item_ids: itemIds,
      },
    });

    onClose();
  };

  const handleChangeText = useCallback((text: string) => {
    setText(text);
    setItems([]);
  }, []);

  const handleChangeItems = useCallback((items: string[]) => {
    setItems(items);
    setText('');
  }, []);

  return (
    <Stack gap="20px">
      <Typography variant="h3">{tr('Add answer')}</Typography>
      <QuestionItemsForm
        question={question}
        text={text}
        items={items}
        onChangeItems={handleChangeItems}
        onChangeText={handleChangeText}
      />
      <Stack direction="row" gap="24px">
        <Button
          variant="contained"
          color="gray_stroke"
          fullWidth
          onClick={onClose}
        >
          {tr('Cancel')}
        </Button>
        {showSaveButton ? (
          <Button
            variant="contained"
            color="green"
            fullWidth
            onClick={handleSaveAnswer}
          >
            {tr('Save')}
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}

export type QuestionItemsFormProps = {
  question: QuestionWithStatistic;
  text: string;
  items: string[];
  onChangeItems(items: string[]): void;
  onChangeText(text: string): void;
};

export function QuestionItemsForm({
  question,
  items,
  text,
  onChangeItems,
  onChangeText,
}: QuestionItemsFormProps) {
  const { tr } = useTr();

  const handleChangeChooseOne = (answer: string) => {
    onChangeItems([answer]);
  };

  const handleChangeMultiselect = (answer: string) => {
    const exists = items.find((item) => item === answer);

    if (exists) {
      onChangeItems(items.filter((item) => item !== answer));
    } else {
      onChangeItems([...items, answer]);
    }
  };

  if (question.question_type_is_multiselect) {
    return (
      <Stack gap="16px">
        {question.question_items.map((item) => (
          <Button
            variant="text"
            startIcon={
              <Checkbox
                checked={items.includes(item.item)}
                sx={{ fontSize: 22, padding: 0 }}
                color={items.includes(item.item) ? 'blue' : 'gray_stroke'}
              />
            }
            color="gray"
            key={item.question_item_id}
            onClick={() => handleChangeMultiselect(item.item)}
            sx={{ justifyContent: 'flex-start', padding: 0 }}
            disableRipple
          >
            {item.item}
          </Button>
        ))}
      </Stack>
    );
  }

  if (question.question_items.length === 0) {
    return (
      <Input
        placeholder={tr('Please write your answer')}
        value={text}
        onChange={onChangeText}
        multiline
        rows={4}
      />
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
        <Stack
          gap="24px"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <UpvoteButton
            selected={items[0] === 'agree'}
            upvotes={tr('Agree')}
            onClick={() => handleChangeChooseOne('agree')}
          />
          <DownvoteButton
            selected={items[0] === 'disagree'}
            downvotes={tr('Disagree')}
            onClick={() => handleChangeChooseOne('disagree')}
          />
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
          <Button
            variant="text"
            startIcon={
              <Radio
                sx={{ fontSize: 22, padding: 0 }}
                color={items[0] === 'true' ? 'green' : 'gray_stroke'}
                checked={items[0] === 'true'}
              />
            }
            onClick={() => handleChangeChooseOne('true')}
            color="gray"
            sx={{ justifyContent: 'flex-start', padding: 0 }}
            disableRipple
          >
            {tr('True')}
          </Button>
          <Button
            variant="text"
            startIcon={
              <Radio
                sx={{ fontSize: 22, padding: 0 }}
                color={items[0] === 'false' ? 'red' : 'gray_stroke'}
                checked={items[0] === 'false'}
              />
            }
            color="gray"
            onClick={() => handleChangeChooseOne('false')}
            sx={{ justifyContent: 'flex-start', padding: 0 }}
            disableRipple
          >
            {tr('False')}
          </Button>
        </Stack>
      );
    }
  }

  return (
    <Stack gap="16px">
      {question.question_items.map((item) => (
        <Button
          variant="text"
          startIcon={
            <Radio
              sx={{ fontSize: 22, padding: 0 }}
              checked={items.includes(item.item)}
              color={items.includes(item.item) ? 'blue' : 'gray_stroke'}
            />
          }
          onClick={() => handleChangeChooseOne(item.item)}
          color="gray"
          key={item.question_item_id}
          sx={{ justifyContent: 'flex-start', padding: 0 }}
          disableRipple
        >
          {item.item}
        </Button>
      ))}
    </Stack>
  );
}
