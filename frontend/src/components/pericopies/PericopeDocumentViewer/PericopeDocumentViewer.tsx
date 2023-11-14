import {
  useMemo,
  useState,
  useCallback,
  ReactNode,
  MouseEvent,
  useEffect,
} from 'react';
import { Popover } from '@mui/material';

import { ViewMode } from '../../documents/DocumentViewer/DocumentViewer';
import { Dot } from '../../documents/DocumentViewer/styled';
import { DocumentViewer } from '../../documents/DocumentViewer';
import { PericopeReaction } from './PericopeReaction';
import { PericopeAddButton } from './PericopeAddButton';

import {
  useGetPericopiesByDocumentIdLazyQuery,
  PericopeWithVote,
  ErrorType,
} from '../../../generated/graphql';

type PericopeDocumentViewerProps = {
  documentId: string;
  mode: ViewMode;
};

export function PericopeDocumentViewer({
  documentId,
  mode,
}: PericopeDocumentViewerProps) {
  const [getPericopiesByDocumentId, { data, error }] =
    useGetPericopiesByDocumentIdLazyQuery();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedWordEntryId, setSelectedWordEntryId] = useState<string | null>(
    null,
  );
  const [requiredPage, setRequiredPage] = useState<number | null>(null);

  useEffect(() => {
    if (!requiredPage) {
      return;
    }

    const timer = setTimeout(() => {
      getPericopiesByDocumentId({
        variables: {
          document_id: documentId,
          page: requiredPage,
        },
      });
    }, 1000);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [documentId, getPericopiesByDocumentId, requiredPage]);

  const { dots, pericopiesMap } = useMemo(() => {
    const pericopiesMap = new Map<string, PericopeWithVote>();
    console.log(data);
    if (
      error ||
      !data ||
      data.getPericopiesByDocumentId.error !== ErrorType.NoError
    ) {
      return {
        dots: [],
        pericopiesMap,
      };
    }

    const dots: {
      entryId: string;
      component?: ReactNode;
    }[] = [];

    data.getPericopiesByDocumentId.pericope_with_votes.forEach(
      (pericopeWithVote) => {
        if (!pericopeWithVote) {
          return;
        }

        let dotColor = 'blue';

        if (pericopeWithVote.upvotes > pericopeWithVote.downvotes) {
          dotColor = 'green';
        } else if (pericopeWithVote.upvotes < pericopeWithVote.downvotes) {
          dotColor = 'red';
        }

        dots.push({
          entryId: pericopeWithVote.start_word,
          component: (
            <Dot
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.background[
                    dotColor as keyof typeof theme.palette.background
                  ],
              }}
            />
          ),
        });
        pericopiesMap.set(pericopeWithVote.start_word, pericopeWithVote);
      },
    );

    return { dots, pericopiesMap };
  }, [data, error]);

  const handleWordClick = useCallback(
    (entryId: string, _index: number, event: MouseEvent<HTMLElement>) => {
      setSelectedWordEntryId(entryId);
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  const handleLoadPage = (page: number) => {
    setRequiredPage(page);
  };

  const documentRange = useMemo(
    () => ({
      beginEntry: selectedWordEntryId || undefined,
      endEntry: undefined,
    }),
    [selectedWordEntryId],
  );

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedWordEntryId(null);
  };

  const open = Boolean(anchorEl);

  const selectedPericope = selectedWordEntryId
    ? pericopiesMap.get(selectedWordEntryId) || null
    : null;

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

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          '& .MuiPopover-paper': {
            marginTop: '2px',
            borderRadius: '6px',
          },
        }}
      >
        {mode === 'view' && selectedPericope ? (
          <PericopeReaction pericope={selectedPericope} onClose={handleClose} />
        ) : null}
        {mode === 'edit' && selectedWordEntryId ? (
          <PericopeAddButton
            wordEntryId={selectedWordEntryId}
            documentId={documentId}
            onClose={handleClose}
          />
        ) : null}
      </Popover>
    </>
  );
}
