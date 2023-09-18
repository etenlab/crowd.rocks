import { actions } from './global.actions';
import { type ActionType } from '.';

import { SiteTextLanguageWithTranslationInfo } from '../generated/graphql';

export interface StateType {
  langauges: {
    appLanguage: LanguageInfo;
    translationPage: {
      source: LanguageInfo | null;
      target: LanguageInfo | null;
    };
    targetLang: LanguageInfo | null;
    sourceLang: LanguageInfo | null;
  };
  siteTexts: {
    originalMap: Record<string, string>;
    translationMap: Record<string, string>;
    languages: SiteTextLanguageWithTranslationInfo[];
  };
}

export const initialState: StateType = {
  langauges: {
    appLanguage: {
      lang: {
        tag: 'en',
        descriptions: ['English'],
      },
    },
    translationPage: {
      source: null,
      target: null,
    },
    targetLang: null,
    sourceLang: null,
  },
  siteTexts: {
    originalMap: {},
    translationMap: {},
    languages: [],
  },
};

export function reducer(
  state: StateType = initialState,
  action: ActionType<unknown>,
): StateType {
  const prevState = { ...state };
  const { type } = action;

  switch (type) {
    case actions.CHANGE_APP_LANGUAGE: {
      return {
        ...prevState,
        langauges: {
          ...prevState.langauges,
          appLanguage: action.payload as LanguageInfo,
        },
      };
    }
    case actions.SET_SITE_TEXT_LANGUAGE_LIST: {
      return {
        ...prevState,
        siteTexts: {
          ...prevState.siteTexts,
          languages: action.payload as SiteTextLanguageWithTranslationInfo[],
        },
      };
    }
    case actions.SET_ORIGINAL_SITE_TEXT_MAP: {
      return {
        ...prevState,
        siteTexts: {
          ...prevState.siteTexts,
          originalMap: action.payload as Record<string, string>,
        },
      };
    }
    case actions.SET_TRANSLATION_SITE_TEXT_MAP: {
      const { translationMap } = action.payload as {
        translationMap: Record<string, string>;
      };

      return {
        ...prevState,
        siteTexts: {
          ...prevState.siteTexts,
          translationMap: translationMap,
        },
      };
    }
    case actions.CHANGE_TRANSLATION_PAGE_SOURCE_LANGAUGE: {
      return {
        ...prevState,
        langauges: {
          ...prevState.langauges,
          translationPage: {
            ...prevState.langauges.translationPage,
            source: action.payload as LanguageInfo | null,
          },
        },
      };
    }
    case actions.CHANGE_TRANSLATION_PAGE_TARGET_LANGAUGE: {
      return {
        ...prevState,
        langauges: {
          ...prevState.langauges,
          translationPage: {
            ...prevState.langauges.translationPage,
            target: action.payload as LanguageInfo | null,
          },
        },
      };
    }
    case actions.SET_CURRENT_TARGET_LANG: {
      return {
        ...prevState,
        langauges: {
          ...prevState.langauges,
          targetLang: action.payload as LanguageInfo,
        },
      };
    }
    case actions.SET_CURRENT_SOURCE_LANG: {
      return {
        ...prevState,
        langauges: {
          ...prevState.langauges,
          sourceLang: action.payload as LanguageInfo,
        },
      };
    }
    default: {
      return prevState;
    }
  }
}
