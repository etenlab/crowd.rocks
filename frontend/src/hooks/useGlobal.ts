import { useRef, type Dispatch, useCallback } from 'react';

import {
  setSiteTextLanguageList as setSiteTextLanguageListAction,
  setOriginalSiteTextMap as setOriginalSiteTextMapAction,
  setTranslationSiteTextMap as setTranslationSiteTextMapAction,
  changeAppLanguage as changeAppLanguageAction,
  changeTranslationSourceLanguage as changeTranslationSourceLanguageAction,
  changeTranslationTargetLanguage as changeTranslationTargetLanguageAction,
  setTargetLanguage as setTargetLangAction,
  setSourceLanguage as setSourceLangAction,
  setUpdatedTrDefinitionIds as setUpdatedTrDefinitionIdsAction,
  setTempTranslation as setTempTranslationAction,
  clearTempTranslation as clearTempTranslationAction,
} from '../reducers/global.actions';

import { type ActionType } from '../reducers/index';

import { SiteTextLanguageWithTranslationInfo } from '../generated/graphql';

interface UseGlobalProps {
  dispatch: Dispatch<ActionType<unknown>>;
}

export function useGlobal({ dispatch }: UseGlobalProps) {
  const dispatchRef = useRef<{ dispatch: Dispatch<ActionType<unknown>> }>({
    dispatch,
  });

  const setSiteTextLanguageList = useCallback(
    (languages: SiteTextLanguageWithTranslationInfo[]) => {
      dispatchRef.current.dispatch(setSiteTextLanguageListAction(languages));
    },
    [],
  );

  const setOriginalSiteTextMap = useCallback(
    (originalMap: Record<string, string>) => {
      dispatchRef.current.dispatch(setOriginalSiteTextMapAction(originalMap));
    },
    [],
  );

  const setTranslationSiteTextMap = useCallback(
    (langInfo: LanguageInfo, translationMapMap: Record<string, string>) => {
      dispatchRef.current.dispatch(
        setTranslationSiteTextMapAction(translationMapMap),
      );
    },
    [],
  );

  const changeAppLanguage = useCallback((langInfo: LanguageInfo) => {
    dispatchRef.current.dispatch(changeAppLanguageAction(langInfo));
  }, []);

  const changeTranslationSourceLanguage = useCallback(
    (langInfo: LanguageInfo | null) => {
      dispatchRef.current.dispatch(
        changeTranslationSourceLanguageAction(langInfo),
      );
    },
    [],
  );

  const changeTranslationTargetLanguage = useCallback(
    (langInfo: LanguageInfo | null) => {
      dispatchRef.current.dispatch(
        changeTranslationTargetLanguageAction(langInfo),
      );
    },
    [],
  );

  const setTargetLanguage = useCallback((language: LanguageInfo | null) => {
    dispatchRef.current.dispatch(setTargetLangAction(language));
  }, []);

  const setSourceLanguage = useCallback((language: LanguageInfo | null) => {
    dispatchRef.current.dispatch(setSourceLangAction(language));
  }, []);

  const setUpdatedTrDefinitionIds = useCallback(
    (definitionIds: Array<string>) => {
      dispatchRef.current.dispatch(
        setUpdatedTrDefinitionIdsAction(definitionIds),
      );
    },
    [],
  );

  const setTempTranslation = useCallback(
    (key: string, value: { translation: string; description: string }) => {
      dispatchRef.current.dispatch(setTempTranslationAction(key, value));
    },
    [],
  );

  const clearTempTranslation = useCallback((key: string) => {
    dispatchRef.current.dispatch(clearTempTranslationAction(key));
  }, []);

  return {
    setOriginalSiteTextMap,
    setTranslationSiteTextMap,
    setSiteTextLanguageList,
    changeAppLanguage,
    changeTranslationSourceLanguage,
    changeTranslationTargetLanguage,
    setSourceLanguage,
    setTargetLanguage,
    setUpdatedTrDefinitionIds,
    setTempTranslation,
    clearTempTranslation,
  };
}
