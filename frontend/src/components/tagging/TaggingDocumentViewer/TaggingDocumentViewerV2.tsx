import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { Button, Stack } from '@mui/material';

import { AddCircle } from '../../common/icons/AddCircle';
import { Dot } from '../../documents/DocumentViewer/styled';
import { DocumentViewerV2 } from '../../documents/DocumentViewer';

import {
  WordRangeTagWithVote,
  useGetWordRangeTagsByDocumentIdQuery,
} from '../../../generated/graphql';
import { useSubscribeToWordRangeTagVoteStatusToggledSubscription } from '../../../hooks/useToggleWordRangeTagVoteStatusMutation';
import { useSubscribeToWordRangeTagWithVoteAddedSubscription } from '../../../hooks/useCreateTaggingOnWordRangeMutation';

import { useAppContext } from '../../../hooks/useAppContext';
import { useTr } from '../../../hooks/useTr';

import { TagAddingModalV2 } from './TagAddingModalV2';
import { TagOriginList } from './TagOriginList';

import { TempPage } from '../../documents/DocumentViewer/DocumentViewer';

export type RangeItem = {
  entryId: string;
  order: number;
  element: HTMLElement | null;
};

type TaggingDocumentViewerV2Props = {
  documentId: string;
  customScrollParent?: HTMLElement;
};

export function TaggingDocumentViewerV2({
  documentId,
  customScrollParent,
}: TaggingDocumentViewerV2Props) {
  const { tr } = useTr();
  const {
    actions: { createModal },
  } = useAppContext();

  const { data, fetchMore } = useGetWordRangeTagsByDocumentIdQuery({
    variables: {
      document_id: documentId,
      first: 1,
      after: null,
    },
  });
  useSubscribeToWordRangeTagVoteStatusToggledSubscription();
  useSubscribeToWordRangeTagWithVoteAddedSubscription();

  const [selectedWordRanges, setSelectedWordRanges] = useState<
    { begin: string; end: string }[]
  >([]);

  const [requiredPage, setRequiredPage] = useState<TempPage | null>(null);

  const taggingsMapRef = useRef(new Map<string, WordRangeTagWithVote>());
  const taggingsGroupMapRef = useRef(new Map<string, WordRangeTagWithVote[]>());

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
      data.getWordRangeTagsByDocumentId.edges.forEach((edge) => {
        edge.node.forEach((tag) => {
          const exists = taggingsMapRef.current.get(tag.word_range_tag_id);

          if (!exists) {
            taggingsMapRef.current.set(tag.word_range_tag_id, tag);

            const key = tag.word_range.begin.document_word_entry_id;

            const arr = taggingsGroupMapRef.current.get(key);

            if (arr) {
              arr.push(tag);
            } else {
              taggingsGroupMapRef.current.set(key, [tag]);
            }
          }
        });
      });
    }

    const dots: {
      entryId: string;
      component?: ReactNode;
    }[] = [];

    for (const key of taggingsGroupMapRef.current.keys()) {
      const arr = taggingsGroupMapRef.current.get(key) || [];

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

  const handleCancelSelection = useCallback(
    (wordRange: { begin: string; end: string }) => {
      if (wordRange) {
        setSelectedWordRanges((wordRanges) => [
          ...wordRanges.filter(
            (item) =>
              !(item.begin === wordRange.begin && item.end === wordRange.end),
          ),
        ]);
      }
    },
    [],
  );

  const handleSelectRange = useCallback(
    (range: { begin: string; end: string }) => {
      setSelectedWordRanges((ranges) => {
        const exists = ranges.find(
          (item) => item.begin === range.begin && item.end === item.end,
        );
        if (exists) {
          return [...ranges];
        } else {
          return [...ranges, range];
        }
      });
    },
    [],
  );

  const handleWordClick = useCallback(
    (entryId: string) => {
      handleSelectRange({ begin: entryId, end: entryId });
    },
    [handleSelectRange],
  );

  const handleLoadPage = useCallback((page: TempPage) => {
    setRequiredPage(page);
  }, []);

  const handleAddTag = useCallback(() => {
    if (selectedWordRanges.length > 0) {
      openModal(
        <TagAddingModalV2
          selectedWordRanges={selectedWordRanges}
          onClose={closeModal}
        />,
      );
    }
  }, [selectedWordRanges, openModal, closeModal]);

  const drawRanges = useMemo(
    () => [...selectedWordRanges],
    [selectedWordRanges],
  );

  return (
    <>
      <DocumentViewerV2
        documentId={documentId}
        drawRanges={drawRanges}
        dots={dots}
        onSelectRange={handleSelectRange}
        onChangeRangeText={() => {}}
        onClickWord={handleWordClick}
        onLoadPage={handleLoadPage}
        customScrollParent={customScrollParent}
      />

      {selectedWordRanges.length > 0 ? (
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
          <TagOriginList
            selectedWordRanges={selectedWordRanges}
            onCancel={handleCancelSelection}
          />
          <Button
            variant="outlined"
            onClick={handleAddTag}
            sx={{
              cursor: 'pointer',
              padding: '10px 20px',
              borderRadius: '6px',
            }}
            startIcon={<AddCircle sx={{ fontSize: 20 }} />}
            color="orange"
            fullWidth
          >
            {tr('Add New Tag')}
          </Button>
        </Stack>
      ) : null}
    </>
  );
}
