import { useMemo } from 'react';
import { IonButton, useIonLoading, useIonToast } from '@ionic/react';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';

import { LangSelector } from '../../common/LangSelector/LangSelector';

import {
  FilterContainer,
  CaptionContainer,
  LanguageSelectorContainer,
} from '../../common/styled';
import { ResultBoard } from './styled';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import {
  useLanguagesForGoogleTranslateQuery,
  useTranslateAllWordsAndPhrasesByGoogleMutation,
} from '../../../generated/graphql';

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
  const [
    translateAllWordsAndPhrasesByGoogleMutation,
    { data, loading, error },
  ] = useTranslateAllWordsAndPhrasesByGoogleMutation();

  const handleTranslate = () => {
    presentLoading({
      message: `${tr('Processing')} ...`,
    });

    if (!source || !target) {
      presentToast({
        message: `${tr('Please select source and target language!')}`,
        duration: 1500,
        position: 'top',
      });

      return;
    }

    translateAllWordsAndPhrasesByGoogleMutation({
      variables: {
        from_language_code: source.lang.tag,
        from_dialect_code: source.dialect?.tag,
        from_geo_code: source.region?.tag,
        to_language_code: target.lang.tag,
        to_dialect_code: target.dialect?.tag,
        to_geo_code: target.region?.tag,
      },
    });
  };

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

  const result = useMemo(() => {
    if (!data || loading || error) {
      return null;
    }

    dismiss();

    return data.translateAllWordsAndPhrasesByGoogle.result;
  }, [data, loading, error, dismiss]);

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
          />
        </LanguageSelectorContainer>
      </FilterContainer>

      <IonButton onClick={handleTranslate}>
        {tr('Translate All Words and Phrases')}
      </IonButton>

      {resultCom}
    </PageLayout>
  );
}
