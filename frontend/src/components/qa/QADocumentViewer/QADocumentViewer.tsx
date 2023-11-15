import { useMemo, useState, useCallback, ReactNode, MouseEvent } from 'react';
import { useParams, useHistory } from 'react-router';
import { useIonToast } from '@ionic/react';
import { Popover } from '@mui/material';

import { ViewMode } from '../../documents/DocumentViewer/DocumentViewer';
import { Dot } from '../../documents/DocumentViewer/styled';
import { DocumentViewer } from '../../documents/DocumentViewer';

import {
  useGetQuestionOnWordRangesByDocumentIdQuery,
  QuestionOnWordRange,
  ErrorType,
} from '../../../generated/graphql';
// import { useUpsertAnswerMutation } from '../../../hooks/useUpsertAnswerMutation';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

// import { AnswerList } from './AnswerList';
import { PieceOfTextModal } from './PieceOfTextModal';
import { QuestionAddButton } from './QuestionAddButton';

export type RangeItem = {
  entryId: string;
  order: number;
  element: HTMLElement | null;
};

type QADocumentViewerProps = {
  documentId: string;
  mode: ViewMode;
};

export function QADocumentViewer({ documentId, mode }: QADocumentViewerProps) {
  const history = useHistory();
  const { nation_id, language_id, cluster_id, document_id } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
    document_id: string;
  }>();

  const { tr } = useTr();
  const {
    actions: { createModal, setNewQuestionFormPageData },
  } = useAppContext();
  const [presetToast] = useIonToast();

  const { data, error } = useGetQuestionOnWordRangesByDocumentIdQuery({
    variables: {
      document_id: documentId,
    },
  });
  // const [upsertAnswer] = useUpsertAnswerMutation();

  const [range, setRange] = useState<{
    begin?: RangeItem;
    end?: RangeItem;
  }>({});
  // const [selectedQuestion, setSelectedQuestion] =
  //   useState<QuestionOnWordRange | null>(null);
  const [sentence, setSentence] = useState<string>('');

  const { openModal, closeModal } = createModal();

  const { dots, questionsMap } = useMemo(() => {
    const questionsMap = new Map<string, QuestionOnWordRange[]>();

    if (
      error ||
      !data ||
      data.getQuestionOnWordRangesByDocumentId.error !== ErrorType.NoError
    ) {
      if (
        data &&
        data.getQuestionOnWordRangesByDocumentId.error !== ErrorType.NoError
      ) {
        presetToast({
          message: `${tr('Failed at fetching questions!')} [${
            data.getQuestionOnWordRangesByDocumentId.error
          }]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
      return {
        dots: [],
        questionsMap,
      };
    }

    data.getQuestionOnWordRangesByDocumentId.questions.forEach((question) => {
      if (!question) {
        return;
      }

      const key = question.begin.document_word_entry_id;

      const arr = questionsMap.get(key);

      if (arr) {
        arr.push(question);
      } else {
        questionsMap.set(key, [question]);
      }
    });

    const dots: {
      entryId: string;
      component?: ReactNode;
    }[] = [];

    for (const key of questionsMap.keys()) {
      const arr = questionsMap.get(key) || [];

      if (arr.length > 0) {
        dots.push({
          entryId: key,
          component: (
            <Dot
              sx={{ backgroundColor: (theme) => theme.palette.background.red }}
            />
          ),
        });
      }
    }

    return { dots, questionsMap };
  }, [data, error, presetToast, tr]);

  const handleSelectQuestion = useCallback((question: QuestionOnWordRange) => {
    setRange({
      begin: {
        entryId: question.begin.document_word_entry_id,
        order: 0,
        element: null,
      },
      end: {
        entryId: question.end.document_word_entry_id,
        order: 0,
        element: null,
      },
    });
    // setSelectedQuestion(question);
  }, []);

  const handleSelectRange = useCallback(
    (entryId: string, index: number, e: MouseEvent<HTMLElement>) => {
      setRange((prev) => {
        if (prev.begin?.entryId && prev.end?.entryId) {
          // ...A... ... ...B...
          if (prev.begin.entryId === entryId) {
            // ...A(X)... ... ...B...
            return {};
          } else if (prev.end.entryId === entryId) {
            // ...A... ... ...B(X)...
            return { ...prev, end: undefined };
          } else {
            if (prev.begin.order <= index) {
              return {
                ...prev,
                end: { entryId, order: index, element: e.currentTarget },
              };
            }
            // ...X... ... A... ... ...B...
          }
        } else if (prev.begin?.entryId && !prev.end?.entryId) {
          // ...A... ... ...
          if (prev.begin.order <= index) {
            return {
              ...prev,
              end: { entryId, order: index, element: e.currentTarget },
            };
          }
          // ...X ... ... ... A ... ... ...
        } else if (!prev.begin?.entryId && prev.end?.entryId) {
          // ... ... ... B
          return {};
        } else if (!prev.begin?.entryId && !prev.end?.entryId) {
          // ... ... ...
          return {
            begin: {
              entryId,
              order: index,
              element: e.currentTarget,
            },
            end: undefined,
          };
        }

        return prev;
      });
    },
    [],
  );

  const handleSelectDot = useCallback(
    (entryId: string) => {
      openModal(
        <PieceOfTextModal
          questions={questionsMap.get(entryId) || []}
          onSelectQuestion={handleSelectQuestion}
          onClose={closeModal}
        />,
      );
    },
    [closeModal, handleSelectQuestion, openModal, questionsMap],
  );

  const handleWordClick = useCallback(
    (entryId: string, index: number, e: MouseEvent<HTMLElement>) => {
      if (mode === 'view') {
        handleSelectDot(entryId);
      } else if (mode === 'edit') {
        handleSelectRange(entryId, index, e);
      }
    },
    [handleSelectRange, handleSelectDot, mode],
  );

  const handleChangeRange = useCallback((_sentence: string) => {
    setSentence(_sentence);
  }, []);

  const handleCancel = () => {
    setRange({});
  };

  // const handleSaveAnswer = async (answer: string, itemIds: string[]) => {
  //   if (!selectedQuestion) {
  //     presetToast({
  //       message: `${tr('Not selected question!')}`,
  //       duration: 1500,
  //       position: 'top',
  //       color: 'danger',
  //     });

  //     return;
  //   }

  //   const res = await upsertAnswer({
  //     variables: {
  //       question_id: selectedQuestion.question_id,
  //       answer,
  //       question_item_ids: itemIds,
  //     },
  //   });

  //   if (res.data?.upsertAnswers.error !== ErrorType.NoError) {
  //     return;
  //   }

  //   handleCancel();
  // };

  const documentRange = useMemo(
    () => ({
      beginEntry: range.begin?.entryId,
      endEntry: range.end?.entryId,
    }),
    [range],
  );

  // modalContentCom =
  //   mode === 'view' && selectedQuestion ? (
  //     <AnswerList
  //       onCancel={handleCancel}
  //       onSave={handleSaveAnswer}
  //       question={selectedQuestion}
  //       sentence={sentence}
  //     />
  //   ) : (
  //     modalContentCom
  //   );

  const handleAddQuestionButton = useCallback(() => {
    if (range.begin && range.end) {
      setNewQuestionFormPageData({
        range: {
          begin: range.begin,
          end: range.end,
        },
        sentence,
      });
      history.push(
        `/${nation_id}/${language_id}/${cluster_id}/qa/new-question?document_id=${document_id}`,
      );
    }
  }, [
    cluster_id,
    document_id,
    history,
    language_id,
    nation_id,
    range.begin,
    range.end,
    sentence,
    setNewQuestionFormPageData,
  ]);

  const popoverCom =
    range.begin && range.end && mode === 'edit' && range.begin.element ? (
      <Popover
        open={!!range.begin.element}
        anchorEl={range.begin.element}
        onClose={handleCancel}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPopover-paper': {
            marginTop: '2px',
            borderRadius: '6px',
          },
        }}
      >
        <QuestionAddButton onClickAddButton={handleAddQuestionButton} />
      </Popover>
    ) : null;

  return (
    <>
      <DocumentViewer
        mode={mode}
        documentId={documentId}
        range={documentRange}
        dots={dots}
        onChangeRange={handleChangeRange}
        onClickWord={handleWordClick}
      />

      {popoverCom}
    </>
  );
}
