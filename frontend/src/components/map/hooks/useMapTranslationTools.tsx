import { useCallback } from 'react';
import { MapPhraseWithVotes, WordWithVotes } from '../../../generated/graphql';

export interface ITranslationsVotes {
  translations?:
    | Array<{ up_votes: string; down_votes: string }>
    | null
    | undefined;
}

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

  return {
    chooseBestTranslation,
  };
}
