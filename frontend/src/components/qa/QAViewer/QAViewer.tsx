import { useMemo, useState, useCallback, ReactNode } from 'react';

import { ViewMode, Dot } from '../../common/BaseDocumentViewer';
import { DocumentViewer } from '../../documents/DocumentViewer';

import {
  useGetQuestionOnWordRangesByDocumentIdQuery,
  QuestionOnWordRange,
  ErrorType,
} from '../../../generated/graphql';

type RangeItem = {
  entryId: string;
  order: number;
};

type QAViewerProps = {
  documentId: string;
  mode: ViewMode;
};

export function QAViewer({ documentId, mode }: QAViewerProps) {
  const { data, error, loading } = useGetQuestionOnWordRangesByDocumentIdQuery({
    variables: {
      document_id: documentId,
    },
  });

  const [range, setRange] = useState<{
    begin?: RangeItem;
    end?: RangeItem;
  }>({});

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
          component: <Dot>{arr.length}</Dot>,
        });
      }
    }

    return { dots, questionsMap };
  }, [data, error]);

  const handleWordClick = useCallback(
    (entryId: string, index: number) => {
      if (mode === 'view') {
        const questionArr = questionsMap.get(entryId) || [];

        if (questionArr.length > 0) {
          setRange({
            begin: {
              entryId: questionArr[0].begin.document_word_entry_id,
              order: 0,
            },
            end: {
              entryId: questionArr[0].begin.document_word_entry_id,
              order: 0,
            },
          });
        }
      } else if (mode === 'edit') {
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
            };
          }

          return prev;
        });
      }
    },
    [mode, questionsMap],
  );

  if (loading) {
    return <div>loading</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  return (
    <DocumentViewer
      mode={mode}
      documentId={documentId}
      range={{
        beginEntry: range.begin?.entryId,
        endEntry: range.end?.entryId,
      }}
      dots={dots}
      onClickWord={handleWordClick}
    />
  );
}
