import { useCallback, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import {
  useIonViewDidEnter,
  useIonViewDidLeave,
  useIonToast,
} from '@ionic/react';
import { Box, CircularProgress, LinearProgress, Button } from '@mui/material';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { Tabs } from '../../common/buttons/Tabs';
import { langInfo2langInput } from '../../../../../utils';
import {
  NewTranslationForm,
  TextAndDesctiption,
} from '../../common/forms/NewTranslationForm/NewTranslationForm';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import {
  useGetPericopeWithDocumentWordEntryQuery,
  useGetPericopeTranslationsQuery,
} from '../../../generated/graphql';
import { useVotePericopeTrChangedSubscription } from '../../../hooks/useVotePericopeTrChangedSubscription';
import { useAddPericopeTrMutation } from '../../../hooks/useAddPericopeTrMutation';

import { PericopeTranslationList } from '../../pericope-translations/PericopeTranslationPage/PericopeTranslationsList';
import { SuperToolKind } from './ToolBox';
import { SuperPericopeViewer } from '../SuperDocumentViewer';

export enum TabKind {
  Original = 'original',
  Target = 'target',
}

export function SuperPericopeViewerPage() {
  const { tr } = useTr();
  const { pericope_id, tool_kind } = useParams<{
    pericope_id: string;
    tool_kind: SuperToolKind;
  }>();
  const {
    states: {
      components: { ionContentScrollElement },
      global: {
        langauges: {
          documentPage: { target: targetLang },
        },
      },
    },
  } = useAppContext();
  const [present] = useIonToast();

  const { data } = useGetPericopeWithDocumentWordEntryQuery({
    variables: {
      pericope_id,
    },
  });

  const [pageStatus, setPageStatus] = useState<'shown' | 'hidden' | null>(null);
  const [openForm, setOpenForm] = useState<boolean>(false);

  const [tab, setTab] = useState<TabKind>(TabKind.Original);

  const tabs = useMemo(
    () => [
      {
        label: tr('Original'),
        value: TabKind.Original,
      },
      {
        label: tr('Target'),
        value: TabKind.Target,
      },
    ],
    [tr],
  );

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

  const pericope =
    data && data.getPericopeWithDocumentWordEntry.pericope
      ? data.getPericopeWithDocumentWordEntry.pericope
      : null;

  const translationsQ = useGetPericopeTranslationsQuery({
    variables: {
      pericopeId: pericope_id,
      targetLang: targetLang
        ? langInfo2langInput(targetLang)
        : { language_code: '' },
    },
  }).data?.getPericopeTranslations;

  const [addPericopeTr] = useAddPericopeTrMutation();

  const handleCancelForm = () => {
    setOpenForm(false);
  };

  const handleSaveForm = useCallback(
    async ({ text, description }: TextAndDesctiption) => {
      if (!targetLang?.lang) {
        present({
          message: `${tr('Target language must be selected')}`,
          duration: 1500,
          position: 'top',
          color: 'warning',
        });
        return;
      }
      await addPericopeTr({
        variables: {
          pericopeId: pericope_id,
          tanslation_description: description,
          translation: text,
          targetLang: langInfo2langInput(targetLang),
        },
      });
      setOpenForm(false);
    },
    [addPericopeTr, pericope_id, present, targetLang, tr],
  );

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  let pageTitle = tr('Pericope Viewer');

  const formCom = openForm ? (
    <NewTranslationForm onCancel={handleCancelForm} onSave={handleSaveForm} />
  ) : null;

  const formButtonCom = !openForm ? (
    <Button variant="contained" color="blue" onClick={handleOpenForm}>
      {tr('Add Translation')}
    </Button>
  ) : null;

  if (tool_kind === SuperToolKind.Tagging) {
    pageTitle = tr('All Tags');
  }

  if (tool_kind === SuperToolKind.QA) {
    pageTitle = tr('All Q&A');
  }

  if (!pericope) {
    return (
      <PageLayout>
        <Caption>{pageTitle}</Caption>
        <Box style={{ textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Caption>{pageTitle}</Caption>

      <Tabs tabs={tabs} selected={tab} onChange={handleChangeTab} />

      <Box
        sx={{
          width: '100%',
          maxWidth: '777px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {tab === TabKind.Original ? (
          <SuperPericopeViewer
            pericope={pericope}
            tool={tool_kind}
            customScrollParent={
              pageStatus === 'shown' && ionContentScrollElement
                ? ionContentScrollElement
                : undefined
            }
          />
        ) : (
          <>
            {formCom}
            {formButtonCom}

            {translationsQ?.translations ? (
              <PericopeTranslationList
                translations={translationsQ?.translations}
              />
            ) : (
              <LinearProgress />
            )}
          </>
        )}
      </Box>
    </PageLayout>
  );
}
