import { useMemo, useState, useRef } from 'react';
import {
  IonButton,
  useIonLoading,
  useIonToast,
  IonSpinner,
} from '@ionic/react';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';

import { LangSelector } from '../../common/LangSelector/LangSelector';

import {
  FilterContainer,
  CaptionContainer,
  LanguageSelectorContainer,
} from '../../common/styled';
import { ResultBoard, LoadingBoard, Stack } from './styled';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import {
  useLanguagesForGoogleTranslateQuery,
  useTranslateAllWordsAndPhrasesByGoogleMutation,
  TranslateAllWordsAndPhrasesByGoogleResult,
} from '../../../generated/graphql';

import {
  langInfo2String,
  subTags2LangInfo,
  getLangsRegistry,
} from '../../../common/langUtils';

function messageHTML({
  total,
  completed,
  message,
}: {
  total: number;
  completed: number;
  message: string;
}) {
  return `
    <div>
      <h5>${total} / ${completed}</h5>
      <span>${message}</span>
    </div>
  `;
}

export function GoogleTranslationPage() {
  const { tr } = useTr();
  const [presentToast] = useIonToast();
  const [presentLoading, dismiss] = useIonLoading();

  const {
    states: {
      global: {
        langauges: {
          translationPage: { source, target },
        },
      },
    },
    actions: {
      changeTranslationSourceLanguage,
      changeTranslationTargetLanguage,
    },
  } = useAppContext();

  const {
    data: languagesData,
    error: languagesError,
    loading: languagesLoading,
  } = useLanguagesForGoogleTranslateQuery();
  const [translateAllWordsAndPhrasesByGoogleMutation] =
    useTranslateAllWordsAndPhrasesByGoogleMutation();

  const batchTranslatingRef = useRef<boolean>(false);
  const [batchTranslating, setBatchTranslating] = useState<boolean>(false);
  const [batchStatus, setBatchStatus] = useState<{
    completed: number;
    total: number;
    message: string;
  } | null>(null);
  const [result, setResult] =
    useState<TranslateAllWordsAndPhrasesByGoogleResult | null>(null);

  const enabledTags = useMemo(() => {
    return !languagesError &&
      !languagesLoading &&
      languagesData &&
      languagesData.languagesForGoogleTranslate.languages
      ? languagesData.languagesForGoogleTranslate.languages.map(
          (language) => language.code,
        )
      : [];
  }, [languagesError, languagesLoading, languagesData]);

  const handleTranslate = async () => {
    if (!source || !target) {
      presentToast({
        message: `${tr('Please select source and target language!')}`,
        duration: 1500,
        position: 'top',
      });

      return;
    }

    presentLoading({
      message: messageHTML({
        total: 1,
        completed: 0,
        message: `${tr('Translate')} ${langInfo2String(source)} ${tr(
          'into',
        )} ${langInfo2String(target)} ...`,
      }),
    });

    const { data } = await translateAllWordsAndPhrasesByGoogleMutation({
      variables: {
        from_language_code: source.lang.tag,
        from_dialect_code: source.dialect?.tag,
        from_geo_code: source.region?.tag,
        to_language_code: target.lang.tag,
        to_dialect_code: target.dialect?.tag,
        to_geo_code: target.region?.tag,
      },
    });

    dismiss();
    setResult(
      data && data.translateAllWordsAndPhrasesByGoogle.result
        ? data.translateAllWordsAndPhrasesByGoogle.result
        : null,
    );
  };

  const handleTranslateAll = async () => {
    if (!source) {
      presentToast({
        message: `${tr('Please select source language!')}`,
        duration: 1500,
        position: 'top',
      });

      return;
    }

    setBatchTranslating(true);
    batchTranslatingRef.current = true;

    const { langs } = await getLangsRegistry(enabledTags);
    let completed = 0;
    const sumOfResult: TranslateAllWordsAndPhrasesByGoogleResult = {
      __typename: 'TranslateAllWordsAndPhrasesByGoogleResult',
      requestedCharactors: 0,
      totalWordCount: 0,
      totalPhraseCount: 0,
      translatedPhraseCount: 0,
      translatedWordCount: 0,
    };

    for (const lang of langs) {
      if (!batchTranslatingRef.current) {
        break;
      }

      setBatchStatus({
        total: langs.length,
        completed: completed,
        message: `${tr(
          `Translate ${langInfo2String(source)} into ${langInfo2String(
            subTags2LangInfo({ lang: lang.tag }),
          )}`,
        )} ...`,
      });

      const { data } = await translateAllWordsAndPhrasesByGoogleMutation({
        variables: {
          from_language_code: source.lang.tag,
          from_dialect_code: source.dialect?.tag,
          from_geo_code: source.region?.tag,
          to_language_code: lang.tag,
          to_dialect_code: null,
          to_geo_code: null,
        },
      });

      if (data && data.translateAllWordsAndPhrasesByGoogle.result) {
        const t = data.translateAllWordsAndPhrasesByGoogle.result;
        sumOfResult.requestedCharactors += t.requestedCharactors;
        sumOfResult.totalWordCount += t.totalWordCount;
        sumOfResult.totalPhraseCount += t.totalPhraseCount;
        sumOfResult.translatedPhraseCount += t.translatedPhraseCount;
        sumOfResult.translatedWordCount += t.translatedWordCount;
      }

      completed++;
    }

    setBatchStatus({
      total: langs.length,
      completed: completed,
      message: `${tr(langs.length === completed ? 'Done' : 'Interrupted')}`,
    });
    setBatchTranslating(false);
    setResult(sumOfResult);
  };

  const handleCancelTranslateAll = () => {
    setBatchTranslating(false);
    batchTranslatingRef.current = false;
  };

  const resultCom = result ? (
    <ResultBoard>
      <span>{tr('Requested Total Charactors')}</span> :
      <span>{result.requestedCharactors}</span>
      <br />
      <span>{tr('Total Words')}</span> :<span>{result.totalWordCount}</span>
      <br />
      <span>{tr('Total Translation for Words')}</span> :
      <span>{result.translatedWordCount}</span>
      <br />
      <span>{tr('Total Phrases')}</span> :<span>{result.totalPhraseCount}</span>
      <br />
      <span>{tr('Total Translation for Phrases')}</span> :
      <span>{result.totalPhraseCount}</span>
      <br />
    </ResultBoard>
  ) : null;

  const loadingCom =
    batchTranslating && batchStatus ? (
      <LoadingBoard>
        <Stack>
          {batchTranslating ? <IonSpinner name="bubbles" /> : null}
          <h5>
            {tr('Progress')} : {batchStatus.completed} / {batchStatus.total}
          </h5>
          <IonButton
            color="danger"
            onClick={handleCancelTranslateAll}
            disabled={!batchTranslating}
          >
            {tr('Cancel')}
          </IonButton>
        </Stack>

        <span>{batchStatus.message}</span>
      </LoadingBoard>
    ) : null;

  const disabled = batchTranslating;

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption>{tr('Google Translation')}</Caption>
      </CaptionContainer>

      <FilterContainer>
        <LanguageSelectorContainer>
          <LangSelector
            title={tr('Source language')}
            langSelectorId="translation-g-source-langSelector"
            selected={source as LanguageInfo | undefined}
            onChange={(_sourceLangTag, sourceLangInfo) => {
              changeTranslationSourceLanguage(sourceLangInfo);
            }}
            onClearClick={() => changeTranslationSourceLanguage(null)}
            enabledTags={enabledTags}
            disabled={disabled}
          />

          <LangSelector
            title={tr('Target language')}
            langSelectorId="translation-g-target-langSelector"
            selected={target as LanguageInfo | undefined}
            onChange={(_targetLangTag, targetLanguageInfo) => {
              changeTranslationTargetLanguage(targetLanguageInfo);
            }}
            onClearClick={() => changeTranslationTargetLanguage(null)}
            enabledTags={enabledTags}
            disabled={disabled}
          />
        </LanguageSelectorContainer>
      </FilterContainer>

      <IonButton onClick={handleTranslate} disabled={disabled}>
        {tr('Translate All Words and Phrases')}
      </IonButton>

      <IonButton
        color="warning"
        onClick={handleTranslateAll}
        disabled={disabled}
      >
        {tr('Translate All Words and Phrases')}
      </IonButton>

      {loadingCom}

      {resultCom}
    </PageLayout>
  );
}
