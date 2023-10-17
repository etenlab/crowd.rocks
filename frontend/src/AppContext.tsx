import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { useIonToast } from '@ionic/react';

import { reducer, loadPersistedStore } from './reducers/index';

import { type StateType as GlobalStateType } from './reducers/global.reducer';
import { type StateType as ComponentsStateType } from './reducers/components.reducer';

import { useGlobal } from './hooks/useGlobal';

import { subTags2LangInfo } from './common/langUtils';

import {
  useGetAllRecommendedSiteTextTranslationListByLanguageLazyQuery,
  useGetAllSiteTextDefinitionsLazyQuery,
  useGetAllSiteTextLanguageListWithRateLazyQuery,
  SiteTextLanguageWithTranslationInfo,
  ErrorType,
} from './generated/graphql';
import { useGlobalComponents } from './hooks/useGlobalComponents';

export interface ContextType {
  states: {
    global: GlobalStateType;
    components: ComponentsStateType;
  };
  actions: {
    setSiteTextLanguageList: (
      languages: SiteTextLanguageWithTranslationInfo[],
    ) => void;
    setOriginalSiteTextMap: (originalMap: Record<string, string>) => void;
    setTranslationSiteTextMap: (
      langInfo: LanguageInfo,
      translationMap: Record<string, string>,
    ) => void;
    changeAppLanguage: (langInfo: LanguageInfo) => void;
    changeTranslationSourceLanguage: (langInfo: LanguageInfo | null) => void;
    changeTranslationTargetLanguage: (langInfo: LanguageInfo | null) => void;
    setSourceLanguage: (targetLanguage: LanguageInfo | null) => void;
    setTargetLanguage: (targetLanguage: LanguageInfo | null) => void;
    setUpdatedTrDefinitionIds: (definitionIds: Array<string>) => void;
    createModal(): {
      openModal(component: ReactNode, mode?: 'standard' | 'full'): void;
      closeModal(): void;
    };
    removeModal(id: string): void;
    setTempTranslation(
      key: string,
      value: { translation: string; description: string },
    ): void;
    clearTempTranslation(key: string): void;
  };
}

export const AppContext = createContext<ContextType | undefined>(undefined);

const initialState = loadPersistedStore();

interface AppProviderProps {
  children?: ReactNode;
}

export function AppContextProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [toastPresent] = useIonToast();

  const [
    getAllRecommendedSiteTextTranslationListByLanguage,
    { data, loading, error, called },
  ] = useGetAllRecommendedSiteTextTranslationListByLanguageLazyQuery();
  const [
    getAllSiteTextDefinitions,
    { data: stData, error: stError, loading: stLoading, called: stCalled },
  ] = useGetAllSiteTextDefinitionsLazyQuery();
  const [
    getAllSiteTextLanguageListWithRate,
    { data: langData, error: langError, loading: langLoading },
  ] = useGetAllSiteTextLanguageListWithRateLazyQuery();

  const {
    setSiteTextLanguageList,
    setOriginalSiteTextMap,
    setTranslationSiteTextMap,
    changeAppLanguage,
    setSourceLanguage,
    setTargetLanguage,
    changeTranslationSourceLanguage,
    changeTranslationTargetLanguage,
    setUpdatedTrDefinitionIds,
    setTempTranslation,
    clearTempTranslation,
  } = useGlobal({
    dispatch,
  });
  const { createModal, removeModal } = useGlobalComponents({ dispatch });

  useEffect(() => {
    getAllRecommendedSiteTextTranslationListByLanguage({
      variables: {
        language_code: state.global.langauges.appLanguage.lang.tag,
        dialect_code: state.global.langauges.appLanguage.dialect?.tag || null,
        geo_code: state.global.langauges.appLanguage.region?.tag || null,
      },
    });
    getAllSiteTextDefinitions();
    getAllSiteTextLanguageListWithRate();
  }, [
    getAllRecommendedSiteTextTranslationListByLanguage,
    getAllSiteTextDefinitions,
    getAllSiteTextLanguageListWithRate,
    state.global.langauges.appLanguage,
  ]);

  useEffect(() => {
    if (loading || !called) {
      return;
    }

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      if (
        data.getAllRecommendedSiteTextTranslationListByLanguage.error !==
        ErrorType.NoError
      ) {
        console.log(
          data.getAllRecommendedSiteTextTranslationListByLanguage.error,
        );
        toastPresent({
          message:
            data.getAllRecommendedSiteTextTranslationListByLanguage.error,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });

        return;
      }

      const siteTextTranslationListByLanguage =
        data.getAllRecommendedSiteTextTranslationListByLanguage
          .translation_with_vote_list_by_language;

      const langInfo = subTags2LangInfo({
        lang: siteTextTranslationListByLanguage.language_code,
        dialect: siteTextTranslationListByLanguage.dialect_code as
          | string
          | undefined,
        region: siteTextTranslationListByLanguage.geo_code as
          | string
          | undefined,
      });

      const translationMap: Record<string, string> = {};

      if (siteTextTranslationListByLanguage.translation_with_vote_list) {
        for (const translation of siteTextTranslationListByLanguage.translation_with_vote_list) {
          if (!translation) {
            continue;
          }

          let siteText: string;
          let translatedText: string;

          switch (translation.__typename) {
            case 'WordToWordTranslationWithVote': {
              siteText = translation.from_word_definition.word.word;
              translatedText = translation.to_word_definition.word.word;
              break;
            }
            case 'WordToPhraseTranslationWithVote': {
              siteText = translation.from_word_definition.word.word;
              translatedText = translation.to_phrase_definition.phrase.phrase;
              break;
            }
            case 'PhraseToWordTranslationWithVote': {
              siteText = translation.from_phrase_definition.phrase.phrase;
              translatedText = translation.to_word_definition.word.word;
              break;
            }
            case 'PhraseToPhraseTranslationWithVote': {
              siteText = translation.from_phrase_definition.phrase.phrase;
              translatedText = translation.to_phrase_definition.phrase.phrase;
              break;
            }
          }

          if (langInfo.lang.tag === 'en') {
            translationMap[siteText!] = siteText!;
          } else {
            translationMap[siteText!] = translatedText!;
          }
        }
      }

      setTranslationSiteTextMap(langInfo, translationMap);
    }
  }, [
    data,
    loading,
    error,
    called,
    toastPresent,
    setTranslationSiteTextMap,
    setSiteTextLanguageList,
  ]);

  useEffect(() => {
    if (stLoading || !stCalled) {
      return;
    }

    if (stError) {
      console.log(stError);
      return;
    }

    if (stData) {
      if (stData.getAllSiteTextDefinitions.error !== ErrorType.NoError) {
        console.log(stData.getAllSiteTextDefinitions.error);
        toastPresent({
          message: stData.getAllSiteTextDefinitions.error,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });

        return;
      }

      const siteTextDefinitionList =
        stData.getAllSiteTextDefinitions.site_text_definition_list;

      if (!siteTextDefinitionList) {
        return;
      }

      const originalMap: Record<string, string> = {};

      for (const siteTextDefinition of siteTextDefinitionList) {
        if (!siteTextDefinition) {
          continue;
        }

        switch (siteTextDefinition.__typename) {
          case 'SiteTextWordDefinition': {
            const word = siteTextDefinition.word_definition.word.word;
            originalMap[word] = word;
            break;
          }
          case 'SiteTextPhraseDefinition': {
            const phrase = siteTextDefinition.phrase_definition.phrase.phrase;
            originalMap[phrase] = phrase;
            break;
          }
        }

        setOriginalSiteTextMap(originalMap);
      }
    }
  }, [
    stData,
    stLoading,
    stError,
    stCalled,
    toastPresent,
    setOriginalSiteTextMap,
  ]);

  useEffect(() => {
    if (langLoading) {
      return;
    }

    if (langError) {
      console.log(langError);
      return;
    }

    if (langData) {
      if (
        langData.getAllSiteTextLanguageListWithRate.error !== ErrorType.NoError
      ) {
        console.log(langData.getAllSiteTextLanguageListWithRate.error);
        toastPresent({
          message: langData.getAllSiteTextLanguageListWithRate.error,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });

        return;
      }

      const siteTextLanguageList: SiteTextLanguageWithTranslationInfo[] = [];

      const allSiteTextLanguageList =
        langData.getAllSiteTextLanguageListWithRate
          .site_text_language_with_translation_info_list;

      if (!allSiteTextLanguageList) {
        return;
      }

      for (const language of allSiteTextLanguageList) {
        if (!language) {
          continue;
        }

        siteTextLanguageList.push({
          language_code: language.language_code,
          dialect_code: language.dialect_code,
          geo_code: language.geo_code,
          total_count: language.total_count,
          translated_count: language.translated_count,
        });

        setSiteTextLanguageList(siteTextLanguageList);
      }
    }
  }, [toastPresent, langLoading, langError, langData, setSiteTextLanguageList]);

  const value = {
    states: {
      global: state.global,
      components: state.components,
    },
    actions: {
      setSiteTextLanguageList,
      setOriginalSiteTextMap,
      setTranslationSiteTextMap,
      changeAppLanguage,
      changeTranslationSourceLanguage,
      changeTranslationTargetLanguage,
      setSourceLanguage,
      setTargetLanguage,
      setUpdatedTrDefinitionIds,
      createModal,
      removeModal,
      setTempTranslation,
      clearTempTranslation,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
