import { ApolloCache } from '@apollo/client';

import {
  Translation,
  TranslationWithVote,
  GetAllTranslationFromSiteTextDefinitionIdQuery,
} from '../generated/graphql';
import { GetAllTranslationFromSiteTextDefinitionIdDocument } from '../generated/graphql';

import { updateCacheWithUpsertTranslation } from './upsertTranslation';

export function updateCacheWithUpsertSiteTextTranslation(
  cache: ApolloCache<unknown>,
  data: {
    newTranslation: Translation;
    site_text_id: number;
    site_text_type_is_word: boolean;
    langInfo: LanguageInfo;
  },
) {
  const { newTranslation, site_text_id, site_text_type_is_word, langInfo } =
    data;

  updateCacheWithUpsertTranslation(cache, newTranslation);

  cache.updateQuery<GetAllTranslationFromSiteTextDefinitionIdQuery>(
    {
      query: GetAllTranslationFromSiteTextDefinitionIdDocument,
      variables: {
        site_text_id: site_text_id + '',
        site_text_type_is_word,
        language_code: langInfo.lang.tag,
      },
    },
    (data) => {
      if (
        data &&
        data.getAllTranslationFromSiteTextDefinitionID
          .translation_with_vote_list
      ) {
        const alreadyExists =
          data.getAllTranslationFromSiteTextDefinitionID.translation_with_vote_list.filter(
            (translation_with_vote) => {
              if (translation_with_vote) {
                switch (translation_with_vote.__typename) {
                  case 'WordToWordTranslationWithVote': {
                    if (
                      newTranslation.__typename === 'WordToWordTranslation' &&
                      translation_with_vote.word_to_word_translation_id ===
                        newTranslation.word_to_word_translation_id
                    ) {
                      return true;
                    }

                    return false;
                  }
                  case 'WordToPhraseTranslationWithVote': {
                    if (
                      newTranslation.__typename === 'WordToPhraseTranslation' &&
                      translation_with_vote.word_to_phrase_translation_id ===
                        newTranslation.word_to_phrase_translation_id
                    ) {
                      return true;
                    }

                    return false;
                  }
                  case 'PhraseToWordTranslationWithVote': {
                    if (
                      newTranslation.__typename === 'PhraseToWordTranslation' &&
                      translation_with_vote.phrase_to_word_translation_id ===
                        newTranslation.phrase_to_word_translation_id
                    ) {
                      return true;
                    }

                    return false;
                  }
                  case 'PhraseToPhraseTranslationWithVote': {
                    if (
                      newTranslation.__typename ===
                        'PhraseToPhraseTranslation' &&
                      translation_with_vote.phrase_to_phrase_translation_id ===
                        newTranslation.phrase_to_phrase_translation_id
                    ) {
                      return true;
                    }

                    return false;
                  }
                }
              }
              return false;
            },
          );

        if (alreadyExists.length > 0) {
          return data;
        }

        let newTypeName:
          | 'WordToWordTranslationWithVote'
          | 'WordToPhraseTranslationWithVote'
          | 'PhraseToWordTranslationWithVote'
          | 'PhraseToPhraseTranslationWithVote'
          | undefined;

        switch (newTranslation.__typename) {
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

        if (!newTypeName) {
          return data;
        }

        return {
          ...data,
          getAllTranslationFromSiteTextDefinitionID: {
            ...data.getAllTranslationFromSiteTextDefinitionID,
            translation_with_vote_list: [
              ...data.getAllTranslationFromSiteTextDefinitionID
                .translation_with_vote_list,
              {
                ...newTranslation,
                __typename: newTypeName,
                upvotes: 0,
                downvotes: 0,
              } as TranslationWithVote,
            ],
          },
        };
      } else {
        return data;
      }
    },
  );
}
