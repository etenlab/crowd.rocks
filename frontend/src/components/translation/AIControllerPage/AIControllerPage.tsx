import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import {
  IonButton,
  useIonLoading,
  useIonToast,
  IonSpinner,
  IonToggle,
  IonLabel,
  IonTitle,
} from '@ionic/react';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';

import { LangSelector } from '../../common/LangSelector/LangSelector';

import {
  ResultBoard,
  LoadingBoard,
  Stack,
  LanguageSectionContainer,
  LanguageSelectorContainer,
  AIContainer,
  AIActionsContainer,
} from './styled';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import {
  useTranslateWordsAndPhrasesByGoogleMutation,
  useTranslateAllWordsAndPhrasesByGoogleMutation,
  useSubscribeToTranslationReportSubscription,
  TranslateAllWordsAndPhrasesByBotResult,
  useMapsReTranslateMutation,
  useGetTranslationLanguageInfoLazyQuery,
  useTranslateWordsAndPhrasesByLiltMutation,
  useTranslateAllWordsAndPhrasesByLiltMutation,
  useTranslateMissingWordsAndPhrasesByGoogleMutation,
  useTranslateWordsAndPhrasesBySmartcatMutation,
  useTranslateAllWordsAndPhrasesBySmartcatMutation,
  BotType,
  useLanguagesForBotTranslateQuery,
  useStopBotTranslationMutation,
  useTranslateWordsAndPhrasesByDeepLMutation,
  useTranslateAllWordsAndPhrasesByDeepLMutation,
  useTranslateWordsAndPhrasesByChatGpt35Mutation,
  useTranslateWordsAndPhrasesByChatGpt4Mutation,
  useTranslateMissingWordsAndPhrasesByChatGptMutation,
  useTranslateMissingWordsAndPhrasesByDeepLMutation,
  useTranslateMissingWordsAndPhrasesBySmartcatMutation,
} from '../../../generated/graphql';

import { langInfo2String, langInfo2tag } from '../../../../../utils/dist';

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

export function AIControllerPage() {
  const { tr } = useTr();
  const [presentToast] = useIonToast();
  const [presentLoading, dismiss] = useIonLoading();
  const [selectTarget, setSelectTarget] = useState<boolean>(true);

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
    data: languagesGData,
    error: languagesGError,
    loading: languagesGLoading,
  } = useLanguagesForBotTranslateQuery({
    variables: { botType: BotType.Google },
  });
  const {
    data: languagesLData,
    error: languagesLError,
    loading: languagesLLoading,
  } = useLanguagesForBotTranslateQuery({
    variables: { botType: BotType.Lilt },
  });
  const {
    data: languagesScData,
    error: languagesScError,
    loading: languagesScLoading,
  } = useLanguagesForBotTranslateQuery({
    variables: { botType: BotType.Smartcat },
  });
  const {
    data: languagesDLData,
    error: languagesDLError,
    loading: languagesDLLoading,
  } = useLanguagesForBotTranslateQuery({
    variables: { botType: BotType.DeepL },
  });

  //google
  const [translateWordsAndPhrasesByGoogle] =
    useTranslateWordsAndPhrasesByGoogleMutation();

  const [translateMissingWordsAndPhrasesByGoogle] =
    useTranslateMissingWordsAndPhrasesByGoogleMutation();

  const [translateAllWordsAndPhrasesByGoogle] =
    useTranslateAllWordsAndPhrasesByGoogleMutation();

  //lilt
  const [translateWordsAndPhrasesByLilt] =
    useTranslateWordsAndPhrasesByLiltMutation();

  const [translateAllWordsAndPhrasesByLilt] =
    useTranslateAllWordsAndPhrasesByLiltMutation();

  //smartcat
  const [translateWordsAndPhrasesBySmartcat] =
    useTranslateWordsAndPhrasesBySmartcatMutation();

  const [translateAllWordsAndPhrasesBySmartcat] =
    useTranslateAllWordsAndPhrasesBySmartcatMutation();

  const [translateMissingWordsAndPhrasesBySC] =
    useTranslateMissingWordsAndPhrasesBySmartcatMutation();

  //deepL
  const [translateWordsAndPhrasesByDeepL] =
    useTranslateWordsAndPhrasesByDeepLMutation();

  const [translateAllWordsAndPhrasesByDeepL] =
    useTranslateAllWordsAndPhrasesByDeepLMutation();

  const [translateMissingWordsAndPhrasesByDeepL] =
    useTranslateMissingWordsAndPhrasesByDeepLMutation();

  //chatgpt
  const [translateWordsAndPhrasesByChatGpt35] =
    useTranslateWordsAndPhrasesByChatGpt35Mutation();

  const [translateWordsAndPhrasesByChatGpt4] =
    useTranslateWordsAndPhrasesByChatGpt4Mutation();

  const [translateMissingWordsAndPhrasesByGpt] =
    useTranslateMissingWordsAndPhrasesByChatGptMutation();

  //

  const { data: translationResult } =
    useSubscribeToTranslationReportSubscription();

  const [getLangInfo, { data: languageData }] =
    useGetTranslationLanguageInfoLazyQuery();

  const [mapsReTranslate] = useMapsReTranslateMutation();
  const [stopBotTranslation] = useStopBotTranslationMutation();

  const batchTranslatingRef = useRef<boolean>(false);
  const [batchTranslating, setBatchTranslating] = useState<boolean>(false);
  const [batchStatus, setBatchStatus] = useState<{
    completed: number;
    total: number;
    message: string;
  } | null>(null);
  const [result, setResult] =
    useState<TranslateAllWordsAndPhrasesByBotResult | null>(null);
  const [isStopPressed, setIsStopPressed] = useState<boolean>(false);

  useEffect(() => {
    if (source) {
      getLangInfo({
        variables: {
          from_language_code: source.lang.tag,
          to_language_code: target?.lang.tag,
        },
      });
    }
    return;
  }, [getLangInfo, source, target?.lang.tag]);

  useEffect(() => {
    console.log('subscriber translationResult', translationResult);
    if (translationResult && translationResult.TranslationReport) {
      const report = translationResult.TranslationReport;

      if (report.message) {
        setBatchStatus({
          completed: report.completed || 0,
          total: report.total || 0,
          message: report.message || '',
        });
      }

      if (report.status !== 'Progressing') {
        setBatchStatus(null);
        setBatchTranslating(false);
        batchTranslatingRef.current = false;
      } else {
        setBatchTranslating(true);
        setIsStopPressed(false);
        batchTranslatingRef.current = true;
      }

      setResult(report);
    }
  }, [translationResult, translationResult?.TranslationReport]);

  const enabledTags = useMemo(() => {
    const langs =
      !languagesGError &&
      !languagesGLoading &&
      languagesGData &&
      languagesGData.languagesForBotTranslate.languages
        ? languagesGData.languagesForBotTranslate.languages.map(
            (language) => language.code,
          )
        : [];

    if (
      !languagesLError &&
      !languagesLLoading &&
      languagesLData &&
      languagesLData.languagesForBotTranslate.languages
    ) {
      languagesLData.languagesForBotTranslate.languages.forEach((l) => {
        if (!langs.includes(l.code)) {
          langs.push(l.code);
        }
      });
    }
    if (
      !languagesScError &&
      !languagesScLoading &&
      languagesScData &&
      languagesScData.languagesForBotTranslate.languages
    ) {
      languagesScData.languagesForBotTranslate.languages.forEach((l) => {
        if (!langs.includes(l.code)) {
          langs.push(l.code);
        }
      });
    }
    if (
      !languagesDLError &&
      !languagesDLLoading &&
      languagesDLData &&
      languagesDLData.languagesForBotTranslate.languages
    ) {
      languagesDLData.languagesForBotTranslate.languages.forEach((l) => {
        if (!langs.includes(l.code)) {
          langs.push(l.code);
        }
      });
    }

    return langs;
  }, [
    languagesGError,
    languagesGLoading,
    languagesGData,
    languagesLError,
    languagesLLoading,
    languagesLData,
    languagesScError,
    languagesScLoading,
    languagesScData,
    languagesDLError,
    languagesDLLoading,
    languagesDLData,
  ]);

  // GOOGLE
  const handleTranslateG = async () => {
    if (!source) {
      presentToast({
        message: `${tr('Please select source language!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }

    if (!selectTarget) {
      handleTranslateToAllLangsG();
      return;
    }

    if (!target) {
      presentToast({
        message: `${tr('Please select target language or unselect target!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
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

    const { data } = await translateWordsAndPhrasesByGoogle({
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

    if (data && data.translateWordsAndPhrasesByGoogle.result) {
      setResult(data.translateWordsAndPhrasesByGoogle.result);
      await mapsReTranslate({
        variables: { forLangTag: langInfo2tag(target) },
      });
    }
  };

  const handleTranslateMissingG = async () => {
    if (!source) {
      presentToast({
        message: `${tr('Please select source language!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }

    if (!selectTarget) {
      handleTranslateToAllLangsG();
      return;
    }

    if (!target) {
      presentToast({
        message: `${tr('Please select target language or unselect target!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
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

    const { data } = await translateMissingWordsAndPhrasesByGoogle({
      variables: {
        from_language_code: source.lang.tag,
        to_language_code: target.lang.tag,
      },
    });

    dismiss();

    if (data && data.translateMissingWordsAndPhrasesByGoogle.result) {
      setResult(data.translateMissingWordsAndPhrasesByGoogle.result);
      await mapsReTranslate({
        variables: { forLangTag: langInfo2tag(target) },
      });
    }
  };

  const handleTranslateToAllLangsG = useCallback(async () => {
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

    translateAllWordsAndPhrasesByGoogle({
      variables: {
        from_language_code: source.lang.tag,
        from_dialect_code: source.dialect?.tag,
        from_geo_code: source.region?.tag,
      },
    });
  }, [presentToast, source, tr, translateAllWordsAndPhrasesByGoogle]);

  // ChatGPT3.5
  const handleTranslateChatGpt3 = async () => {
    if (!source) {
      presentToast({
        message: `${tr('Please select source language!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }

    if (!selectTarget) {
      // handleTranslateToAllLangsG();   //later
      return;
    }

    if (!target) {
      presentToast({
        message: `${tr('Please select target language or unselect target!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
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

    const { data } = await translateWordsAndPhrasesByChatGpt35({
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

    if (data && data.translateWordsAndPhrasesByChatGPT35.result) {
      setResult(data.translateWordsAndPhrasesByChatGPT35.result);
      await mapsReTranslate({
        variables: { forLangTag: langInfo2tag(target) },
      });
    }
  };

  const handleTranslateMissingChatGpt3 = async () => {
    if (!source) {
      presentToast({
        message: `${tr('Please select source language!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }

    if (!selectTarget) {
      //handleTranslateToAllLangsG(); //later
      return;
    }

    if (!target) {
      presentToast({
        message: `${tr('Please select target language or unselect target!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
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

    const { data } = await translateMissingWordsAndPhrasesByGpt({
      variables: {
        from_language_code: source.lang.tag,
        to_language_code: target.lang.tag,
        version: 'gpt-3.5-turbo',
      },
    });

    dismiss();

    if (data && data.translateMissingWordsAndPhrasesByChatGpt.result) {
      setResult(data.translateMissingWordsAndPhrasesByChatGpt.result);
      await mapsReTranslate({
        variables: { forLangTag: langInfo2tag(target) },
      });
    }
  };

  //ChatGPT 4
  const handleTranslateChatGpt4 = async () => {
    if (!source) {
      presentToast({
        message: `${tr('Please select source language!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }

    if (!selectTarget) {
      // handleTranslateToAllLangsG();   //later
      return;
    }

    if (!target) {
      presentToast({
        message: `${tr('Please select target language or unselect target!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
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

    const { data } = await translateWordsAndPhrasesByChatGpt4({
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

    if (data && data.translateWordsAndPhrasesByChatGPT4.result) {
      setResult(data.translateWordsAndPhrasesByChatGPT4.result);
      await mapsReTranslate({
        variables: { forLangTag: langInfo2tag(target) },
      });
    }
  };

  const handleTranslateMissingChatGpt4 = async () => {
    if (!source) {
      presentToast({
        message: `${tr('Please select source language!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }

    if (!selectTarget) {
      //handleTranslateToAllLangsG(); //later
      return;
    }

    if (!target) {
      presentToast({
        message: `${tr('Please select target language or unselect target!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
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

    const { data } = await translateMissingWordsAndPhrasesByGpt({
      variables: {
        from_language_code: source.lang.tag,
        to_language_code: target.lang.tag,
        version: 'gpt-4',
      },
    });

    dismiss();

    if (data && data.translateMissingWordsAndPhrasesByChatGpt.result) {
      setResult(data.translateMissingWordsAndPhrasesByChatGpt.result);
      await mapsReTranslate({
        variables: { forLangTag: langInfo2tag(target) },
      });
    }
  };

  // LILT
  const handleTranslateL = async () => {
    if (!source) {
      presentToast({
        message: `${tr('Please select source language!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }

    if (!selectTarget) {
      handleTranslateToAllLangsL();
      return;
    }

    if (!target) {
      presentToast({
        message: `${tr('Please select target language or unselect target!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
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

    const { data } = await translateWordsAndPhrasesByLilt({
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

    if (data && data.translateWordsAndPhrasesByLilt.result) {
      setResult(data.translateWordsAndPhrasesByLilt.result);
      await mapsReTranslate({
        variables: { forLangTag: langInfo2tag(target) },
      });
    }
  };

  const handleTranslateToAllLangsL = useCallback(async () => {
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

    translateAllWordsAndPhrasesByLilt({
      variables: {
        from_language_code: source.lang.tag,
        from_dialect_code: source.dialect?.tag,
        from_geo_code: source.region?.tag,
      },
    });
  }, [presentToast, source, tr, translateAllWordsAndPhrasesByLilt]);

  // SMARTCAT
  const handleTranslateSC = async () => {
    if (!source) {
      presentToast({
        message: `${tr('Please select source language!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }

    if (!selectTarget) {
      handleTranslateToAllLangsSC();
      return;
    }

    if (!target) {
      presentToast({
        message: `${tr('Please select target language or unselect target!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
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

    const { data } = await translateWordsAndPhrasesBySmartcat({
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

    if (data && data.translateWordsAndPhrasesBySmartcat.result) {
      setResult(data.translateWordsAndPhrasesBySmartcat.result);
      await mapsReTranslate({
        variables: { forLangTag: langInfo2tag(target) },
      });
    }
  };

  const handleTranslateToAllLangsSC = useCallback(async () => {
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

    translateAllWordsAndPhrasesBySmartcat({
      variables: {
        from_language_code: source.lang.tag,
        from_dialect_code: source.dialect?.tag,
        from_geo_code: source.region?.tag,
      },
    });
  }, [presentToast, source, tr, translateAllWordsAndPhrasesBySmartcat]);

  const handleTranslateMissingSC = async () => {
    if (!source) {
      presentToast({
        message: `${tr('Please select source language!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }

    if (!selectTarget) {
      handleTranslateToAllLangsDL();
      return;
    }

    if (!target) {
      presentToast({
        message: `${tr('Please select target language or unselect target!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
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

    const { data } = await translateMissingWordsAndPhrasesBySC({
      variables: {
        from_language_code: source.lang.tag,
        to_language_code: target.lang.tag,
      },
    });

    dismiss();

    if (data && data.translateMissingWordsAndPhrasesBySmartcat.result) {
      setResult(data.translateMissingWordsAndPhrasesBySmartcat.result);
      await mapsReTranslate({
        variables: { forLangTag: langInfo2tag(target) },
      });
    }
  };

  // DeepL
  const handleTranslateDL = async () => {
    if (!source) {
      presentToast({
        message: `${tr('Please select source language!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }

    if (!selectTarget) {
      handleTranslateToAllLangsDL();
      return;
    }

    if (!target) {
      presentToast({
        message: `${tr('Please select target language or unselect target!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
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

    const { data } = await translateWordsAndPhrasesByDeepL({
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

    if (data && data.translateWordsAndPhrasesByDeepL.result) {
      setResult(data.translateWordsAndPhrasesByDeepL.result);
      await mapsReTranslate({
        variables: { forLangTag: langInfo2tag(target) },
      });
    }
  };

  const handleTranslateToAllLangsDL = useCallback(async () => {
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

    translateAllWordsAndPhrasesByDeepL({
      variables: {
        from_language_code: source.lang.tag,
        from_dialect_code: source.dialect?.tag,
        from_geo_code: source.region?.tag,
      },
    });
  }, [presentToast, source, tr, translateAllWordsAndPhrasesByDeepL]);

  const handleTranslateMissingDL = async () => {
    if (!source) {
      presentToast({
        message: `${tr('Please select source language!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }

    if (!selectTarget) {
      handleTranslateToAllLangsDL();
      return;
    }

    if (!target) {
      presentToast({
        message: `${tr('Please select target language or unselect target!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
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

    const { data } = await translateMissingWordsAndPhrasesByDeepL({
      variables: {
        from_language_code: source.lang.tag,
        to_language_code: target.lang.tag,
      },
    });

    dismiss();

    if (data && data.translateMissingWordsAndPhrasesByDeepL.result) {
      setResult(data.translateMissingWordsAndPhrasesByDeepL.result);
      await mapsReTranslate({
        variables: { forLangTag: langInfo2tag(target) },
      });
    }
  };

  const handleCancelTranslateAll = async () => {
    setIsStopPressed(true);
    await stopBotTranslation();
  };

  const resultCom = result ? (
    <ResultBoard>
      <span>{tr('Requested Total Charactors')}</span> :
      <span>{result.requestedCharacters}</span>
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
            disabled={!batchTranslating || isStopPressed}
          >
            {isStopPressed ? `${tr('Canceling')}...` : tr('Cancel')}
          </IonButton>
        </Stack>

        <span>{batchStatus.message}</span>
      </LoadingBoard>
    ) : null;

  const disabled = batchTranslating;

  const AiMenu = [
    {
      handleTranslateFunc: handleTranslateG,
      handleTranslateMissingFunc: handleTranslateMissingG,
      botTitle: 'Google Translate',
      languageLabel: !selectTarget
        ? languageData?.getLanguageTranslationInfo
            .googleTranslateTotalLangCount + ' languages'
        : languagesGData &&
          languagesGData!.languagesForBotTranslate.languages?.filter(
            (scl) => scl.code === langInfo2tag(target || undefined),
          ).length + ' languages',
    },
    {
      handleTranslateFunc: handleTranslateChatGpt3,
      handleTranslateMissingFunc: handleTranslateMissingChatGpt3,
      botTitle: 'Chat GPT 3.5',
      languageLabel: !selectTarget ? '∞ languages' : '1 language', //maybe later can ask gpt 'can you translate to xyz language'
      disabledActions: disabled || !selectTarget,
    },
    {
      handleTranslateFunc: handleTranslateChatGpt4,
      handleTranslateMissingFunc: handleTranslateMissingChatGpt4,
      botTitle: 'Chat GPT 4',
      languageLabel: !selectTarget ? '∞ languages' : '1 language', //maybe later can ask gpt 'can you translate to xyz language'
      disabledActions: disabled || !selectTarget,
    },
    {
      handleTranslateFunc: handleTranslateSC,
      handleTranslateMissingFunc: handleTranslateMissingSC,
      botTitle: 'Smartcat',
      languageLabel: !selectTarget
        ? languageData?.getLanguageTranslationInfo
            .smartcatTranslateTotalLangCount + ' languages'
        : languagesScData &&
          languagesScData!.languagesForBotTranslate.languages?.filter(
            (scl) => scl.code === langInfo2tag(target || undefined),
          ).length + ' languages',
    },
    {
      handleTranslateFunc: handleTranslateDL,
      handleTranslateMissingFunc: handleTranslateMissingDL,
      botTitle: 'DeepL',
      languageLabel: !selectTarget
        ? languageData?.getLanguageTranslationInfo
            .deeplTranslateTotalLangCount + ' languages'
        : languagesDLData &&
          languagesDLData!.languagesForBotTranslate.languages?.filter(
            (scl) => scl.code === langInfo2tag(target || undefined),
          ).length + ' languages',
    },
    {
      handleTranslateFunc: handleTranslateL,
      handleTranslateMissingFunc: null,
      botTitle: 'Lilt',
      languageLabel: !selectTarget
        ? languageData?.getLanguageTranslationInfo.liltTranslateTotalLangCount +
          ' languages'
        : languagesLData &&
          languagesLData!.languagesForBotTranslate.languages?.filter(
            (scl) => scl.code === langInfo2tag(target || undefined),
          ).length + ' languages',
      disabledActions: true,
    },
  ];

  return (
    <PageLayout>
      <Caption>{tr('AI Controller')}</Caption>

      <LanguageSectionContainer>
        <LanguageSelectorContainer>
          <IonLabel>Source</IonLabel>
          <LangSelector
            title={tr('Source language')}
            selected={source as LanguageInfo}
            onChange={(_sourceLangTag, sourceLangInfo) => {
              changeTranslationSourceLanguage(sourceLangInfo);
            }}
            onClearClick={() => changeTranslationSourceLanguage(null)}
            enabledTags={enabledTags}
            disabled={disabled}
          />
          <br />
          <IonLabel>
            Words: {languageData?.getLanguageTranslationInfo.totalWordCount}
          </IonLabel>
          <IonLabel>
            Phrases: {languageData?.getLanguageTranslationInfo.totalPhraseCount}
          </IonLabel>
        </LanguageSelectorContainer>
        <LanguageSelectorContainer>
          <div>
            <IonLabel>Target</IonLabel>
            <IonToggle
              checked={selectTarget}
              onIonChange={() => setSelectTarget(!selectTarget)}
              style={{ marginLeft: '10px' }}
            />
          </div>
          <LangSelector
            title={tr('Target language')}
            selected={target as LanguageInfo}
            onChange={(_targetLangTag, targetLanguageInfo) => {
              changeTranslationTargetLanguage(targetLanguageInfo);
            }}
            onClearClick={() => changeTranslationTargetLanguage(null)}
            enabledTags={enabledTags}
            disabled={!selectTarget || batchTranslating}
          />
          <br />
          <IonLabel>
            Missing Words:{' '}
            {selectTarget
              ? languageData?.getLanguageTranslationInfo
                  .translatedMissingWordCount
              : '?'}
          </IonLabel>
          <IonLabel>
            Missing Phrases:{' '}
            {selectTarget
              ? languageData?.getLanguageTranslationInfo
                  .translatedMissingPhraseCount
              : '?'}
          </IonLabel>
        </LanguageSelectorContainer>
      </LanguageSectionContainer>

      <br />

      {AiMenu.map((item) => (
        <AIContainer key={item.botTitle}>
          <div style={{ display: 'flex' }}>
            <IonTitle>{item.botTitle}</IonTitle>
            <IonLabel>{item.languageLabel}</IonLabel>
          </div>

          <AIActionsContainer>
            <IonButton
              onClick={() => item.handleTranslateFunc()}
              disabled={item.disabledActions ? item.disabledActions : disabled}
            >
              {tr('Translate All')}
            </IonButton>
            {item.handleTranslateMissingFunc && (
              <IonButton
                onClick={() => item.handleTranslateMissingFunc()}
                disabled={
                  item.disabledActions ? item.disabledActions : disabled
                }
              >
                {tr('Translate Missing')}
              </IonButton>
            )}
          </AIActionsContainer>
          <hr />
        </AIContainer>
      ))}

      {loadingCom}

      {resultCom}
    </PageLayout>
  );
}
