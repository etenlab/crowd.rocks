import { useState, useCallback, useEffect } from 'react';
import { Stack, Button } from '@mui/material';

import { Checkbox } from '../../common/buttons/Checkbox';
import { Radio } from '../../common/buttons/Radio';
import { ThumbsUp } from '../../common/icons/ThumbsUp';
import { ThumbsDown } from '../../common/icons/ThumbsDown';
import { CheckCircle } from '../../common/icons/CheckCircle';
import { Input } from '../../common/forms/Input';

import { useTr } from '../../../hooks/useTr';
import { useUpsertAnswerMutation } from '../../../hooks/useUpsertAnswerMutation';

import { QuestionWithStatistic } from '../../../generated/graphql';
import { Typography } from '@mui/material';

export type AnswerFormProps = {
  question: QuestionWithStatistic;
  onClose(): void;
};

export function AnswerForm({ onClose, question }: AnswerFormProps) {
  const { tr } = useTr();

  const [upsertAnswer] = useUpsertAnswerMutation();

  const [items, setItems] = useState<string[]>([]);
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
      <Typography>{tr('Add answer')}</Typography>
      <QuestionItemsForm
        question={question}
        text={text}
        items={items}
        onChangeItems={handleChangeItems}
        onChangeText={handleChangeText}
      />
      <Stack direction="row" gap="24px">
        <Button variant="contained" color="gray">
          {tr('Cancel')}
        </Button>
        {showSaveButton ? (
          <Button variant="contained" color="green" onClick={handleSaveAnswer}>
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
              <Checkbox checked={items.includes(item.item)} color="blue" />
            }
            color="gray"
            key={item.question_item_id}
            onClick={() => handleChangeMultiselect(item.item)}
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
          <Button
            variant={items[0] === 'agree' ? 'contained' : 'outlined'}
            startIcon={<ThumbsUp sx={{ fontSize: 22 }} color="green" />}
            color="gray"
            onClick={() => handleChangeChooseOne('agree')}
          >
            {tr('Agree')}
          </Button>
          <Button
            variant={items[1] === 'disagree' ? 'contained' : 'outlined'}
            startIcon={<ThumbsDown sx={{ fontSize: 22 }} color="red" />}
            color="gray"
            onClick={() => handleChangeChooseOne('agree')}
          >
            {tr('Disagree')}
          </Button>
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
            startIcon={<CheckCircle sx={{ fontSize: 22 }} color="green" />}
            onClick={() => handleChangeChooseOne('true')}
            color="gray"
          >
            {tr('True')}
          </Button>
          <Button
            variant="text"
            startIcon={<CheckCircle sx={{ fontSize: 22 }} color="red" />}
            color="gray"
            onClick={() => handleChangeChooseOne('false')}
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
              checked={items.includes(item.item)}
              color="blue"
              onClick={() => handleChangeChooseOne(item.item)}
            />
          }
          color="gray"
          key={item.question_item_id}
        >
          {item.item}
        </Button>
      ))}
    </Stack>
  );
}
