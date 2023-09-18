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
      is_word_type: boolean;
      id: string;
    })
  | (MapPhraseWithVotes & {
      value?: string | null | undefined;
      is_word_type: boolean;
      id: string;
    });

export type WordOrPhraseWithValueAndTranslations = {
  value?: string | null | undefined;
  is_word_type: boolean;
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
                is_word_type: true,
              };
            } else if (tr.__typename === 'MapPhraseWithVotes') {
              wordOrPhrase.translations[i] = {
                ...tr,
                value: tr.phrase || '',
                id: tr.phrase_id,
                is_word_type: false,
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

  const makeMapThumbnail = async (
    content: string,
    {
      toWidth,
      toHeight,
      asFile,
    }: { toWidth: number; toHeight: number; asFile?: string },
  ): Promise<HTMLCanvasElement | File> => {
    const scaleToFit = (
      img: HTMLImageElement,
      ctx: CanvasRenderingContext2D,
    ): void => {
      // get the scale
      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height,
      );
      // get the top left position of the image
      const x = canvas.width / 2 - (img.width / 2) * scale;
      const y = canvas.height / 2 - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    const canvas = document.createElement('canvas');
    canvas.id = 'mapThumbnail';
    Object.assign(canvas.style, {
      height: `${toHeight}px`,
      'background-color': 'white',
      width: `${toWidth}px`,
      color: 'black',
      border: '1px solid black',
      position: 'absolute',
    });
    canvas.width = toWidth;
    canvas.height = toHeight;

    const img = new Image();
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(content)}`;
    const ctx = canvas.getContext('2d');
    return new Promise((resolve) => {
      img.onload = () => {
        scaleToFit(img, ctx!);
        if (asFile) {
          canvas.toBlob((thumbnailBlob) => {
            // thumbnailBlob is .png by default
            if (!thumbnailBlob) {
              throw new Error(`Can not convert canvas into BLOB`);
            }
            const file = new File([thumbnailBlob], `${asFile}.png`, {
              type: 'image/png',
            });
            resolve(file);
          });
        } else {
          resolve(canvas);
        }
      };
    });
  };

  return {
    chooseBestTranslation,
    addValueToWordsOrPhrases,
    makeMapThumbnail,
  };
}
