import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router';
import { useIonToast } from '@ionic/react';
import { Divider, Stack, Typography, Button } from '@mui/material';

import { Caption } from '../../common/Caption/Caption';
import { PageLayout } from '../../common/PageLayout';
import {
  ErrorType,
  TableNameType,
  useWordDefinitionReadLazyQuery,
  usePhraseDefinitionReadLazyQuery,
} from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';
import { useQuery } from '../../../hooks/useQuery';

import {
  WORD_AND_PHRASE_FLAGS,
  authorizedForAnyFlag,
} from '../../flags/flagGroups';

import { DiscussionIconButton } from '../../Discussion/DiscussionButton';
import { FlagV2 } from '../../flags/Flag';
import { MoreHorizButton } from '../../common/buttons/MoreHorizButton';
import { NewTranslationForm } from './NewTranslationForm';
import { TranslationList } from './TranslantionList';
import { Box } from '@mui/material';
import { tag2langInfo } from '../../../../../utils';
import { StringContentTypes } from '../../../common/utility';

export function TranslationDetailPage() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const history = useHistory();
  const {
    definition_id,
    type: definition_type,
    lang_full_tag,
  } = useParams<{
    definition_id: string;
    type: string;
    lang_full_tag: string;
  }>();
  const searchParams = useQuery();

  const [openForm, setOpenForm] = useState<boolean>(false);
  const [wordOrPhrase, setWordOrPhrase] = useState<{
    wordOrPhrase: string;
    definition: string;
  } | null>(null);

  const [readWordDefinition] = useWordDefinitionReadLazyQuery();
  const [readPhraseDefinition] = usePhraseDefinitionReadLazyQuery();

  const handleBackClick = useCallback(() => {
    const redirectUrl = searchParams.get('redirect_url');
    if (redirectUrl) {
      history.push(redirectUrl);
    } else {
      history.goBack();
    }
  }, [history, searchParams]);

  useEffect(() => {
    (async () => {
      if (definition_type === StringContentTypes.WORD) {
        const { data } = await readWordDefinition({
          variables: {
            id: definition_id,
          },
        });

        if (
          !data ||
          !data.wordDefinitionRead ||
          !data.wordDefinitionRead.word_definition ||
          data.wordDefinitionRead.error !== ErrorType.NoError
        ) {
          present({
            message: `${tr('There is no Original Word Definition!')} [${data
              ?.wordDefinitionRead.error}]`,
            duration: 1500,
            position: 'top',
            color: 'danger',
          });

          handleBackClick();
          return;
        }
        setWordOrPhrase({
          wordOrPhrase: data.wordDefinitionRead.word_definition.word.word,
          definition: data.wordDefinitionRead.word_definition.definition,
        });
      } else {
        const { data } = await readPhraseDefinition({
          variables: {
            id: definition_id,
          },
        });

        if (
          !data ||
          !data.phraseDefinitionRead ||
          !data.phraseDefinitionRead.phrase_definition ||
          data.phraseDefinitionRead.error !== ErrorType.NoError
        ) {
          present({
            message: `${tr('There is no Original Phrase Definition!')} [${data
              ?.phraseDefinitionRead.error}]`,
            duration: 1500,
            position: 'top',
            color: 'danger',
          });

          handleBackClick();
          return;
        }
        setWordOrPhrase({
          wordOrPhrase:
            data.phraseDefinitionRead.phrase_definition.phrase.phrase,
          definition: data.phraseDefinitionRead.phrase_definition.definition,
        });
      }
    })();
  }, [
    definition_id,
    definition_type,
    handleBackClick,
    present,
    readPhraseDefinition,
    readWordDefinition,
    tr,
  ]);

  const targetLang = useMemo(
    () => tag2langInfo(lang_full_tag),
    [lang_full_tag],
  );

  const handleCancelForm = () => {
    setOpenForm(false);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const wordFormCom = openForm ? (
    <NewTranslationForm
      language={targetLang}
      definition_id={definition_id}
      definition_type={definition_type}
      onCancel={handleCancelForm}
    />
  ) : null;

  const wordFormButtonCom = !openForm ? (
    <Button variant="contained" color="blue" onClick={handleOpenForm}>
      {tr('Add Translation')}
    </Button>
  ) : null;

  return (
    <PageLayout>
      <Caption onBackClick={handleBackClick}>{tr('Details')}</Caption>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h1" sx={{ paddingTop: '5px' }}>
          {wordOrPhrase?.wordOrPhrase || ''}
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap="14px"
        >
          <DiscussionIconButton
            parent_id={definition_id}
            parent_table={
              definition_type === StringContentTypes.WORD
                ? TableNameType.Words
                : TableNameType.Phrases
            }
          />
          <Box
            sx={{
              display: authorizedForAnyFlag(WORD_AND_PHRASE_FLAGS)
                ? undefined
                : 'none',
            }}
          >
            <MoreHorizButton
              component={
                <FlagV2
                  parent_id={definition_id}
                  parent_table={
                    definition_type === StringContentTypes.WORD
                      ? TableNameType.WordDefinitions
                      : TableNameType.PhraseDefinitions
                  }
                  flag_names={WORD_AND_PHRASE_FLAGS}
                />
              }
            />
          </Box>
        </Stack>
      </Stack>

      <Typography variant="body1" color="text.gray">
        {wordOrPhrase?.definition || ''}
      </Typography>

      <Divider />

      <Typography variant="h3">{tr('Translations')}</Typography>

      {wordFormCom}
      {wordFormButtonCom}

      <TranslationList
        definition_id={definition_id}
        definition_type={definition_type}
        targetLang={targetLang}
      />
    </PageLayout>
  );
}
