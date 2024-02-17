import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { useHistory, useParams } from 'react-router';
import { Stack, Button } from '@mui/material';

import { AddCircle } from '../../common/icons/AddCircle';
import { Dot } from '../../documents/DocumentViewer/styled';

import {
  PericopeWithDocumentWordEntry,
  QuestionOnWordRange,
  useGetQuestionOnWordRangesByDocumentIdQuery,
} from '../../../generated/graphql';
import { useSubscribeToQuestionsOnWordRangeAddedSubscription } from '../../../hooks/useCreateQuestionOnWordRangeMutation';

import { useTr } from '../../../hooks/useTr';

import { TempPage } from '../../documents/DocumentViewer/DocumentViewer';
import { PieceOfTextList } from './PieceOfTextList';

import { PericopeViewer } from '../../pericopies/PericopeDocumentViewer/PericopeViewer';

export type RangeItem = {
  entryId: string;
  order: number;
  element: HTMLElement | null;
};

type QAPericopeViewerProps = {
  pericope: PericopeWithDocumentWordEntry;
  customScrollParent?: HTMLElement;
};

export function QAPericopeViewer({
  pericope,
  customScrollParent,
}: QAPericopeViewerProps) {
  const history = useHistory();
  const { nation_id, language_id, cluster_id } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
  }>();
  const { tr } = useTr();

  const { data, fetchMore } = useGetQuestionOnWordRangesByDocumentIdQuery({
    variables: {
      document_id: pericope.start_word.document_id,
      first: 1,
      after: null,
    },
  });
  useSubscribeToQuestionsOnWordRangeAddedSubscription();

  const [selectedWordRange, setSelectedWordRange] = useState<{
    begin: string;
    end: string;
  } | null>(null);
  const [selectedWordEntryId, setSelectedWordEntryId] = useState<string>();

  const [requiredPage, setRequiredPage] = useState<TempPage | null>(null);

  const questionsMapRef = useRef(new Map<string, QuestionOnWordRange>());
  const questionsGroupMapRef = useRef(new Map<string, QuestionOnWordRange[]>());

  useEffect(() => {
    if (!requiredPage) {
      return;
    }

    const timer = setTimeout(() => {
      fetchMore({
        variables: {
          document_id: pericope.start_word.document_id,
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
  }, [requiredPage, fetchMore, pericope]);

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
              sx={{ backgroundColor: (theme) => theme.palette.background.blue }}
            />
          ),
        });
      }
    }

    return dots;
  }, [data]);

  const handleCancelSelection = useCallback(() => {
    setSelectedWordRange(null);
  }, []);

  const handleSelectRange = useCallback(
    (range: { begin: string; end: string }) => {
      setSelectedWordRange({
        begin: range.begin,
        end: range.end,
      });
    },
    [],
  );

  const handleSelectingRange = useCallback((status: boolean) => {
    if (status) {
      setSelectedWordEntryId(undefined);
      setSelectedWordRange(null);
    }
  }, []);

  const handleWordClick = useCallback(
    (entryId: string) => {
      setSelectedWordEntryId(entryId);
      handleSelectRange({ begin: entryId, end: entryId });
    },
    [handleSelectRange],
  );

  const handleLoadPage = useCallback((page: TempPage) => {
    setRequiredPage(page);
  }, []);

  const handleAddQuestionButton = useCallback(() => {
    if (selectedWordRange) {
      history.push(
        `/${nation_id}/${language_id}/${cluster_id}/qa/new-question/${selectedWordRange.begin}/${selectedWordRange.end}`,
      );
    }

    handleCancelSelection();
  }, [
    selectedWordRange,
    handleCancelSelection,
    history,
    nation_id,
    language_id,
    cluster_id,
  ]);

  const drawRanges = useMemo(
    () => (selectedWordRange ? [selectedWordRange] : []),
    [selectedWordRange],
  );

  return (
    <>
      <PericopeViewer
        pericope={pericope}
        drawRanges={drawRanges}
        dots={dots}
        onSelectRange={handleSelectRange}
        onSelectingRange={handleSelectingRange}
        onChangeRangeText={() => {}}
        onClickWord={handleWordClick}
        onLoadPage={handleLoadPage}
        customScrollParent={customScrollParent}
      />

      {selectedWordRange ? (
        <Stack
          gap="16px"
          sx={{
            position: 'fixed',
            zIndex: 10,
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '777px',
            padding: '16px 16px 20px 16px',
            backgroundColor: (theme) => theme.palette.background.white,
            boxShadow: '0px -5px 14px 0px rgba(128, 136, 163, 0.20)',
          }}
        >
          {selectedWordEntryId ? (
            <PieceOfTextList
              begin_document_word_entry_id={selectedWordEntryId}
            />
          ) : null}
          <Button
            variant="outlined"
            onClick={handleAddQuestionButton}
            sx={{
              cursor: 'pointer',
              padding: '10px 20px',
              borderRadius: '6px',
            }}
            startIcon={<AddCircle sx={{ fontSize: 20 }} />}
            color="orange"
            fullWidth
          >
            {tr('Add a Question')}
          </Button>
        </Stack>
      ) : null}
    </>
  );
}
