import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { useIonToast } from '@ionic/react';

import { reducer, loadPersistedStore } from './reducers/index';

import { type StateType as GlobalStateType } from './reducers/global.reducer';

import { useGlobal } from './hooks/useGlobal';

import {
  useGetAllRecommendedTranslationLazyQuery,
  WordDefinition,
  PhraseDefinition,
  ErrorType,
} from './generated/graphql';

export interface ContextType {
  states: {
    global: GlobalStateType;
  };
  actions: {
    setSiteTextMap: (siteTextMap: Record<string, string>) => void;
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

  const [getAllRecommendedTranslation, { data, loading, error, called }] =
    useGetAllRecommendedTranslationLazyQuery();

  const {
    setSiteTextMap,
    changeAppLanguage,
    setTargetLanguage,
    changeTranslationSourceLanguage,
    changeTranslationTargetLanguage,
  } = useGlobal({
    dispatch,
  });

  useEffect(() => {
    getAllRecommendedTranslation({
      variables: {
        language_code: state.global.langauges.appLanguage.lang.tag,
        dialect_code: state.global.langauges.appLanguage.dialect?.tag,
        geo_code: state.global.langauges.appLanguage.region?.tag,
      },
    });
  }, [getAllRecommendedTranslation, state.global.langauges.appLanguage]);

  useEffect(() => {
    if (loading || !called) {
      return;
    }

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      if (data.getAllRecommendedTranslation.error !== ErrorType.NoError) {
        console.log(data.getAllRecommendedTranslation.error);
        toastPresent({
          message: data.getAllRecommendedTranslation.error,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });

        return;
      }

      const siteTextTranslationList =
        data.getAllRecommendedTranslation.site_text_translation_with_vote_list;

      const siteTextMap: Record<string, string> = {};

      for (const translation of siteTextTranslationList) {
        if (!translation) {
          continue;
        }

        let siteText: string;
        let translatedText: string;

        if (translation.from_type_is_word) {
          const fromDefinition = translation.from_definition as WordDefinition;
          siteText = fromDefinition.word.word;
        } else {
          const fromDefinition =
            translation.from_definition as PhraseDefinition;
          siteText = fromDefinition.phrase.phrase;
        }

        if (translation.to_type_is_word) {
          const toDefinition = translation.to_definition as WordDefinition;
          translatedText = toDefinition.word.word;
        } else {
          const toDefinition = translation.to_definition as PhraseDefinition;
          translatedText = toDefinition.phrase.phrase;
        }

        siteTextMap[siteText] = translatedText;
      }

      setSiteTextMap(siteTextMap);
    }
  }, [data, loading, error, called, toastPresent, setSiteTextMap]);

  const value = {
    states: {
      global: state.global,
    },
    actions: {
      setSiteTextMap,
      changeAppLanguage,
      changeTranslationSourceLanguage,
      changeTranslationTargetLanguage,
      setTargetLanguage,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
