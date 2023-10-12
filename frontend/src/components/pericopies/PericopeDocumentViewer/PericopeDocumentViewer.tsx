import { useMemo, useState, useCallback, useRef, ReactNode } from 'react';
import { useHistory, useParams } from 'react-router';
import {
  IonPopover,
  // useIonToast,
  // useIonLoading,
} from '@ionic/react';

import { ViewMode, Dot } from '../../common/BaseDocumentViewer';
import { DocumentViewer } from '../../documents/DocumentViewer';
import { PericopeReaction } from './PericopeReaction';

import {
  useGetPericopiesByDocumentIdQuery,
  useGetPericopeVoteStatusLazyQuery,
  Pericope,
  ErrorType,
  TableNameType,
} from '../../../generated/graphql';
import { useTogglePericopeVoteStatusMutation } from '../../../hooks/useTogglePericopeVoteStatusMutation';
import { useUpsertPericopeMutation } from '../../../hooks/useUpsertPericopeMutation';

type PericopeDocumentViewerProps = {
  documentId: string;
  mode: ViewMode;
};

export function PericopeDocumentViewer({
  documentId,
  mode,
}: PericopeDocumentViewerProps) {
  const history = useHistory();
  const { nation_id, language_id, cluster_id } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
  }>();

  const { data, error } = useGetPericopiesByDocumentIdQuery({
    variables: {
      document_id: documentId,
    },
  });
  const [
    getPericopeVoteStatus,
    { data: voteStatusData, error: voteStatusError },
  ] = useGetPericopeVoteStatusLazyQuery();
  const [togglePericopeVoteStatus] = useTogglePericopeVoteStatusMutation();
  const [upsertPericope] = useUpsertPericopeMutation(documentId);

  const popoverRef = useRef<HTMLIonPopoverElement>(null);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedWordEntryId, setSelectedWordEntryId] = useState<string | null>(
    null,
  );

  const { dots, pericopiesMap } = useMemo(() => {
    const pericopiesMap = new Map<string, Pericope>();

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

    data.getPericopiesByDocumentId.pericopies.forEach((pericope) => {
      if (!pericope) {
        return;
      }

      dots.push({
        entryId: pericope.start_word,
        component: <Dot />,
      });
      pericopiesMap.set(pericope.start_word, pericope);
    });

    return { dots, pericopiesMap };
  }, [data, error]);

  const handleWordClick = useCallback(
    (entryId: string, _index: number, e?: unknown) => {
      const pericope = pericopiesMap.get(entryId);

      if (mode === 'edit' && pericope) {
        return;
      }

      setSelectedWordEntryId(entryId);

      if (mode === 'view') {
        if (pericope) {
          getPericopeVoteStatus({
            variables: {
              pericope_id: pericope.pericope_id,
            },
          });
        }
      }

      popoverRef.current!.event = e;
      setPopoverOpen(true);
    },
    [getPericopeVoteStatus, mode, pericopiesMap],
  );

  const vote = useMemo(() => {
    if (!selectedWordEntryId) {
      return null;
    }

    const pericope = pericopiesMap.get(selectedWordEntryId) || null;

    if (
      voteStatusError ||
      !voteStatusData ||
      voteStatusData.getPericopeVoteStatus.error !== ErrorType.NoError ||
      !voteStatusData.getPericopeVoteStatus.vote_status ||
      !pericope
    ) {
      return null;
    }

    const voteStatus = voteStatusData.getPericopeVoteStatus.vote_status;

    if (pericope.pericope_id !== voteStatus.pericope_id) {
      return null;
    }

    const handleUpClick = () => {
      togglePericopeVoteStatus({
        variables: {
          pericope_id: voteStatus.pericope_id,
          vote: true,
        },
      });
    };

    const handleDownClick = () => {
      togglePericopeVoteStatus({
        variables: {
          pericope_id: voteStatus.pericope_id,
          vote: false,
        },
      });
    };

    return {
      upVotes: voteStatus.upvotes,
      downVotes: voteStatus.downvotes,
      onVoteUpClick: handleUpClick,
      onVoteDownClick: handleDownClick,
    };
  }, [
    selectedWordEntryId,
    pericopiesMap,
    voteStatusError,
    voteStatusData,
    togglePericopeVoteStatus,
  ]);

  const handleAddPericope = () => {
    if (!selectedWordEntryId) {
      return;
    }

    if (mode === 'edit') {
      upsertPericope({
        variables: {
          startWord: selectedWordEntryId,
        },
      });
    }
  };

  const handleClickDiscussion = () => {
    if (!selectedWordEntryId) {
      return;
    }

    const pericope = pericopiesMap.get(selectedWordEntryId) || null;

    if (!pericope) {
      return;
    }

    history.push(
      `/${nation_id}/${language_id}/${cluster_id}/discussion/${TableNameType.Pericopies}/${pericope.pericope_id}`,
    );
  };

  const documentRange = useMemo(
    () => ({
      beginEntry: selectedWordEntryId || undefined,
      endEntry: undefined,
    }),
    [selectedWordEntryId],
  );

  return (
    <>
      <DocumentViewer
        mode={mode}
        documentId={documentId}
        range={documentRange}
        dots={dots}
        onChangeRange={() => {}}
        onClickWord={handleWordClick}
      />

      <IonPopover
        ref={popoverRef}
        isOpen={popoverOpen}
        onDidDismiss={() => setPopoverOpen(false)}
        style={{ '--width': '150px' }}
      >
        <PericopeReaction
          mode={mode}
          vote={vote || undefined}
          onClickAddPericope={handleAddPericope}
          onClickDiscussion={handleClickDiscussion}
        />
      </IonPopover>
    </>
  );
}
