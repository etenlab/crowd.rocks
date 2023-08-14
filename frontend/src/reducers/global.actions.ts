export const actions = {
  CHANGE_APP_LANGUAGE: 'CHANGE_APP_LANGUAGE',
  CHANGE_TRANSLATION_PAGE_SOURCE_LANGAUGE:
    'CHANGE_TRANSLATION_PAGE_SOURCE_LANGAUGE',
  CHANGE_TRANSLATION_PAGE_TARGET_LANGAUGE:
    'CHANGE_TRANSLATION_PAGE_TARGET_LANGAUGE',
  SET_SITE_TEXT_MAP: 'SET_SITE_TEXT_MAP',
};

export function setSiteTextMap(siteTextMap: Record<string, string>) {
  return {
    type: actions.SET_SITE_TEXT_MAP,
    payload: siteTextMap,
  };
}

export function changeAppLanguage(langInfo: LanguageInfo) {
  return {
    type: actions.CHANGE_APP_LANGUAGE,
    payload: langInfo,
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
