import { useState, useRef } from 'react';
import { useIonToast } from '@ionic/react';
import { Divider, Stack, Typography, Button } from '@mui/material';

import { AddCircle } from '../../common/icons/AddCircle';

import { Input } from '../../common/forms/Input';
import { Select, OptionItem } from '../../common/forms/Select';

import { useTr } from '../../../hooks/useTr';

import { useCreateQuestionOnWordRangeMutation } from '../../../hooks/useCreateQuestionOnWordRangeMutation';

import { RangeItem } from '../QADocumentViewer/QADocumentViewer';

export enum QuestionValue {
  TEXT,
  TRUE_OR_FALSE,
  AGREE_OR_DISAGREE,
  MULTISELECT,
  CHOOSEONE,
}

export type QuestionFormProps = {
  sentence: string;
  range: {
    begin: RangeItem;
    end: RangeItem;
  };
  onClose(): void;
};

export function QuestionForm({ sentence, range, onClose }: QuestionFormProps) {
  const [presentToast] = useIonToast();

  const { tr } = useTr();

  const [questionItems, setQuestionItems] = useState<
    { key: string; value: string }[]
  >([]);
  const [invalidMessage, setInvalidMessage] = useState<{
    invalidItems: string[];
    message: string;
  } | null>(null);

  const [questionType, setQuestionType] = useState<OptionItem | null>(null);
  const [question, setQuestion] = useState<string>('');
  const questionItemKeyRef = useRef<number>(1);

  const [createQuestionOnWordRange] = useCreateQuestionOnWordRangeMutation();

  const questionTypeOptions = [
    {
      label: tr('Text'),
      value: QuestionValue.TEXT,
    },
    {
      label: tr('True / False'),
      value: QuestionValue.TRUE_OR_FALSE,
    },
    {
      label: tr('Agree / Disagree'),
      value: QuestionValue.AGREE_OR_DISAGREE,
    },
    {
      label: tr('Multiselect'),
      value: QuestionValue.MULTISELECT,
    },
    {
      label: tr('Choose One'),
      value: QuestionValue.CHOOSEONE,
    },
  ];

  const saveQuestion = (
    question: string,
    items: string[],
    isMultiselect: boolean,
  ) => {
    createQuestionOnWordRange({
      variables: {
        begin_document_word_entry_id: range.begin.entryId,
        end_document_word_entry_id: range.end.entryId,
        question: question,
        question_items: items,
        question_type_is_multiselect: isMultiselect,
      },
    });

    onClose();
  };

  const checkQuestionItemsValidation = () => {
    const itemMap = new Map<string, string>();

    const duplicated: string[] = [];

    questionItems.forEach((item) => {
      const key = itemMap.get(item.value);
      if (key) {
        duplicated.push(...[item.key, key]);
      } else {
        itemMap.set(item.value, item.key);
      }
    });

    if (duplicated.length) {
      setInvalidMessage({
        invalidItems: duplicated,
        message: tr('Exists duplicated question items'),
      });

      return false;
    }

    return true;
  };

  const handleSaveQuestion = () => {
    if (!questionType) {
      presentToast({
        message: `${tr('Please select question type!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    if (question.trim() === '') {
      presentToast({
        message: `${tr('Please ask question!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }

    if (questionType.value === QuestionValue.TRUE_OR_FALSE) {
      saveQuestion(question, ['true', 'false'], false);
      return;
    } else if (questionType.value === QuestionValue.AGREE_OR_DISAGREE) {
      saveQuestion(question, ['agree', 'disagree'], false);
      return;
    } else if (questionType.value === QuestionValue.TEXT) {
      saveQuestion(question, [], false);
      return;
    }

    if (questionItems.length === 0) {
      presentToast({
        message: `${tr('Please add question items!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }

    if (!checkQuestionItemsValidation()) {
      return;
    }

    if (questionType.value === QuestionValue.MULTISELECT) {
      saveQuestion(
        question,
        questionItems.map((item) => item.value),
        true,
      );
    } else if (questionType.value === QuestionValue.CHOOSEONE) {
      saveQuestion(
        question,
        questionItems.map((item) => item.value),
        false,
      );
    }
  };

  const handleAddQuestionItem = () => {
    setQuestionItems((_items) => {
      return [
        ..._items,
        {
          key: questionItemKeyRef.current + '',
          value: '',
        },
      ];
    });

    questionItemKeyRef.current++;
  };

  const handleClearQuestionItem = (key: string) => {
    setQuestionItems((_items) => _items.filter((item) => item.key !== key));
  };

  const handleChangeQuestionItem = (key: string, value: string) => {
    setQuestionItems((_items) => {
      return [
        ..._items.map((item) => {
          if (item.key !== key) {
            return item;
          }
          return {
            key,
            value,
          };
        }),
      ];
    });
  };

  const addMoreQuestionItemCom =
    (questionType && questionType.value === QuestionValue.CHOOSEONE) ||
    (questionType && questionType.value === QuestionValue.MULTISELECT) ? (
      <Button
        variant="text"
        startIcon={<AddCircle sx={{ fontSize: 20 }} />}
        color="orange"
        onClick={handleAddQuestionItem}
        sx={{ justifyContent: 'flex-start', padding: 0 }}
      >
        {tr('Add More')}
      </Button>
    ) : null;

  return (
    <Stack gap="32px">
      <Typography variant="h2">{tr('New Question')}</Typography>

      <Stack gap="24px">
        <Stack gap="20px">
          <Typography variant="h4">{sentence}</Typography>

          <Divider />

          <Stack gap="10px">
            <Typography variant="overline" color="text.gray">
              {tr('Your Question')}
            </Typography>
            <Input
              placeholder={tr('Ask a question')}
              value={question}
              onChange={setQuestion}
              multiline
              rows={4}
            />
          </Stack>
        </Stack>

        <Stack gap="20px">
          <Select
            label={tr('Question Type')}
            placeholder={tr('Select question type')}
            options={questionTypeOptions}
            value={questionType}
            onChange={setQuestionType}
            onClear={() => {}}
          />

          {questionItems.length > 0 ? (
            <Stack gap="16px">
              {questionItems.map((item) => (
                <Input
                  key={item.key}
                  placeholder={`${tr('Answer')} ${item.key}`}
                  value={item.value}
                  onChange={(value) =>
                    handleChangeQuestionItem(item.key, value)
                  }
                  onClear={() => handleClearQuestionItem(item.key)}
                  error={
                    (
                      invalidMessage?.invalidItems.filter(
                        (key) => key === item.key,
                      ) || []
                    ).length > 0
                  }
                />
              ))}

              {invalidMessage ? (
                <Typography variant="overline" color="text.red">
                  {invalidMessage.message}
                </Typography>
              ) : null}
            </Stack>
          ) : null}

          {addMoreQuestionItemCom}
        </Stack>
      </Stack>

      <Stack gap="16px">
        <Button
          variant="contained"
          color="blue"
          startIcon={<AddCircle sx={{ fontSize: 24 }} />}
          fullWidth
          onClick={handleSaveQuestion}
        >
          {tr('Save')}
        </Button>

        <Button variant="contained" color="gray_stroke" onClick={onClose}>
          {tr('Cancel')}
        </Button>
      </Stack>
    </Stack>
  );
}
