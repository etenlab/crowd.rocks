import { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import {
  Box,
  CircularProgress,
  Collapse,
  Button,
  useMediaQuery,
} from '@mui/material';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { Menu } from '../../common/icons/Menu';
import { Cancel } from '../../common/icons/Cancel';
import { OptionItem } from '../../common/forms/Autocomplete';

import { useGetDocumentQuery } from '../../../generated/graphql';
import { useVotePericopeTrChangedSubscription } from '../../../hooks/useVotePericopeTrChangedSubscription';
import { useTr } from '../../../hooks/useTr';
import { TabKind, ToolBox, SuperToolKind, FilterKind } from './ToolBox';
import { useAppContext } from '../../../hooks/useAppContext';

import { SuperDocumentViewer } from '../SuperDocumentViewer/SuperDocumentViewer';
import { SuperPericopiesTranslator } from '../SuperPericopiesTranslator';

export function SuperDocumentViewerPage() {
  const { tr } = useTr();
  const { document_id } = useParams<{ document_id: string }>();
  const matches = useMediaQuery('(min-width:765px)');
  const {
    states: {
      components: { ionContentScrollElement },
    },
  } = useAppContext();

  const [pageStatus, setPageStatus] = useState<'shown' | 'hidden' | null>(null);
  const [expand, setExpand] = useState(true);

  const [tab, setTab] = useState<TabKind>(TabKind.Document);
  const [tool, setTool] = useState<OptionItem>({
    label: tr('Pericope'),
    value: SuperToolKind.Pericope,
  });
  const [filter, setFilter] = useState<OptionItem<FilterKind>>({
    label: tr('All'),
    value: FilterKind.All,
  });
  const [stringFilter, setStringFilter] = useState('');

  const { data: documentData } = useGetDocumentQuery({
    variables: {
      document_id,
    },
  });
  useIonViewDidEnter(() => {
    setPageStatus('shown');
  });

  useIonViewDidLeave(() => {
    setPageStatus('hidden');
  });

  useVotePericopeTrChangedSubscription();

  const handleChangeTab = useCallback((tab: TabKind) => {
    setTab(tab);
  }, []);

  const handleChangeTool = useCallback((tool: OptionItem) => {
    setTool(tool);
  }, []);

  const handleChangeFilter = useCallback((filter: OptionItem<FilterKind>) => {
    setFilter(filter);
  }, []);

  const handleChangeStringFilter = useCallback((str: string) => {
    setStringFilter(str);
  }, []);

  const handleExpand = () => {
    setExpand(true);
  };

  const handleClose = () => {
    setExpand(false);
  };

  const document = documentData ? documentData.getDocument.document : null;

  if (!document) {
    return (
      <PageLayout>
        <Caption>{tr('Details')}</Caption>
        <Box style={{ textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          width: '100%',
          maxWidth: '777px',
          background: (theme) => theme.palette.background.white,
          padding: expand ? '30px 16px' : '0 16px',
          boxShadow: '0px 5px 14px 0px rgba(128, 136, 163, 0.20)',
        }}
      >
        <Collapse in={expand}>
          <ToolBox
            tab={tab}
            onChangeTab={handleChangeTab}
            tool={tool}
            onChangeTool={handleChangeTool}
            filter={filter}
            onChangeFilter={handleChangeFilter}
            stringFilter={stringFilter}
            onChangeStringFilter={handleChangeStringFilter}
            document={document}
          />
        </Collapse>
      </Box>

      <Collapse in={expand}>
        <Box sx={{ height: '340px' }} />
      </Collapse>

      {!expand ? (
        <Button
          variant="outlined"
          onClick={handleExpand}
          sx={{
            position: 'fixed',
            zIndex: 1000,
            top: 20,
            right: matches ? `calc(50% - 394px)` : 0,
            borderRadius: '10px',
            padding: '10px',
            minWidth: 0,
            transform: 'translateX(-50%)',
            background: (theme) => theme.palette.background.white,
            '&:hover': {
              background: (theme) => theme.palette.background.white,
            },
          }}
          color="blue"
        >
          <Menu />
        </Button>
      ) : (
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            position: 'fixed',
            zIndex: 1000,
            top: 20,
            right: matches ? `calc(50% - 394px)` : 0,
            borderRadius: '10px',
            padding: '10px',
            minWidth: 0,
            transform: 'translateX(-50%)',
            background: (theme) => theme.palette.background.white,
            '&:hover': {
              background: (theme) => theme.palette.background.white,
            },
          }}
          color="blue"
        >
          <Cancel />
        </Button>
      )}

      <Box
        sx={{
          width: '100%',
          maxWidth: '777px',
          height: '100vh',
        }}
      >
        {tab === TabKind.Document ? (
          <SuperDocumentViewer
            documentId={document_id}
            documentAuthorId={document.created_by}
            tool={tool.value as SuperToolKind}
            customScrollParent={
              pageStatus === 'shown' && ionContentScrollElement
                ? ionContentScrollElement
                : undefined
            }
          />
        ) : (
          <SuperPericopiesTranslator
            documentId={document_id}
            filterKind={filter.value}
            stringFilter={stringFilter}
          />
        )}
      </Box>
    </PageLayout>
  );
}
