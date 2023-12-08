import { useMemo, useState, useCallback, ReactNode, useEffect } from 'react';
import { Box } from '@mui/material';

import { Dot } from '../../documents/DocumentViewer/styled';
import { DocumentViewerV2 } from '../../documents/DocumentViewer';
import { PericopeReactionV2 } from './PericopeReactionV2';
import { PericopeAddButtonV2 } from './PericopeAddButtonV2';

import { TempPage } from '../../documents/DocumentViewer/DocumentViewer';

import {
  PericopeWithVote,
  useGetPericopiesByDocumentIdQuery,
} from '../../../generated/graphql';
import { useSubscribeToPericopiesAddedSubscription } from '../../../hooks/useUpsertPericopeMutation';
import { useSubscribeToPericopieDeletedSubscription } from '../../../hooks/useDeletePericopeMutation';
import { useSubscribeToPericopeVoteStatusToggledSubscription } from '../../../hooks/useTogglePericopeVoteStatusMutation';

type PericopeDocumentViewerV2Props = {
  documentId: string;
  customScrollParent?: HTMLElement;
};

export function PericopeDocumentViewerV2({
  documentId,
  customScrollParent,
}: PericopeDocumentViewerV2Props) {
  const { data, fetchMore } = useGetPericopiesByDocumentIdQuery({
    variables: {
      document_id: documentId,
      first: 1,
      after: null,
    },
  });
  useSubscribeToPericopiesAddedSubscription();
  useSubscribeToPericopieDeletedSubscription();
  useSubscribeToPericopeVoteStatusToggledSubscription();

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

  const handleWordClick = useCallback((entryId: string) => {
    setSelectedWordEntryId(entryId);
  }, []);

  const handleLoadPage = useCallback((page: TempPage) => {
    setRequiredPage(page);
  }, []);

  const handleClose = () => {
    setSelectedWordEntryId(null);
  };

  const selectedPericope = selectedWordEntryId
    ? pericopeMap.get(selectedWordEntryId) || null
    : null;

  let popoverCom: ReactNode = null;

  if (selectedPericope) {
    popoverCom = (
      <PericopeReactionV2 pericope={selectedPericope} onClose={handleClose} />
    );
  } else if (selectedWordEntryId) {
    popoverCom = (
      <PericopeAddButtonV2
        wordEntryId={selectedWordEntryId}
        onClose={handleClose}
      />
    );
  }

  const drawRanges = selectedWordEntryId
    ? [{ begin: selectedWordEntryId, end: selectedWordEntryId }]
    : [];

  return (
    <>
      <DocumentViewerV2
        documentId={documentId}
        drawRanges={drawRanges}
        selectedPericopeDot={selectedPericope?.start_word}
        dots={dots}
        onChangeRangeText={() => {}}
        onSelectRange={() => {}}
        onClickWord={handleWordClick}
        onLoadPage={handleLoadPage}
        customScrollParent={customScrollParent}
      />

      {selectedWordEntryId ? (
        <Box
          sx={{
            position: 'fixed',
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
          {popoverCom}
        </Box>
      ) : null}
    </>
  );
}
