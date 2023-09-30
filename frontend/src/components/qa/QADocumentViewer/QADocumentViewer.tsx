import { useMemo, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
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

import { useTr } from '../../../hooks/useTr';
import { RowStack } from '../../common/Layout/styled';

type RangeItem = {
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

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [range, setRange] = useState<{
    begin?: RangeItem;
    end?: RangeItem;
  }>({});

  useEffect(() => {
    if (range.begin && range.end) {
      setIsOpenModal(true);
    }
  }, [range.begin, range.end]);

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
              end: undefined,
            };
          }

          return prev;
        });
      }
    },
    [mode, questionsMap],
  );

  const handleCancel = () => {
    setIsOpenModal(false);
    setRange({});
  };

  const handleSaveQuestion = () => {
    setIsOpenModal(false);
    setRange({});
  };

  if (loading) {
    return <div>loading</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  return (
    <>
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
      <IonModal isOpen={isOpenModal} onDidDismiss={() => setIsOpenModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{tr('New Document')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div>Developing now</div>
          <RowStack>
            <IonButton fill="outline" onClick={handleCancel}>
              {tr('Cancel')}
            </IonButton>
            <IonButton onClick={handleSaveQuestion}>{tr('Save')}</IonButton>
          </RowStack>
        </IonContent>
      </IonModal>
    </>
  );
}
