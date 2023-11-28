import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useIonToast } from '@ionic/react';

import { Stack, Typography, Button, CircularProgress } from '@mui/material';

import { typeOfString, StringContentTypes } from '../../../common/utility';
import { tag2langInfo } from '../../../../../utils';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { useUpsertTranslationFromWordAndDefinitionlikeStringMutation } from '../../../hooks/useUpsertTranslationFromWordAndDefinitionlikeStringMutation';

import {
  ErrorType,
  useWordDefinitionReadLazyQuery,
  usePhraseDefinitionReadLazyQuery,
} from '../../../generated/graphql';
import { useQuery } from '../../../hooks/useQuery';

import { PageLayout } from '../../common/PageLayout';
import { InfoFill } from '../../common/icons/InfoFill';
import { AddCircle } from '../../common/icons/AddCircle';
import { TranslatedTextItemViewer } from '../../common/TranslatedTextItem';
import { TranslationList } from './TranslantionList';

export function NewTranslationConfirmPage() {
  const { tr } = useTr();
  const history = useHistory();
  const [present] = useIonToast();
  const { lang_full_tag, definition_id, definition_type } = useParams<{
    definition_id: string;
    lang_full_tag: string;
    definition_type: string;
  }>();
  const searchParams = useQuery();
  const [saving, setSaving] = useState<boolean>(false);

  const {
    states: {
      global: {
        maps: { tempTranslations },
      },
    },
    actions: { clearTempTranslation },
  } = useAppContext();

  const targetLang = useMemo(
    () => tag2langInfo(lang_full_tag),
    [lang_full_tag],
  );

  const [wordOrPhrase, setWordOrPhrase] = useState<{
    wordOrPhrase: string;
    definition: string;
  } | null>(null);

  const [readWordDefinition] = useWordDefinitionReadLazyQuery();
  const [readPhraseDefinition] = usePhraseDefinitionReadLazyQuery();

  const [upsertTranslation] =
    useUpsertTranslationFromWordAndDefinitionlikeStringMutation();

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

  useEffect(() => {
    if (!tempTranslations[`${definition_id}:${definition_type}`]) {
      handleBackClick();
    }
  }, [tempTranslations, definition_id, definition_type, handleBackClick]);

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
      handleBackClick();
    })();
  }, [
    clearTempTranslation,
    definition_id,
    definition_type,
    handleBackClick,
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
    <PageLayout>
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
            text: wordOrPhrase?.wordOrPhrase || '',
            description: wordOrPhrase?.definition || '',
          }}
          viewData={{
            text: viewData.translation,
            description: viewData.description,
          }}
        />
      ) : null}

      <Typography variant="h3">{tr('Similar translation')}</Typography>

      <TranslationList
        targetLang={targetLang}
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
          onClick={handleBackClick}
          disabled={saving}
        >
          {tr('Cancel')}
        </Button>
      </Stack>
    </PageLayout>
  );
}
