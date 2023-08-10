import { actions } from './global.actions';
import { type ActionType } from '.';

export interface StateType {
  appLanguage: LanguageInfo;
  targetLang: LanguageInfo | null;
  siteTextMap: Record<string, string>;
}

export const initialState: StateType = {
  appLanguage: {
    lang: {
      tag: 'en',
      descriptions: ['English'],
    },
  },
  targetLang: null,
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
        appLanguage: action.payload as LanguageInfo,
      };
    }
    case actions.SET_SITE_TEXT_MAP: {
      return {
        ...prevState,
        siteTextMap: action.payload as Record<string, string>,
      };
    }
    case actions.SET_CURRENT_TARGET_LANG: {
      return {
        ...prevState,
        targetLang: action.payload as LanguageInfo,
      };
    }
    default: {
      return prevState;
    }
  }
}
