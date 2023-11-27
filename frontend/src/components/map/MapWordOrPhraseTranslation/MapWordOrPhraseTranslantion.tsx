import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Divider, Stack, Typography, Button } from '@mui/material';

import { Caption } from '../../common/Caption/Caption';
import {
  TableNameType,
  useGetMapWordOrPhraseAsOrigByDefinitionIdQuery,
} from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';

import {
  WORD_AND_PHRASE_FLAGS,
  authorizedForAnyFlag,
} from '../../flags/flagGroups';

import { DiscussionIconButton } from '../../Discussion/DiscussionButton';
import { FlagV2 } from '../../flags/Flag';
import { MoreHorizButton } from '../../common/buttons/MoreHorizButton';
import { NewTranslationForm } from './NewTranslationForm';
import { MapWordOrPhraseTranslationList } from './MapWordOrPhraseTranslantionList';
import { Box } from '@mui/material';
import { useUpsertTranslationFromWordAndDefinitionlikeStringMutation } from '../../../hooks/useUpsertTranslationFromWordAndDefinitionlikeStringMutation';
import { StringContentTypes, typeOfString } from '../../../common/utility';
import {
  GetRecommendedTranslationFromDefinitionIdDocument,
  GetTranslationsByFromDefinitionIdDocument,
} from '../../../generated/graphql';
import { useIonToast } from '@ionic/react';
import { useAppContext } from '../../../hooks/useAppContext';

export function MapWordOrPhraseTranslation() {
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

  const wordOrPhraseQ = useGetMapWordOrPhraseAsOrigByDefinitionIdQuery({
    variables: {
      definition_id,
      is_word_definition: definition_type === 'word',
    },
  });

  const [upsertTranslation] =
    useUpsertTranslationFromWordAndDefinitionlikeStringMutation();

  const handleCancelForm = () => {
    setOpenForm(false);
  };

  const handleSaveForm = useCallback(
    async ({
      translation,
      description,
    }: {
      translation: string;
      description: string;
    }) => {
      if (!targetLang?.lang) {
        present({
          message: `${tr('Target language must be selected')}`,
          duration: 1500,
          position: 'top',
          color: 'warning',
        });
        return;
      }
      upsertTranslation({
        variables: {
          language_code: targetLang?.lang.tag,
          dialect_code: targetLang?.dialect?.tag,
          geo_code: targetLang?.region?.tag,
          word_or_phrase: translation,
          definition: description,
          from_definition_id: definition_id,
          from_definition_type_is_word:
            definition_type === StringContentTypes.WORD,
          is_type_word: typeOfString(translation) === StringContentTypes.WORD,
        },
        refetchQueries: [
          GetTranslationsByFromDefinitionIdDocument,
          GetRecommendedTranslationFromDefinitionIdDocument,
        ],
      });
    },
    [
      definition_id,
      definition_type,
      present,
      targetLang?.dialect?.tag,
      targetLang?.lang,
      targetLang?.region?.tag,
      tr,
      upsertTranslation,
    ],
  );

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const original = useMemo(() => {
    const wordOrPhrase =
      wordOrPhraseQ.data?.getMapWordOrPhraseAsOrigByDefinitionId.wordOrPhrase;
    const isWord = wordOrPhrase?.__typename === 'WordWithDefinition';
    const isPhrase = wordOrPhrase?.__typename === 'PhraseWithDefinition';
    const value = isWord
      ? wordOrPhrase?.word
      : isPhrase
      ? wordOrPhrase?.phrase
      : '';
    const id = isWord
      ? wordOrPhrase?.word_id
      : isPhrase
      ? wordOrPhrase?.phrase_id
      : '';

    return {
      isWord,
      isPhrase,
      wordOrPhrase,
      value,
      id,
      definition: wordOrPhrase?.definition,
    };
  }, [wordOrPhraseQ]);

  const wordFormCom = openForm ? (
    <NewTranslationForm onCancel={handleCancelForm} onSave={handleSaveForm} />
  ) : null;

  const wordFormButtonCom = !openForm ? (
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
          parent_table={
            original.isWord
              ? TableNameType.WordDefinitions
              : TableNameType.PhraseDefinitions
          }
          flag_names={WORD_AND_PHRASE_FLAGS}
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

      {wordFormCom}
      {wordFormButtonCom}

      <MapWordOrPhraseTranslationList
        definition_id={definition_id}
        definition_type={definition_type}
      />
    </>
  );
}
