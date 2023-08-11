export const actions = {
  CHANGE_APP_LANGUAGE: 'CHANGE_APP_LANGUAGE',
  SET_SITE_TEXT_MAP: 'SET_SITE_TEXT_MAP',
  SET_CURRENT_TARGET_LANG: 'SET_CURRENT_TARGET_LANGUAGE',
};

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

export function setSiteTextMap(siteTextMap: Record<string, string>) {
  return {
    type: actions.SET_SITE_TEXT_MAP,
    payload: siteTextMap,
  };
}
