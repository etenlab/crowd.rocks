import { useCallback } from 'react';

import {
  PhraseToPhraseTranslationWithVote,
  PhraseToWordTranslationWithVote,
  PhraseWithDefinition,
  WordToPhraseTranslationWithVote,
  WordToWordTranslationWithVote,
  WordWithDefinition,
} from '../../../generated/graphql';

export interface ITranslationsVotes {
  translations?:
    | Array<{ up_votes: string; down_votes: string }>
    | null
    | undefined;
}

export type Original = {
  isWord: boolean;
  isPhrase: boolean;
  wordOrPhrase?: PhraseWithDefinition | WordWithDefinition | null;
  value: string;
  id: string;
  definition?: string | null;
  author: {
    username?: string;
    avatar?: string | null;
    createdAt?: string;
  };
};

export type Translation = {
  key: string;
  value: string;
  id: string;
  to_type: 'phrase' | 'word';
  definition_id: string;
  definition: string;
  upvotes: number;
  downvotes: number;
  author: {
    username: string;
    avatar?: string;
    createdAt: Date;
    createdByBot?: boolean;
  };
  parent: {
    id: string;
    table: string;
  };
};
export function useMapTranslationTools() {
  const getTransformedTranslations = useCallback(
    (
      wordOrPhraseQ: PhraseWithDefinition | WordWithDefinition | null,
      translationsQ: Array<
        | PhraseToPhraseTranslationWithVote
        | PhraseToWordTranslationWithVote
        | WordToPhraseTranslationWithVote
        | WordToWordTranslationWithVote
        | null
      >,
    ): { original: Original | null; translations: Translation[] } | null => {
      const original = (() => {
        if (!wordOrPhraseQ) {
          return null;
        }
        const isWord = wordOrPhraseQ?.__typename === 'WordWithDefinition';
        const isPhrase = wordOrPhraseQ?.__typename === 'PhraseWithDefinition';
        const value = isWord
          ? wordOrPhraseQ?.word
          : isPhrase
          ? wordOrPhraseQ?.phrase
          : '';
        const id = isWord
          ? wordOrPhraseQ?.word_id
          : isPhrase
          ? wordOrPhraseQ?.phrase_id
          : '';
        const username = wordOrPhraseQ?.created_by_user.avatar;
        const avatar = wordOrPhraseQ?.created_by_user.avatar_url;
        const createdAt = wordOrPhraseQ?.created_at;

        return {
          isWord,
          isPhrase,
          wordOrPhrase: wordOrPhraseQ,
          value,
          id,
          definition: wordOrPhraseQ?.definition,
          author: {
            username,
            avatar,
            createdAt: createdAt as string,
          },
        };
      })();

      const translations = (() => {
        if (!translationsQ) {
          return [];
        }

        return translationsQ
          .map((translation) => {
            if (!translation) {
              return null;
            }

            let value: string = '';
            let id: string = '';
            let to_type: 'phrase' | 'word' = 'word';
            let definition_id: string = '';
            let definition: string = '';
            let username: string = '';
            let avatar: string | null | undefined;
            let createdAt: Date = new Date();
            let createdByBot: boolean = false;
            let parent: { id: string; table: string } = { id: '', table: '' };

            if (
              translation?.__typename === 'PhraseToPhraseTranslationWithVote'
            ) {
              value = translation.to_phrase_definition.phrase.phrase;
              id = translation.phrase_to_phrase_translation_id;
              to_type = 'phrase';
              definition_id =
                translation.to_phrase_definition.phrase_definition_id;
              definition = translation.to_phrase_definition.definition;
              username =
                translation.to_phrase_definition.created_by_user.avatar;
              avatar =
                translation.to_phrase_definition.created_by_user.avatar_url;
              createdAt = new Date(translation.to_phrase_definition.created_at);
              createdByBot =
                translation.to_phrase_definition.created_by_user.is_bot;
              parent = {
                id: translation.phrase_to_phrase_translation_id,
                table: 'phrase_to_phrase_translations',
              };
            }
            if (translation?.__typename === 'PhraseToWordTranslationWithVote') {
              value = translation.to_word_definition.word.word;
              id = translation.phrase_to_word_translation_id;
              to_type = 'word';
              definition_id = translation.to_word_definition.word_definition_id;
              definition = translation.to_word_definition.definition;
              username = translation.to_word_definition.created_by_user.avatar;
              avatar =
                translation.to_word_definition.created_by_user.avatar_url;
              createdAt = new Date(translation.to_word_definition.created_at);
              createdByBot =
                translation.to_word_definition.created_by_user.is_bot;

              parent = {
                id: translation.phrase_to_word_translation_id,
                table: 'phrase_to_word_translations',
              };
            }
            if (translation?.__typename === 'WordToPhraseTranslationWithVote') {
              value = translation.to_phrase_definition.phrase.phrase;
              id = translation.word_to_phrase_translation_id;
              to_type = 'phrase';
              definition = translation.to_phrase_definition.definition;
              definition_id =
                translation.to_phrase_definition.phrase_definition_id;
              username =
                translation.to_phrase_definition.created_by_user.avatar;
              avatar =
                translation.to_phrase_definition.created_by_user.avatar_url;
              createdAt = new Date(translation.to_phrase_definition.created_at);
              createdByBot =
                translation.to_phrase_definition.created_by_user.is_bot;

              parent = {
                id: translation.word_to_phrase_translation_id,
                table: 'word_to_phrase_translations',
              };
            }
            if (translation?.__typename === 'WordToWordTranslationWithVote') {
              value = translation.to_word_definition.word.word;
              id = translation.word_to_word_translation_id;
              to_type = 'word';
              definition = translation.to_word_definition.definition;
              definition_id = translation.to_word_definition.word_definition_id;
              username = translation.to_word_definition.created_by_user.avatar;
              avatar =
                translation.to_word_definition.created_by_user.avatar_url;
              createdAt = new Date(translation.to_word_definition.created_at);
              createdByBot =
                translation.to_word_definition.created_by_user.is_bot;

              parent = {
                id: translation.word_to_word_translation_id,
                table: 'word_to_word_translations',
              };
            }

            return {
              key: `${translation.__typename}:${id}`,
              value,
              id,
              to_type,
              definition_id,
              definition,
              upvotes: translation.upvotes,
              downvotes: translation.downvotes,
              author: {
                username,
                avatar,
                createdAt,
                createdByBot,
              },
              parent,
            };
          })
          .filter((item) => item) as {
          key: string;
          value: string;
          id: string;
          to_type: 'phrase' | 'word';
          definition_id: string;
          definition: string;
          upvotes: number;
          downvotes: number;
          author: {
            username: string;
            avatar?: string;
            createdAt: Date;
            createdByBot?: boolean;
          };
          parent: {
            id: string;
            table: string;
          };
        }[];
      })();

      return {
        original,
        translations,
      };
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
    getTransformedTranslations,
    makeMapThumbnail,
  };
}
