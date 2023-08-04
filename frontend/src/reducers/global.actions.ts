export const actions = {
  CHANGE_APP_LANGUAGE: 'CHANGE_APP_LANGUAGE',
  SET_SITE_TEXT_MAP: 'SET_SITE_TEXT_MAP',
};

export function changeAppLanguage(langInfo: LanguageInfo) {
  return {
    type: actions.CHANGE_APP_LANGUAGE,
    payload: langInfo,
  };
}

export function setSiteTextMap(siteTextMap: Record<string, string>) {
  return {
    type: actions.SET_SITE_TEXT_MAP,
    payload: siteTextMap,
  };
}
