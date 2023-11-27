export const actions = {
  CHANGE_APP_LANGUAGE: 'CHANGE_APP_LANGUAGE',
  CHANGE_TRANSLATION_PAGE_SOURCE_LANGAUGE:
    'CHANGE_TRANSLATION_PAGE_SOURCE_LANGAUGE',
  CHANGE_TRANSLATION_PAGE_TARGET_LANGAUGE:
    'CHANGE_TRANSLATION_PAGE_TARGET_LANGAUGE',
  CHANGE_SITE_TEXT_STRINGS_PAGE_TARGET_LANGAUGE:
    'CHANGE_SITE_TEXT_STRINGS_PAGE_TARGET_LANGAUGE',
  SET_CURRENT_SOURCE_LANG: 'SET_CURRENT_SOURCE_LANGUAGE',
  SET_CURRENT_TARGET_LANG: 'SET_CURRENT_TARGET_LANGUAGE',
  SET_SITE_TEXT_LANGUAGE_LIST: 'SET_SITE_TEXT_LANGUAGE_LIST',
  SET_ORIGINAL_SITE_TEXT_MAP: 'SET_ORIGINAL_SITE_TEXT_MAP',
  SET_TRANSLATION_SITE_TEXT_MAP: 'SET_TRANSLATION_SITE_TEXT_MAP',
  SET_TEMP_TRANSLATION: 'SET_TEMP_TRANSLATION',
  CLEAR_TEMP_TRANSLATION: 'CLEAR_TEMP_TRANSLATION',
};

import { SiteTextLanguageWithTranslationInfo } from '../generated/graphql';

export function setOriginalSiteTextMap(originalMap: Record<string, string>) {
  return {
    type: actions.SET_ORIGINAL_SITE_TEXT_MAP,
    payload: originalMap,
  };
}

export function setTranslationSiteTextMap(
  translationMap: Record<string, string>,
) {
  return {
    type: actions.SET_TRANSLATION_SITE_TEXT_MAP,
    payload: {
      translationMap,
    },
  };
}

export function setSiteTextLanguageList(
  languages: SiteTextLanguageWithTranslationInfo[],
) {
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

export function setSourceLanguage(language: LanguageInfo | null) {
  return {
    type: actions.SET_CURRENT_SOURCE_LANG,
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

export function changeSiteTextTargetLanguage(langInfo: LanguageInfo | null) {
  return {
    type: actions.CHANGE_SITE_TEXT_STRINGS_PAGE_TARGET_LANGAUGE,
    payload: langInfo,
  };
}

export function setTempTranslation(
  key: string,
  value: { translation: string; description: string },
) {
  return {
    type: actions.SET_TEMP_TRANSLATION,
    payload: {
      key,
      value,
    },
  };
}

export function clearTempTranslation(key: string) {
  return {
    type: actions.SET_TEMP_TRANSLATION,
    payload: key,
  };
}
