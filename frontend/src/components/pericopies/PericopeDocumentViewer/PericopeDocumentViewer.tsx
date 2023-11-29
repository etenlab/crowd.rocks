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

import { TempPage } from '../../documents/DocumentViewer/DocumentViewer';

import {
  useGetPericopiesByDocumentIdQuery,
  PericopeWithVote,
} from '../../../generated/graphql';
import { PericopeDeleteButton } from './PericopeDeleteButton';

type PericopeDocumentViewerProps = {
  documentId: string;
  mode: ViewMode;
  customScrollParent?: HTMLElement;
};

export function PericopeDocumentViewer({
  documentId,
  mode,
  customScrollParent,
}: PericopeDocumentViewerProps) {
  const { data, fetchMore } = useGetPericopiesByDocumentIdQuery({
    variables: {
      document_id: documentId,
      first: 1,
      after: null,
    },
  });

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedWordEntryId, setSelectedWordEntryId] = useState<string | null>(
    null,
  );
  const [requiredPage, setRequiredPage] = useState<TempPage | null>(null);

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

  const { dots, pericopeMap } = useMemo(() => {
    const pericopeMap = new Map<string, PericopeWithVote>();

    if (data) {
      data.getPericopiesByDocumentId.edges.forEach((edge) => {
        edge.node.forEach((pericopeWithVote) => {
          pericopeMap.set(pericopeWithVote.start_word, pericopeWithVote);
        });
      });
    }

    const dots: {
      entryId: string;
      component?: ReactNode;
    }[] = [];

    for (const pericopeWithVote of pericopeMap.values()) {
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
    }

    return { dots, pericopeMap };
  }, [data]);

  const handleWordClick = useCallback(
    (entryId: string, _index: number, event: MouseEvent<HTMLElement>) => {
      setSelectedWordEntryId(entryId);
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  const handleLoadPage = useCallback((page: TempPage) => {
    setRequiredPage(page);
  }, []);

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
    ? pericopeMap.get(selectedWordEntryId) || null
    : null;

  let popoverCom: ReactNode = null;

  if (mode === 'view' && selectedPericope) {
    popoverCom = (
      <PericopeReaction pericope={selectedPericope} onClose={handleClose} />
    );
  } else if (mode === 'edit' && selectedPericope) {
    popoverCom = (
      <PericopeDeleteButton
        pericopeId={selectedPericope.pericope_id}
        onClose={handleClose}
      />
    );
  } else if (mode === 'edit' && selectedWordEntryId && !selectedPericope) {
    popoverCom = (
      <PericopeAddButton
        wordEntryId={selectedWordEntryId}
        onClose={handleClose}
      />
    );
  }

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
        {popoverCom}
      </Popover>
    </>
  );
}
