import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Divider, Stack, Typography, Button } from '@mui/material';

import { Caption } from '../../common/Caption/Caption';
import { TableNameType } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';

import { PERICOPIES_FLAGS, authorizedForAnyFlag } from '../../flags/flagGroups';

import { DiscussionIconButton } from '../../Discussion/DiscussionButton';
import { FlagV2 } from '../../flags/Flag';
import { MoreHorizButton } from '../../common/buttons/MoreHorizButton';
import {
  NewTranslationForm,
  TextAndDesctiption,
} from '../../common/forms/NewTranslationForm/NewTranslationForm';

import { Box } from '@mui/material';

import { useIonToast } from '@ionic/react';
import { useAppContext } from '../../../hooks/useAppContext';
import { PericopeTranslationList } from './PericopeTranslationsList';

export function PericopeTranslation() {
  const { pericopeId } = useParams<{ pericopeId: string }>();
  const { tr } = useTr();
  const {
    states: {
      global: {
        langauges: { targetLang },
      },
    },
  } = useAppContext();
  const [present] = useIonToast();

  const [openForm, setOpenForm] = useState<boolean>(false);

  const getPericopeTr = useGetPericopeTextQuery({});

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
      console.log('mocked save translation ', text, description);
    },
    [present, targetLang?.lang, tr],
  );

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const original = useMemo<{
    pericope_id: string;
    text: string;
    description: string;
  }>(() => {
    const pericope = getPericopeTr();

    return pericope;
  }, [getPericopeText, pericopeId]);

  const formCom = openForm ? (
    <NewTranslationForm onCancel={handleCancelForm} onSave={handleSaveForm} />
  ) : null;

  const formButtonCom = !openForm ? (
    <Button variant="contained" color="blue" onClick={handleOpenForm}>
      {tr('Add Translation')}
    </Button>
  ) : null;

  const dropDownList = [
    {
      key: 'flag_button',
      component: (
        <FlagV2
          parent_id={original.pericope_id}
          parent_table={TableNameType.Pericopies}
          flag_names={PERICOPIES_FLAGS}
        />
      ),
    },
  ];

  return (
    <>
      <Caption>{tr('Details')}</Caption>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h1" sx={{ paddingTop: '5px' }}>
          {original.text}
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap="14px"
        >
          <DiscussionIconButton
            parent_id={original.pericope_id}
            parent_table={TableNameType.Pericopies}
            flex="1"
          />
          <Box
            sx={{
              display: authorizedForAnyFlag(PERICOPIES_FLAGS)
                ? undefined
                : 'none',
            }}
          >
            <MoreHorizButton dropDownList={dropDownList} />
          </Box>
        </Stack>
      </Stack>

      <Typography variant="body1" color="text.gray">
        {original.description}
      </Typography>

      <Divider />

      <Typography variant="h3">{tr('Translations')}</Typography>

      {formCom}
      {formButtonCom}

      <PericopeTranslationList pericope_id={original.pericope_id} />
    </>
  );
}
