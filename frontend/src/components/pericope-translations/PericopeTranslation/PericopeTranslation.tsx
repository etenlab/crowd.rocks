import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Divider, Stack, Typography, Button } from '@mui/material';

import { Caption } from '../../common/Caption/Caption';
import { TableNameType } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';

import {
  PERICOPIES_FLAGS,
  WORD_AND_PHRASE_FLAGS,
  authorizedForAnyFlag,
} from '../../flags/flagGroups';

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

export function PericopeTranslation() {
  const { tr } = useTr();
  const { definition_id, type: definition_type } = useParams<{
    definition_id: string;
    type: string;
  }>();
  const {
    states: {
      global: {
        langauges: { targetLang },
      },
    },
  } = useAppContext();
  const [present] = useIonToast();

  const [openForm, setOpenForm] = useState<boolean>(false);

  const getPericopeAsOriginal = () => {};

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

  const original = useMemo(() => {
    const wordOrPhrase =
      getPericopeAsOriginal.data?.getPericopeAsOriginal.pericope;

    return {
      isWord,
      isPhrase,
      wordOrPhrase,
      value,
      id,
      definition: wordOrPhrase?.definition,
    } as { text: string; description: string };
  }, [getPericopeAsOriginal]);

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
          parent_id={definition_id}
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
          {original.value}
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap="14px"
        >
          <DiscussionIconButton
            parent_id={original.id}
            parent_table={
              original.isWord ? TableNameType.Words : TableNameType.Phrases
            }
            flex="1"
          />
          <Box
            sx={{
              display: authorizedForAnyFlag(WORD_AND_PHRASE_FLAGS)
                ? undefined
                : 'none',
            }}
          >
            <MoreHorizButton dropDownList={dropDownList} />
          </Box>
        </Stack>
      </Stack>

      <Typography variant="body1" color="text.gray">
        {original.definition}
      </Typography>

      <Divider />

      <Typography variant="h3">{tr('Translations')}</Typography>

      {formCom}
      {formButtonCom}

      <MapWordOrPhraseTranslationList
        definition_id={definition_id}
        definition_type={definition_type}
      />
    </>
  );
}
