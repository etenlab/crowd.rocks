import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
  MouseEvent,
} from 'react';
import { Popover } from '@mui/material';

import { ViewMode } from '../../documents/DocumentViewer/DocumentViewer';
import { Dot } from '../../documents/DocumentViewer/styled';
import { DocumentViewer } from '../../documents/DocumentViewer';

import {
  WordRangeTagWithVote,
  useGetWordRangeTagsByDocumentIdQuery,
} from '../../../generated/graphql';
import { useSubscribeToWordRangeTagVoteStatusToggledSubscription } from '../../../hooks/useToggleWordRangeTagVoteStatusMutation';
import { useSubscribeToWordRangeTagWithVoteAddedSubscription } from '../../../hooks/useCreateTaggingOnWordRangeMutation';

import { useAppContext } from '../../../hooks/useAppContext';
import { useTr } from '../../../hooks/useTr';

import { PieceOfTextModal } from '../../qa/QADocumentViewer/PieceOfTextModal';
import { OrangeAddButton } from '../../common/buttons/OrangeAddButton';
import { TagAddingModal } from './TagAddingModal';

import { TempPage } from '../../documents/DocumentViewer/DocumentViewer';
import { TagsListModal } from './TagsListModal';

export type RangeItem = {
  entryId: string;
  order: number;
  element: HTMLElement | null;
};

type TaggingDocumentViewerProps = {
  documentId: string;
  mode: ViewMode;
  customScrollParent?: HTMLElement;
};

export function TaggingDocumentViewer({
  documentId,
  mode,
  customScrollParent,
}: TaggingDocumentViewerProps) {
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

  const [range, setRange] = useState<{
    begin?: RangeItem;
    end?: RangeItem;
  }>({});

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

  const handleSelectPiece = useCallback(
    (pieceOfText: string, beginWordEntryId: string, endWordEntryId: string) => {
      openModal(
        <TagsListModal
          pieceOfText={pieceOfText}
          begin_document_word_entry_id={beginWordEntryId}
          end_document_word_entry_id={endWordEntryId}
          onClose={closeModal}
        />,
      );
    },
    [closeModal, openModal],
  );

  const handleSelectDot = useCallback(
    (entryId: string) => {
      const taggings = taggingsGroupMapRef.current.get(entryId) || [];

      openModal(
        <PieceOfTextModal
          ranges={taggings.map((tag) => ({
            begin_document_word_entry_id:
              tag.word_range.begin.document_word_entry_id,
            end_document_word_entry_id:
              tag.word_range.end.document_word_entry_id,
          }))}
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

  const handleAddTag = useCallback(() => {
    if (range.begin && range.end) {
      openModal(
        <TagAddingModal
          begin_document_word_entry_id={range.begin.entryId}
          end_document_word_entry_id={range.end.entryId}
          onClose={closeModal}
        />,
      );
      handleCancel();
    }
  }, [range.begin, range.end, openModal, closeModal, handleCancel]);

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
        <OrangeAddButton
          onClickAddButton={handleAddTag}
          label={tr('Add Tag')}
        />
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
        customScrollParent={customScrollParent}
      />

      {popoverCom}
    </>
  );
}
