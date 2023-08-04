import { useRef, type Dispatch, useCallback } from 'react';

import {
  setSiteTextMap as setSiteTextMapAction,
  changeAppLanguage as changeAppLanguageAction,
} from '../reducers/global.actions';

import { type ActionType } from '../reducers/index';

interface UseGlobalProps {
  dispatch: Dispatch<ActionType<unknown>>;
}

export function useGlobal({ dispatch }: UseGlobalProps) {
  const dispatchRef = useRef<{ dispatch: Dispatch<ActionType<unknown>> }>({
    dispatch,
  });

  const setSiteTextMap = useCallback((siteTextMap: Record<string, string>) => {
    dispatchRef.current.dispatch(setSiteTextMapAction(siteTextMap));
  }, []);

  const changeAppLanguage = useCallback((langInfo: LanguageInfo) => {
    dispatchRef.current.dispatch(changeAppLanguageAction(langInfo));
  }, []);

  return {
    setSiteTextMap,
    changeAppLanguage,
  };
}
