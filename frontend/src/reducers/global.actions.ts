export const actions = {
  CHANGE_APP_LANGUAGE: 'CHANGE_APP_LANGUAGE',
  CHANGE_TRANSLATION_PAGE_SOURCE_LANGAUGE:
    'CHANGE_TRANSLATION_PAGE_SOURCE_LANGAUGE',
  CHANGE_TRANSLATION_PAGE_TARGET_LANGAUGE:
    'CHANGE_TRANSLATION_PAGE_TARGET_LANGAUGE',
  SET_CURRENT_TARGET_LANG: 'SET_CURRENT_TARGET_LANGUAGE',
  SET_SITE_TEXT_LANGUAGE_LIST: 'SET_SITE_TEXT_LANGUAGE_LIST',
  SET_ORIGINAL_SITE_TEXT_MAP: 'SET_ORIGINAL_SITE_TEXT_MAP',
  SET_TRANSLATION_SITE_TEXT_MAP: 'SET_TRANSLATION_SITE_TEXT_MAP',
};

import { SiteTextLanguage } from '../generated/graphql';

export function setOriginalSiteTextMap(originalMap: Record<string, string>) {
  return {
    type: actions.SET_ORIGINAL_SITE_TEXT_MAP,
    payload: originalMap,
  };
}

export function setTranslationSiteTextMap(
  languageKey: string,
  translationMap: Record<string, string>,
) {
  return {
    type: actions.SET_TRANSLATION_SITE_TEXT_MAP,
    payload: {
      languageKey,
      translationMap,
    },
  };
}

export function setSiteTextLanguageList(languages: SiteTextLanguage[]) {
  return {
    type: actions.SET_SITE_TEXT_LANGUAGE_LIST,
    payload: languages,
  };
}

export function changeAppLanguage(langInfo: LanguageInfo) {
  return {
    type: actions.CHANGE_APP_LANGUAGE,
    payload: langInfo,
  };
}

export function setTargetLanguage(language: LanguageInfo | null) {
  return {
    type: actions.SET_CURRENT_TARGET_LANG,
    payload: language,
  };
}

export function changeTranslationSourceLanguage(langInfo: LanguageInfo | null) {
  return {
    type: actions.CHANGE_TRANSLATION_PAGE_SOURCE_LANGAUGE,
    payload: langInfo,
  };
}

export function changeTranslationTargetLanguage(langInfo: LanguageInfo | null) {
  return {
    type: actions.CHANGE_TRANSLATION_PAGE_TARGET_LANGAUGE,
    payload: langInfo,
  };
}
