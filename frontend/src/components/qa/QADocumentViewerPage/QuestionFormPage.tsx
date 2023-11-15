import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router';
import { useIonToast } from '@ionic/react';
import { Divider, Stack, Typography, Button } from '@mui/material';

import { AddCircle } from '../../common/icons/AddCircle';

import { PageLayout } from '../../common/PageLayout';
import { Input } from '../../common/forms/Input';
import { Select, OptionItem } from '../../common/forms/Select';

import { useTr } from '../../../hooks/useTr';

import { useCreateQuestionOnWordRangeMutation } from '../../../hooks/useCreateQuestionOnWordRangeMutation';
import { useAppContext } from '../../../hooks/useAppContext';

export enum QuestionValue {
  TEXT,
  TRUE_OR_FALSE,
  AGREE_OR_DISAGREE,
  MULTISELECT,
  CHOOSEONE,
}

export function QuestionFormPage() {
  const history = useHistory();
  const { nation_id, language_id, cluster_id, document_id } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
    document_id: string;
  }>();
  const [presentToast] = useIonToast();

  const { tr } = useTr();
  const {
    states: {
      nonPersistent: {
        pageData: { newQuestionForm },
      },
    },
  } = useAppContext();

  const [questionItems, setQuestionItems] = useState<
    { key: string; value: string }[]
  >([]);
  const [invalidMessage, setInvalidMessage] = useState<{
    invalidItems: string[];
    message: string;
  } | null>(null);

  const [questionType, setQuestionType] = useState<OptionItem | null>(null);
  const [question, setQuestion] = useState<string>('');
  const questionItemKeyRef = useRef(1);

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

  const goToDocumentsDetailPage = useCallback(() => {
    history.push(
      `/${nation_id}/${language_id}/${cluster_id}/qa/documents/${document_id}`,
    );
  }, [cluster_id, document_id, history, language_id, nation_id]);

  useEffect(() => {
    if (!newQuestionForm) {
      goToDocumentsDetailPage();
    }
  }, [goToDocumentsDetailPage, newQuestionForm]);

  const saveQuestion = (
    question: string,
    items: string[],
    isMultiselect: boolean,
  ) => {
    if (!newQuestionForm) {
      goToDocumentsDetailPage();
      return;
    }

    createQuestionOnWordRange({
      variables: {
        begin_document_word_entry_id: newQuestionForm.range.begin.entryId,
        end_document_word_entry_id: newQuestionForm.range.end.entryId,
        question: question,
        question_items: items,
        question_type_is_multiselect: isMultiselect,
      },
    });

    goToDocumentsDetailPage();
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
        ..._items.filter((item) => item.key !== key),
        {
          key,
          value,
        },
      ];
    });
  };

  const addMoreQuestionItemCom =
    questionType && questionType.value === '' ? (
      <Button
        variant="text"
        startIcon={<AddCircle sx={{ fontSize: 20 }} />}
        color="orange"
        onClick={handleAddQuestionItem}
      >
        {tr('Add More')}
      </Button>
    ) : null;

  return (
    <PageLayout>
      <Stack gap="32px">
        <Typography variant="h2">{tr('New Question')}</Typography>

        <Stack gap="24px">
          <Stack gap="20px">
            <Typography variant="h4">
              {`"${newQuestionForm ? newQuestionForm.sentence : ''}"`}
            </Typography>

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

          <Button
            variant="contained"
            color="gray_stroke"
            onClick={goToDocumentsDetailPage}
          >
            {tr('Cancel')}
          </Button>
        </Stack>
      </Stack>
    </PageLayout>
  );
}
