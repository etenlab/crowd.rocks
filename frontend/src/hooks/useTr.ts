import { useCallback } from 'react';

import { useAppContext } from './useAppContext';

export function useTr() {
  const {
    states: {
      global: { siteTextMap },
    },
  } = useAppContext();

  const tr = useCallback(
    (siteText: string) => {
      if (siteText.trim() === '') {
        return '';
      }

      const allTrWordsRef: Record<string, boolean> = JSON.parse(
        localStorage.getItem('allTrWordsRef') || '{}',
      );

      if (allTrWordsRef[siteText.trim()] === undefined) {
        allTrWordsRef[siteText.trim()] = true;
      }

      localStorage.setItem('allTrWordsRef', JSON.stringify(allTrWordsRef));

      if (siteTextMap[siteText.trim()]) {
        return siteTextMap[siteText.trim()];
      }

      return siteText.trim();
    },
    [siteTextMap],
  );

  const outputAllTrWords = useCallback(() => {
    const allTrWordsRef: Record<string, boolean> = JSON.parse(
      localStorage.getItem('allTrWordsRef') || '',
    );
    console.log(allTrWordsRef);
  }, []);

  return {
    tr,
    outputAllTrWords,
  };
}
