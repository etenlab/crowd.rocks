import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { useIonToast } from '@ionic/react';

import { reducer, loadPersistedStore } from './reducers/index';

import { type StateType as GlobalStateType } from './reducers/global.reducer';

import { useGlobal } from './hooks/useGlobal';

import {
  useGetAllRecommendedSiteTextTranslationLazyQuery,
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

  const [
    getAllRecommendedSiteTextTranslation,
    { data, loading, error, called },
  ] = useGetAllRecommendedSiteTextTranslationLazyQuery();

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
    getAllRecommendedSiteTextTranslation({
      variables: {
        language_code: state.global.langauges.appLanguage.lang.tag,
        dialect_code: state.global.langauges.appLanguage.dialect?.tag,
        geo_code: state.global.langauges.appLanguage.region?.tag,
      },
    });
  }, [
    getAllRecommendedSiteTextTranslation,
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
        data.getAllRecommendedSiteTextTranslation.error !== ErrorType.NoError
      ) {
        console.log(data.getAllRecommendedSiteTextTranslation.error);
        toastPresent({
          message: data.getAllRecommendedSiteTextTranslation.error,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });

        return;
      }

      const siteTextTranslationList =
        data.getAllRecommendedSiteTextTranslation
          .site_text_translation_with_vote_list;

      if (!siteTextTranslationList) {
        return;
      }

      const siteTextMap: Record<string, string> = {};

      for (const translation of siteTextTranslationList) {
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

        siteTextMap[siteText!] = translatedText!;
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
