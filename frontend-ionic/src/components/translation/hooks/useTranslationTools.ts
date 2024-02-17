import { useCallback } from 'react';

import {
  PhraseToPhraseTranslationWithVote,
  PhraseToWordTranslationWithVote,
  WordToPhraseTranslationWithVote,
  WordToWordTranslationWithVote,
  PhraseWithDefinition,
  WordWithDefinition,
  TableNameType,
} from '../../../generated/graphql';
import { subTags2LangInfo } from '../../../../../utils';

export type OriginalData = {
  isWord: boolean;
  wordOrPhrase: {
    id: string;
    likeString: string;
  };
  definition: {
    id: string;
    likeString: string;
  };
  author?: {
    username: string;
    avatar?: string;
    createdAt: Date;
    createdByBot?: boolean;
  };
  language: LanguageInfo;
};

export type TranslationData = Omit<OriginalData, 'isWord'> & {
  key: string;
  fromDefinitionIsWord: boolean;
  toDefinitionIsWord: boolean;
  vote: {
    upvotes: number;
    downvotes: number;
  };
  translation: {
    id: string;
    tableName: TableNameType;
  };
};

export function useTranslationTools() {
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
    ): {
      original: OriginalData | null;
      translations: TranslationData[];
    } => {
      const original = (() => {
        if (!wordOrPhraseQ) {
          return null;
        }

        let isWord = true;
        let wordOrPhrase: {
          id: string;
          likeString: string;
        };

        switch (wordOrPhraseQ.__typename) {
          case 'WordWithDefinition': {
            isWord = true;
            wordOrPhrase = {
              id: wordOrPhraseQ.word_id,
              likeString: wordOrPhraseQ.word,
            };
            break;
          }
          case 'PhraseWithDefinition': {
            isWord = false;
            wordOrPhrase = {
              id: wordOrPhraseQ.phrase_id,
              likeString: wordOrPhraseQ.phrase,
            };
            break;
          }
        }

        const definition = {
          id: wordOrPhraseQ.definition_id || '',
          likeString: wordOrPhraseQ.definition || '',
        };
        const author = {
          username: wordOrPhraseQ.created_by_user.avatar,
          avatar: wordOrPhraseQ.created_by_user.avatar_url || undefined,
          createdAt: new Date(wordOrPhraseQ.created_at),
        };
        const language = subTags2LangInfo({
          lang: wordOrPhraseQ.language_code,
          dialect: wordOrPhraseQ.dialect_code || undefined,
          region: wordOrPhraseQ.geo_code || undefined,
        });

        return {
          isWord,
          wordOrPhrase: wordOrPhrase!,
          definition,
          author,
          language,
        };
      })();

      const translations = (() => {
        if (!translationsQ) {
          return [];
        }

        return translationsQ
          .filter(
            (
              translation,
            ): translation is
              | PhraseToPhraseTranslationWithVote
              | PhraseToWordTranslationWithVote
              | WordToPhraseTranslationWithVote
              | WordToWordTranslationWithVote => translation !== null,
          )
          .map((translation) => {
            let toDefinitionIsWord = true;
            let fromDefinitionIsWord = true;
            let wordOrPhrase: {
              id: string;
              likeString: string;
            };
            let definition: {
              id: string;
              likeString: string;
            };
            let author: {
              username: string;
              avatar?: string;
              createdAt: Date;
              createdByBot?: boolean;
            };
            let translationData: { id: string; tableName: TableNameType };
            let language: LanguageInfo;

            switch (translation.__typename) {
              case 'WordToWordTranslationWithVote': {
                translationData = {
                  id: translation.word_to_word_translation_id,
                  tableName: TableNameType.WordToWordTranslations,
                };
                fromDefinitionIsWord = true;
                toDefinitionIsWord = true;
                wordOrPhrase = {
                  id: translation.to_word_definition.word.word_id,
                  likeString: translation.to_word_definition.word.word,
                };
                definition = {
                  id: translation.to_word_definition.word_definition_id,
                  likeString: translation.to_word_definition.definition,
                };
                author = {
                  username:
                    translation.to_word_definition.created_by_user.avatar,
                  avatar:
                    translation.to_word_definition.created_by_user.avatar_url ||
                    undefined,
                  createdAt: new Date(
                    translation.to_word_definition.created_at,
                  ),
                  createdByBot:
                    translation.to_word_definition.created_by_user.is_bot,
                };
                language = subTags2LangInfo({
                  lang: translation.to_word_definition.word.language_code,
                  dialect:
                    translation.to_word_definition.word.dialect_code ||
                    undefined,
                  region:
                    translation.to_word_definition.word.geo_code || undefined,
                });
                break;
              }
              case 'WordToPhraseTranslationWithVote': {
                translationData = {
                  id: translation.word_to_phrase_translation_id,
                  tableName: TableNameType.WordToPhraseTranslations,
                };
                fromDefinitionIsWord = true;
                toDefinitionIsWord = false;
                wordOrPhrase = {
                  id: translation.to_phrase_definition.phrase.phrase_id,
                  likeString: translation.to_phrase_definition.phrase.phrase,
                };
                definition = {
                  id: translation.to_phrase_definition.phrase_definition_id,
                  likeString: translation.to_phrase_definition.definition,
                };
                author = {
                  username:
                    translation.to_phrase_definition.created_by_user.avatar,
                  avatar:
                    translation.to_phrase_definition.created_by_user
                      .avatar_url || undefined,
                  createdAt: new Date(
                    translation.to_phrase_definition.created_at,
                  ),
                  createdByBot:
                    translation.to_phrase_definition.created_by_user.is_bot,
                };
                language = subTags2LangInfo({
                  lang: translation.to_phrase_definition.phrase.language_code,
                  dialect:
                    translation.to_phrase_definition.phrase.dialect_code ||
                    undefined,
                  region:
                    translation.to_phrase_definition.phrase.geo_code ||
                    undefined,
                });
                break;
              }
              case 'PhraseToWordTranslationWithVote': {
                translationData = {
                  id: translation.phrase_to_word_translation_id,
                  tableName: TableNameType.PhraseToWordTranslations,
                };
                fromDefinitionIsWord = false;
                toDefinitionIsWord = true;
                wordOrPhrase = {
                  id: translation.to_word_definition.word.word_id,
                  likeString: translation.to_word_definition.word.word,
                };
                definition = {
                  id: translation.to_word_definition.word_definition_id,
                  likeString: translation.to_word_definition.definition,
                };
                author = {
                  username:
                    translation.to_word_definition.created_by_user.avatar,
                  avatar:
                    translation.to_word_definition.created_by_user.avatar_url ||
                    undefined,
                  createdAt: new Date(
                    translation.to_word_definition.created_at,
                  ),
                  createdByBot:
                    translation.to_word_definition.created_by_user.is_bot,
                };
                language = subTags2LangInfo({
                  lang: translation.to_word_definition.word.language_code,
                  dialect:
                    translation.to_word_definition.word.dialect_code ||
                    undefined,
                  region:
                    translation.to_word_definition.word.geo_code || undefined,
                });
                break;
              }
              case 'PhraseToPhraseTranslationWithVote': {
                translationData = {
                  id: translation.phrase_to_phrase_translation_id,
                  tableName: TableNameType.PhraseToPhraseTranslations,
                };
                fromDefinitionIsWord = false;
                toDefinitionIsWord = false;
                wordOrPhrase = {
                  id: translation.to_phrase_definition.phrase.phrase_id,
                  likeString: translation.to_phrase_definition.phrase.phrase,
                };
                definition = {
                  id: translation.to_phrase_definition.phrase_definition_id,
                  likeString: translation.to_phrase_definition.definition,
                };
                author = {
                  username:
                    translation.to_phrase_definition.created_by_user.avatar,
                  avatar:
                    translation.to_phrase_definition.created_by_user
                      .avatar_url || undefined,
                  createdAt: new Date(
                    translation.to_phrase_definition.created_at,
                  ),
                  createdByBot:
                    translation.to_phrase_definition.created_by_user.is_bot,
                };
                language = subTags2LangInfo({
                  lang: translation.to_phrase_definition.phrase.language_code,
                  dialect:
                    translation.to_phrase_definition.phrase.dialect_code ||
                    undefined,
                  region:
                    translation.to_phrase_definition.phrase.geo_code ||
                    undefined,
                });
                break;
              }
            }

            const vote = {
              upvotes: translation.upvotes,
              downvotes: translation.downvotes,
            };

            return {
              key: `${translation.__typename}:${translationData!.id}`,
              fromDefinitionIsWord,
              toDefinitionIsWord,
              wordOrPhrase: wordOrPhrase!,
              definition: definition!,
              vote,
              language: language!,
              author: author!,
              translation: translationData!,
            };
          });
      })();

      return {
        original,
        translations,
      };
    },
    [],
  );

  return {
    getTransformedTranslations,
  };
}
