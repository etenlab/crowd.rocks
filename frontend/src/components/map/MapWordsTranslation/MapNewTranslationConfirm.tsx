import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIonRouter, useIonToast } from '@ionic/react';

import { Stack, Typography, Button, CircularProgress } from '@mui/material';

import { typeOfString, StringContentTypes } from '../../../common/utility';
import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { useGetMapWordOrPhraseAsOrigByDefinitionIdQuery } from '../../../generated/graphql';
import { useQuery } from '../../../hooks/useQuery';

import { InfoFill } from '../../common/icons/InfoFill';
import { AddCircle } from '../../common/icons/AddCircle';
import { TranslatedTextItemViewer } from '../../common/TranslatedTextItem';
import { MapWordOrPhraseTranslationList } from '../MapWordOrPhraseTranslation/MapWordOrPhraseTranslationList';
import { useUpsertTranslationFromWordAndDefinitionlikeStringMutation } from '../../../hooks/useUpsertTranslationFromWordAndDefinitionlikeStringMutation';

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
  const searchParams = useQuery();
  const [saving, setSaving] = useState<boolean>(false);

  const {
    states: {
      global: {
        langauges: { targetLang },
        maps: { tempTranslations },
      },
    },
    actions: { clearTempTranslation },
  } = useAppContext();

  const wordOrPhraseQ = useGetMapWordOrPhraseAsOrigByDefinitionIdQuery({
    variables: {
      definition_id,
      is_word_definition: definition_type === 'word',
    },
  });

  const [upsertTranslation] =
    useUpsertTranslationFromWordAndDefinitionlikeStringMutation();

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

    if (searchParams.get('original_map_id')) {
      router.push(
        `/${nation_id}/${language_id}/1/maps/translation/${searchParams.get(
          'original_map_id',
        )}`,
      );
    } else {
      router.push(`/${nation_id}/${language_id}/1/maps/translation/all`);
    }
  }, [
    language_id,
    nation_id,
    router,
    clearTempTranslation,
    definition_id,
    definition_type,
    searchParams,
  ]);

  useEffect(() => {
    if (!tempTranslations[`${definition_id}:${definition_type}`]) {
      goToTranslation();
    }
  }, [tempTranslations, definition_id, definition_type, goToTranslation]);

  useEffect(() => {
    if (!saving) {
      return;
    }

    if (!targetLang) {
      setSaving(false);
      return;
    }

    (async () => {
      const currentData =
        tempTranslations[`${definition_id}:${definition_type}`];

      if (!currentData) {
        return;
      }

      const { translation, description } = currentData;

      await upsertTranslation({
        variables: {
          language_code: targetLang.lang.tag,
          dialect_code: targetLang.dialect?.tag,
          geo_code: targetLang.region?.tag,
          word_or_phrase: translation,
          definition: description,
          from_definition_id: definition_id,
          from_definition_type_is_word:
            definition_type === StringContentTypes.WORD,
          is_type_word: typeOfString(translation) === StringContentTypes.WORD,
        },
      });

      clearTempTranslation(`${definition_id}:${definition_type}`);

      setSaving(false);
      goToTranslation();
    })();
  }, [
    clearTempTranslation,
    definition_id,
    definition_type,
    goToTranslation,
    saving,
    targetLang,
    tempTranslations,
    upsertTranslation,
  ]);

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

    setSaving(true);
  };

  const viewData = tempTranslations[`${definition_id}:${definition_type}`];

  return (
    <>
      <Stack gap="8px">
        <Stack direction="row" gap="8px" alignItems="center">
          <InfoFill color="orange" />
          <Typography variant="h3">
            {tr('Your translation already exists!')}
          </Typography>
        </Stack>

        <Typography variant="body1" color="text.gray">
          {tr(
            'Compare translations below. Are you sure you want to duplicate the translation? ',
          )}
        </Typography>
      </Stack>

      {viewData ? (
        <TranslatedTextItemViewer
          original={{
            text: original.value || '',
            description: original.definition || '',
          }}
          viewData={{
            text: viewData.translation,
            description: viewData.description,
          }}
        />
      ) : null}

      <Typography variant="h3">{tr('Similar translation')}</Typography>

      <MapWordOrPhraseTranslationList
        definition_id={definition_id}
        definition_type={definition_type}
        tempTranslation={viewData?.translation}
      />

      <Stack gap="16px">
        <Button
          variant="contained"
          color="green"
          startIcon={
            saving ? (
              <CircularProgress color="inherit" size="18px" />
            ) : (
              <AddCircle sx={{ fontSize: 24 }} />
            )
          }
          onClick={handleUpsertTranslation}
          disabled={saving}
        >
          {tr('Yes, add my translation')}
        </Button>
        <Button
          variant="contained"
          color="gray_stroke"
          onClick={goToTranslation}
          disabled={saving}
        >
          {tr('Cancel')}
        </Button>
      </Stack>
    </>
  );
}
