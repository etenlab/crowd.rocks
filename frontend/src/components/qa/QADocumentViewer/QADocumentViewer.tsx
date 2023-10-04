import {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from 'react';
import {
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
  IonPopover,
  // useIonToast,
  // useIonLoading,
} from '@ionic/react';

import { ViewMode, Dot } from '../../common/BaseDocumentViewer';
import { DocumentViewer } from '../../documents/DocumentViewer';

import {
  useGetQuestionOnWordRangesByDocumentIdQuery,
  QuestionOnWordRange,
  ErrorType,
} from '../../../generated/graphql';
import { useCreateQuestionOnWordRangeMutation } from '../../../hooks/useCreateQuestionOnWordRangeMutation';
import { useUpsertAnswerMutation } from '../../../hooks/useUpsertAnswerMutation';

import { useTr } from '../../../hooks/useTr';

import { QuestionForm } from './QuestionForm';
import { AnswerList } from './AnswerList';
import { QuestionsMenu } from './QuestionsMenu';

export type RangeItem = {
  entryId: string;
  order: number;
};

type QADocumentViewerProps = {
  documentId: string;
  mode: ViewMode;
};

export function QADocumentViewer({ documentId, mode }: QADocumentViewerProps) {
  const { tr } = useTr();

  const { data, error, loading } = useGetQuestionOnWordRangesByDocumentIdQuery({
    variables: {
      document_id: documentId,
    },
  });
  const [createQuestionOnWordRange] = useCreateQuestionOnWordRangeMutation();
  const [upsertAnswer] = useUpsertAnswerMutation();

  const popoverRef = useRef<HTMLIonPopoverElement>(null);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [range, setRange] = useState<{
    begin?: RangeItem;
    end?: RangeItem;
  }>({});
  const [questions, setQuestions] = useState<QuestionOnWordRange[]>([]);
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionOnWordRange | null>(null);
  const [sentence, setSentence] = useState<string>('');

  useEffect(() => {
    if (range.begin && range.end && mode === 'edit') {
      setIsOpenModal(true);
    }
  }, [range.begin, range.end, mode]);

  const { dots, questionsMap } = useMemo(() => {
    const questionsMap = new Map<string, QuestionOnWordRange[]>();

    if (
      error ||
      !data ||
      data.getQuestionOnWordRangesByDocumentId.error !== ErrorType.NoError
    ) {
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
          component: <Dot />,
        });
      }
    }

    return { dots, questionsMap };
  }, [data, error]);

  const handleSelectQuestion = useCallback((question: QuestionOnWordRange) => {
    setRange({
      begin: { entryId: question.begin.document_word_entry_id, order: 0 },
      end: { entryId: question.end.document_word_entry_id, order: 0 },
    });
    setSelectedQuestion(question);
    setIsOpenModal(true);
    setPopoverOpen(false);
  }, []);

  const handleSelectRange = useCallback((entryId: string, index: number) => {
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
            return { ...prev, end: { entryId, order: index } };
          }
          // ...X... ... A... ... ...B...
        }
      } else if (prev.begin?.entryId && !prev.end?.entryId) {
        // ...A... ... ...
        if (prev.begin.order <= index) {
          return { ...prev, end: { entryId, order: index } };
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
          },
          end: undefined,
        };
      }

      return prev;
    });
  }, []);

  const handleSelectDot = useCallback(
    (entryId: string, _index: number, e?: unknown) => {
      setQuestions(questionsMap.get(entryId) || []);

      popoverRef.current!.event = e;
      setPopoverOpen(true);
    },
    [questionsMap],
  );

  const handleWordClick = useCallback(
    (entryId: string, index: number, e?: unknown) => {
      if (mode === 'view') {
        handleSelectDot(entryId, index, e);
      } else if (mode === 'edit') {
        handleSelectRange(entryId, index);
      }
    },
    [handleSelectRange, handleSelectDot, mode],
  );

  const handleChangeRange = useCallback((_sentence: string) => {
    setSentence(_sentence);
  }, []);

  const handleCancel = () => {
    setIsOpenModal(false);
    setRange({});
  };

  const handleSaveQuestion = async (
    question: string,
    items: string[],
    isMultiselect: boolean,
  ) => {
    if (!range.begin?.entryId || !range.end?.entryId) {
      alert('Not selected range');
      return;
    }

    const res = await createQuestionOnWordRange({
      variables: {
        begin_document_word_entry_id: range.begin.entryId,
        end_document_word_entry_id: range.end.entryId,
        question: question,
        question_items: items,
        question_type_is_multiselect: isMultiselect,
      },
    });

    if (res.data?.createQuestionOnWordRange.error !== ErrorType.NoError) {
      return;
    }

    handleCancel();
  };

  const handleSaveAnswer = async (answer: string, itemIds: string[]) => {
    if (!selectedQuestion) {
      alert('Not selected question');
      return;
    }

    const res = await upsertAnswer({
      variables: {
        question_id: selectedQuestion.question_id,
        answer,
        question_item_ids: itemIds,
      },
    });

    if (res.data?.upsertAnswers.error !== ErrorType.NoError) {
      return;
    }

    handleCancel();
  };

  const documentRange = useMemo(
    () => ({
      beginEntry: range.begin?.entryId,
      endEntry: range.end?.entryId,
    }),
    [range],
  );

  if (loading) {
    return <div>loading</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  const modalTitle = mode === 'edit' ? tr('New Question') : tr('New Answer');

  let modalContentCom =
    mode === 'edit' ? (
      <QuestionForm
        onCancel={handleCancel}
        onSave={handleSaveQuestion}
        sentence={sentence}
      />
    ) : null;

  modalContentCom =
    mode === 'view' && selectedQuestion ? (
      <AnswerList
        onCancel={handleCancel}
        onSave={handleSaveAnswer}
        question={selectedQuestion}
        sentence={sentence}
      />
    ) : (
      modalContentCom
    );

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

      <IonPopover
        ref={popoverRef}
        isOpen={popoverOpen}
        onDidDismiss={() => setPopoverOpen(false)}
      >
        <QuestionsMenu
          questions={questions}
          onSelectQuestion={handleSelectQuestion}
        />
      </IonPopover>

      <IonModal isOpen={isOpenModal} onDidDismiss={() => setIsOpenModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{modalTitle}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">{modalContentCom}</IonContent>
      </IonModal>
    </>
  );
}
