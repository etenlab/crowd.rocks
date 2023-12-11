import { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import { Box, CircularProgress, Collapse, Button } from '@mui/material';

import { globals } from '../../../services/globals';
import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';

import { useGetDocumentQuery } from '../../../generated/graphql';
import { useTr } from '../../../hooks/useTr';

import { useAppContext } from '../../../hooks/useAppContext';
import { TabKind, ToolBox, SuperToolKind, FilterKind } from './ToolBox';
import { OptionItem } from '../../common/forms/Autocomplete';
import { NavArrowDown } from '../../common/icons/NavArrowDown';
import { NavArrowUp } from '../../common/icons/NavArrowUp';
import { SuperDocumentViewer } from '../SuperDocumentViewer/SuperDocumentViewer';
import { SuperPericopiesTranslator } from '../SuperPericopiesTranslator';
import { useVotePericopeTrChangedSubscription } from '../../../hooks/useVotePericopeTrChangedSubscription';

export function SuperDocumentViewerPage() {
  const { tr } = useTr();
  const { document_id } = useParams<{ document_id: string }>();
  const {
    states: {
      components: { ionContentScrollElement },
    },
  } = useAppContext();

  const [pageStatus, setPageStatus] = useState<'shown' | 'hidden' | null>(null);
  const [expand, setExpand] = useState(true);

  const [mode, setMode] = useState<'view' | 'edit'>('view');
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

  const handleToggleMode = useCallback(() => {
    setMode((mode) => {
      if (mode === 'view') {
        return 'edit';
      } else {
        return 'view';
      }
    });
  }, []);

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

  const sameUser = document
    ? +document.created_by === globals.get_user_id()
    : false;

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
          padding: expand ? '30px 20px' : '15px 20px',
          borderRadius: '0 0 20px 20px',
          boxShadow: '0px 5px 14px 0px rgba(128, 136, 163, 0.20)',
        }}
      >
        <Collapse in={expand}>
          <ToolBox
            mode={mode}
            onToggleMode={handleToggleMode}
            tab={tab}
            onChangeTab={handleChangeTab}
            tool={tool}
            onChangeTool={handleChangeTool}
            filter={filter}
            onChangeFilter={handleChangeFilter}
            stringFilter={stringFilter}
            onChangeStringFilter={handleChangeStringFilter}
            document={document}
            disabledEditButton={
              tool.value === SuperToolKind.Pericope && !sameUser
            }
          />
        </Collapse>
        {expand ? (
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              bottom: -20,
              left: '50%',
              borderRadius: '50%',
              minWidth: 0,
              transform: 'translateX(-50%)',
            }}
            color="blue"
          >
            <NavArrowUp />
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleExpand}
            sx={{
              position: 'absolute',
              bottom: -20,
              left: '50%',
              borderRadius: '50%',

              minWidth: 0,
              transform: 'translateX(-50%)',
            }}
            color="blue"
          >
            <NavArrowDown />
          </Button>
        )}
      </Box>

      <Collapse in={expand}>
        <Box sx={{ height: '340px' }} />
      </Collapse>

      {tab === TabKind.Document ? (
        <SuperDocumentViewer
          documentId={document_id}
          mode={mode}
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
    </PageLayout>
  );
}
