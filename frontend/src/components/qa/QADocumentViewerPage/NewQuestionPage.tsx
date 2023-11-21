import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useHistory } from 'react-router';
import { useIonToast } from '@ionic/react';
import { Divider, Stack, Typography, Button, Box, styled } from '@mui/material';

import { AddCircle } from '../../common/icons/AddCircle';

import { Caption } from '../../common/Caption/Caption';
import { PageLayout } from '../../common/PageLayout';
import { Input } from '../../common/forms/Input';
import { Select, OptionItem } from '../../common/forms/Select';

import { useTr } from '../../../hooks/useTr';

import { useGetDocumentTextFromRangesLazyQuery } from '../../../generated/graphql';
import { useCreateQuestionOnWordRangeMutation } from '../../../hooks/useCreateQuestionOnWordRangeMutation';

export enum QuestionValue {
  TEXT,
  TRUE_OR_FALSE,
  AGREE_OR_DISAGREE,
  MULTISELECT,
  CHOOSEONE,
}

const Textarea = styled('textarea')({});

export function NewQuestionPage() {
  const history = useHistory();
  const { begin_document_word_entry_id, end_document_word_entry_id } =
    useParams<{
      begin_document_word_entry_id: string;
      end_document_word_entry_id: string;
    }>();
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
  const [getDocumentTextFromRange, { data: textFromRangeData }] =
    useGetDocumentTextFromRangesLazyQuery();

  const questionTypeOptions = useMemo(
    () => [
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
    ],
    [tr],
  );

  useEffect(() => {
    getDocumentTextFromRange({
      variables: {
        ranges: [
          {
            begin_document_word_entry_id: begin_document_word_entry_id,
            end_document_word_entry_id: end_document_word_entry_id,
          },
        ],
      },
    });
  }, [
    begin_document_word_entry_id,
    end_document_word_entry_id,
    getDocumentTextFromRange,
  ]);

  const saveQuestion = (
    question: string,
    items: string[],
    isMultiselect: boolean,
  ) => {
    createQuestionOnWordRange({
      variables: {
        begin_document_word_entry_id: begin_document_word_entry_id,
        end_document_word_entry_id: end_document_word_entry_id,
        question: question,
        question_items: items,
        question_type_is_multiselect: isMultiselect,
      },
    });

    history.goBack();
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

    if (questionItems.length === 0) {
      setInvalidMessage({
        invalidItems: [],
        message: tr('Please add question Items'),
      });

      return false;
    }

    const invalid: string[] = [];

    questionItems.forEach((item) => {
      if (item.value.trim() === '') {
        invalid.push(item.key);
      }
    });

    if (invalid.length > 0) {
      setInvalidMessage({
        invalidItems: invalid,
        message: tr('There are empty items'),
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

  const pieceOfText =
    textFromRangeData?.getDocumentTextFromRanges.list[0].piece_of_text || '';

  return (
    <PageLayout>
      <Caption>{tr('New Question')}</Caption>

      <Stack gap="20px">
        <Typography variant="h4">{pieceOfText}</Typography>

        <Divider />

        <Stack gap="10px">
          <Typography variant="overline" color="text.gray">
            {tr('Your Question')}
          </Typography>

          <Box
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '10px',
              border: `1px solid ${theme.palette.text.gray_stroke}`,
              gap: '12px',
            })}
          >
            <Textarea
              sx={(theme) => ({
                border: 'none',
                width: '100%',
                overflow: 'auto',
                outline: 'none',
                boxShadow: 'none',
                resize: 'none',
                color: theme.palette.text.dark,
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '22px',
                letterSpacing: '-0.28px',
              })}
              value={question}
              placeholder={tr('Ask a question')}
              rows={4}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </Box>
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
                onChange={(value) => handleChangeQuestionItem(item.key, value)}
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

        <Button
          variant="contained"
          color="gray_stroke"
          onClick={() => history.goBack()}
        >
          {tr('Cancel')}
        </Button>
      </Stack>
    </PageLayout>
  );
}
