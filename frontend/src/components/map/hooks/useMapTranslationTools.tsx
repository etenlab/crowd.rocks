import { useCallback } from 'react';
import {
  MapPhraseTranslations,
  MapPhraseWithVotes,
  WordTranslations,
  WordWithVotes,
} from '../../../generated/graphql';

export interface ITranslationsVotes {
  translations?:
    | Array<{ up_votes: string; down_votes: string }>
    | null
    | undefined;
}

export type WordOrPhraseWithValue = (
  | WordTranslations
  | MapPhraseTranslations
) & {
  value?: string | null | undefined;
  translations: Array<
    (WordWithVotes | MapPhraseWithVotes) & {
      value?: string | null | undefined;
    }
  >;
};

export function useMapTranslationTools() {
  // const apolloClient = useApolloClient();

  // const sendMapFile = useCallback(
  //   async (
  //     file: File,
  //     afterSuccess: (uploadedFileData: {
  //       id: string;
  //       fileName: string;
  //     }) => void,
  //     afterFail: (error: Error) => void,
  //   ): Promise<void> => {
  //     apolloClient
  //       .mutate({
  //         mutation: UPLOAD_FILE_MUTATION,
  //         variables: {
  //           file,
  //         },
  //         refetchQueries: ['GetAllMapsList'],
  //       })
  //       .then((res) => {
  //         console.log(`Map file (name:${file.name}) is uploaded.`);
  //         const { original_map_id, map_file_name } = res.data.mapUpload;
  //         afterSuccess({ id: original_map_id, fileName: map_file_name });
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         afterFail(error);
  //       });
  //   },
  //   [apolloClient],
  // );

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
        {} as WordWithVotes | MapPhraseWithVotes,
      );
      return res as WordWithVotes | MapPhraseWithVotes;
    },
    [],
  );

  const addValueToWordsOrPhrases = useCallback(
    (wordOrPhrases: WordOrPhraseWithValue[] | undefined) => {
      const res: WordOrPhraseWithValue[] = [];
      wordOrPhrases?.forEach((wordOrPhrase) => {
        let mainValue = '';
        if (wordOrPhrase.__typename === 'WordTranslations') {
          mainValue = wordOrPhrase.word;
        } else if (wordOrPhrase.__typename === 'MapPhraseTranslations') {
          mainValue = wordOrPhrase.phrase;
        }

        if (wordOrPhrase?.translations) {
          wordOrPhrase?.translations.forEach((tr, i) => {
            if (tr.__typename === 'WordWithVotes') {
              wordOrPhrase.translations[i] = { ...tr, value: tr.word || '' };
            } else if (tr.__typename === 'MapPhraseWithVotes') {
              wordOrPhrase.translations[i] = { ...tr, value: tr.phrase || '' };
            }
          });
        }
        res.push({ ...wordOrPhrase, value: mainValue });
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
