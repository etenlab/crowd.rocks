import { ApolloCache } from '@apollo/client';

import {
  Translation,
  TranslationWithVote,
  GetTranslationsByFromDefinitionIdQuery,
} from '../generated/graphql';
import { GetTranslationsByFromDefinitionIdDocument } from '../generated/graphql';

export function updateCacheWithUpsertTranslation(
  cache: ApolloCache<unknown>,
  translation: Translation,
) {
  let definition_id;
  let from_definition_type_is_word;
  let language_code;
  let dialect_code;
  let geo_code;

  switch (translation.__typename) {
    case 'WordToWordTranslation': {
      definition_id = translation.from_word_definition.word_definition_id;
      from_definition_type_is_word = true;
      language_code = translation.to_word_definition.word.language_code;
      dialect_code = translation.to_word_definition.word.dialect_code;
      geo_code = translation.to_word_definition.word.geo_code;
      break;
    }
    case 'WordToPhraseTranslation': {
      definition_id = translation.from_word_definition.word_definition_id;
      from_definition_type_is_word = true;
      language_code = translation.to_phrase_definition.phrase.language_code;
      dialect_code = translation.to_phrase_definition.phrase.dialect_code;
      geo_code = translation.to_phrase_definition.phrase.geo_code;
      break;
    }
    case 'PhraseToWordTranslation': {
      definition_id = translation.from_phrase_definition.phrase_definition_id;
      from_definition_type_is_word = false;
      language_code = translation.to_word_definition.word.language_code;
      dialect_code = translation.to_word_definition.word.dialect_code;
      geo_code = translation.to_word_definition.word.geo_code;
      break;
    }
    case 'PhraseToPhraseTranslation': {
      definition_id = translation.from_phrase_definition.phrase_definition_id;
      from_definition_type_is_word = false;
      language_code = translation.to_phrase_definition.phrase.language_code;
      dialect_code = translation.to_phrase_definition.phrase.dialect_code;
      geo_code = translation.to_phrase_definition.phrase.geo_code;
      break;
    }
  }

  cache.updateQuery<GetTranslationsByFromDefinitionIdQuery>(
    {
      query: GetTranslationsByFromDefinitionIdDocument,
      variables: {
        definition_id: definition_id + '',
        from_definition_type_is_word,
        language_code: language_code,
        dialect_code: dialect_code,
        geo_code: geo_code,
      },
    },
    (data) => {
      if (data) {
        const { translation_with_vote_list } =
          data.getTranslationsByFromDefinitionId;

        let newTypeName:
          | 'WordToWordTranslationWithVote'
          | 'WordToPhraseTranslationWithVote'
          | 'PhraseToWordTranslationWithVote'
          | 'PhraseToPhraseTranslationWithVote'
          | undefined;

        switch (translation.__typename) {
          case 'WordToWordTranslation': {
            newTypeName = 'WordToWordTranslationWithVote';
            break;
          }
          case 'WordToPhraseTranslation': {
            newTypeName = 'WordToPhraseTranslationWithVote';
            break;
          }
          case 'PhraseToWordTranslation': {
            newTypeName = 'PhraseToWordTranslationWithVote';
            break;
          }
          case 'PhraseToPhraseTranslation': {
            newTypeName = 'PhraseToPhraseTranslationWithVote';
            break;
          }
        }

        if (newTypeName === undefined || !translation_with_vote_list) {
          return data;
        }

        const newTranslationWithVote = {
          ...translation,
          __typename: newTypeName,
          upvotes: 0,
          downvotes: 0,
        } as TranslationWithVote;

        return {
          ...data,
          getTranslationsByFromDefinitionId: {
            ...data.getTranslationsByFromDefinitionId,
            translation_with_vote_list: [
              ...translation_with_vote_list,
              newTranslationWithVote,
            ],
          },
        };
      } else {
        return data;
      }
    },
  );
}
