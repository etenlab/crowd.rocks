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
  useGetPericopiesByDocumentIdQuery,
  Pericope,
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
  const { data, error } = useGetPericopiesByDocumentIdQuery({
    variables: {
      document_id: documentId,
    },
  });

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [selectedWordEntryId, setSelectedWordEntryId] = useState<string | null>(
    null,
  );
  const [selectedPericopeId, setSelectedPericopeId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    console.log(anchorEl);
  }, [anchorEl]);

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
    (entryId: string, _index: number, event: MouseEvent<HTMLElement>) => {
      const pericope = pericopiesMap.get(entryId);

      if (mode === 'edit' && !pericope) {
        setSelectedWordEntryId(entryId);
        setAnchorEl(event.currentTarget);
      }

      if (mode === 'view' && pericope) {
        setSelectedPericopeId(pericope.pericope_id);
        const tar = event.currentTarget;
        setAnchorEl(tar);
        setTimeout(() => {
          setAnchorEl(null);
          setTimeout(() => {
            setAnchorEl(tar);
          }, 50);
        }, 50);
      }
    },
    [mode, pericopiesMap],
  );

  const documentRange = useMemo(
    () => ({
      beginEntry: selectedWordEntryId || undefined,
      endEntry: undefined,
    }),
    [selectedWordEntryId],
  );

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedPericopeId(null);
    setSelectedWordEntryId(null);
  };

  const open = Boolean(anchorEl);

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
        // sx={{
        //   '& .MuiPopover-paper': {
        //     marginTop: '2px',
        //     borderRadius: '6px',
        //   },
        // }}
      >
        {mode === 'view' && selectedPericopeId ? (
          <PericopeReaction
            pericopeId={selectedPericopeId}
            onClose={handleClose}
          />
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
