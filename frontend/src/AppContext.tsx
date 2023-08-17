import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { useIonToast } from '@ionic/react';

import { reducer, loadPersistedStore } from './reducers/index';

import { type StateType as GlobalStateType } from './reducers/global.reducer';

import { useGlobal } from './hooks/useGlobal';

import { subTags2LangInfo } from './common/langUtils';

import {
  useGetAllRecommendedSiteTextTranslationListLazyQuery,
  useGetAllSiteTextDefinitionsLazyQuery,
  SiteTextLanguage,
  ErrorType,
} from './generated/graphql';

export interface ContextType {
  states: {
    global: GlobalStateType;
  };
  actions: {
    setSiteTextLanguageList: (languages: SiteTextLanguage[]) => void;
    setOriginalSiteTextMap: (originalMap: Record<string, string>) => void;
    setTranslationSiteTextMap: (
      langInfo: LanguageInfo,
      translationMap: Record<string, string>,
    ) => void;
    changeAppLanguage: (langInfo: LanguageInfo) => void;
    changeTranslationSourceLanguage: (langInfo: LanguageInfo | null) => void;
    changeTranslationTargetLanguage: (langInfo: LanguageInfo | null) => void;
    setTargetLanguage: (targetLanguage: LanguageInfo | null) => void;
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
    getAllRecommendedSiteTextTranslationList,
    { data, loading, error, called },
  ] = useGetAllRecommendedSiteTextTranslationListLazyQuery();
  const [
    getAllSiteTextDefinitions,
    { data: stData, error: stError, loading: stLoading, called: stCalled },
  ] = useGetAllSiteTextDefinitionsLazyQuery();

  const {
    setSiteTextLanguageList,
    setOriginalSiteTextMap,
    setTranslationSiteTextMap,
    changeAppLanguage,
    setTargetLanguage,
    changeTranslationSourceLanguage,
    changeTranslationTargetLanguage,
  } = useGlobal({
    dispatch,
  });

  useEffect(() => {
    getAllRecommendedSiteTextTranslationList({
      variables: {},
    });
    getAllSiteTextDefinitions({
      variables: {},
    });
  }, [
    getAllRecommendedSiteTextTranslationList,
    getAllSiteTextDefinitions,
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
        data.getAllRecommendedSiteTextTranslationList.error !==
        ErrorType.NoError
      ) {
        console.log(data.getAllRecommendedSiteTextTranslationList.error);
        toastPresent({
          message: data.getAllRecommendedSiteTextTranslationList.error,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });

        return;
      }

      const siteTextTranslationListByLanguageList =
        data.getAllRecommendedSiteTextTranslationList
          .site_text_translation_with_vote_list_by_language_list;

      if (!siteTextTranslationListByLanguageList) {
        return;
      }

      const siteTextLanguageList: SiteTextLanguage[] = [];

      for (const siteTextTranslationListByLanguage of siteTextTranslationListByLanguageList) {
        siteTextLanguageList.push({
          language_code: siteTextTranslationListByLanguage.language_code,
          dialect_code: siteTextTranslationListByLanguage.dialect_code,
          geo_code: siteTextTranslationListByLanguage.geo_code,
        });

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

        if (
          siteTextTranslationListByLanguage.site_text_translation_with_vote_list
        ) {
          for (const translation of siteTextTranslationListByLanguage.site_text_translation_with_vote_list) {
            if (!translation) {
              continue;
            }

            let siteText: string;
            let translatedText: string;

            switch (translation.__typename) {
              case 'SiteTextWordToWordTranslationWithVote': {
                siteText = translation.from_word_definition.word.word;
                translatedText = translation.to_word_definition.word.word;
                break;
              }
              case 'SiteTextWordToPhraseTranslationWithVote': {
                siteText = translation.from_word_definition.word.word;
                translatedText = translation.to_phrase_definition.phrase.phrase;
                break;
              }
              case 'SiteTextPhraseToWordTranslationWithVote': {
                siteText = translation.from_phrase_definition.phrase.phrase;
                translatedText = translation.to_word_definition.word.word;
                break;
              }
              case 'SiteTextPhraseToPhraseTranslationWithVote': {
                siteText = translation.from_phrase_definition.phrase.phrase;
                translatedText = translation.to_phrase_definition.phrase.phrase;
                break;
              }
            }

            translationMap[siteText!] = translatedText!;
          }
        }

        setTranslationSiteTextMap(langInfo, translationMap);
      }

      setSiteTextLanguageList(siteTextLanguageList);
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

  const value = {
    states: {
      global: state.global,
    },
    actions: {
      setSiteTextLanguageList,
      setOriginalSiteTextMap,
      setTranslationSiteTextMap,
      changeAppLanguage,
      changeTranslationSourceLanguage,
      changeTranslationTargetLanguage,
      setTargetLanguage,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
