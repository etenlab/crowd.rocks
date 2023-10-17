import { useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { useIonRouter, useIonToast } from '@ionic/react';

import { Stack, Typography, Button } from '@mui/material';

import { typeOfString, StringContentTypes } from '../../../common/utility';
import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import {
  ErrorType,
  useGetMapWordOrPhraseAsOrigByDefinitionIdQuery,
  useUpsertTranslationFromWordAndDefinitionlikeStringMutation,
} from '../../../generated/graphql';

import { InfoFill } from '../../common/icons/InfoFill';
import { AddCircle } from '../../common/icons/AddCircle';
import { WordItem } from '../../common/WordItem';
import { MapWordOrPhraseTranslationList } from '../MapWordOrPhraseTranslation/MapWordOrPhraseTranslantionList';

export function MapNewTranslationConfirm() {
  const { tr } = useTr();
  const router = useIonRouter();
  const [present] = useIonToast();
  const {
    nation_id,
    language_id,
    definition_id,
    type: definition_type,
  } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
    definition_id: string;
    type: string;
  }>();

  const {
    states: {
      global: {
        langauges: { targetLang },
        maps: { tempTranslations, updatedTrDefinitionIds },
      },
    },
    actions: { clearTempTranslation, setUpdatedTrDefinitionIds },
  } = useAppContext();

  const wordOrPhraseQ = useGetMapWordOrPhraseAsOrigByDefinitionIdQuery({
    variables: {
      definition_id,
      is_word_definition: definition_type === 'word',
    },
  });

  const [upsertTranslation, { data: upsertData, loading: upsertLoading }] =
    useUpsertTranslationFromWordAndDefinitionlikeStringMutation({
      refetchQueries: ['GetTranslationsByFromDefinitionId'],
    });

  useEffect(() => {
    if (upsertLoading) return;
    if (
      upsertData &&
      upsertData?.upsertTranslationFromWordAndDefinitionlikeString.error !==
        ErrorType.NoError
    ) {
      present({
        message:
          upsertData?.upsertTranslationFromWordAndDefinitionlikeString.error,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
    }
  }, [present, upsertData, upsertLoading]);

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

  const goToTranslation = useCallback(() => {
    clearTempTranslation(`${definition_id}:${definition_type}`);
    router.push(`/${nation_id}/${language_id}/1/maps/translation`);
  }, [
    language_id,
    nation_id,
    router,
    clearTempTranslation,
    definition_id,
    definition_type,
  ]);

  useEffect(() => {
    if (!tempTranslations[`${definition_id}:${definition_type}`]) {
      goToTranslation();
    }
  }, [tempTranslations, definition_id, definition_type, goToTranslation]);

  const handleUpsertTranslation = () => {
    const currentData = tempTranslations[`${definition_id}:${definition_type}`];

    if (!currentData) {
      return;
    }

    const { translation, description } = currentData;

    if (translation.trim() === '') {
      present({
        message: `${tr('New translation value is mandatory')}`,
        duration: 1500,
        position: 'top',
        color: 'warning',
      });
      return;
    }

    if (description.trim() === '') {
      present({
        message: `${tr('Translated value of definition is mandatory')}`,
        duration: 1500,
        position: 'top',
        color: 'warning',
      });
      return;
    }

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
    });

    setUpdatedTrDefinitionIds([...updatedTrDefinitionIds, definition_id]);

    clearTempTranslation(`${definition_id}:${definition_type}`);
    goToTranslation();
  };

  return (
    <>
      <Stack gap="8px">
        <Stack direction="row" gap="8px" alignItems="center">
          <InfoFill color="orange" />
          <Typography variant="h3">
            {tr('Your translation may exist!')}
          </Typography>
        </Stack>

        <Typography variant="body1" color="text.gray">
          {tr(
            'Compare translations below. Are you sure you want to duplicate the translation? ',
          )}
        </Typography>
      </Stack>

      <WordItem
        word={original.value || ''}
        description={original.definition || ''}
        viewData={tempTranslations[`${definition_id}:${definition_type}`]}
        onConfirm={() => {}}
        onDetail={() => {}}
      />

      <Typography variant="h3">{tr('Similar translation')}</Typography>

      <MapWordOrPhraseTranslationList
        definition_id={definition_id}
        definition_type={definition_type}
      />

      <Stack gap="16px">
        <Button
          variant="contained"
          color="green"
          startIcon={<AddCircle sx={{ fontSize: 24 }} />}
          onClick={handleUpsertTranslation}
        >
          {tr('Yes, add my translation')}
        </Button>
        <Button
          variant="contained"
          color="gray_stroke"
          onClick={goToTranslation}
        >
          {tr('Cancel')}
        </Button>
      </Stack>
    </>
  );
}
