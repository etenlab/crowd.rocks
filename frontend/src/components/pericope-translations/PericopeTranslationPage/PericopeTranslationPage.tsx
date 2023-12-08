import { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import {
  Divider,
  Stack,
  Typography,
  Button,
  LinearProgress,
} from '@mui/material';

import { Caption } from '../../common/Caption/Caption';
import {
  TableNameType,
  useGetPericopeTextAndDesctiptionQuery,
  useGetPericopeTranslationsQuery,
} from '../../../generated/graphql';

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
import { PageLayout } from '../../common/PageLayout';
import { langInfo2langInput } from '../../../../../utils';
import { useAddPericopeTrMutation } from '../../../hooks/useAddPericopeTrMutation';

export function PericopeTranslationPage() {
  const { pericopeId } = useParams<{ pericopeId: string }>();
  const { tr } = useTr();
  const {
    states: {
      global: {
        langauges: {
          documentPage: { target: targetLang },
        },
      },
    },
  } = useAppContext();
  const [present] = useIonToast();

  const [openForm, setOpenForm] = useState<boolean>(false);

  const pericopeTrData = useGetPericopeTextAndDesctiptionQuery({
    variables: { pericopeId },
  });

  const translationsQ = useGetPericopeTranslationsQuery({
    variables: {
      pericopeId,
      targetLang: targetLang
        ? langInfo2langInput(targetLang)
        : { language_code: '' },
    },
  }).data?.getPericopeTranslations;

  const pericopeTr = pericopeTrData.data?.getPericopeTextAndDesctiption;

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
          pericopeId,
          tanslation_description: description,
          translation: text,
          targetLang: langInfo2langInput(targetLang),
        },
      });
      setOpenForm(false);
    },
    [addPericopeTr, pericopeId, present, targetLang, tr],
  );

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const formCom = openForm ? (
    <NewTranslationForm onCancel={handleCancelForm} onSave={handleSaveForm} />
  ) : null;

  const formButtonCom = !openForm ? (
    <Button variant="contained" color="blue" onClick={handleOpenForm}>
      {tr('Add Translation')}
    </Button>
  ) : null;

  const dropDownList = pericopeTr?.pericope_id && [
    {
      key: 'flag_button',
      component: (
        <FlagV2
          parent_id={pericopeTr.pericope_id}
          parent_table={TableNameType.Pericopies}
          flag_names={PERICOPIES_FLAGS}
        />
      ),
    },
  ];

  return (
    <PageLayout>
      <Caption>{tr('Details')}</Caption>

      {pericopeTr?.pericope_id && dropDownList && (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h1" sx={{ paddingTop: '5px' }}>
              {pericopeTr.pericope_text}
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap="14px"
            >
              <DiscussionIconButton
                parent_id={pericopeTr.pericope_id}
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
            {pericopeTr.pericope_description_text}
          </Typography>

          <Divider />

          <Typography variant="h3">{tr('Translations')}</Typography>

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
    </PageLayout>
  );
}
