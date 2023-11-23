import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
  MouseEvent,
} from 'react';
import { useHistory, useParams } from 'react-router';
import { Popover } from '@mui/material';

import { ViewMode } from '../../documents/DocumentViewer/DocumentViewer';
import { Dot } from '../../documents/DocumentViewer/styled';
import { DocumentViewer } from '../../documents/DocumentViewer';

import {
  QuestionOnWordRange,
  useGetQuestionOnWordRangesByDocumentIdQuery,
} from '../../../generated/graphql';

import { useAppContext } from '../../../hooks/useAppContext';

import { PieceOfTextModal } from './PieceOfTextModal';
import { QuestionAddButton } from './QuestionAddButton';
import { QuestionsModal } from './QuestionsModal';

import { TempPage } from '../../documents/DocumentViewer/DocumentViewer';

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
  const { nation_id, language_id, cluster_id } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
  }>();

  const {
    actions: { createModal },
  } = useAppContext();

  const { data, fetchMore } = useGetQuestionOnWordRangesByDocumentIdQuery({
    variables: {
      document_id: documentId,
      first: 1,
      after: null,
    },
  });

  const [range, setRange] = useState<{
    begin?: RangeItem;
    end?: RangeItem;
  }>({});

  const [requiredPage, setRequiredPage] = useState<TempPage | null>(null);

  const questionsMapRef = useRef(new Map<string, QuestionOnWordRange>());
  const questionsGroupMapRef = useRef(new Map<string, QuestionOnWordRange[]>());

  const { openModal, closeModal } = createModal();

  useEffect(() => {
    if (!requiredPage) {
      return;
    }

    const timer = setTimeout(() => {
      fetchMore({
        variables: {
          document_id: documentId,
          first: requiredPage.first,
          after: requiredPage.after + '',
        },
      });
    }, 1000);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [requiredPage, fetchMore, documentId]);

  const dots = useMemo(() => {
    if (data) {
      data.getQuestionOnWordRangesByDocumentId.edges.forEach((edge) => {
        edge.node.forEach((question) => {
          const exists = questionsMapRef.current.get(question.question_id);

          if (!exists) {
            questionsMapRef.current.set(question.question_id, question);

            const key = question.begin.document_word_entry_id;

            const arr = questionsGroupMapRef.current.get(key);

            if (arr) {
              arr.push(question);
            } else {
              questionsGroupMapRef.current.set(key, [question]);
            }
          }
        });
      });
    }

    const dots: {
      entryId: string;
      component?: ReactNode;
    }[] = [];

    for (const key of questionsGroupMapRef.current.keys()) {
      const arr = questionsGroupMapRef.current.get(key) || [];

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

    return dots;
  }, [data]);

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

  const handleSelectQuestion = useCallback(
    (question: QuestionOnWordRange) => {
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

      history.push(
        `/${nation_id}/${language_id}/${cluster_id}/qa/answers/${question.question_id}`,
      );
    },
    [cluster_id, history, language_id, nation_id],
  );

  const handleSelectPiece = useCallback(
    (pieceOfText: string, beginWordEntryId: string, endWordEntryId: string) => {
      const questions =
        questionsGroupMapRef.current.get(beginWordEntryId) || [];

      openModal(
        <QuestionsModal
          pieceOfText={pieceOfText}
          questions={questions.filter(
            (item) => item.end.document_word_entry_id === endWordEntryId,
          )}
          onSelectQuestion={handleSelectQuestion}
          onClose={closeModal}
        />,
      );
    },
    [closeModal, handleSelectQuestion, openModal],
  );

  const handleSelectDot = useCallback(
    (entryId: string) => {
      const questions = questionsGroupMapRef.current.get(entryId) || [];

      openModal(
        <PieceOfTextModal
          questions={questions}
          onSelectPiece={handleSelectPiece}
          onClose={closeModal}
        />,
      );
    },
    [openModal, handleSelectPiece, closeModal],
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

  const handleCancel = useCallback(() => {
    setRange({});
  }, []);

  const documentRange = useMemo(
    () => ({
      beginEntry: range.begin?.entryId,
      endEntry: range.end?.entryId,
    }),
    [range],
  );

  const handleLoadPage = useCallback((page: TempPage) => {
    setRequiredPage(page);
  }, []);

  const handleAddQuestionButton = useCallback(() => {
    if (range.begin && range.end) {
      history.push(
        `/${nation_id}/${language_id}/${cluster_id}/qa/new-question/${range.begin.entryId}/${range.end.entryId}`,
      );
    }

    handleCancel();
  }, [
    range.begin,
    range.end,
    handleCancel,
    history,
    nation_id,
    language_id,
    cluster_id,
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
        onChangeRange={() => {}}
        onClickWord={handleWordClick}
        onLoadPage={handleLoadPage}
      />

      {popoverCom}
    </>
  );
}
