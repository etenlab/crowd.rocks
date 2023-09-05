import { useCallback, useRef } from 'react';

import { useAppContext } from './useAppContext';
import { langInfo2String } from '../common/langUtils';

import { useSiteTextUpsertMutation } from '../generated/graphql';

import { globals } from '../services/globals';

export function useTr() {
  const {
    states: {
      global: {
        siteTexts: { originalMap, translationMap },
        langauges: { appLanguage },
      },
    },
  } = useAppContext();

  const [siteTextUpsert] = useSiteTextUpsertMutation();

  const newSiteTextsRef = useRef<Record<string, string>>({});

  const tr = useCallback(
    (siteText: string) => {
      if (siteText.trim() === '') {
        return '';
      }

      if (
        originalMap[siteText.trim()] === undefined &&
        newSiteTextsRef.current[siteText.trim()] === undefined &&
        globals.get_user_id() !== null
      ) {
        newSiteTextsRef.current[siteText.trim()] = siteText.trim();
        siteTextUpsert({
          variables: {
            siteTextlike_string: siteText.trim(),
            definitionlike_string: 'Site User Interface Text',
            language_code: 'en',
            dialect_code: null,
            geo_code: null,
          },
        });
      }

      if (
        translationMap[langInfo2String(appLanguage)] &&
        translationMap[langInfo2String(appLanguage)][siteText.trim()]
      ) {
        return translationMap[langInfo2String(appLanguage)][siteText.trim()];
      }

      return siteText.trim();
    },
    [translationMap, originalMap, appLanguage, siteTextUpsert],
  );

  return {
    tr,
  };
}
