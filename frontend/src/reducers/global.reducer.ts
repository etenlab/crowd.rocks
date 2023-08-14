import { actions } from './global.actions';
import { type ActionType } from '.';

export interface StateType {
  langauges: {
    appLanguage: LanguageInfo;
    translationPage: {
      source: LanguageInfo | null;
      target: LanguageInfo | null;
    };
  };
  siteTextMap: Record<string, string>;
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
  },
  siteTextMap: {},
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
    case actions.SET_SITE_TEXT_MAP: {
      return {
        ...prevState,
        siteTextMap: action.payload as Record<string, string>,
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
    default: {
      return prevState;
    }
  }
}
