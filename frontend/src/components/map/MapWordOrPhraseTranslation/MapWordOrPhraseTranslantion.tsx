import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Divider, Stack, Typography, Button } from '@mui/material';

import { Caption } from '../../common/Caption/Caption';
import {
  TableNameType,
  useGetMapWordOrPhraseAsOrigByDefinitionIdQuery,
} from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';

import { WORD_AND_PHRASE_FLAGS } from '../../flags/flagGroups';

import { DiscussionIconButton } from '../../Discussion/DiscussionButton';
import { FlagV2 } from '../../flags/Flag';
import { NewTranslationForm } from './NewTranslationForm';
import { MapWordOrPhraseTranslationList } from './MapWordOrPhraseTranslantionList';

export function MapWordOrPhraseTranslation() {
  const { tr } = useTr();
  const { definition_id, type: definition_type } = useParams<{
    definition_id: string;
    type: string;
  }>();

  const [openForm, setOpenForm] = useState<boolean>(false);

  const wordOrPhraseQ = useGetMapWordOrPhraseAsOrigByDefinitionIdQuery({
    variables: {
      definition_id,
      is_word_definition: definition_type === 'word',
    },
  });

  const handleCancelForm = () => {
    setOpenForm(false);
  };

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
    <NewTranslationForm
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
          />
          <FlagV2
            parent_id={definition_id}
            parent_table={
              original.isWord
                ? TableNameType.WordDefinitions
                : TableNameType.PhraseDefinitions
            }
            flag_names={WORD_AND_PHRASE_FLAGS}
          />
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
