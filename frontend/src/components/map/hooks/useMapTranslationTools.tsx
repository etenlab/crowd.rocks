import { useCallback } from 'react';
import {
  MapPhraseTranslations,
  MapPhraseWithVotes,
  MapWordTranslations,
  MapWordWithVotes,
} from '../../../generated/graphql';

export interface ITranslationsVotes {
  translations?:
    | Array<{ up_votes: string; down_votes: string }>
    | null
    | undefined;
}

export type WordOrPhraseWithVotesAndValue =
  | (MapWordWithVotes & {
      value?: string | null | undefined;
      id: string;
    })
  | (MapPhraseWithVotes & {
      value?: string | null | undefined;
      id: string;
    });

export type WordOrPhraseWithValueAndTranslations = {
  value?: string | null | undefined;
  id: string;
  translations: Array<WordOrPhraseWithVotesAndValue>;
} & (MapWordTranslations | MapPhraseTranslations);

export function useMapTranslationTools() {
  const chooseBestTranslation = useCallback(
    <T extends ITranslationsVotes>(wordTranslated: T) => {
      const res = wordTranslated?.translations?.reduce(
        (bestTr, currTr) => {
          if (bestTr?.up_votes === undefined) {
            return currTr;
          }

          const bestTrTotal =
            Number(bestTr?.up_votes || 0) - Number(bestTr?.down_votes || 0);

          const currTrTotal =
            Number(currTr?.up_votes || 0) - Number(currTr?.down_votes || 0);

          if (currTrTotal > bestTrTotal) {
            return currTr;
          }

          return bestTr;
        },
        {} as MapWordWithVotes | MapPhraseWithVotes,
      );
      return res as MapWordWithVotes | MapPhraseWithVotes;
    },
    [],
  );

  const addValueToWordsOrPhrases = useCallback(
    (wordOrPhrases: WordOrPhraseWithValueAndTranslations[] | undefined) => {
      const res: WordOrPhraseWithValueAndTranslations[] = [];
      wordOrPhrases?.forEach((wordOrPhrase) => {
        let mainValue = '';
        let id = '';
        if (wordOrPhrase.__typename === 'MapWordTranslations') {
          mainValue = wordOrPhrase.word;
          id = wordOrPhrase.word_id;
        } else if (wordOrPhrase.__typename === 'MapPhraseTranslations') {
          mainValue = wordOrPhrase.phrase;
          id = wordOrPhrase.phrase_id;
        }

        if (wordOrPhrase?.translations) {
          wordOrPhrase?.translations.forEach((tr, i) => {
            if (tr.__typename === 'MapWordWithVotes') {
              wordOrPhrase.translations[i] = {
                ...tr,
                value: tr.word || '',
                id: tr.word_id,
              };
            } else if (tr.__typename === 'MapPhraseWithVotes') {
              wordOrPhrase.translations[i] = {
                ...tr,
                value: tr.phrase || '',
                id: tr.phrase_id,
              };
            }
          });
        }
        res.push({ ...wordOrPhrase, value: mainValue, id });
      });

      return res;
    },
    [],
  );

  return {
    chooseBestTranslation,
    addValueToWordsOrPhrases,
  };
}
